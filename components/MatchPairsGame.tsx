import { useRef, useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useLanguage } from '../LanguageContext';

type Card = { id: string; image: number; pair: string };

const images = {
  bamboo: require('../app_image/Games/Match_Pairs/Bamboo.png'),
  basket: require('../app_image/Games/Match_Pairs/Basket.png'),
  bird: require('../app_image/Games/Match_Pairs/Bird.png'),
  boat: require('../app_image/Games/Match_Pairs/Boat.png'),
  flower: require('../app_image/Games/Match_Pairs/Flower.png'),
  house: require('../app_image/Games/Match_Pairs/House.png'),
  landscape: require('../app_image/Games/Match_Pairs/Landscape.png'),
  shawl: require('../app_image/Games/Match_Pairs/Shawl.png'),
};

const order = ['boat', 'flower', 'bamboo', 'house', 'bird', 'basket', 'landscape', 'shawl', 'basket', 'landscape', 'house', 'bamboo', 'shawl', 'bird', 'boat', 'flower'] as const;
const cards: Card[] = order.map((pair, index) => ({ id: `${pair}-${index}`, image: images[pair], pair }));

export function MatchPairsGame({ onExit, onComplete }: { onExit: () => void; onComplete?: () => void }) {
  const { t: tr, fontMedium, fontBold } = useLanguage();
  const [selected, setSelected] = useState<string[]>([]);
  const [matched, setMatched] = useState<string[]>([]);
  const [moves, setMoves] = useState(0);
  const [locked, setLocked] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isComplete = matched.length === cards.length;

  const resetGame = () => {
    if (timer.current) clearTimeout(timer.current);
    setSelected([]); setMatched([]); setMoves(0); setLocked(false);
  };

  const flip = (card: Card) => {
    if (locked || selected.includes(card.id) || matched.includes(card.id)) return;
    const next = [...selected, card.id];
    setSelected(next);
    if (next.length !== 2) return;
    setMoves((value) => value + 1);
    const first = cards.find((item) => item.id === next[0]);
    if (first?.pair === card.pair) {
      const newMatched = [...matched, ...next];
      setMatched(newMatched);
      setSelected([]);
      if (newMatched.length === cards.length) onComplete?.();
      return;
    }
    setLocked(true);
    timer.current = setTimeout(() => { setSelected([]); setLocked(false); }, 850);
  };

  if (isComplete) {
    return (
      <View style={styles.container}>
        <View style={styles.completeCard}>
          <Text style={[styles.completeTitle, { fontFamily: fontMedium }]}>{tr('matchPairsResult', moves)}</Text>
          <Pressable accessibilityRole="button" onPress={resetGame} style={styles.primaryButton}>
            <Text style={[styles.primaryText, { fontFamily: fontBold }]}>{tr('playAgain')}</Text>
          </Pressable>
          <Pressable accessibilityRole="button" onPress={onExit} style={styles.outlineButton}>
            <Text style={[styles.outlineText, { fontFamily: fontBold }]}>{tr('backToGames')}</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Pressable accessibilityRole="button" onPress={onExit} style={styles.backButton}>
        <Text style={[styles.backText, { fontFamily: fontMedium }]}>‹ {tr('backToGames')}</Text>
      </Pressable>
      <Text style={[styles.heading, { fontFamily: fontMedium }]}>{tr('matchPairsTitle')}</Text>
      <Text style={[styles.moves, { fontFamily: fontMedium }]}>{tr('moves', moves)}</Text>
      <View style={styles.grid}>
        {cards.map((card) => {
          const revealed = selected.includes(card.id) || matched.includes(card.id);
          return (
            <Pressable
              accessibilityLabel={revealed ? 'Picture card' : 'Turn over card'}
              accessibilityRole="button"
              key={card.id}
              onPress={() => flip(card)}
              style={({ pressed }) => [styles.card, revealed && styles.revealedCard, pressed && !revealed && styles.pressed]}
            >
              {revealed
                ? <Image resizeMode="contain" source={card.image} style={styles.cardImage} />
                : <Text style={[styles.cardBack, { fontFamily: fontBold }]}>?</Text>
              }
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { ...StyleSheet.absoluteFillObject, backgroundColor: '#F9F6F0', left: -27, paddingHorizontal: 22, right: -27 },
  backButton: { alignSelf: 'flex-start', marginTop: 25, paddingVertical: 10 },
  backText: { color: '#2E7359', fontSize: 18 },
  heading: { color: '#000', fontSize: 36, textAlign: 'center' },
  moves: { color: '#000', fontSize: 16, marginTop: 12, textAlign: 'center' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 9, justifyContent: 'space-between', marginTop: 16 },
  card: { alignItems: 'center', backgroundColor: '#2E7359', borderColor: '#1F513F', borderRadius: 12, borderWidth: 1, height: 92, justifyContent: 'center', overflow: 'hidden', width: '23%' },
  revealedCard: { backgroundColor: '#FFF', borderColor: 'rgba(0, 0, 0, 0.22)' },
  cardBack: { color: '#FFF', fontSize: 36 },
  cardImage: { height: '100%', width: '100%' },
  completeCard: { alignItems: 'center', borderColor: 'rgba(0, 0, 0, 0.2)', borderRadius: 24, borderWidth: 1.5, marginTop: 250, padding: 26 },
  completeTitle: { color: '#000', fontSize: 20, lineHeight: 30, marginVertical: 18, textAlign: 'center' },
  primaryButton: { alignItems: 'center', backgroundColor: '#2E7359', borderRadius: 12, height: 52, justifyContent: 'center', width: '100%' },
  primaryText: { color: '#FFF', fontSize: 18 },
  outlineButton: { alignItems: 'center', borderColor: '#2E7359', borderRadius: 12, borderWidth: 1, height: 52, justifyContent: 'center', marginTop: 12, width: '100%' },
  outlineText: { color: '#2E7359', fontSize: 18 },
  pressed: { opacity: 0.72 },
});
