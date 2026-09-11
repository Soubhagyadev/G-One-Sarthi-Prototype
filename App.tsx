import { useEffect, useRef, useState, type ReactNode } from 'react';
import { useFonts } from 'expo-font';
import { StatusBar } from 'expo-status-bar';
import { SvgUri } from 'react-native-svg';
import { AskingForName } from './components/AskingForName';
import { LoginScreen } from './components/LoginScreen';
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
  const [screen, setScreen] = useState<'main' | 'name' | 'welcome' | 'login'>('main');
  const [languagePickerOpen, setLanguagePickerOpen] = useState(false);
  const [language, setLanguage] = useState('English');
  const [name, setName] = useState('Amma');
  const [fontsLoaded] = useFonts({
    'Lora-Medium': require('./fonts/Lora/static/Lora-Medium.ttf'),
    'Lora-Bold': require('./fonts/Lora/static/Lora-Bold.ttf'),
  });

  if (!fontsLoaded) return null;

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
            onChangeName={setName}
            onProceed={() => setScreen('welcome')}
          />
          ) : screen === 'welcome' ? (
          <WelcomeScreen name={name} />
          ) : (
            <LoginScreen />
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
