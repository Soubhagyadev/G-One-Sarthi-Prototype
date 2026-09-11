import { useState } from 'react';
import { ActivityIndicator, Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SvgUri } from 'react-native-svg';
import * as Speech from 'expo-speech';
import Constants from 'expo-constants';

const GEMINI_API_KEY = Constants.expoConfig?.extra?.geminiApiKey as string;

const uri = (source: number) => Image.resolveAssetSource(source).uri;

function Icon({ source, size }: { source: number; size: number }) {
  return <SvgUri height={size} uri={uri(source)} width={size} />;
}

type VoiceScreenProps = {
  onGames: () => void;
  onHome: () => void;
  onMonitor: () => void;
};

export function VoiceScreen({ onGames, onHome, onMonitor }: VoiceScreenProps) {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [speaking, setSpeaking] = useState(false);

  const askGemini = async () => {
    if (!question.trim()) return;
    setLoading(true);
    setAnswer('');
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: `You are a caring health assistant for elderly dementia patients in North East India. Answer simply and kindly in 2-3 short sentences. Question: ${question}`,
              }],
            }],
          }),
        }
      );
      const data = await response.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? 'Sorry, I could not get an answer. Please try again.';
      setAnswer(text);
    } catch {
      setAnswer('Something went wrong. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
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
        <Text style={styles.heading}>Ask{'\n'}Anything</Text>

        <Image
          accessibilityIgnoresInvertColors
          resizeMode="contain"
          source={require('../app_image/Voice_Page/Mic_Image.png')}
          style={styles.voiceImage}
        />

        <View style={styles.inputCard}>
          <TextInput
            accessibilityLabel="Type your question"
            multiline
            onChangeText={setQuestion}
            placeholder="Type your question here..."
            placeholderTextColor="#B0A8A8"
            style={styles.textInput}
            value={question}
          />
          <Pressable
            accessibilityLabel="Ask question"
            accessibilityRole="button"
            disabled={loading || !question.trim()}
            onPress={askGemini}
            style={({ pressed }) => [styles.askButton, (loading || !question.trim()) && styles.askButtonDisabled, pressed && styles.pressed]}
          >
            {loading
              ? <ActivityIndicator color="#FFF" size="small" />
              : <Text style={styles.askButtonText}>Ask</Text>
            }
          </Pressable>
        </View>

        {answer !== '' && (
          <View style={styles.answerCard}>
            <Text style={styles.answerText}>{answer}</Text>
            <Pressable
              accessibilityRole="button"
              onPress={speaking ? stopSpeaking : () => readAloud(answer)}
              style={({ pressed }) => [styles.speakButton, speaking && styles.speakButtonActive, pressed && styles.pressed]}
            >
              <Icon size={22} source={require('../SVG_Icons/Voice/Mic.svg')} />
              <Text style={[styles.speakButtonText, speaking && styles.speakButtonTextActive]}>{speaking ? 'Stop' : 'Read Aloud'}</Text>
            </Pressable>
          </View>
        )}

        <View style={styles.comingSoonCard}>
          <View style={styles.comingSoonBadge}>
            <Text style={styles.comingSoonBadgeText}>Coming Soon</Text>
          </View>
          <Text style={styles.comingSoonTitle}>Voice Input</Text>
          <Text style={styles.comingSoonBody}>
            Speak directly to G-One Sarthi in Assamese, Hindi, Bodo, or English. No typing needed.
          </Text>
        </View>
      </ScrollView>

      <View style={styles.navigationBar}>
        <NavItem icon={require('../SVG_Icons/Home/Home.svg')} label="Home" onPress={onHome} />
        <NavItem icon={require('../SVG_Icons/Home/Controller.svg')} label="Games" onPress={onGames} />
        <NavItem icon={require('../SVG_Icons/Home/Voice.svg')} label="Voice Chat" />
        <NavItem icon={require('../SVG_Icons/Home/Health_For_Monitor.svg')} label="Monitor" onPress={onMonitor} />
      </View>
    </View>
  );
}

function NavItem({ icon, label, onPress }: { icon: number; label: string; onPress?: () => void }) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={({ pressed }) => [styles.navItem, pressed && styles.pressed]}>
      <Icon size={34} source={icon} />
      <Text style={styles.navLabel}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#F9F6F0',
    left: -27,
    right: -27,
  },
  content: {
    paddingBottom: 120,
    paddingHorizontal: 22,
    paddingTop: 34,
  },
  heading: {
    color: '#000000',
    fontFamily: 'Lora-Medium',
    fontSize: 48,
    letterSpacing: -1.8,
    lineHeight: 56,
  },
  voiceImage: {
    alignSelf: 'center',
    borderRadius: 24,
    height: 160,
    marginTop: 20,
    width: 160,
  },
  inputCard: {
    borderColor: 'rgba(0,0,0,0.25)',
    borderRadius: 25,
    borderWidth: 2,
    marginTop: 20,
    padding: 16,
  },
  textInput: {
    color: '#000',
    fontFamily: 'Lora-Medium',
    fontSize: 17,
    lineHeight: 26,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  askButton: {
    alignItems: 'center',
    backgroundColor: '#2E7359',
    borderRadius: 12,
    height: 48,
    justifyContent: 'center',
    marginTop: 12,
  },
  askButtonDisabled: {
    backgroundColor: '#A8C9BC',
  },
  askButtonText: {
    color: '#FFF',
    fontFamily: 'Lora-Bold',
    fontSize: 18,
  },
  answerCard: {
    backgroundColor: '#E7EFE7',
    borderColor: '#2E7359',
    borderRadius: 25,
    borderWidth: 2,
    marginTop: 16,
    padding: 18,
    alignItems: 'stretch',
  },
  answerText: {
    color: '#000',
    fontFamily: 'Lora-Medium',
    fontSize: 16,
    lineHeight: 26,
  },
  speakButton: {
    alignItems: 'center',
    alignSelf: 'stretch',
    borderColor: '#2E7359',
    borderRadius: 12,
    borderWidth: 1.5,
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 14,
    paddingVertical: 10,
    gap: 8,
  },
  speakButtonActive: {
    backgroundColor: '#2E7359',
  },
  speakButtonText: {
    color: '#2E7359',
    fontFamily: 'Lora-Bold',
    fontSize: 16,
  },
  speakButtonTextActive: {
    color: '#FFFFFF',
  },
  comingSoonCard: {
    borderColor: 'rgba(0,0,0,0.25)',
    borderRadius: 25,
    borderWidth: 2,
    marginTop: 20,
    padding: 20,
  },
  comingSoonBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFE2CA',
    borderColor: 'rgba(0,0,0,0.15)',
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 14,
    paddingVertical: 5,
  },
  comingSoonBadgeText: {
    color: '#C47A2B',
    fontFamily: 'Lora-Bold',
    fontSize: 13,
  },
  comingSoonTitle: {
    color: '#000',
    fontFamily: 'Lora-Medium',
    fontSize: 20,
    marginBottom: 8,
  },
  comingSoonBody: {
    color: '#786F6F',
    fontFamily: 'Lora-Medium',
    fontSize: 15,
    lineHeight: 22,
  },
  navigationBar: {
    alignItems: 'center',
    backgroundColor: '#2E7359',
    borderRadius: 50,
    bottom: 20,
    flexDirection: 'row',
    height: 78,
    justifyContent: 'space-around',
    left: 22,
    position: 'absolute',
    right: 22,
  },
  navItem: {
    alignItems: 'center',
    minWidth: 55,
  },
  navLabel: {
    color: '#FFFFFF',
    fontFamily: 'Lora-Medium',
    fontSize: 11,
    marginTop: 2,
  },
  pressed: {
    opacity: 0.72,
  },
});
