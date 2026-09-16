import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SvgProps } from 'react-native-svg';
import { useLanguage } from '../LanguageContext';

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

export function GamesScreen({ onHome, onMatchPairs, onMonitor, onPackYourBags, onTravelPattern, onVoice, onWatchTheTray, onPeopleFace }: GamesScreenProps) {
  const { t: tr, fontMedium, fontBold, headingStyle } = useLanguage();

  const games = [
    {
      title: tr('gameTravelRating'),
      subtitle: tr('gameTravelSubtitle'),
      icon: require('../SVG_Icons/Games/Eye_Svg.svg'),
      size: 104,
      difficulty: 'Easy' as const,
      difficultyColor: '#4A9E6B',
      onPress: onTravelPattern,
    },
    {
      title: tr('gameMatchPairs'),
      subtitle: tr('gameMatchSubtitle'),
      icon: require('../SVG_Icons/Games/Frame_Icon_Svg.svg'),
      size: 82,
      difficulty: 'Medium' as const,
      difficultyColor: '#C47A2B',
      onPress: onMatchPairs,
    },
    {
      title: tr('gamePackBags'),
      subtitle: tr('gamePackSubtitle'),
      icon: require('../SVG_Icons/Games/Backpack.svg'),
      size: 88,
      difficulty: 'Medium' as const,
      difficultyColor: '#C47A2B',
      onPress: onPackYourBags,
    },
    {
      title: tr('gameWatchTray'),
      subtitle: tr('gameWatchSubtitle'),
      icon: require('../SVG_Icons/Games/Basket_icon_Svg (1).svg'),
      size: 82,
      difficulty: 'Hard' as const,
      difficultyColor: '#B85858',
      onPress: onWatchTheTray,
    },
    {
      title: tr('gamePeopleFace'),
      subtitle: tr('gamePeopleSubtitle'),
      icon: require('../SVG_Icons/Games/Landscape_Icon_Svg.svg'),
      size: 84,
      difficulty: 'Hard' as const,
      difficultyColor: '#B85858',
      onPress: onPeopleFace,
    },
  ];

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={[styles.heading, { fontFamily: fontMedium, ...headingStyle(46, 59) }]}>{tr('gamesCurated')}</Text>
        <View style={styles.gameList}>
          {games.map((game) => (
            <Pressable
              accessibilityLabel={`Play ${game.title}`}
              accessibilityRole="button"
              key={game.title}
              onPress={game.onPress ?? (() => Alert.alert(game.title, 'This game will begin shortly.'))}
              style={({ pressed }) => [styles.gameCard, pressed && styles.pressed]}
            >
              <View style={styles.iconArea}>
                <Icon size={game.size} source={game.icon} />
              </View>
              <View style={styles.gameCopy}>
                <Text style={[styles.gameTitle, { fontFamily: fontMedium }]}>{game.title}</Text>
                <Text style={[styles.gameSubtitle, { fontFamily: fontMedium }]}>{game.subtitle}</Text>
                <View style={[styles.difficultyBadge, { backgroundColor: game.difficultyColor + '22', borderColor: game.difficultyColor }]}>
                  <Text style={[styles.difficultyText, { color: game.difficultyColor, fontFamily: fontBold }]}>
                    {game.difficulty === 'Easy' ? '★☆☆' : game.difficulty === 'Medium' ? '★★☆' : '★★★'} {game.difficulty}
                  </Text>
                </View>
              </View>
            </Pressable>
          ))}
        </View>
      </ScrollView>

      <View style={styles.navigationBar}>
        <NavItem icon={require('../SVG_Icons/Home/Home.svg')} label={tr('navHome')} onPress={onHome} fontMedium={fontMedium} />
        <NavItem icon={require('../SVG_Icons/Home/Controller.svg')} label={tr('navGames')} fontMedium={fontMedium} />
        <NavItem icon={require('../SVG_Icons/Home/Voice.svg')} label={tr('navVoice')} onPress={onVoice} fontMedium={fontMedium} />
        <NavItem icon={require('../SVG_Icons/Home/Health_For_Monitor.svg')} label={tr('navMonitor')} onPress={onMonitor} fontMedium={fontMedium} />
      </View>
    </View>
  );
}

function NavItem({ icon, label, onPress, fontMedium }: { icon: SvgComponent; label: string; onPress?: () => void; fontMedium: string }) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={({ pressed }) => [styles.navItem, pressed && styles.pressed]}>
      <Icon size={34} source={icon} />
      <Text style={[styles.navLabel, { fontFamily: fontMedium }]}>{label}</Text>
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
    fontSize: 46,
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
    height: 120,
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
    fontSize: 20,
    textAlign: 'center',
  },
  gameSubtitle: {
    color: '#000000',
    fontSize: 11,
    marginTop: 3,
    textAlign: 'center',
  },
  difficultyBadge: {
    alignSelf: 'center',
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 6,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  difficultyText: {
    fontSize: 11,
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.22,
    shadowRadius: 14,
    elevation: 12,
  },
  navItem: {
    alignItems: 'center',
    minWidth: 55,
  },
  navLabel: {
    color: '#FFFFFF',
    fontSize: 11,
    marginTop: 2,
  },
  pressed: {
    opacity: 0.72,
  },
});
