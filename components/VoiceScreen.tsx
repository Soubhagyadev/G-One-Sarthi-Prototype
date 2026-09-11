import { useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { SvgUri } from 'react-native-svg';

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
  const [listening, setListening] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Ask Anything</Text>
      <Image
        accessibilityIgnoresInvertColors
        resizeMode="cover"
        source={require('../app_image/Voice_Page/Mic_Image.png')}
        style={styles.voiceImage}
      />
      <Pressable
        accessibilityLabel={listening ? 'Stop listening' : 'Tap to speak'}
        accessibilityRole="button"
        onPress={() => setListening((value) => !value)}
        style={({ pressed }) => [styles.speakButton, listening && styles.listeningButton, pressed && styles.pressed]}
      >
        <Icon size={48} source={require('../SVG_Icons/Voice/Mic.svg')} />
        <Text style={styles.speakText}>{listening ? 'Listening...' : 'Tap To Speak'}</Text>
      </Pressable>

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
  heading: {
    color: '#000000',
    fontFamily: 'Lora-Medium',
    fontSize: 48,
    left: 27,
    letterSpacing: -1.8,
    lineHeight: 61,
    position: 'absolute',
    top: 34,
  },
  voiceImage: {
    borderRadius: 24,
    height: 260,
    left: 70,
    position: 'absolute',
    top: 250,
    width: 260,
  },
  speakButton: {
    alignItems: 'center',
    backgroundColor: '#2E7359',
    borderColor: '#A18686',
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: 'row',
    height: 70,
    justifyContent: 'center',
    left: 35,
    position: 'absolute',
    top: 550,
    width: 320,
  },
  listeningButton: {
    backgroundColor: '#245D48',
  },
  speakText: {
    color: '#FFFFFF',
    fontFamily: 'Lora-Medium',
    fontSize: 20,
    marginLeft: 10,
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
