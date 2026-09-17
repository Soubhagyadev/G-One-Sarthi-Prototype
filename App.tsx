import { useEffect, useRef, useState, type ReactNode } from 'react';
import * as Notifications from 'expo-notifications';
import type { Language } from './i18n';
import { getItem, migrateLegacyAsyncStorage, multiGet, multiSet, setItem } from './storage';
import * as NavigationBar from 'expo-navigation-bar';
import { useFonts } from 'expo-font';
import { StatusBar } from 'expo-status-bar';
import { LanguageProvider, useLanguage } from './LanguageContext';

// Show notifications even when the app is in the foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});
const GlobeSvg = require('./SVG_Icons/Globe.svg') as any;
import { AskingForName } from './components/AskingForName';
import { LoginScreen } from './components/LoginScreen';
import { HomeScreen } from './components/HomeScreen';
import { GamesScreen } from './components/GamesScreen';
import { VoiceScreen } from './components/VoiceScreen';
import { MonitorScreen, initialReminders, type Reminder } from './components/MonitorScreen';
import { TravelPatternGame } from './components/TravelPatternGame';
import { MatchPairsGame } from './components/MatchPairsGame';
import { PackYourBagsGame } from './components/PackYourBagsGame';
import { WatchTheTrayGame } from './components/WatchTheTrayGame';
import { PeopleFaceGame } from './components/PeopleFaceGame';
import { WelcomeScreen } from './components/WelcomeScreen';
import {
  Animated,
  Easing,
  Image,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';

const colors = {
  background: '#F9F6F0',
  ink: '#000000',
  cardBorder: 'rgba(217, 212, 204, 0.50)',
};

export default function App() {
  const [screen, setScreen] = useState<'main' | 'name' | 'welcome' | 'login' | 'home' | 'games' | 'voice' | 'monitor' | 'travelGame' | 'matchPairs' | 'packYourBags' | 'watchTheTray' | 'peopleFace'>('main');
  const [languagePickerOpen, setLanguagePickerOpen] = useState(false);
  const [language, setLanguage] = useState<Language>('English');
  const [name, setName] = useState('Amma');
  const [reminders, setReminders] = useState<Reminder[]>(initialReminders);
  const [streak, setStreak] = useState(0);
  const [gamesCompleted, setGamesCompleted] = useState<Set<string>>(new Set());
  const [dismissedReminders, setDismissedReminders] = useState<Set<string>>(new Set());
  const [lastActive, setLastActive] = useState<string>('');
  // weeklyHistory: array of 7 entries, index 0 = 6 days ago, index 6 = today
  // each entry: { date: 'YYYY-MM-DD', count: number }
  const [weeklyHistory, setWeeklyHistory] = useState<{ date: string; count: number }[]>([]);
  const [fontsLoaded] = useFonts({
    'Lora-Medium': require('./fonts/Lora/static/Lora-Medium.ttf'),
    'Lora-Bold': require('./fonts/Lora/static/Lora-Bold.ttf'),
    'NotoSerif-Bengali': require('./fonts/Noto_Serif_Bengali/static/NotoSerifBengali-Medium.ttf'),
    'NotoSerif-Bengali-Bold': require('./fonts/Noto_Serif_Bengali/static/NotoSerifBengali-Bold.ttf'),
    'NotoSerif-Devanagari': require('./fonts/Noto_Serif_Devanagari/static/NotoSerifDevanagari-Medium.ttf'),
    'NotoSerif-Devanagari-Bold': require('./fonts/Noto_Serif_Devanagari/static/NotoSerifDevanagari-Bold.ttf'),
  });

  useEffect(() => {
    if (Platform.OS !== 'android') return;

    NavigationBar.setVisibilityAsync('hidden').catch(() => undefined);
    NavigationBar.setBehaviorAsync('overlay-swipe').catch(() => undefined);
  }, []);

  useEffect(() => {
    migrateLegacyAsyncStorage().catch(() => undefined);
  }, []);

  useEffect(() => {
    setItem('language', language).catch(() => undefined);
  }, [language]);

  useEffect(() => {
    setItem('patientName', name).catch(() => undefined);
  }, [name]);

  useEffect(() => {
    setItem('reminders', JSON.stringify(reminders)).catch(() => undefined);
  }, [reminders]);

  // --- Streak logic ---
  // Runs once on mount. Compares today's date to the last recorded date in storage.
  // Same day → no change. Yesterday → increment. Older → reset to 1.
  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10); // "YYYY-MM-DD"

    // Build the 7-day window (6 days ago → today)
    const buildWeek = (historyMap: Record<string, number>) => {
      const week: { date: string; count: number }[] = [];
      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const key = d.toISOString().slice(0, 10);
        week.push({ date: key, count: historyMap[key] ?? 0 });
      }
      return week;
    };

    multiGet([
      'streakCount', 'streakLastDate',
      'gamesCompletedDate', 'gamesCompletedList',
      'dismissedRemindersDate', 'dismissedRemindersList',
      'lastActive', 'weeklyHistory',
      'language', 'patientName',
      'reminders',
    ]).then((rows) => {
      const values = Object.fromEntries(rows.map(([key, value]) => [key, value]));
      const savedCount = values.streakCount;
      const savedDate = values.streakLastDate;
      const gamesDate = values.gamesCompletedDate;
      const gamesList = values.gamesCompletedList;
      const dismissDate = values.dismissedRemindersDate;
      const dismissList = values.dismissedRemindersList;
      const savedWeekly = values.weeklyHistory;
      const savedLanguage = values.language;
      const savedName = values.patientName;
      const savedReminders = values.reminders;

      if (savedLanguage) setLanguage(savedLanguage as Language);
      if (savedName) setName(savedName);
      if (savedReminders) {
        try {
          setReminders(JSON.parse(savedReminders));
        } catch {
          setReminders([]);
        }
      }

      // ── Streak ──
      const currentStreak = savedCount ? Number(savedCount) : 0;
      if (!savedDate) {
        multiSet([['streakCount', '1'], ['streakLastDate', today]]).catch(() => undefined);
        setStreak(1);
      } else if (savedDate === today) {
        setStreak(currentStreak);
      } else {
        const lastDate = new Date(savedDate);
        const todayDate = new Date(today);
        const diffDays = Math.round((todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
        const newStreak = diffDays === 1 ? currentStreak + 1 : 1;
        multiSet([['streakCount', String(newStreak)], ['streakLastDate', today]]).catch(() => undefined);
        setStreak(newStreak);
      }

      // ── Games completed today ──
      if (gamesDate === today && gamesList) {
        setGamesCompleted(new Set(JSON.parse(gamesList)));
      } else {
        multiSet([['gamesCompletedDate', today], ['gamesCompletedList', '[]']]).catch(() => undefined);
        setGamesCompleted(new Set());
      }

      // ── Dismissed reminders today ──
      if (dismissDate === today && dismissList) {
        setDismissedReminders(new Set(JSON.parse(dismissList)));
      } else {
        multiSet([['dismissedRemindersDate', today], ['dismissedRemindersList', '[]']]).catch(() => undefined);
        setDismissedReminders(new Set());
      }

      // ── Last active ──
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const h12 = (hours % 12 || 12);
      const timeStr = `${h12}:${minutes} ${ampm}`;
      const activeStr = `Today at ${timeStr}`;
      setLastActive(activeStr);
      setItem('lastActive', activeStr).catch(() => undefined);

      // ── Weekly history ──
      const historyMap: Record<string, number> = savedWeekly ? JSON.parse(savedWeekly) : {};
      const todayCount = gamesDate === today && gamesList ? JSON.parse(gamesList).length : 0;
      historyMap[today] = todayCount;
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - 7);
      Object.keys(historyMap).forEach(k => { if (new Date(k) < cutoff) delete historyMap[k]; });
      setItem('weeklyHistory', JSON.stringify(historyMap)).catch(() => undefined);
      setWeeklyHistory(buildWeek(historyMap));
    }).catch(() => {
      setStreak(1);
      setGamesCompleted(new Set());
      setDismissedReminders(new Set());
      setLastActive('Today at 9:00 AM');
      setWeeklyHistory(buildWeek({}));
    });
  }, []);

  if (!fontsLoaded) return null;

  // Parse a time string like "8:00 PM" into total minutes from midnight for sorting
  const parseMinutes = (time: string): number => {
    const match = time.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
    if (!match) return Infinity;
    let hour = Number(match[1]);
    const minute = Number(match[2]);
    const isPM = match[3].toUpperCase() === 'PM';
    if (isPM && hour !== 12) hour += 12;
    if (!isPM && hour === 12) hour = 0;
    return hour * 60 + minute;
  };

  // Find the next upcoming reminder strictly in the future from current time.
  // Returns null if all reminders for today have already passed.
  const getNextReminder = (): Reminder | null => {
    if (reminders.length === 0) return null;
    const nowMinutes = new Date().getHours() * 60 + new Date().getMinutes();
    const sorted = [...reminders]
      .filter(r => r.label.trim() && !dismissedReminders.has(r.id))
      .sort((a, b) => parseMinutes(a.time) - parseMinutes(b.time));
    // Only return a reminder that is strictly in the future
    return sorted.find(r => parseMinutes(r.time) > nowMinutes) ?? null;
  };

  const dismissReminder = (id: string) => {
    setDismissedReminders((prev) => {
      if (prev.has(id)) return prev;
      const next = new Set(prev);
      next.add(id);
      const today = new Date().toISOString().slice(0, 10);
      multiSet([['dismissedRemindersDate', today], ['dismissedRemindersList', JSON.stringify([...next])]]).catch(() => undefined);
      return next;
    });
  };

  const gameScreens = ['travelGame', 'matchPairs', 'packYourBags', 'watchTheTray', 'peopleFace'] as const;
  const launchRandomGame = () => {
    const pick = gameScreens[Math.floor(Math.random() * gameScreens.length)];
    setScreen(pick);
  };

  const markGameComplete = (gameId: string) => {
    setGamesCompleted((prev) => {
      if (prev.has(gameId)) return prev;
      const next = new Set(prev);
      next.add(gameId);
      const today = new Date().toISOString().slice(0, 10);
      multiSet([['gamesCompletedDate', today], ['gamesCompletedList', JSON.stringify([...next])]]).catch(() => undefined);
      getItem('weeklyHistory').then(saved => {
        const map: Record<string, number> = saved ? JSON.parse(saved) : {};
        map[today] = next.size;
        setItem('weeklyHistory', JSON.stringify(map)).catch(() => undefined);
        const week: { date: string; count: number }[] = [];
        for (let i = 6; i >= 0; i--) {
          const d = new Date();
          d.setDate(d.getDate() - i);
          const key = d.toISOString().slice(0, 10);
          week.push({ date: key, count: map[key] ?? 0 });
        }
        setWeeklyHistory(week);
      }).catch(() => undefined);
      return next;
    });
  };

  const chooseRole = (role: 'patient' | 'caregiver') => {
    setLanguagePickerOpen(false);
    setScreen(role === 'patient' ? 'name' : 'login');
  };

  const chooseLanguage = (nextLanguage: Language) => {
    setLanguage(nextLanguage);
    setLanguagePickerOpen(false);
  };

  return (
    <LanguageProvider language={language}>
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" hidden={true} />
      <View style={styles.screen}>
        <PageFade screenKey={screen}>
          {screen === 'main' ? (
          <MainScreenContent
            language={language}
            languagePickerOpen={languagePickerOpen}
            setLanguagePickerOpen={setLanguagePickerOpen}
            chooseLanguage={chooseLanguage}
            chooseRole={chooseRole}
          />
          ) : screen === 'name' ? (
          <AskingForName
            name={name}
            onBack={() => setScreen('main')}
            onChangeName={setName}
            onProceed={() => setScreen('welcome')}
          />
          ) : screen === 'welcome' ? (
          <WelcomeScreen name={name} onContinue={() => setScreen('home')} />
          ) : (
          screen === 'home' ? <HomeScreen name={name} streak={streak} gamesCompleted={gamesCompleted.size} remindersSet={reminders.filter(r => dismissedReminders.has(r.id)).length} totalReminders={reminders.length} onGames={() => setScreen('games')} onMonitor={() => setScreen('monitor')} onVoice={() => setScreen('voice')} onRandomGame={launchRandomGame} nextReminder={getNextReminder()} onDismissReminder={dismissReminder} caregiverPhone="112" onLanguageChange={(lang) => setLanguage(lang as Language)} /> :
          screen === 'games' ? <GamesScreen onHome={() => setScreen('home')} onMatchPairs={() => setScreen('matchPairs')} onMonitor={() => setScreen('monitor')} onPackYourBags={() => setScreen('packYourBags')} onTravelPattern={() => setScreen('travelGame')} onVoice={() => setScreen('voice')} onWatchTheTray={() => setScreen('watchTheTray')} onPeopleFace={() => setScreen('peopleFace')} /> :
          screen === 'voice' ? <VoiceScreen onGames={() => setScreen('games')} onHome={() => setScreen('home')} onMonitor={() => setScreen('monitor')} streak={streak} gamesCompleted={gamesCompleted} reminders={reminders} setReminders={setReminders} dismissedReminders={dismissedReminders} patientName={name} /> :
          screen === 'monitor' ? <MonitorScreen onGames={() => setScreen('games')} onHome={() => setScreen('home')} onVoice={() => setScreen('voice')} reminders={reminders} setReminders={setReminders} gamesCompleted={gamesCompleted} streak={streak} lastActive={lastActive} weeklyHistory={weeklyHistory} remindersTotal={reminders.length} remindersDone={dismissedReminders.size} /> :
          screen === 'travelGame' ? <TravelPatternGame onExit={() => setScreen('games')} onComplete={() => markGameComplete('travelGame')} /> :
          screen === 'matchPairs' ? <MatchPairsGame onExit={() => setScreen('games')} onComplete={() => markGameComplete('matchPairs')} /> :
          screen === 'packYourBags' ? <PackYourBagsGame onExit={() => setScreen('games')} onComplete={() => markGameComplete('packYourBags')} /> :
          screen === 'watchTheTray' ? <WatchTheTrayGame onExit={() => setScreen('games')} onComplete={() => markGameComplete('watchTheTray')} /> :
          screen === 'peopleFace' ? <PeopleFaceGame onExit={() => setScreen('games')} onComplete={() => markGameComplete('peopleFace')} /> :
          <LoginScreen onBack={() => setScreen('main')} onSignIn={() => setScreen('monitor')} />
          )}
        </PageFade>
      </View>
    </SafeAreaView>
    </LanguageProvider>
  );
}

function MainScreenContent({
  language,
  languagePickerOpen,
  setLanguagePickerOpen,
  chooseLanguage,
  chooseRole,
}: {
  language: Language;
  languagePickerOpen: boolean;
  setLanguagePickerOpen: (open: boolean | ((prev: boolean) => boolean)) => void;
  chooseLanguage: (lang: Language) => void;
  chooseRole: (role: 'patient' | 'caregiver') => void;
}) {
  const { t, fontMedium, fontBold, headingStyle } = useLanguage();
  const { width, height } = useWindowDimensions();
  // Card height: 38% of screen height, capped so two cards + gaps always fit
  const cardHeight = Math.min(Math.round(height * 0.30), 220);
  const imageH = Math.round(cardHeight * 0.84);

  return (
    <ScrollView
      contentContainerStyle={styles.mainContent}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      {/* Language picker — top right */}
      <View style={styles.languageArea}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Select language: ${language}`}
          onPress={() => setLanguagePickerOpen((isOpen) => !isOpen)}
          style={styles.languageButton}
        >
          {(() => { const G = (GlobeSvg as any).default ?? GlobeSvg; return <G width={35} height={35} />; })()}
          <Text style={[styles.languageText, { fontFamily: fontMedium }]}>{language}</Text>
        </Pressable>
        {languagePickerOpen && (
          <View accessibilityRole="menu" style={styles.languageMenu}>
            {(['English', 'Hindi', 'Assamese', 'Bodo'] as const).map((option) => (
              <Pressable
                key={option}
                accessibilityRole="menuitem"
                onPress={() => chooseLanguage(option)}
                style={({ pressed }) => [styles.languageOption, pressed && styles.pressed]}
              >
                <Text style={[styles.languageOptionText, { fontFamily: fontMedium }]}>{option}</Text>
              </Pressable>
            ))}
          </View>
        )}
      </View>

      {/* Title block — pushed down to clear language button */}
      <View style={styles.intro}>
        <Text style={[styles.title, { fontFamily: fontMedium, ...headingStyle(45, 58) }]}>{t('welcome')}</Text>
        <Text style={[styles.subtitle, { fontFamily: fontMedium }]}>{t('subtitle')}</Text>
      </View>

      {/* Role cards */}
      <View style={styles.roleList}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t('imPatient')}
          onPress={() => chooseRole('patient')}
          style={({ pressed }) => [styles.roleCard, { height: cardHeight }, pressed && styles.pressed]}
        >
          <Text style={[styles.roleTitle, { fontFamily: fontMedium }]}>{t('imPatient')}</Text>
          <Image
            source={require('./app_image/Main_Screen/Caregiver_Image.png')}
            resizeMode="contain"
            style={[styles.patientImage, { height: imageH, width: width * 0.82 }]}
          />
        </Pressable>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t('imCaregiver')}
          onPress={() => chooseRole('caregiver')}
          style={({ pressed }) => [styles.roleCard, { height: cardHeight }, pressed && styles.pressed]}
        >
          <Text style={[styles.roleTitle, { fontFamily: fontMedium }]}>{t('imCaregiver')}</Text>
          <Image
            source={require('./app_image/Main_Screen/Patient_Image.png')}
            resizeMode="contain"
            style={[styles.caregiverImage, { height: imageH, width: width * 0.82 }]}
          />
        </Pressable>
      </View>
    </ScrollView>
  );
}

function PageFade({
  children,
  screenKey,
}: {
  children: ReactNode;
  screenKey: string;
}) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(18)).current;

  useEffect(() => {
    opacity.setValue(0);
    translateY.setValue(18);
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 280,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 280,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, [screenKey]);

  return (
    <Animated.View style={[styles.pageTransition, { opacity, transform: [{ translateY }] }]}>
      {children}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  screen: {
    flex: 1,
    backgroundColor: colors.background,
    overflow: 'hidden',
    paddingHorizontal: 27,
  },
  pageTransition: {
    flex: 1,
  },
  languageArea: {
    alignItems: 'flex-end',
    position: 'absolute',
    right: 0,
    top: 42,
    zIndex: 5,
  },
  languageButton: {
    minWidth: 120,
    maxWidth: 200,
    height: 55,
    borderColor: colors.ink,
    borderWidth: 1,
    borderRadius: 28,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    gap: 7,
  },
  languageText: {
    fontSize: 18,
    color: colors.ink,
    flexShrink: 1,
  },
  languageMenu: {
    backgroundColor: colors.background,
    borderColor: colors.cardBorder,
    borderWidth: 1,
    borderRadius: 16,
    elevation: 4,
    marginTop: 8,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    minWidth: 180,
  },
  languageOption: {
    minHeight: 48,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  languageOptionText: {
    color: colors.ink,
    fontSize: 18,
  },
  intro: {
    marginTop: 72,
  },
  title: {
    color: colors.ink,
    fontSize: 45,
  },
  subtitle: {
    color: colors.ink,
    fontFamily: 'Lora-Medium',
    fontSize: 14,
    lineHeight: 18,
    marginTop: 3,
  },
  mainContent: {
    paddingBottom: 32,
    paddingTop: 36,
    flexGrow: 1,
  },
  roleList: {
    marginTop: 28,
    gap: 16,
    paddingBottom: 16,
  },
  roleCard: {
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: 16,
    overflow: 'hidden',
  },
  roleTitle: {
    color: colors.ink,
    fontSize: 22,
    lineHeight: 28,
    marginLeft: 17,
    marginTop: 10,
  },
  patientImage: {
    position: 'absolute',
    bottom: 0,
    left: 0,
  },
  caregiverImage: {
    position: 'absolute',
    bottom: 0,
    left: 7,
  },
  pressed: {
    opacity: 0.72,
  },
});
