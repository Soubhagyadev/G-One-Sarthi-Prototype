import { useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { Alert, Image, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useLanguage } from '../LanguageContext';
import { signInWithEmail, signInWithGoogle, signUpWithEmail } from '../authService';

const GoogleLogo = require('../SVG_Icons/Login_Button/Google_Logo.svg') as any;

export function LoginScreen({ onBack, onSignIn }: { onBack: () => void; onSignIn: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { t: tr, fontMedium, fontBold } = useLanguage();

  const validateDetails = () => {
    if (!email.trim() || !password) {
      Alert.alert('Details needed', 'Please enter your email and password.');
      return false;
    }
    return true;
  };

  const signIn = async () => {
    if (!validateDetails()) return;
    try {
      setLoading(true);
      await signInWithEmail(email.trim(), password);
      onSignIn();
    } catch (error) {
      Alert.alert('Login failed', error instanceof Error ? error.message : 'Unable to log in right now.');
    } finally {
      setLoading(false);
    }
  };

  const signUp = async () => {
    if (!validateDetails()) return;
    try {
      setLoading(true);
      const loggedIn = await signUpWithEmail(email.trim(), password);
      if (loggedIn) {
        onSignIn();
      } else {
        Alert.alert('Check your email', 'Your caregiver account was created. Confirm your email, then log in.');
      }
    } catch (error) {
      Alert.alert('Sign up failed', error instanceof Error ? error.message : 'Unable to create the account right now.');
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    try {
      setLoading(true);
      await signInWithGoogle();
      onSignIn();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to sign in with Google right now.';
      Alert.alert('Google sign-in failed', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Image
        accessibilityIgnoresInvertColors
        resizeMode="cover"
        source={require('../app_image/Login_Screen/CareGiver_Image.png')}
        style={styles.backgroundImage}
      />
      <LinearGradient
        colors={['rgba(0, 0, 0, 0.55)', 'rgba(0, 0, 0, 0)']}
        pointerEvents="none"
        style={styles.topShade}
      />
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Go back"
        onPress={onBack}
        style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}
      >
        <Text style={[styles.backText, { fontFamily: fontMedium }]}>{tr('back')}</Text>
      </Pressable>
      <View style={styles.content}>
        <Text style={[styles.heading, { fontFamily: fontMedium }]}>{tr('welcomeCaregiver')}</Text>
        <View style={styles.formCard}>
          <Text style={[styles.label, { fontFamily: fontMedium }]}>{tr('emailPlaceholder')}</Text>
          <TextInput
            accessibilityLabel="Email"
            autoCapitalize="none"
            autoComplete="email"
            keyboardType="email-address"
            onChangeText={setEmail}
            style={[styles.input, { fontFamily: fontMedium }]}
            value={email}
          />
          <Text style={[styles.passwordLabel, { fontFamily: fontMedium }]}>{tr('passwordPlaceholder')}</Text>
          <TextInput
            accessibilityLabel="Password"
            autoComplete="password"
            onChangeText={setPassword}
            secureTextEntry
            style={[styles.input, { fontFamily: fontMedium }]}
            value={password}
          />
          <Pressable
            accessibilityRole="button"
            disabled={loading}
            onPress={loginWithGoogle}
            style={({ pressed }) => [styles.googleButton, pressed && styles.pressed, loading && styles.disabledButton]}
          >
            {(() => { const Logo = GoogleLogo.default ?? GoogleLogo; return <Logo height={22} width={22} />; })()}
            <Text style={[styles.googleText, { fontFamily: fontBold }]}>
              {loading ? 'Connecting...' : 'Continue with Google'}
            </Text>
          </Pressable>

          <Pressable
            accessibilityRole="button"
            disabled={loading}
            onPress={signUp}
            style={({ pressed }) => [styles.signUpButton, pressed && styles.pressed, loading && styles.disabledButton]}
          >
            <Text style={[styles.signUpText, { fontFamily: fontBold }]}>Sign up</Text>
          </Pressable>

          <Pressable
            accessibilityRole="button"
            disabled={loading}
            onPress={signIn}
            style={({ pressed }) => [styles.signInButton, pressed && styles.pressed, loading && styles.disabledButton]}
          >
            <Text style={[styles.signInText, { fontFamily: fontBold }]}>{tr('signIn')}</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    left: -27,
    right: -27,
    overflow: 'hidden',
  },
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
  },
  topShade: {
    height: 280,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  backButton: {
    left: 22,
    position: 'absolute',
    top: 22,
    paddingVertical: 8,
    paddingHorizontal: 4,
    zIndex: 10,
  },
  backText: {
    color: '#FFFFFF',
    fontSize: 18,
  },
  content: {
    flex: 1,
    justifyContent: 'flex-start',
    paddingHorizontal: 22,
    paddingTop: 80,
    paddingBottom: 30,
  },
  heading: {
    color: '#FFFFFF',
    fontSize: 64,
    letterSpacing: -2.5,
    lineHeight: 82,
    marginBottom: 24,
  },
  formCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 32,
    paddingBottom: 30,
  },
  label: {
    color: '#333333',
    fontSize: 18,
    lineHeight: 25,
    marginLeft: 9,
  },
  passwordLabel: {
    color: '#333333',
    fontSize: 20,
    lineHeight: 25,
    marginLeft: 9,
    marginTop: 24,
  },
  input: {
    backgroundColor: '#F9F6F0',
    borderColor: '#C7C2B8',
    borderRadius: 12,
    borderWidth: 1.5,
    color: '#333333',
    fontSize: 18,
    height: 68,
    marginTop: 10,
    paddingHorizontal: 16,
  },
  signInButton: {
    alignItems: 'center',
    backgroundColor: '#2E7359',
    borderColor: '#A18686',
    borderRadius: 12,
    borderWidth: 1,
    height: 50,
    justifyContent: 'center',
    marginTop: 20,
  },
  signInText: {
    color: '#FFFFFF',
    fontSize: 20,
  },
  googleButton: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: '#D9D2C9',
    borderRadius: 12,
    borderWidth: 1,
    height: 50,
    justifyContent: 'center',
    marginTop: 12,
    flexDirection: 'row',
    gap: 10,
  },
  googleText: {
    color: '#1F2937',
    fontSize: 18,
  },
  signUpButton: {
    alignItems: 'center',
    backgroundColor: '#F2EEE7',
    borderColor: '#C7C2B8',
    borderRadius: 12,
    borderWidth: 1,
    height: 50,
    justifyContent: 'center',
    marginTop: 12,
  },
  signUpText: {
    color: '#2E7359',
    fontSize: 18,
  },
  disabledButton: {
    opacity: 0.7,
  },
  pressed: {
    opacity: 0.72,
  },
});
