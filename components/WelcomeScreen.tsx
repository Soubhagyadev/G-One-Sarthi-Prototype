import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useLanguage } from '../LanguageContext';

type WelcomeScreenProps = {
  name: string;
  onContinue: () => void;
};

export function WelcomeScreen({ name, onContinue }: WelcomeScreenProps) {
  const { t: tr, fontMedium, fontBold, headingStyle } = useLanguage();

  return (
    <Pressable
      accessibilityHint="Opens your home dashboard"
      accessibilityLabel="Continue to home"
      accessibilityRole="button"
      onPress={onContinue}
      style={styles.container}
    >
      <Image
        accessibilityIgnoresInvertColors
        resizeMode="cover"
        source={require('../app_image/Welcome_Screen/Welcome_Screen_Image.png')}
        style={styles.backgroundImage}
      />
      <Text style={[styles.heading, { fontFamily: fontMedium, ...headingStyle(54, 68) }]}>
        {tr('welcomePatient')}{`\n`}{name || 'Amma'}
      </Text>
      <Text style={[styles.tapHint, { fontFamily: fontBold }]}> 
        {tr('tapToContinue')}
      </Text>
    </Pressable>
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
    bottom: 0,
    left: 0,
    position: 'absolute',
    top: 84,
    width: '100%',
  },
  heading: {
    color: '#000000',
    fontSize: 54,
    left: 23,
    position: 'absolute',
    top: 47,
  },
  tapHint: {
    bottom: 36,
    color: '#FFFFFF',
    fontSize: 16,
    left: 23,
    letterSpacing: 0.2,
    position: 'absolute',
  },
});
