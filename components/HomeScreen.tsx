import { Alert, Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SvgProps } from 'react-native-svg';

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
    text: 'বাट হেৰুৱালেও, ঘৰৰ বাট সদায় হৃদয়ত থাকে।',
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

function getDailyQuote() {
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
  );
  return NE_QUOTES[dayOfYear % NE_QUOTES.length];
}

type SvgComponent = (props: SvgProps) => JSX.Element | null;

function HomeIcon({ source, size }: { source: SvgComponent | { default: SvgComponent }; size: number }) {
  const SvgIcon = (source as any).default ?? source;
  return <SvgIcon width={size} height={size} />;
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return 'Good Morning';
  if (hour >= 12 && hour < 17) return 'Good Afternoon';
  if (hour >= 17 && hour < 21) return 'Good Evening';
  return 'Good Night';
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

export function HomeScreen({ name, streak, gamesCompleted, remindersSet, totalReminders, onGames, onMonitor, onVoice, onRandomGame, nextReminder, onDismissReminder, caregiverPhone }: {
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
}) {
  const quote = getDailyQuote();

  const handleSOS = () => {
    const phone = caregiverPhone || '112'; // 112 is India's national emergency number
    Alert.alert(
      '🚨 Emergency SOS',
      `Call ${phone === '112' ? 'Emergency Services (112)' : 'your caregiver'} now?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Call Now',
          style: 'destructive',
          onPress: () => Linking.openURL(`tel:${phone}`),
        },
      ]
    );
  };
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.greeting}>{getGreeting()},{`\n`}{name || 'Amma'}</Text>
        <Text style={styles.date}>{getFormattedDate()}</Text>

        <View style={styles.streakCard}>
          <HomeIcon size={34} source={require('../SVG_Icons/Home/Fire_Icon.svg')} />
          <Text style={styles.streakText}>
            {streak === 1
              ? 'You Have Been Playing For 1 Day'
              : `You Have Been Playing For ${streak} Days`}
          </Text>
        </View>

        <View style={styles.performanceCard}>
          <Text style={styles.sectionTitle}>Your Performance</Text>
          <Text style={styles.sectionSubtitle}>A Little Progress Makes a Big Difference</Text>
          <View style={styles.progressRow}>
            <PerformanceTile
              caption="Memory Games"
              completed={`${gamesCompleted}/5`}
              icon={require('../SVG_Icons/Home/Brain_Svg.svg')}
              tint="#E7EFE7"
            />
            <PerformanceTile
              caption="Reminders Set"
              completed={totalReminders === 0 ? 'None' : `${remindersSet}/${totalReminders}`}
              icon={require('../SVG_Icons/Home/Water_Drop.svg')}
              tint="#E2EFF4"
            />
          </View>
          <View style={styles.encouragement}>
            <HomeIcon size={52} source={require('../SVG_Icons/Home/Smiling_Svg.svg')} />
            <Text style={styles.encouragementText}>You are doing well keep it up!!</Text>
          </View>
        </View>

        <View style={styles.exerciseCard}>
          <Text style={styles.sectionTitle}>Today’s Game Exercise For You</Text>
          <Pressable
            accessibilityRole="button"
            onPress={onRandomGame}
            style={({ pressed }) => [styles.playButton, pressed && styles.pressed]}
          >
            <Text style={styles.playText}>▶ Play</Text>
          </Pressable>
        </View>

        <View style={styles.reminderCard}>
          <Text style={styles.sectionTitle}>Reminders</Text>
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
              <Text style={styles.reminderText}>{nextReminder.time}  {nextReminder.label}</Text>
              <Pressable
                accessibilityLabel="Mark reminder as done"
                accessibilityRole="checkbox"
                onPress={() => onDismissReminder(nextReminder.id)}
                style={({ pressed }) => [styles.checkBox, pressed && styles.pressed]}
              >
                <Text style={styles.checkMark}>✓</Text>
              </Pressable>
            </View>
          ) : (
            <Text style={styles.noReminderText}>No upcoming reminders for today.</Text>
          )}
        </View>

        {/* Daily Quote Card */}
        <View style={styles.quoteCard}>
          <View style={styles.quoteBadge}>
            <Text style={styles.quoteBadgeText}>{quote.language}</Text>
          </View>
          <Text style={styles.quoteText}>{quote.text}</Text>
          <Text style={styles.quoteTranslation}>"{quote.translation}"</Text>
        </View>

        {/* Emergency SOS Button */}
        <Pressable
          accessibilityLabel="Emergency SOS — call caregiver or emergency services"
          accessibilityRole="button"
          onPress={handleSOS}
          style={({ pressed }) => [styles.sosButton, pressed && styles.sosPressed]}
        >
          <Text style={styles.sosIcon}>🆘</Text>
          <View>
            <Text style={styles.sosTitle}>Emergency SOS</Text>
            <Text style={styles.sosSub}>Tap to call for help immediately</Text>
          </View>
        </Pressable>
      </ScrollView>

      <View style={styles.navigationBar}>
        <NavItem icon={require('../SVG_Icons/Home/Home.svg')} label="Home" />
        <NavItem icon={require('../SVG_Icons/Home/Controller.svg')} label="Games" onPress={onGames} />
        <NavItem icon={require('../SVG_Icons/Home/Voice.svg')} label="Voice Chat" onPress={onVoice} />
        <NavItem icon={require('../SVG_Icons/Home/Health_For_Monitor.svg')} label="Monitor" onPress={onMonitor} />
      </View>
    </View>
  );
}

function PerformanceTile({
  caption,
  completed,
  icon,
  tint,
}: {
  caption: string;
  completed: string;
  icon: SvgComponent;
  tint: string;
}) {
  return (
    <View style={[styles.performanceTile, { backgroundColor: tint }]}>
      <HomeIcon size={40} source={icon} />
      <View style={styles.tileText}>
        <Text style={styles.tileCaption}>{caption}</Text>
        <Text style={styles.completedValue}>{completed}</Text>
        <Text style={styles.completedLabel}>Completed</Text>
      </View>
    </View>
  );
}

function NavItem({ icon, label, onPress }: { icon: SvgComponent; label: string; onPress?: () => void }) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={({ pressed }) => [styles.navItem, pressed && styles.pressed]}>
      <HomeIcon size={34} source={icon} />
      <Text style={styles.navLabel}>{label}</Text>
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
    fontFamily: 'Lora-Medium',
    fontSize: 48,
    letterSpacing: -1.8,
    lineHeight: 61,
  },
  date: {
    color: '#919191',
    fontFamily: 'Lora-Medium',
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
    fontFamily: 'Lora-Medium',
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
    fontFamily: 'Lora-Medium',
    fontSize: 20,
  },
  sectionSubtitle: {
    color: '#000000',
    fontFamily: 'Lora-Medium',
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
    paddingHorizontal: 10,
    paddingVertical: 12,
  },
  tileText: {
    flex: 1,
    flexShrink: 1,
    marginLeft: 6,
  },
  tileCaption: {
    color: '#000000',
    fontFamily: 'Lora-Medium',
    fontSize: 11,
    flexWrap: 'wrap',
  },
  completedValue: {
    color: '#000000',
    fontFamily: 'Lora-Bold',
    fontSize: 20,
    lineHeight: 24,
  },
  completedLabel: {
    color: '#7D6E6E',
    fontFamily: 'Lora-Medium',
    fontSize: 12,
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
    fontFamily: 'Lora-Medium',
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
    fontFamily: 'Lora-Bold',
    fontSize: 20,
  },
  reminderCard: {
    borderColor: 'rgba(0, 0, 0, 0.25)',
    borderRadius: 25,
    borderWidth: 2,
    marginTop: 20,
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  reminderLine: {
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: 4,
  },
  reminderText: {
    color: '#000000',
    flex: 1,
    fontFamily: 'Lora-Medium',
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
    fontFamily: 'Lora-Bold',
    fontSize: 20,
  },
  noReminderText: {
    color: '#786F6F',
    fontFamily: 'Lora-Medium',
    fontSize: 15,
    marginTop: 4,
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
    fontFamily: 'Lora-Bold',
    fontSize: 12,
  },
  quoteText: {
    color: '#000',
    fontFamily: 'Lora-Medium',
    fontSize: 17,
    lineHeight: 26,
  },
  quoteTranslation: {
    color: '#786F6F',
    fontFamily: 'Lora-Medium',
    fontSize: 14,
    lineHeight: 20,
    marginTop: 8,
    fontStyle: 'italic',
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
  sosIcon: {
    fontSize: 38,
  },
  sosTitle: {
    color: '#FFFFFF',
    fontFamily: 'Lora-Bold',
    fontSize: 20,
  },
  sosSub: {
    color: 'rgba(255,255,255,0.8)',
    fontFamily: 'Lora-Medium',
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
