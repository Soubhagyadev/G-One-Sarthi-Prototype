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
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Voice{'\n'}Assistant</Text>

      <View style={styles.comingSoonBadge}>
        <Text style={styles.comingSoonText}>Coming Soon</Text>
      </View>

      <Image
        accessibilityIgnoresInvertColors
        resizeMode="cover"
        source={require('../app_image/Voice_Page/Mic_Image.png')}
        style={styles.voiceImage}
      />

      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>AI Voice Chat</Text>
        <Text style={styles.infoBody}>
          Talk to G-One Sarthi in your own language. Ask about medicines, get reminders read aloud, or just have a conversation.
        </Text>
        <View style={styles.featureList}>
          {['Multilingual support (Assamese, Hindi, Bodo)', 'Reads reminders aloud', 'Answers health questions', 'Works offline'].map((f) => (
            <View key={f} style={styles.featureRow}>
              <Text style={styles.featureDot}>·</Text>
              <Text style={styles.featureText}>{f}</Text>
            </View>
          ))}
        </View>
      </View>

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
    paddingHorizontal: 22,
  },
  heading: {
    color: '#000000',
    fontFamily: 'Lora-Medium',
    fontSize: 48,
    letterSpacing: -1.8,
    lineHeight: 56,
    marginTop: 34,
  },
  comingSoonBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFE2CA',
    borderColor: 'rgba(0,0,0,0.15)',
    borderRadius: 20,
    borderWidth: 1,
    marginTop: 10,
    paddingHorizontal: 14,
    paddingVertical: 5,
  },
  comingSoonText: {
    color: '#C47A2B',
    fontFamily: 'Lora-Bold',
    fontSize: 14,
  },
  voiceImage: {
    alignSelf: 'center',
    borderRadius: 24,
    height: 200,
    marginTop: 24,
    width: 200,
  },
  infoCard: {
    borderColor: 'rgba(0,0,0,0.25)',
    borderRadius: 25,
    borderWidth: 2,
    marginTop: 24,
    padding: 20,
  },
  infoTitle: {
    color: '#000',
    fontFamily: 'Lora-Medium',
    fontSize: 22,
    marginBottom: 8,
  },
  infoBody: {
    color: '#786F6F',
    fontFamily: 'Lora-Medium',
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 14,
  },
  featureList: { gap: 6 },
  featureRow: { flexDirection: 'row', alignItems: 'flex-start' },
  featureDot: { color: '#2E7359', fontFamily: 'Lora-Bold', fontSize: 20, lineHeight: 22, marginRight: 8 },
  featureText: { color: '#000', fontFamily: 'Lora-Medium', fontSize: 15, flex: 1, lineHeight: 22 },
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
