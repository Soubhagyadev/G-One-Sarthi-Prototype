import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

type WelcomeScreenProps = {
  name: string;
  onContinue: () => void;
};

export function WelcomeScreen({ name, onContinue }: WelcomeScreenProps) {
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
      <Text style={styles.heading}>Welcome,{`\n`}{name || 'Amma'}</Text>
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
    fontFamily: 'Lora-Medium',
    fontSize: 54,
    left: 23,
    letterSpacing: -1.5,
    lineHeight: 68,
    position: 'absolute',
    top: 47,
  },
});
