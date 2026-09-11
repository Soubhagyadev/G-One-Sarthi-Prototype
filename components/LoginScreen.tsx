import { useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { Alert, Image, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

export function LoginScreen({ onBack, onSignIn }: { onBack: () => void; onSignIn: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const signIn = () => {
    if (!email.trim() || !password) {
      Alert.alert('Details needed', 'Please enter your email and password.');
      return;
    }
    if (email.trim().toLowerCase() !== 'example@new.com' || password !== '123') {
      Alert.alert('Incorrect details', 'Email or password is wrong. Please try again.');
      return;
    }
    onSignIn();
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
        <Text style={styles.backText}>‹ Back</Text>
      </Pressable>
      <Text style={styles.heading}>Welcome{`\n`}Caregiver</Text>

      <View style={styles.formCard}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          accessibilityLabel="Email"
          autoCapitalize="none"
          autoComplete="email"
          keyboardType="email-address"
          onChangeText={setEmail}
          style={styles.input}
          value={email}
        />

        <Text style={styles.passwordLabel}>Password</Text>
        <TextInput
          accessibilityLabel="Password"
          autoComplete="password"
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
          value={password}
        />

        <Pressable
          accessibilityRole="button"
          onPress={signIn}
          style={({ pressed }) => [styles.signInButton, pressed && styles.pressed]}
        >
          <Text style={styles.signInText}>Sign In</Text>
        </Pressable>
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
  heading: {
    color: '#FFFFFF',
    fontFamily: 'Lora-Medium',
    fontSize: 64,
    left: 26,
    letterSpacing: -2.5,
    lineHeight: 82,
    position: 'absolute',
    top: 73,
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
    fontFamily: 'Lora-Medium',
    fontSize: 18,
  },
  formCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderRadius: 24,
    height: 416,
    left: 22,
    paddingHorizontal: 20,
    paddingTop: 40,
    position: 'absolute',
    right: 22,
    top: 310,
  },
  label: {
    color: '#333333',
    fontFamily: 'Lora-Medium',
    fontSize: 18,
    lineHeight: 25,
    marginLeft: 9,
  },
  passwordLabel: {
    color: '#333333',
    fontFamily: 'Lora-Medium',
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
    fontFamily: 'Lora-Medium',
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
    fontFamily: 'Lora-Bold',
    fontSize: 20,
  },
  pressed: {
    opacity: 0.72,
  },
});
