import { Alert, Animated, Linking, Modal, Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { useRef, useState } from 'react';
import { SvgProps } from 'react-native-svg';
import { useLanguage } from '../LanguageContext';

// Genuine NE India motivational quotes in local languages, relevant to memory & daily life
// Sourced from Assamese, Meitei (Manipuri), Bodo, and Nagaland oral traditions
const NE_QUOTES = [
  {
    text: 'জীৱন এখন যাত্ৰা, প্ৰতিটো দিন এক নতুন আৰম্ভণি।',
    translation: 'Life is a journey; every day is a new beginning.',
    language: 'Assamese',
  },
  {
    text: 'মনত ৰখা — তুমি যি আছা, সেয়াই যথেষ্ট।',
    translation: 'Remember — who you are is enough.',
    language: 'Assamese',
  },
  {
    text: 'ধৈৰ্য ধৰা মানুহে জীৱনৰ মিঠা ফল পায়।',
    translation: 'The patient person tastes the sweetest fruit of life.',
    language: 'Assamese',
  },
  {
    text: 'ꯃꯤꯑꯣꯏ ꯑꯣꯏꯅꯥ ꯂꯩꯕ ꯑꯃꯗꯤ ꯃꯤꯠ ꯑꯃꯗꯤ ꯇꯥꯈꯜ ꯂꯩꯕ।',
    translation: 'To live as a human is to have love and courage.',
    language: 'Meitei (Manipuri)',
  },
  {
    text: 'আজিৰ ক্ষণটো মূল্যৱান — ইয়াকেই ভালপাওক।',
    translation: 'This moment is precious — embrace it with love.',
    language: 'Assamese',
  },
  {
    text: 'বাট হেৰুৱালেও, ঘৰৰ বাট সদায় হৃদয়ত থাকে।',
    translation: 'Even if the road is forgotten, the way home always stays in the heart.',
    language: 'Assamese',
  },
  {
    text: 'বৃদ্ধ গছৰ শিপা গভীৰ — বয়সত জ্ঞান।',
    translation: 'An old tree has deep roots — wisdom comes with age.',
    language: 'Assamese',
  },
  {
    text: 'সৰু সৰু পদক্ষেপেই দীঘল যাত্ৰা সম্পূৰ্ণ কৰে।',
    translation: 'Small steps complete the longest journey.',
    language: 'Assamese',
  },
];

type SvgComponent = (props: SvgProps) => JSX.Element | null;

function HomeIcon({ source, size }: { source: SvgComponent | { default: SvgComponent }; size: number }) {
  const SvgIcon = (source as any).default ?? source;
  return <SvgIcon width={size} height={size} />;
}

function getFormattedDate(): string {
  const now = new Date();
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const months = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];
  const day = days[now.getDay()];
  const date = now.getDate();
  const month = months[now.getMonth()];
  // Ordinal suffix
  const suffix = date === 1 || date === 21 || date === 31 ? 'st'
    : date === 2 || date === 22 ? 'nd'
    : date === 3 || date === 23 ? 'rd'
    : 'th';
  return `Today Is ${day} ${date}${suffix} ${month}`;
}

export function HomeScreen({ name, streak, gamesCompleted, remindersSet, totalReminders, onGames, onMonitor, onVoice, onRandomGame, nextReminder, onDismissReminder, caregiverPhone, onLanguageChange }: {
  name: string;
  streak: number;
  gamesCompleted: number;
  remindersSet: number;
  totalReminders: number;
  onGames: () => void;
  onMonitor: () => void;
  onVoice: () => void;
  onRandomGame: () => void;
  nextReminder: { id: string; label: string; time: string; icon: 'medicine' | 'water' | 'walk' } | null;
  onDismissReminder: (id: string) => void;
  caregiverPhone?: string;
  onLanguageChange: (lang: string) => void;
}) {
  const { t: tr, fontMedium, fontBold, headingStyle, language } = useLanguage();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  function getGreeting(): string {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return tr('goodMorning');
    if (hour >= 12 && hour < 17) return tr('goodAfternoon');
    if (hour >= 17 && hour < 21) return tr('goodEvening');
    return tr('goodNight');
  }

  const dailyIndex = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
  ) % NE_QUOTES.length;

  const [quoteIndex, setQuoteIndex] = useState(dailyIndex);
  const [displayIndex, setDisplayIndex] = useState(dailyIndex);
  const flipAnim = useRef(new Animated.Value(0)).current;

  const flipToNext = () => {
    const nextIndex = (quoteIndex + 1) % NE_QUOTES.length;
    // First half: flip card face-away (0 → 90deg)
    Animated.timing(flipAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setDisplayIndex(nextIndex);
      setQuoteIndex(nextIndex);
      // Second half: flip card face-forward (90deg → 0)
      flipAnim.setValue(-1);
      Animated.timing(flipAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    });
  };

  const flipRotate = flipAnim.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: ['-90deg', '0deg', '90deg'],
  });

  const flipScale = flipAnim.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: [0.85, 1, 0.85],
  });

  const quote = NE_QUOTES[displayIndex];

  const handleSOS = () => {
    const phone = caregiverPhone || '112'; // 112 is India's national emergency number
    Alert.alert(
      tr('sosConfirmTitle'),
      tr('sosConfirmMessage', phone),
      [
        { text: tr('cancel'), style: 'cancel' },
        {
          text: tr('callNow'),
          style: 'destructive',
          onPress: () => Linking.openURL(`tel:${phone}`),
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* Settings button — top right */}
      <Pressable
        accessibilityLabel="Open settings"
        accessibilityRole="button"
        onPress={() => setSettingsOpen(true)}
        style={({ pressed }) => [styles.settingsButton, pressed && styles.pressed]}
      >
        <HomeIcon size={28} source={require('../SVG_Icons/Settings_Icon.svg')} />
      </Pressable>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={[styles.greeting, { fontFamily: fontMedium, ...headingStyle(48, 61) }]}>{getGreeting()},{`\n`}{name || 'Amma'}</Text>
        <Text style={[styles.date, { fontFamily: fontMedium }]}>{getFormattedDate()}</Text>

        <View style={styles.streakCard}>
          <HomeIcon size={34} source={require('../SVG_Icons/Home/Fire_Icon.svg')} />
          <Text style={[styles.streakText, { fontFamily: fontMedium }]}>
            {tr('streakDays', streak)}
          </Text>
        </View>

        <View style={styles.performanceCard}>
          <Text style={[styles.sectionTitle, { fontFamily: fontMedium }]}>{tr('yourPerformance')}</Text>
          <Text style={[styles.sectionSubtitle, { fontFamily: fontMedium }]}>{tr('littleProgress')}</Text>
          <View style={styles.progressRow}>
            <PerformanceTile
              caption={tr('memoryGames')}
              completed={`${gamesCompleted}/5`}
              completedLabel={tr('completed')}
              icon={require('../SVG_Icons/Home/Brain_Svg.svg')}
              tint="#E7EFE7"
              fontMedium={fontMedium}
              fontBold={fontBold}
            />
            <PerformanceTile
              caption={tr('remindersSet')}
              completed={totalReminders === 0 ? 'None' : `${remindersSet}/${totalReminders}`}
              completedLabel={tr('completed')}
              icon={require('../SVG_Icons/Home/Water_Drop.svg')}
              tint="#E2EFF4"
              fontMedium={fontMedium}
              fontBold={fontBold}
            />
          </View>
          <View style={styles.encouragement}>
            <HomeIcon size={52} source={require('../SVG_Icons/Home/Smiling_Svg.svg')} />
            <Text style={[styles.encouragementText, { fontFamily: fontMedium }]}>{tr('doingWell')}</Text>
          </View>
        </View>

        <View style={styles.exerciseCard}>
          <Text style={[styles.sectionTitle, { fontFamily: fontMedium }]}>{tr('todaysGame')}</Text>
          <Pressable
            accessibilityRole="button"
            onPress={onRandomGame}
            style={({ pressed }) => [styles.playButton, pressed && styles.pressed]}
          >
            <Text style={[styles.playText, { fontFamily: fontBold }]}>{tr('play')}</Text>
          </Pressable>
        </View>

        <View style={styles.reminderCard}>
          <Text style={[styles.sectionTitle, { fontFamily: fontMedium }]}>{tr('reminders')}</Text>
          {nextReminder ? (
            <View style={styles.reminderLine}>
              <HomeIcon
                size={31}
                source={
                  nextReminder.icon === 'water'
                    ? require('../SVG_Icons/Home/Water_Drop.svg')
                    : nextReminder.icon === 'walk'
                    ? require('../SVG_Icons/Home/Fire_Icon.svg')
                    : require('../SVG_Icons/Home/Medicine_Svg.svg')
                }
              />
              <Text style={[styles.reminderText, { fontFamily: fontMedium }]}>{nextReminder.time}  {nextReminder.label}</Text>
              <Pressable
                accessibilityLabel="Mark reminder as done"
                accessibilityRole="checkbox"
                onPress={() => onDismissReminder(nextReminder.id)}
                style={({ pressed }) => [styles.checkBox, pressed && styles.pressed]}
              >
                <Text style={[styles.checkMark, { fontFamily: fontBold }]}>✓</Text>
              </Pressable>
            </View>
          ) : (
            <Text style={[styles.noReminderText, { fontFamily: fontMedium }]}>{tr('noReminders')}</Text>
          )}
        </View>

        {/* Daily Quote Card — tap to flip to next quote */}
        <Pressable
          accessibilityLabel="Motivational quote — tap to see another"
          accessibilityRole="button"
          onPress={flipToNext}
        >
          <Animated.View style={[styles.quoteCard, { transform: [{ rotateY: flipRotate }, { scale: flipScale }] }]}>
            <View style={styles.quoteBadge}>
              <Text style={[styles.quoteBadgeText, { fontFamily: fontBold }]}>{quote.language}</Text>
            </View>
            <Text style={[styles.quoteText, { fontFamily: fontMedium }]}>{quote.text}</Text>
            <Text style={[styles.quoteTranslation, { fontFamily: fontMedium }]}>"{quote.translation}"</Text>
            <Text style={[styles.quoteTapHint, { fontFamily: fontMedium }]}>{tr('tapForQuote')}</Text>
          </Animated.View>
        </Pressable>

        {/* Emergency SOS Button */}
        <Pressable
          accessibilityLabel="Emergency SOS — call caregiver or emergency services"
          accessibilityRole="button"
          onPress={handleSOS}
          style={({ pressed }) => [styles.sosButton, pressed && styles.sosPressed]}
        >
          <View>
            <Text style={[styles.sosTitle, { fontFamily: fontBold }]}>{tr('emergencySOS')}</Text>
            <Text style={[styles.sosSub, { fontFamily: fontMedium }]}>{tr('sosSubtitle')}</Text>
          </View>
        </Pressable>
      </ScrollView>

      {/* Settings Modal */}
      <Modal
        animationType="slide"
        onRequestClose={() => setSettingsOpen(false)}
        transparent
        visible={settingsOpen}
      >
        <Pressable onPress={() => setSettingsOpen(false)} style={styles.modalBackdrop}>
          <Pressable style={styles.settingsSheet} onPress={() => {}}>
            {/* Handle bar */}
            <View style={styles.sheetHandle} />
            <Text style={[styles.sheetTitle, { fontFamily: fontBold }]}>Settings</Text>

            {/* Language */}
            <Text style={[styles.settingLabel, { fontFamily: fontMedium }]}>Language</Text>
            <View style={styles.languageGrid}>
              {(['English', 'Assamese', 'Hindi', 'Bodo'] as const).map(lang => (
                <Pressable
                  key={lang}
                  onPress={() => { onLanguageChange(lang); setSettingsOpen(false); }}
                  style={({ pressed }) => [
                    styles.langChip,
                    language === lang && styles.langChipActive,
                    pressed && styles.pressed,
                  ]}
                >
                  <Text style={[
                    styles.langChipText,
                    { fontFamily: fontMedium },
                    language === lang && styles.langChipTextActive,
                  ]}>{lang}</Text>
                </Pressable>
              ))}
            </View>

            {/* Reminder Notifications */}
            <View style={styles.settingRow}>
              <View style={styles.settingRowText}>
                <Text style={[styles.settingLabel, { fontFamily: fontMedium }]}>Reminder Notifications</Text>
                <Text style={[styles.settingHint, { fontFamily: fontMedium }]}>Get daily alerts for your reminders</Text>
              </View>
              <Switch
                onValueChange={setNotificationsEnabled}
                thumbColor="#FFFFFF"
                trackColor={{ false: '#D0CBC5', true: '#2E7359' }}
                value={notificationsEnabled}
              />
            </View>

            <Pressable
              onPress={() => setSettingsOpen(false)}
              style={({ pressed }) => [styles.sheetClose, pressed && styles.pressed]}
            >
              <Text style={[styles.sheetCloseText, { fontFamily: fontBold }]}>Done</Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>

      <View style={styles.navigationBar}>
        <NavItem icon={require('../SVG_Icons/Home/Home.svg')} label={tr('navHome')} fontMedium={fontMedium} />
        <NavItem icon={require('../SVG_Icons/Home/Controller.svg')} label={tr('navGames')} onPress={onGames} fontMedium={fontMedium} />
        <NavItem icon={require('../SVG_Icons/Home/Voice.svg')} label={tr('navVoice')} onPress={onVoice} fontMedium={fontMedium} />
        <NavItem icon={require('../SVG_Icons/Home/Health_For_Monitor.svg')} label={tr('navMonitor')} onPress={onMonitor} fontMedium={fontMedium} />
      </View>
    </View>
  );
}

function PerformanceTile({
  caption,
  completed,
  completedLabel,
  icon,
  tint,
  fontMedium,
  fontBold,
}: {
  caption: string;
  completed: string;
  completedLabel: string;
  icon: SvgComponent;
  tint: string;
  fontMedium: string;
  fontBold: string;
}) {
  return (
    <View style={[styles.performanceTile, { backgroundColor: tint }]}>
      <HomeIcon size={40} source={icon} />
      <View style={styles.tileText}>
        <Text style={[styles.tileCaption, { fontFamily: fontMedium }]}>{caption}</Text>
        <Text style={[styles.completedValue, { fontFamily: fontBold }]}>{completed}</Text>
        <Text style={[styles.completedLabel, { fontFamily: fontMedium }]}>{completedLabel}</Text>
      </View>
    </View>
  );
}

function NavItem({ icon, label, onPress, fontMedium }: { icon: SvgComponent; label: string; onPress?: () => void; fontMedium: string }) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={({ pressed }) => [styles.navItem, pressed && styles.pressed]}>
      <HomeIcon size={34} source={icon} />
      <Text style={[styles.navLabel, { fontFamily: fontMedium }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    left: -27,
    right: -27,
    backgroundColor: '#F9F6F0',
  },
  content: {
    paddingBottom: 120,
    paddingHorizontal: 22,
    paddingTop: 32,
  },
  greeting: {
    color: '#000000',
    fontSize: 48,
  },
  date: {
    color: '#919191',
    fontSize: 18,
    marginTop: 12,
  },
  streakCard: {
    alignItems: 'center',
    backgroundColor: '#FFE2CA',
    borderColor: 'rgba(0, 0, 0, 0.25)',
    borderRadius: 25,
    borderWidth: 2,
    flexDirection: 'row',
    height: 82,
    marginTop: 22,
    paddingHorizontal: 17,
  },
  streakText: {
    color: '#000000',
    flex: 1,
    fontSize: 19,
    marginLeft: 10,
  },
  performanceCard: {
    borderColor: 'rgba(0, 0, 0, 0.25)',
    borderRadius: 25,
    borderWidth: 2,
    marginTop: 15,
    padding: 18,
  },
  sectionTitle: {
    color: '#000000',
    fontSize: 20,
  },
  sectionSubtitle: {
    color: '#000000',
    fontSize: 14,
    marginTop: 4,
  },
  progressRow: {
    flexDirection: 'row',
    gap: 14,
    marginTop: 18,
  },
  performanceTile: {
    alignItems: 'center',
    borderColor: 'rgba(0, 0, 0, 0.25)',
    borderRadius: 25,
    borderWidth: 2,
    flex: 1,
    flexDirection: 'row',
    minHeight: 96,
    paddingHorizontal: 12,
    paddingVertical: 14,
  },
  tileText: {
    flex: 1,
    flexShrink: 1,
    marginLeft: 8,
    justifyContent: 'center',
  },
  tileCaption: {
    color: '#000000',
    fontSize: 11,
    flexWrap: 'wrap',
    lineHeight: 15,
  },
  completedValue: {
    color: '#000000',
    fontSize: 22,
    lineHeight: 28,
    marginTop: 2,
  },
  completedLabel: {
    color: '#7D6E6E',
    fontSize: 12,
    marginTop: 1,
  },
  encouragement: {
    alignItems: 'center',
    backgroundColor: '#E7EFE7',
    borderColor: 'rgba(0, 0, 0, 0.25)',
    borderRadius: 25,
    borderWidth: 2,
    flexDirection: 'row',
    height: 68,
    marginTop: 18,
    paddingHorizontal: 20,
  },
  encouragementText: {
    color: '#000000',
    fontSize: 14,
    marginLeft: 12,
  },
  exerciseCard: {
    borderColor: 'rgba(0, 0, 0, 0.25)',
    borderRadius: 25,
    borderWidth: 2,
    marginTop: 20,
    padding: 12,
  },
  playButton: {
    alignItems: 'center',
    backgroundColor: '#2E7359',
    borderColor: '#A18686',
    borderRadius: 12,
    borderWidth: 1,
    height: 50,
    justifyContent: 'center',
    marginTop: 12,
  },
  playText: {
    color: '#FFFFFF',
    fontSize: 20,
  },
  reminderCard: {
    borderColor: 'rgba(0, 0, 0, 0.25)',
    borderRadius: 25,
    borderWidth: 2,
    marginTop: 20,
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  reminderLine: {
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: 4,
  },
  reminderText: {
    color: '#000000',
    flex: 1,
    fontSize: 19,
    marginLeft: 5,
  },
  checkBox: {
    alignItems: 'center',
    backgroundColor: '#2E7359',
    borderRadius: 10,
    height: 36,
    justifyContent: 'center',
    marginLeft: 8,
    width: 36,
  },
  checkMark: {
    color: '#FFFFFF',
    fontSize: 20,
  },
  noReminderText: {
    color: '#786F6F',
    fontSize: 15,
    marginTop: 6,
    marginBottom: 4,
  },
  // Settings button
  settingsButton: {
    alignItems: 'center',
    backgroundColor: '#F0EDE8',
    borderColor: 'rgba(0,0,0,0.12)',
    borderRadius: 20,
    borderWidth: 1.5,
    height: 46,
    justifyContent: 'center',
    position: 'absolute',
    right: 0,
    top: 32,
    width: 46,
    zIndex: 5,
  },
  // Settings modal
  modalBackdrop: {
    backgroundColor: 'rgba(0,0,0,0.35)',
    flex: 1,
    justifyContent: 'flex-end',
  },
  settingsSheet: {
    backgroundColor: '#F9F6F0',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingBottom: 36,
    paddingHorizontal: 24,
    paddingTop: 14,
  },
  sheetHandle: {
    alignSelf: 'center',
    backgroundColor: 'rgba(0,0,0,0.15)',
    borderRadius: 3,
    height: 4,
    marginBottom: 18,
    width: 44,
  },
  sheetTitle: {
    color: '#000',
    fontSize: 26,
    marginBottom: 24,
  },
  settingLabel: {
    color: '#000',
    fontSize: 17,
    marginBottom: 10,
  },
  settingHint: {
    color: '#786F6F',
    fontSize: 13,
    marginTop: 2,
  },
  settingRow: {
    alignItems: 'center',
    borderColor: 'rgba(0,0,0,0.1)',
    borderRadius: 16,
    borderWidth: 1.5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    marginTop: 8,
    padding: 16,
  },
  settingRowText: {
    flex: 1,
    paddingRight: 12,
  },
  languageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 24,
  },
  langChip: {
    borderColor: 'rgba(0,0,0,0.2)',
    borderRadius: 20,
    borderWidth: 1.5,
    paddingHorizontal: 18,
    paddingVertical: 9,
  },
  langChipActive: {
    backgroundColor: '#2E7359',
    borderColor: '#2E7359',
  },
  langChipText: {
    color: '#000',
    fontSize: 15,
  },
  langChipTextActive: {
    color: '#FFFFFF',
  },
  sheetClose: {
    alignItems: 'center',
    backgroundColor: '#2E7359',
    borderRadius: 14,
    height: 52,
    justifyContent: 'center',
    marginTop: 4,
  },
  sheetCloseText: {
    color: '#FFF',
    fontSize: 18,
  },
  // Quote card
  quoteCard: {
    borderColor: 'rgba(0,0,0,0.25)',
    borderRadius: 25,
    borderWidth: 2,
    backgroundColor: '#FFF8F0',
    marginTop: 20,
    padding: 18,
  },
  quoteBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFE2CA',
    borderColor: 'rgba(0,0,0,0.12)',
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  quoteBadgeText: {
    color: '#C47A2B',
    fontSize: 12,
  },
  quoteText: {
    color: '#000',
    fontSize: 17,
    lineHeight: 26,
  },
  quoteTranslation: {
    color: '#786F6F',
    fontSize: 14,
    lineHeight: 20,
    marginTop: 8,
    fontStyle: 'italic',
  },
  quoteTapHint: {
    color: '#C47A2B',
    fontSize: 12,
    marginTop: 10,
    textAlign: 'right',
  },
  // SOS button
  sosButton: {
    alignItems: 'center',
    backgroundColor: '#B85858',
    borderRadius: 25,
    flexDirection: 'row',
    gap: 16,
    marginTop: 20,
    marginBottom: 10,
    paddingHorizontal: 22,
    paddingVertical: 18,
    shadowColor: '#B85858',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 7,
  },
  sosPressed: {
    opacity: 0.82,
    transform: [{ scale: 0.97 }],
  },
  sosTitle: {
    color: '#FFFFFF',
    fontSize: 20,
  },
  sosSub: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 13,
    marginTop: 2,
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.22,
    shadowRadius: 14,
    elevation: 12,
  },
  navItem: {
    alignItems: 'center',
    minWidth: 55,
  },
  navLabel: {
    color: '#FFFFFF',
    fontSize: 11,
    marginTop: 2,
  },
  pressed: {
    opacity: 0.72,
  },
});
