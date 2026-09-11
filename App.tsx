import { useEffect, useRef, useState, type ReactNode } from 'react';
import { useFonts } from 'expo-font';
import { StatusBar } from 'expo-status-bar';
import { SvgUri } from 'react-native-svg';
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
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
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
  const [language, setLanguage] = useState('English');
  const [name, setName] = useState('Amma');
  const [reminders, setReminders] = useState<Reminder[]>(initialReminders);
  const [fontsLoaded] = useFonts({
    'Lora-Medium': require('./fonts/Lora/static/Lora-Medium.ttf'),
    'Lora-Bold': require('./fonts/Lora/static/Lora-Bold.ttf'),
  });

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

  // Find the next upcoming reminder (closest to current time, wrapping to tomorrow if needed)
  const getNextReminder = (): Reminder | null => {
    if (reminders.length === 0) return null;
    const nowMinutes = new Date().getHours() * 60 + new Date().getMinutes();
    const sorted = [...reminders]
      .filter(r => r.label.trim())
      .sort((a, b) => parseMinutes(a.time) - parseMinutes(b.time));
    // Find first reminder still upcoming today
    const upcoming = sorted.find(r => parseMinutes(r.time) > nowMinutes);
    // If none left today, wrap to earliest tomorrow
    return upcoming ?? sorted[0] ?? null;
  };

  const gameScreens = ['travelGame', 'matchPairs', 'packYourBags', 'watchTheTray', 'peopleFace'] as const;
  const launchRandomGame = () => {
    const pick = gameScreens[Math.floor(Math.random() * gameScreens.length)];
    setScreen(pick);
  };

  const chooseRole = (role: 'patient' | 'caregiver') => {
    setLanguagePickerOpen(false);
    setScreen(role === 'patient' ? 'name' : 'login');
  };

  const chooseLanguage = (nextLanguage: string) => {
    setLanguage(nextLanguage);
    setLanguagePickerOpen(false);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <View style={styles.screen}>
        <PageFade key={screen} animate={screen !== 'name'} screenKey={screen}>
          {screen === 'main' ? (
          <>
            <View style={styles.languageArea}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`Select language: ${language}`}
                onPress={() => setLanguagePickerOpen((isOpen) => !isOpen)}
                style={styles.languageButton}
              >
                <SvgUri
                  uri={Image.resolveAssetSource(require('./SVG_Icons/Globe.svg')).uri}
                  height={35}
                  width={35}
                />
                <Text style={styles.languageText}>{language}</Text>
              </Pressable>
              {languagePickerOpen && (
                <View accessibilityRole="menu" style={styles.languageMenu}>
                  {['English', 'Hindi', 'Assamese', 'Bodo'].map((option) => (
                    <Pressable
                      key={option}
                      accessibilityRole="menuitem"
                      onPress={() => chooseLanguage(option)}
                      style={({ pressed }) => [styles.languageOption, pressed && styles.pressed]}
                    >
                      <Text style={styles.languageOptionText}>{option}</Text>
                    </Pressable>
                  ))}
                </View>
              )}
            </View>

            <View style={styles.intro}>
              <Text style={styles.title}>Welcome To{`\n`}G-One Sarthi</Text>
              <Text style={styles.subtitle}>
                An AI Based Companion{`\n`}For Elderly Patient Suffering From Dementia & Alzheimers
              </Text>
            </View>

            <View style={styles.roleList}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="I'm a Patient"
            onPress={() => chooseRole('patient')}
            style={({ pressed }) => [styles.roleCard, pressed && styles.pressed]}
          >
            <Text style={styles.roleTitle}>I'm a Patient</Text>
            <Image
              source={require('./app_image/Main_Screen/Caregiver_Image.png')}
              resizeMode="contain"
              style={styles.patientImage}
            />
          </Pressable>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="I'm a Caregiver"
            onPress={() => chooseRole('caregiver')}
            style={({ pressed }) => [styles.roleCard, pressed && styles.pressed]}
          >
            <Text style={styles.roleTitle}>I'm a Caregiver</Text>
            <Image
              source={require('./app_image/Main_Screen/Patient_Image.png')}
              resizeMode="contain"
              style={styles.caregiverImage}
            />
          </Pressable>
        </View>
          </>
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
          screen === 'home' ? <HomeScreen name={name} onGames={() => setScreen('games')} onMonitor={() => setScreen('monitor')} onVoice={() => setScreen('voice')} onRandomGame={launchRandomGame} nextReminder={getNextReminder()} /> :
          screen === 'games' ? <GamesScreen onHome={() => setScreen('home')} onMatchPairs={() => setScreen('matchPairs')} onMonitor={() => setScreen('monitor')} onPackYourBags={() => setScreen('packYourBags')} onTravelPattern={() => setScreen('travelGame')} onVoice={() => setScreen('voice')} onWatchTheTray={() => setScreen('watchTheTray')} onPeopleFace={() => setScreen('peopleFace')} /> :
          screen === 'voice' ? <VoiceScreen onGames={() => setScreen('games')} onHome={() => setScreen('home')} onMonitor={() => setScreen('monitor')} /> :
          screen === 'monitor' ? <MonitorScreen onGames={() => setScreen('games')} onHome={() => setScreen('home')} onVoice={() => setScreen('voice')} reminders={reminders} setReminders={setReminders} /> :
          screen === 'travelGame' ? <TravelPatternGame onExit={() => setScreen('games')} /> :
          screen === 'matchPairs' ? <MatchPairsGame onExit={() => setScreen('games')} /> :
          screen === 'packYourBags' ? <PackYourBagsGame onExit={() => setScreen('games')} /> :
          screen === 'watchTheTray' ? <WatchTheTrayGame onExit={() => setScreen('games')} /> :
          screen === 'peopleFace' ? <PeopleFaceGame onExit={() => setScreen('games')} /> :
          <LoginScreen onBack={() => setScreen('main')} onSignIn={() => setScreen('monitor')} />
          )}
        </PageFade>
      </View>
    </SafeAreaView>
  );
}

function PageFade({
  animate,
  children,
  screenKey,
}: {
  animate: boolean;
  children: ReactNode;
  screenKey: string;
}) {
  const opacity = useRef(new Animated.Value(animate ? 0 : 1)).current;

  useEffect(() => {
    if (!animate) {
      opacity.setValue(1);
      return;
    }
    opacity.setValue(0);
    Animated.timing(opacity, {
      duration: 260,
      easing: Easing.out(Easing.cubic),
      toValue: 1,
      useNativeDriver: true,
    }).start();
  }, [animate, opacity, screenKey]);

  return <Animated.View style={[styles.pageTransition, { opacity }]}>{children}</Animated.View>;
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
    right: -7,
    top: 42,
    zIndex: 5,
  },
  languageButton: {
    height: 55,
    width: 134,
    borderColor: colors.ink,
    borderWidth: 1,
    borderRadius: 28,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
  },
  languageText: {
    fontFamily: 'Lora-Medium',
    fontSize: 20,
    color: colors.ink,
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
    width: 180,
  },
  languageOption: {
    minHeight: 48,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  languageOptionText: {
    color: colors.ink,
    fontFamily: 'Lora-Medium',
    fontSize: 18,
  },
  intro: {
    marginTop: 97,
  },
  title: {
    color: colors.ink,
    fontFamily: 'Lora-Medium',
    fontSize: 45,
    lineHeight: 58,
    letterSpacing: -1.5,
  },
  subtitle: {
    color: colors.ink,
    fontFamily: 'Lora-Medium',
    fontSize: 14,
    lineHeight: 18,
    marginTop: 3,
  },
  roleList: {
    marginTop: 46,
    gap: 46,
  },
  roleCard: {
    height: 224,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: 16,
    overflow: 'hidden',
  },
  roleTitle: {
    color: colors.ink,
    fontFamily: 'Lora-Medium',
    fontSize: 22,
    lineHeight: 28,
    marginLeft: 17,
    marginTop: 6,
  },
  patientImage: {
    position: 'absolute',
    height: 188,
    width: 350,
    bottom: 0,
    left: 0,
  },
  caregiverImage: {
    position: 'absolute',
    height: 188,
    width: 350,
    bottom: 0,
    left: 7,
  },
  pressed: {
    opacity: 0.72,
  },
});
