import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Animated, Easing, Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SvgProps } from 'react-native-svg';
import * as Speech from 'expo-speech';
import Constants from 'expo-constants';
import { useLanguage } from '../LanguageContext';

// Lazy-load expo-speech-recognition so Expo Go doesn't crash at import time.
// The native module only exists in custom/EAS builds, not in Expo Go.
let ExpoSpeechRecognition: typeof import('expo-speech-recognition') | null = null;
try {
  ExpoSpeechRecognition = require('expo-speech-recognition');
} catch {
  ExpoSpeechRecognition = null;
}
import type { Reminder } from './MonitorScreen';

const GEMINI_API_KEY = Constants.expoConfig?.extra?.geminiApiKey as string;
const TOTAL_GAMES = 5;

type SvgComponent = (props: SvgProps) => React.ReactElement | null;

function Icon({ source, size }: { source: SvgComponent | { default: SvgComponent }; size: number }) {
  const SvgIcon = (source as any).default ?? source;
  return <SvgIcon width={size} height={size} />;
}

type VoiceScreenProps = {
  onGames: () => void;
  onHome: () => void;
  onMonitor: () => void;
  streak: number;
  gamesCompleted: Set<string>;
  reminders: Reminder[];
  setReminders: React.Dispatch<React.SetStateAction<Reminder[]>>;
  dismissedReminders: Set<string>;
  patientName: string;
};

export function VoiceScreen({
  onGames, onHome, onMonitor,
  streak, gamesCompleted, reminders, setReminders, dismissedReminders, patientName,
}: VoiceScreenProps) {
  const { t: tr, fontMedium, fontBold, headingStyle } = useLanguage();

  const [transcript, setTranscript] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [listening, setListening] = useState(false);
  const [sttAvailable, setSttAvailable] = useState(false);
  const [toast, setToast] = useState<{ label: string; time: string; icon: string } | null>(null);

  // Toast slide-up animation
  const toastY = useRef(new Animated.Value(100)).current;
  const toastOpacity = useRef(new Animated.Value(0)).current;
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = (label: string, time: string, icon: string) => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast({ label, time, icon });
    toastY.setValue(100);
    toastOpacity.setValue(0);
    Animated.parallel([
      Animated.spring(toastY, { toValue: 0, useNativeDriver: true, speed: 20, bounciness: 6 }),
      Animated.timing(toastOpacity, { toValue: 1, duration: 200, useNativeDriver: true }),
    ]).start();
    toastTimer.current = setTimeout(() => {
      Animated.parallel([
        Animated.timing(toastY, { toValue: 100, duration: 250, useNativeDriver: true }),
        Animated.timing(toastOpacity, { toValue: 0, duration: 250, useNativeDriver: true }),
      ]).start(() => setToast(null));
    }, 3500);
  };

  // Pulsing animation for mic button while listening
  const pulse = useRef(new Animated.Value(1)).current;
  const pulseLoop = useRef<Animated.CompositeAnimation | null>(null);

  useEffect(() => {
    // Check if STT is available on this device/build
    const module = ExpoSpeechRecognition?.ExpoSpeechRecognitionModule;
    if (!module) { setSttAvailable(false); return; }

    module.getStateAsync?.()
      .then(() => setSttAvailable(true))
      .catch(() => setSttAvailable(false));

    return () => {
      Speech.stop();
      if (listening) module.abort?.();
    };
  }, []);

  useEffect(() => {
    if (listening) {
      pulseLoop.current = Animated.loop(
        Animated.sequence([
          Animated.timing(pulse, { toValue: 1.15, duration: 600, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
          Animated.timing(pulse, { toValue: 1, duration: 600, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        ])
      );
      pulseLoop.current.start();
    } else {
      pulseLoop.current?.stop();
      pulse.setValue(1);
    }
  }, [listening]);

  // Build a rich context string for Gemini
  const buildContext = (): string => {
    const completedList = Array.from(gamesCompleted).join(', ') || 'none';
    const pendingReminders = reminders.filter(r => !dismissedReminders.has(r.id));
    const doneReminders = reminders.filter(r => dismissedReminders.has(r.id));
    const reminderSummary = reminders.length === 0
      ? 'No reminders set.'
      : `Reminders today: ${reminders.map(r => `${r.label} at ${r.time}`).join(', ')}. Done: ${doneReminders.map(r => r.label).join(', ') || 'none'}. Pending: ${pendingReminders.map(r => r.label).join(', ') || 'none'}.`;

    return `
You are G-One Sarthi, a warm and caring AI assistant for elderly dementia patients in North East India.
You are talking to ${patientName}.

Current patient status:
- Day streak: ${streak} day(s)
- Memory games completed today: ${gamesCompleted.size} out of ${TOTAL_GAMES}
- Games completed: ${completedList}
- ${reminderSummary}

Rules:
1. Answer in 2-3 short simple sentences. Use simple words suitable for elderly users.
2. If the user asks to SET a reminder (e.g. "remind me to take medicine at 9 PM"), respond with EXACTLY this JSON on the first line (nothing before it): REMINDER:{"label":"Take Medicine","time":"9:00 PM","icon":"medicine"} then on the next line add a friendly confirmation message. Icon must be one of: medicine, water, walk.
3. If asked about streak, games, or reminders, use the context above to answer accurately.
4. Be warm, encouraging, and patient.
    `.trim();
  };

  const askGemini = async (question: string) => {
    if (!question.trim()) return;
    setLoading(true);
    setAnswer('');
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{
              parts: [{ text: `${buildContext()}\n\nUser: ${question}` }],
            }],
          }),
        }
      );
      const data = await response.json();
      const raw = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? 'Sorry, I could not get an answer. Please try again.';

      // Check if Gemini wants to set a reminder
      if (raw.startsWith('REMINDER:')) {
        const lines = raw.split('\n');
        try {
          const jsonStr = lines[0].replace('REMINDER:', '').trim();
          const reminderData = JSON.parse(jsonStr);
          const newReminder: Reminder = {
            id: `voice_${Date.now()}`,
            icon: (reminderData.icon === 'water' || reminderData.icon === 'walk') ? reminderData.icon : 'medicine',
            label: reminderData.label ?? 'Reminder',
            time: reminderData.time ?? '9:00 AM',
          };
          setReminders(prev => [...prev, newReminder]);
          const confirmMsg = lines.slice(1).join('\n').trim() || `Done! I have added a reminder: ${newReminder.label} at ${newReminder.time}.`;
          setAnswer(confirmMsg);
          readAloud(confirmMsg);
          showToast(newReminder.label, newReminder.time, newReminder.icon);
        } catch {
          setAnswer(raw);
        }
      } else {
        setAnswer(raw);
      }
    } catch {
      setAnswer('Something went wrong. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const startListening = async () => {
    const module = ExpoSpeechRecognition?.ExpoSpeechRecognitionModule;
    if (!module) return;

    const { granted } = await module.requestPermissionsAsync();
    if (!granted) {
      setAnswer('Microphone permission is needed to use voice input.');
      return;
    }
    setTranscript('');
    setAnswer('');
    setListening(true);

    module.start({
      lang: 'en-IN',
      interimResults: true,
      continuous: false,
    });

    const resultHandler = module.addListener(
      'result',
      (event: any) => {
        const text = event?.results?.[0]?.transcript ?? '';
        setTranscript(text);
        if (!event.isFinal) return;
        setListening(false);
        resultHandler.remove();
        errorHandler.remove();
        if (text.trim()) askGemini(text);
      }
    );

    const errorHandler = module.addListener(
      'error',
      () => {
        setListening(false);
        resultHandler.remove();
        errorHandler.remove();
      }
    );
  };

  const stopListening = () => {
    ExpoSpeechRecognition?.ExpoSpeechRecognitionModule?.stop?.();
    setListening(false);
  };

  const readAloud = (text: string) => {
    Speech.stop();
    setSpeaking(true);
    Speech.speak(text, {
      language: 'en-IN',
      rate: 0.85,
      onDone: () => setSpeaking(false),
      onError: () => setSpeaking(false),
    });
  };

  const stopSpeaking = () => {
    Speech.stop();
    setSpeaking(false);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <Text style={[styles.heading, { fontFamily: fontMedium, ...headingStyle(48, 56) }]}>{tr('askAnything')}</Text>

        {/* Mic illustration */}
        <Image
          accessibilityIgnoresInvertColors
          resizeMode="contain"
          source={require('../app_image/Voice_Page/Mic_Image.png')}
          style={styles.voiceImage}
        />

        {/* Voice mic button */}
        {sttAvailable && (
          <View style={styles.micRow}>
            <Animated.View style={{ transform: [{ scale: pulse }] }}>
              <Pressable
                accessibilityLabel={listening ? tr('listeningStop') : tr('tapToSpeak')}
                accessibilityRole="button"
                onPress={listening ? stopListening : startListening}
                style={({ pressed }) => [styles.micButton, listening && styles.micButtonActive, pressed && styles.pressed]}
              >
                <Icon size={36} source={require('../SVG_Icons/Voice/Mic.svg')} />
              </Pressable>
            </Animated.View>
            <Text style={[styles.micLabel, { fontFamily: fontMedium }]}>
              {listening ? tr('listeningStop') : tr('tapToSpeak')}
            </Text>
          </View>
        )}

        {/* Live transcript while listening */}
        {listening && transcript !== '' && (
          <View style={styles.transcriptBubble}>
            <Text style={[styles.transcriptText, { fontFamily: fontMedium }]}>{transcript}</Text>
          </View>
        )}

        {/* Text input card */}
        <View style={styles.inputCard}>
          <TextInput
            accessibilityLabel={tr('typeQuestion')}
            multiline
            onChangeText={setTranscript}
            placeholder={tr('typeQuestion')}
            placeholderTextColor="#B0A8A8"
            style={[styles.textInput, { fontFamily: fontMedium }]}
            value={transcript}
          />
          <Pressable
            accessibilityLabel={tr('ask')}
            accessibilityRole="button"
            disabled={loading || !transcript.trim()}
            onPress={() => askGemini(transcript)}
            style={({ pressed }) => [styles.askButton, (loading || !transcript.trim()) && styles.askButtonDisabled, pressed && styles.pressed]}
          >
            {loading
              ? <ActivityIndicator color="#FFF" size="small" />
              : <Text style={[styles.askButtonText, { fontFamily: fontBold }]}>{tr('ask')}</Text>
            }
          </Pressable>
        </View>

        {/* Answer card */}
        {answer !== '' && (
          <View style={styles.answerCard}>
            <Text style={[styles.answerText, { fontFamily: fontMedium }]}>{answer}</Text>
            <Pressable
              accessibilityRole="button"
              onPress={speaking ? stopSpeaking : () => readAloud(answer)}
              style={({ pressed }) => [styles.speakButton, speaking && styles.speakButtonActive, pressed && styles.pressed]}
            >
              <Icon size={22} source={require('../SVG_Icons/Voice/Mic.svg')} />
              <Text style={[styles.speakButtonText, speaking && styles.speakButtonTextActive, { fontFamily: fontBold }]}>
                {speaking ? tr('stop') : tr('readAloud')}
              </Text>
            </Pressable>
          </View>
        )}

        {/* Coming soon note if STT not available */}
        {!sttAvailable && (
          <View style={styles.comingSoonCard}>
            <View style={styles.comingSoonBadge}>
              <Text style={[styles.comingSoonBadgeText, { fontFamily: fontBold }]}>{tr('comingSoon')}</Text>
            </View>
            <Text style={[styles.comingSoonTitle, { fontFamily: fontMedium }]}>{tr('voiceInputTitle')}</Text>
            <Text style={[styles.comingSoonBody, { fontFamily: fontMedium }]}>{tr('voiceInputBody')}</Text>
          </View>
        )}
      </ScrollView>

      {toast && (
        <Animated.View style={[styles.toast, { transform: [{ translateY: toastY }], opacity: toastOpacity }]}>
          <View style={styles.toastIconBox}>
            <Text style={styles.toastIconText}>
              {toast.icon === 'water' ? '💧' : toast.icon === 'walk' ? '🚶' : '💊'}
            </Text>
          </View>
          <View style={styles.toastTextBox}>
            <Text style={[styles.toastTitle, { fontFamily: fontBold }]}>{tr('toastReminderSet')}</Text>
            <Text style={[styles.toastSub, { fontFamily: fontMedium }]}>{toast.label} · {toast.time}</Text>
          </View>
          <Text style={[styles.toastCheck, { fontFamily: fontBold }]}>✓</Text>
        </Animated.View>
      )}

      <View style={styles.navigationBar}>
        <NavItem icon={require('../SVG_Icons/Home/Home.svg')} label={tr('navHome')} onPress={onHome} fontMedium={fontMedium} />
        <NavItem icon={require('../SVG_Icons/Home/Controller.svg')} label={tr('navGames')} onPress={onGames} fontMedium={fontMedium} />
        <NavItem icon={require('../SVG_Icons/Home/Voice.svg')} label={tr('navVoice')} fontMedium={fontMedium} />
        <NavItem icon={require('../SVG_Icons/Home/Health_For_Monitor.svg')} label={tr('navMonitor')} onPress={onMonitor} fontMedium={fontMedium} />
      </View>
    </View>
  );
}

function NavItem({ icon, label, onPress, fontMedium }: { icon: SvgComponent; label: string; onPress?: () => void; fontMedium: string }) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={({ pressed }) => [styles.navItem, pressed && styles.pressed]}>
      <Icon size={34} source={icon} />
      <Text style={[styles.navLabel, { fontFamily: fontMedium }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { ...StyleSheet.absoluteFillObject, backgroundColor: '#F9F6F0', left: -27, right: -27 },
  content: { paddingBottom: 120, paddingHorizontal: 22, paddingTop: 34 },
  heading: { color: '#000000', fontSize: 48 },
  voiceImage: { alignSelf: 'center', borderRadius: 24, height: 150, marginTop: 16, width: 150 },

  // Mic button
  micRow: { alignItems: 'center', flexDirection: 'column', marginTop: 20, gap: 10 },
  micButton: {
    alignItems: 'center',
    backgroundColor: '#2E7359',
    borderRadius: 40,
    height: 80,
    justifyContent: 'center',
    width: 80,
    shadowColor: '#2E7359',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  micButtonActive: { backgroundColor: '#B85858' },
  micLabel: { color: '#786F6F', fontSize: 15 },

  // Live transcript
  transcriptBubble: {
    backgroundColor: '#F0F8F0',
    borderColor: '#2E7359',
    borderRadius: 16,
    borderWidth: 1.5,
    marginTop: 12,
    padding: 14,
  },
  transcriptText: { color: '#2E7359', fontSize: 16, lineHeight: 24 },

  // Input card
  inputCard: { borderColor: 'rgba(0,0,0,0.25)', borderRadius: 25, borderWidth: 2, marginTop: 20, padding: 16 },
  textInput: { color: '#000', fontSize: 17, lineHeight: 26, minHeight: 70, textAlignVertical: 'top' },
  askButton: { alignItems: 'center', backgroundColor: '#2E7359', borderRadius: 12, height: 48, justifyContent: 'center', marginTop: 12 },
  askButtonDisabled: { backgroundColor: '#A8C9BC' },
  askButtonText: { color: '#FFF', fontSize: 18 },

  // Answer card
  answerCard: { alignItems: 'stretch', backgroundColor: '#E7EFE7', borderColor: '#2E7359', borderRadius: 25, borderWidth: 2, marginTop: 16, padding: 18 },
  answerText: { color: '#000', fontSize: 16, lineHeight: 26 },
  speakButton: { alignItems: 'center', alignSelf: 'stretch', borderColor: '#2E7359', borderRadius: 12, borderWidth: 1.5, flexDirection: 'row', gap: 8, justifyContent: 'center', marginTop: 14, paddingVertical: 10 },
  speakButtonActive: { backgroundColor: '#2E7359' },
  speakButtonText: { color: '#2E7359', fontSize: 16 },
  speakButtonTextActive: { color: '#FFFFFF' },

  // Coming soon
  comingSoonCard: { borderColor: 'rgba(0,0,0,0.25)', borderRadius: 25, borderWidth: 2, marginTop: 20, padding: 20 },
  comingSoonBadge: { alignSelf: 'flex-start', backgroundColor: '#FFE2CA', borderColor: 'rgba(0,0,0,0.15)', borderRadius: 20, borderWidth: 1, marginBottom: 10, paddingHorizontal: 14, paddingVertical: 5 },
  comingSoonBadgeText: { color: '#C47A2B', fontSize: 13 },
  comingSoonTitle: { color: '#000', fontSize: 20, marginBottom: 8 },
  comingSoonBody: { color: '#786F6F', fontSize: 15, lineHeight: 22 },

  // Toast
  toast: {
    alignItems: 'center',
    backgroundColor: '#2E7359',
    borderRadius: 20,
    bottom: 108,
    elevation: 10,
    flexDirection: 'row',
    gap: 12,
    left: 22,
    paddingHorizontal: 18,
    paddingVertical: 14,
    position: 'absolute',
    right: 22,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 10,
  },
  toastIconBox: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 12,
    height: 42,
    justifyContent: 'center',
    width: 42,
  },
  toastIconText: { fontSize: 22 },
  toastTextBox: { flex: 1 },
  toastTitle: { color: '#FFFFFF', fontSize: 15 },
  toastSub: { color: 'rgba(255,255,255,0.8)', fontSize: 13, marginTop: 2 },
  toastCheck: { color: '#FFFFFF', fontSize: 22 },

  // Nav
  navigationBar: { alignItems: 'center', backgroundColor: '#2E7359', borderRadius: 50, bottom: 20, flexDirection: 'row', height: 78, justifyContent: 'space-around', left: 22, position: 'absolute', right: 22, shadowColor: '#000', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.22, shadowRadius: 14, elevation: 12 },
  navItem: { alignItems: 'center', minWidth: 55 },
  navLabel: { color: '#FFFFFF', fontSize: 11, marginTop: 2 },
  pressed: { opacity: 0.72 },
});
