import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

// ─── Asset map ───────────────────────────────────────────────────────────────

const ITEMS = [
  { key: 'bottle',     label: 'Bottle',      image: require('../app_image/Games/Watch_Tray/Bottle.png') },
  { key: 'carpet',     label: 'Carpet',      image: require('../app_image/Games/Watch_Tray/Carpet.png') },
  { key: 'cup',        label: 'Cup',         image: require('../app_image/Games/Watch_Tray/Cup.png') },
  { key: 'jute_bag',   label: 'Jute Bag',    image: require('../app_image/Games/Watch_Tray/Jute_bag.png') },
  { key: 'rice',       label: 'Rice',        image: require('../app_image/Games/Watch_Tray/Rice.png') },
  { key: 'shawl',      label: 'Shawl',       image: require('../app_image/Games/Watch_Tray/Shawl (1).png') },
  { key: 'spinach',    label: 'Spinach',     image: require('../app_image/Games/Watch_Tray/Spinach.png') },
  { key: 'steel_tiffin', label: 'Tiffin',   image: require('../app_image/Games/Watch_Tray/Steel_Tiffin.png') },
  { key: 'umbrella',   label: 'Umbrella',    image: require('../app_image/Games/Watch_Tray/Umbrella.png') },
] as const;

type ItemKey = typeof ITEMS[number]['key'];

// ─── Difficulty config ────────────────────────────────────────────────────────

const LEVELS = [
  { label: 'Easy',   trayCount: 3, showSeconds: 5 },
  { label: 'Medium', trayCount: 5, showSeconds: 5 },
  { label: 'Hard',   trayCount: 7, showSeconds: 4 },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildRound(trayCount: number): { trayKeys: ItemKey[]; choiceKeys: ItemKey[] } {
  const shuffled = shuffle([...ITEMS]);
  const trayItems = shuffled.slice(0, trayCount);
  const trayKeys = trayItems.map((i) => i.key);
  // Choices = tray items + same number of distractors, all shuffled
  const distractors = shuffled.slice(trayCount, trayCount * 2).map((i) => i.key);
  const choiceKeys = shuffle([...trayKeys, ...distractors]) as ItemKey[];
  return { trayKeys, choiceKeys };
}

// ─── Countdown flash ─────────────────────────────────────────────────────────

function CountdownBadge({ seconds }: { seconds: number }) {
  const scale = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    Animated.sequence([
      Animated.timing(scale, { toValue: 1.4, duration: 120, useNativeDriver: true, easing: Easing.out(Easing.quad) }),
      Animated.timing(scale, { toValue: 1, duration: 220, useNativeDriver: true, easing: Easing.in(Easing.quad) }),
    ]).start();
  }, [seconds]);
  return (
    <Animated.View style={[styles.countdownBadge, { transform: [{ scale }] }]}>
      <Text style={styles.countdownText}>{seconds}</Text>
    </Animated.View>
  );
}

// ─── Phase types ─────────────────────────────────────────────────────────────

type Phase = 'level-select' | 'memorise' | 'recall' | 'result';

// ─── Main component ───────────────────────────────────────────────────────────

export function WatchTheTrayGame({ onExit }: { onExit: () => void }) {
  const [phase, setPhase] = useState<Phase>('level-select');
  const [levelIndex, setLevelIndex] = useState(0);
  const [trayKeys, setTrayKeys] = useState<ItemKey[]>([]);
  const [choiceKeys, setChoiceKeys] = useState<ItemKey[]>([]);
  const [countdown, setCountdown] = useState(0);
  const [selected, setSelected] = useState<ItemKey[]>([]);
  const [score, setScore] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Cleans up any running timer
  const clearTimer = () => {
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
  };

  const startRound = (idx: number) => {
    const level = LEVELS[idx];
    const round = buildRound(level.trayCount);
    setLevelIndex(idx);
    setTrayKeys(round.trayKeys);
    setChoiceKeys(round.choiceKeys);
    setSelected([]);
    setCountdown(level.showSeconds);
    setPhase('memorise');

    let remaining = level.showSeconds;
    clearTimer();
    timerRef.current = setInterval(() => {
      remaining -= 1;
      setCountdown(remaining);
      if (remaining <= 0) {
        clearTimer();
        setPhase('recall');
      }
    }, 1000);
  };

  const toggleSelection = (key: ItemKey) => {
    setSelected((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key],
    );
  };

  const submitAnswer = () => {
    const correct = trayKeys.filter((k) => selected.includes(k)).length;
    const wrong = selected.filter((k) => !trayKeys.includes(k)).length;
    setScore(Math.max(0, correct - wrong));
    setPhase('result');
  };

  // Cleanup on unmount
  useEffect(() => () => clearTimer(), []);

  // ── Level select ──
  if (phase === 'level-select') {
    return (
      <View style={styles.container}>
        <Pressable accessibilityRole="button" onPress={onExit} style={styles.backButton}>
          <Text style={styles.backText}>‹ Games</Text>
        </Pressable>
        <Text style={styles.heading}>Watch The Tray</Text>
        <Text style={styles.subtitle}>
          Study the objects on the tray, then pick them out after they disappear.
        </Text>
        <Text style={styles.chooseDifficulty}>Choose Difficulty</Text>
        <View style={styles.levelList}>
          {LEVELS.map((level, idx) => (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`Start ${level.label} difficulty`}
              key={level.label}
              onPress={() => startRound(idx)}
              style={({ pressed }) => [styles.levelCard, pressed && styles.pressed]}
            >
              <Text style={styles.levelLabel}>{level.label}</Text>
              <Text style={styles.levelMeta}>
                {level.trayCount} objects · {level.showSeconds}s to memorise
              </Text>
            </Pressable>
          ))}
        </View>
      </View>
    );
  }

  // ── Memorise phase ──
  if (phase === 'memorise') {
    return (
      <View style={styles.container}>
        <Text style={styles.heading}>Remember These!</Text>
        <Text style={styles.subtitle}>Study the tray carefully…</Text>
        <CountdownBadge seconds={countdown} />
        <View style={styles.trayGrid}>
          {trayKeys.map((key) => {
            const item = ITEMS.find((i) => i.key === key)!;
            return (
              <View key={key} style={styles.trayCard}>
                <Image resizeMode="contain" source={item.image} style={styles.trayImage} />
                <Text style={styles.trayLabel}>{item.label}</Text>
              </View>
            );
          })}
        </View>
      </View>
    );
  }

  // ── Recall phase ──
  if (phase === 'recall') {
    const level = LEVELS[levelIndex];
    const ready = selected.length === level.trayCount;
    return (
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.recallContent} showsVerticalScrollIndicator={false}>
          <Text style={styles.heading}>What Was On The Tray?</Text>
          <Text style={styles.subtitle}>
            Tap the {level.trayCount} objects you saw · {selected.length}/{level.trayCount} chosen
          </Text>
          <View style={styles.choiceGrid}>
            {choiceKeys.map((key) => {
              const item = ITEMS.find((i) => i.key === key)!;
              const isSelected = selected.includes(key);
              return (
                <Pressable
                  accessibilityLabel={`${item.label}${isSelected ? ', selected' : ''}`}
                  accessibilityRole="button"
                  key={key}
                  onPress={() => toggleSelection(key)}
                  style={({ pressed }) => [
                    styles.choiceCard,
                    isSelected && styles.choiceSelected,
                    pressed && styles.pressed,
                  ]}
                >
                  <Image resizeMode="contain" source={item.image} style={styles.choiceImage} />
                  <Text style={[styles.choiceLabel, isSelected && styles.choiceLabelSelected]}>
                    {item.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
          <Pressable
            accessibilityRole="button"
            disabled={!ready}
            onPress={submitAnswer}
            style={[styles.submitButton, !ready && styles.submitDisabled]}
          >
            <Text style={styles.submitText}>Submit</Text>
          </Pressable>
        </ScrollView>
      </View>
    );
  }

  // ── Result phase ──
  const total = trayKeys.length;
  const correct = trayKeys.filter((k) => selected.includes(k)).length;
  const missed = trayKeys.filter((k) => !selected.includes(k));
  const wrong = selected.filter((k) => !trayKeys.includes(k));
  const perfect = correct === total && wrong.length === 0;

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.resultContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.resultEmoji}>{perfect ? '🎉' : score >= Math.ceil(total / 2) ? '👍' : '💪'}</Text>
        <Text style={styles.resultTitle}>
          {perfect ? 'Perfect Memory!' : score >= Math.ceil(total / 2) ? 'Well Done!' : 'Keep Practising!'}
        </Text>
        <Text style={styles.resultScore}>
          {correct} of {total} correct
        </Text>

        {missed.length > 0 && (
          <>
            <Text style={styles.resultSectionLabel}>You missed:</Text>
            <View style={styles.resultRow}>
              {missed.map((key) => {
                const item = ITEMS.find((i) => i.key === key)!;
                return (
                  <View key={key} style={[styles.resultThumb, styles.resultMissed]}>
                    <Image resizeMode="contain" source={item.image} style={styles.resultThumbImage} />
                    <Text style={styles.resultThumbLabel}>{item.label}</Text>
                  </View>
                );
              })}
            </View>
          </>
        )}

        {wrong.length > 0 && (
          <>
            <Text style={styles.resultSectionLabel}>Not on the tray:</Text>
            <View style={styles.resultRow}>
              {wrong.map((key) => {
                const item = ITEMS.find((i) => i.key === key)!;
                return (
                  <View key={key} style={[styles.resultThumb, styles.resultWrong]}>
                    <Image resizeMode="contain" source={item.image} style={styles.resultThumbImage} />
                    <Text style={styles.resultThumbLabel}>{item.label}</Text>
                  </View>
                );
              })}
            </View>
          </>
        )}

        <Pressable
          accessibilityRole="button"
          onPress={() => startRound(levelIndex)}
          style={styles.primaryButton}
        >
          <Text style={styles.primaryText}>Play Again</Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          onPress={() => setPhase('level-select')}
          style={styles.outlineButton}
        >
          <Text style={styles.outlineText}>Change Difficulty</Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          onPress={onExit}
          style={styles.outlineButton}
        >
          <Text style={styles.outlineText}>Back To Games</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#F9F6F0',
    left: -27,
    right: -27,
    paddingHorizontal: 22,
  },
  backButton: { alignSelf: 'flex-start', marginTop: 25, paddingVertical: 10 },
  backText: { color: '#2E7359', fontFamily: 'Lora-Medium', fontSize: 18 },

  heading: {
    color: '#000',
    fontFamily: 'Lora-Medium',
    fontSize: 36,
    letterSpacing: -1.2,
    lineHeight: 45,
    textAlign: 'center',
    marginTop: 20,
  },
  subtitle: {
    color: '#786F6F',
    fontFamily: 'Lora-Medium',
    fontSize: 15,
    marginTop: 6,
    textAlign: 'center',
    lineHeight: 21,
  },

  // Level select
  chooseDifficulty: {
    color: '#000',
    fontFamily: 'Lora-Medium',
    fontSize: 20,
    marginTop: 36,
    marginBottom: 12,
  },
  levelList: { gap: 14 },
  levelCard: {
    borderColor: 'rgba(0, 0, 0, 0.25)',
    borderRadius: 20,
    borderWidth: 2,
    paddingHorizontal: 22,
    paddingVertical: 18,
  },
  levelLabel: { color: '#000', fontFamily: 'Lora-Medium', fontSize: 24 },
  levelMeta: { color: '#786F6F', fontFamily: 'Lora-Medium', fontSize: 14, marginTop: 2 },

  // Memorise phase
  countdownBadge: {
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2E7359',
    borderRadius: 40,
    height: 64,
    width: 64,
    marginTop: 16,
    marginBottom: 20,
  },
  countdownText: { color: '#FFF', fontFamily: 'Lora-Bold', fontSize: 32 },
  trayGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'center',
    marginTop: 4,
  },
  trayCard: {
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderColor: 'rgba(0, 0, 0, 0.18)',
    borderRadius: 16,
    borderWidth: 1.5,
    paddingVertical: 10,
    width: '30%',
  },
  trayImage: { height: 80, width: '90%' },
  trayLabel: { color: '#000', fontFamily: 'Lora-Medium', fontSize: 12, marginTop: 6, textAlign: 'center' },

  // Recall phase
  recallContent: { paddingBottom: 40, paddingTop: 20 },
  choiceGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'space-between',
    marginTop: 18,
  },
  choiceCard: {
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderColor: 'rgba(0, 0, 0, 0.18)',
    borderRadius: 16,
    borderWidth: 1.5,
    paddingVertical: 10,
    width: '30%',
  },
  choiceSelected: {
    backgroundColor: '#E4F0EA',
    borderColor: '#2E7359',
    borderWidth: 2.5,
  },
  choiceImage: { height: 72, width: '90%' },
  choiceLabel: { color: '#000', fontFamily: 'Lora-Medium', fontSize: 11, marginTop: 5, textAlign: 'center' },
  choiceLabelSelected: { color: '#2E7359' },

  submitButton: {
    alignItems: 'center',
    backgroundColor: '#2E7359',
    borderRadius: 12,
    height: 54,
    justifyContent: 'center',
    marginTop: 22,
  },
  submitDisabled: { backgroundColor: '#A8C9BC' },
  submitText: { color: '#FFF', fontFamily: 'Lora-Bold', fontSize: 20 },

  // Result phase
  resultContent: { alignItems: 'center', paddingBottom: 50, paddingTop: 30 },
  resultEmoji: { fontSize: 62, marginBottom: 8 },
  resultTitle: { color: '#000', fontFamily: 'Lora-Medium', fontSize: 32, textAlign: 'center' },
  resultScore: { color: '#2E7359', fontFamily: 'Lora-Bold', fontSize: 22, marginTop: 8 },
  resultSectionLabel: {
    alignSelf: 'flex-start',
    color: '#786F6F',
    fontFamily: 'Lora-Medium',
    fontSize: 15,
    marginTop: 20,
    marginBottom: 8,
  },
  resultRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, justifyContent: 'flex-start', width: '100%' },
  resultThumb: {
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 1.5,
    paddingVertical: 8,
    width: '30%',
  },
  resultMissed: { backgroundColor: '#FFF3E0', borderColor: '#E0A050' },
  resultWrong: { backgroundColor: '#FDECEA', borderColor: '#E07070' },
  resultThumbImage: { height: 60, width: '85%' },
  resultThumbLabel: { color: '#000', fontFamily: 'Lora-Medium', fontSize: 11, marginTop: 4, textAlign: 'center' },

  primaryButton: {
    alignItems: 'center',
    backgroundColor: '#2E7359',
    borderRadius: 12,
    height: 52,
    justifyContent: 'center',
    marginTop: 24,
    width: '100%',
  },
  primaryText: { color: '#FFF', fontFamily: 'Lora-Bold', fontSize: 18 },
  outlineButton: {
    alignItems: 'center',
    borderColor: '#2E7359',
    borderRadius: 12,
    borderWidth: 1,
    height: 52,
    justifyContent: 'center',
    marginTop: 12,
    width: '100%',
  },
  outlineText: { color: '#2E7359', fontFamily: 'Lora-Bold', fontSize: 18 },
  pressed: { opacity: 0.72 },
});
