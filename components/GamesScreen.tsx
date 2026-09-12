import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SvgProps } from 'react-native-svg';

type SvgComponent = (props: SvgProps) => JSX.Element | null;

function Icon({ source, size }: { source: SvgComponent | { default: SvgComponent }; size: number }) {
  const SvgIcon = (source as any).default ?? source;
  return <SvgIcon width={size} height={size} />;
}

type GamesScreenProps = {
  onHome: () => void;
  onMonitor: () => void;
  onMatchPairs: () => void;
  onTravelPattern: () => void;
  onPackYourBags: () => void;
  onWatchTheTray: () => void;
  onPeopleFace: () => void;
  onVoice: () => void;
};

const games = [
  {
    title: 'Travel Rating',
    subtitle: 'Emotion recognition / social cognition',
    icon: require('../SVG_Icons/Games/Eye_Svg.svg'),
    size: 104,
  },
  {
    title: 'Match Pairs',
    subtitle: 'Helps with the memory',
    icon: require('../SVG_Icons/Games/Frame_Icon_Svg.svg'),
    size: 82,
  },
  {
    title: 'Pack Your Bags',
    subtitle: 'Pattern Recognition',
    icon: require('../SVG_Icons/Games/Backpack.svg'),
    size: 88,
  },
  {
    title: 'Watch The Tray',
    subtitle: 'Memory',
    icon: require('../SVG_Icons/Games/Basket_icon_Svg (1).svg'),
    size: 82,
  },
  {
    title: 'People Face',
    subtitle: 'Recognition',
    icon: require('../SVG_Icons/Games/Landscape_Icon_Svg.svg'),
    size: 84,
  },
];

export function GamesScreen({ onHome, onMatchPairs, onMonitor, onPackYourBags, onTravelPattern, onVoice, onWatchTheTray, onPeopleFace }: GamesScreenProps) {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.heading}>Games Curated{`\n`}Just For You</Text>
        <View style={styles.gameList}>
          {games.map((game) => (
            <Pressable
              accessibilityLabel={`Play ${game.title}`}
              accessibilityRole="button"
              key={game.title}
              onPress={game.title === 'Travel Rating' ? onTravelPattern : game.title === 'Match Pairs' ? onMatchPairs : game.title === 'Pack Your Bags' ? onPackYourBags : game.title === 'Watch The Tray' ? onWatchTheTray : game.title === 'People Face' ? onPeopleFace : () => Alert.alert(game.title, 'This game will begin shortly.')}
              style={({ pressed }) => [styles.gameCard, pressed && styles.pressed]}
            >
              <View style={styles.iconArea}>
                <Icon size={game.size} source={game.icon} />
              </View>
              <View style={styles.gameCopy}>
                <Text style={styles.gameTitle}>{game.title}</Text>
                <Text style={styles.gameSubtitle}>{game.subtitle}</Text>
              </View>
            </Pressable>
          ))}
        </View>
      </ScrollView>

      <View style={styles.navigationBar}>
        <NavItem icon={require('../SVG_Icons/Home/Home.svg')} label="Home" onPress={onHome} />
        <NavItem icon={require('../SVG_Icons/Home/Controller.svg')} label="Games" />
        <NavItem icon={require('../SVG_Icons/Home/Voice.svg')} label="Voice Chat" onPress={onVoice} />
        <NavItem icon={require('../SVG_Icons/Home/Health_For_Monitor.svg')} label="Monitor" onPress={onMonitor} />
      </View>
    </View>
  );
}

function NavItem({ icon, label, onPress }: { icon: SvgComponent; label: string; onPress?: () => void }) {
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
  content: {
    paddingBottom: 120,
    paddingHorizontal: 21,
    paddingTop: 34,
  },
  heading: {
    color: '#000000',
    fontFamily: 'Lora-Medium',
    fontSize: 46,
    letterSpacing: -1.8,
    lineHeight: 59,
  },
  gameList: {
    gap: 20,
    marginTop: 22,
  },
  gameCard: {
    alignItems: 'center',
    borderColor: 'rgba(0, 0, 0, 0.25)',
    borderRadius: 25,
    borderWidth: 2,
    flexDirection: 'row',
    height: 100,
    overflow: 'hidden',
  },
  iconArea: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 190,
  },
  gameCopy: {
    flex: 1,
    paddingRight: 12,
  },
  gameTitle: {
    color: '#000000',
    fontFamily: 'Lora-Medium',
    fontSize: 20,
    textAlign: 'center',
  },
  gameSubtitle: {
    color: '#000000',
    fontFamily: 'Lora-Medium',
    fontSize: 11,
    marginTop: 3,
    textAlign: 'center',
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
