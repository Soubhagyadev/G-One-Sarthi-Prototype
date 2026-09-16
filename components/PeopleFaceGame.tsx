import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useLanguage } from '../LanguageContext';

// ─── People data ──────────────────────────────────────────────────────────────

const PEOPLE = [
  { key: 'amma',     name: "Amma",            image: require('../app_image/Games/People_Face/Amma.png') },
  { key: 'son',      name: "Amma's Son",       image: require('../app_image/Games/People_Face/Amma\'s Son.png') },
  { key: 'daughter', name: "Amma's Daughter",  image: require('../app_image/Games/People_Face/Amma\'s Daughter.png') },
  { key: 'doctor',   name: "Amma's Doctor",    image: require('../app_image/Games/People_Face/Amma\'s Doctor.png') },
] as const;

type PersonKey = typeof PEOPLE[number]['key'];

const ALL_NAMES = PEOPLE.map((p) => p.name);

const STUDY_SECONDS = 8;

// ─── Countdown badge ──────────────────────────────────────────────────────────

function CountdownBadge({ seconds, fontBold }: { seconds: number; fontBold: string }) {
  const scale = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    Animated.sequence([
      Animated.timing(scale, { toValue: 1.45, duration: 110, useNativeDriver: true, easing: Easing.out(Easing.quad) }),
      Animated.timing(scale, { toValue: 1, duration: 220, useNativeDriver: true, easing: Easing.in(Easing.quad) }),
    ]).start();
  }, [seconds]);
  return (
    <Animated.View style={[styles.countdownBadge, { transform: [{ scale }] }]}>
      <Text style={[styles.countdownText, { fontFamily: fontBold }]}>{seconds}</Text>
    </Animated.View>
  );
}

// ─── Phase types ──────────────────────────────────────────────────────────────

type Phase = 'study' | 'quiz' | 'result';

// ─── Main component ───────────────────────────────────────────────────────────

export function PeopleFaceGame({ onExit, onComplete }: { onExit: () => void; onComplete?: () => void }) {
  const { t: tr, fontMedium, fontBold } = useLanguage();
  const [phase, setPhase] = useState<Phase>('study');
  const [countdown, setCountdown] = useState(STUDY_SECONDS);
  const [quizOrder] = useState<PersonKey[]>(() => shuffle(PEOPLE.map((p) => p.key)));
  const [quizIndex, setQuizIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<PersonKey, string | null>>({
    amma: null, son: null, daughter: null, doctor: null,
  });
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearTimer = () => {
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
  };

  useEffect(() => {
    if (phase !== 'study') return;
    let remaining = STUDY_SECONDS;
    clearTimer();
    timerRef.current = setInterval(() => {
      remaining -= 1;
      setCountdown(remaining);
      if (remaining <= 0) {
        clearTimer();
        setPhase('quiz');
      }
    }, 1000);
    return clearTimer;
  }, [phase]);

  useEffect(() => () => clearTimer(), []);

  const resetGame = () => {
    setPhase('study');
    setCountdown(STUDY_SECONDS);
    setQuizIndex(0);
    setSelected(null);
    setAnswers({ amma: null, son: null, daughter: null, doctor: null });
  };

  // ── Study phase ──
  if (phase === 'study') {
    return (
      <View style={styles.container}>
        <Pressable accessibilityRole="button" onPress={onExit} style={styles.backButton}>
          <Text style={[styles.backText, { fontFamily: fontMedium }]}>‹ {tr('backToGames')}</Text>
        </Pressable>
        <Text style={[styles.heading, { fontFamily: fontMedium }]}>{tr('studyFaces')}</Text>
        <View style={styles.studyRow}>
          <Text style={[styles.subtitle, { fontFamily: fontMedium }]}>Study them carefully…</Text>
          <CountdownBadge seconds={countdown} fontBold={fontBold} />
        </View>
        <View style={styles.faceGrid}>
          {PEOPLE.map((person) => (
            <View key={person.key} style={styles.faceCard}>
              <Image
                accessibilityLabel={person.name}
                resizeMode="cover"
                source={person.image}
                style={styles.faceImage}
              />
              <View style={styles.nameBadge}>
                <Text style={[styles.nameText, { fontFamily: fontMedium }]}>{person.name}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    );
  }

  // ── Quiz phase ──
  if (phase === 'quiz') {
    const currentKey = quizOrder[quizIndex];
    const currentPerson = PEOPLE.find((p) => p.key === currentKey)!;
    const progress = `${quizIndex + 1} of ${PEOPLE.length}`;
    const correct = selected === currentPerson.name;

    const choose = (name: string) => {
      if (selected) return;
      setSelected(name);
      setAnswers((prev) => ({ ...prev, [currentKey]: name }));
    };

    const next = () => {
      setSelected(null);
      if (quizIndex + 1 >= PEOPLE.length) {
        onComplete?.();
        setPhase('result');
      } else {
        setQuizIndex((i) => i + 1);
      }
    };

    return (
      <View style={styles.container}>
        <Text style={[styles.heading, { fontFamily: fontMedium }]}>{tr('whoIsThis')}</Text>
        <Text style={[styles.progress, { fontFamily: fontMedium }]}>{progress}</Text>

        <Image
          accessibilityLabel="Person to identify"
          resizeMode="cover"
          source={currentPerson.image}
          style={styles.quizImage}
        />

        <View style={styles.optionGrid}>
          {ALL_NAMES.map((name) => {
            const isAnswer = name === currentPerson.name;
            const isChosen = name === selected;
            return (
              <Pressable
                accessibilityLabel={name}
                accessibilityRole="button"
                disabled={Boolean(selected)}
                key={name}
                onPress={() => choose(name)}
                style={({ pressed }) => [
                  styles.option,
                  selected && isAnswer && styles.correctOption,
                  isChosen && !isAnswer && styles.incorrectOption,
                  pressed && !selected && styles.pressed,
                ]}
              >
                <Text style={[
                  styles.optionText,
                  selected && isAnswer && styles.correctOptionText,
                  isChosen && !isAnswer && styles.incorrectOptionText,
                  { fontFamily: fontMedium },
                ]}>{name}</Text>
              </Pressable>
            );
          })}
        </View>

        {selected && (
          <View style={styles.feedback}>
            <Text style={[styles.feedbackText, correct ? styles.correctText : styles.incorrectText, { fontFamily: fontMedium }]}>
              {correct ? tr('correct') : `${tr('incorrect')} — ${currentPerson.name}`}
            </Text>
            <Pressable accessibilityRole="button" onPress={next} style={styles.primaryButton}>
              <Text style={[styles.primaryText, { fontFamily: fontBold }]}>
                {quizIndex + 1 === PEOPLE.length ? tr('score') : tr('nextPerson')}
              </Text>
            </Pressable>
          </View>
        )}
      </View>
    );
  }

  // ── Result phase ──
  const correctCount = PEOPLE.filter((p) => answers[p.key] === p.name).length;
  const total = PEOPLE.length;
  const perfect = correctCount === total;

  return (
    <View style={styles.container}>
      <View style={styles.resultContent}>
        <Text style={styles.resultEmoji}>{perfect ? '🌟' : correctCount >= 3 ? '👍' : '💪'}</Text>
        <Text style={[styles.resultTitle, { fontFamily: fontMedium }]}>
          {perfect ? 'Perfect!' : correctCount >= 3 ? 'Well Done!' : 'Keep Practising!'}
        </Text>
        <Text style={[styles.resultScore, { fontFamily: fontBold }]}>{tr('peopleFaceResult', correctCount)}</Text>

        <View style={styles.resultGrid}>
          {PEOPLE.map((person) => {
            const wasCorrect = answers[person.key] === person.name;
            return (
              <View
                key={person.key}
                style={[styles.resultFaceCard, wasCorrect ? styles.resultCorrectCard : styles.resultWrongCard]}
              >
                <Image resizeMode="cover" source={person.image} style={styles.resultFaceImage} />
                <Text style={[styles.resultFaceName, { fontFamily: fontMedium }]}>{person.name}</Text>
                {!wasCorrect && answers[person.key] && (
                  <Text style={[styles.resultWrongAnswer, { fontFamily: fontMedium }]}>
                    {tr('youSaid')} {answers[person.key]}
                  </Text>
                )}
                <Text style={[wasCorrect ? styles.resultTick : styles.resultCross, { fontFamily: fontBold }]}>
                  {wasCorrect ? '✓' : '✗'}
                </Text>
              </View>
            );
          })}
        </View>

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

// ─── Helper ───────────────────────────────────────────────────────────────────

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
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
  backText: { color: '#2E7359', fontSize: 18 },

  heading: {
    color: '#000',
    fontSize: 38,
    marginTop: 10,
    textAlign: 'center',
  },
  progress: {
    color: '#786F6F',
    fontSize: 16,
    marginTop: 6,
    textAlign: 'center',
  },

  // Study phase
  studyRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 14,
    marginTop: 8,
  },
  subtitle: {
    color: '#786F6F',
    fontSize: 15,
  },
  countdownBadge: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2E7359',
    borderRadius: 30,
    height: 52,
    width: 52,
  },
  countdownText: { color: '#FFF', fontSize: 26 },

  faceGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'space-between',
    marginTop: 18,
  },
  faceCard: {
    borderColor: 'rgba(0, 0, 0, 0.18)',
    borderRadius: 18,
    borderWidth: 1.5,
    overflow: 'hidden',
    width: '47%',
  },
  faceImage: {
    height: 160,
    width: '100%',
  },
  nameBadge: {
    backgroundColor: '#2E7359',
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  nameText: {
    color: '#FFF',
    fontSize: 13,
    textAlign: 'center',
  },

  // Quiz phase
  quizImage: {
    alignSelf: 'center',
    borderColor: 'rgba(0,0,0,0.15)',
    borderRadius: 20,
    borderWidth: 1.5,
    height: 240,
    marginTop: 16,
    width: 220,
  },
  optionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'space-between',
    marginTop: 18,
  },
  option: {
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderColor: 'rgba(0, 0, 0, 0.25)',
    borderRadius: 16,
    borderWidth: 1.5,
    height: 58,
    justifyContent: 'center',
    width: '47%',
  },
  correctOption: { backgroundColor: '#DDEDDD', borderColor: '#2E7359' },
  incorrectOption: { backgroundColor: '#F8DEDE', borderColor: '#B85858' },
  optionText: { color: '#000', fontSize: 15, textAlign: 'center', paddingHorizontal: 6 },
  correctOptionText: { color: '#2E7359' },
  incorrectOptionText: { color: '#9B3E3E' },

  feedback: { alignItems: 'center', marginTop: 14 },
  feedbackText: {
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 10,
    textAlign: 'center',
  },
  correctText: { color: '#2E7359' },
  incorrectText: { color: '#9B3E3E' },

  primaryButton: {
    alignItems: 'center',
    backgroundColor: '#2E7359',
    borderRadius: 12,
    height: 52,
    justifyContent: 'center',
    width: '100%',
  },
  primaryText: { color: '#FFF', fontSize: 18 },
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
  outlineText: { color: '#2E7359', fontSize: 18 },

  // Result phase
  resultContent: { alignItems: 'center', paddingTop: 30, paddingBottom: 50 },
  resultEmoji: { fontSize: 58, marginBottom: 6 },
  resultTitle: { color: '#000', fontSize: 34, textAlign: 'center' },
  resultScore: { color: '#2E7359', fontSize: 20, marginTop: 6, marginBottom: 20, textAlign: 'center', lineHeight: 28 },

  resultGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'space-between',
    marginBottom: 22,
    width: '100%',
  },
  resultFaceCard: {
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 2,
    overflow: 'hidden',
    paddingBottom: 8,
    width: '47%',
  },
  resultCorrectCard: { borderColor: '#2E7359', backgroundColor: '#F0F8F0' },
  resultWrongCard: { borderColor: '#B85858', backgroundColor: '#FDF4F4' },
  resultFaceImage: { height: 120, width: '100%' },
  resultFaceName: {
    color: '#000',
    fontSize: 13,
    marginTop: 6,
    textAlign: 'center',
    paddingHorizontal: 4,
  },
  resultWrongAnswer: {
    color: '#9B3E3E',
    fontSize: 11,
    marginTop: 2,
    textAlign: 'center',
    paddingHorizontal: 4,
  },
  resultTick: { color: '#2E7359', fontSize: 20, marginTop: 4 },
  resultCross: { color: '#B85858', fontSize: 20, marginTop: 4 },

  pressed: { opacity: 0.72 },
});
