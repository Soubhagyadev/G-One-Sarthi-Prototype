import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useLanguage } from '../LanguageContext';

type Scenario = { answer: string; options: string[]; prompt: string };
const scenarios: Scenario[] = [
  { prompt: 'Maya is going to a rainy village. What should she pack?', answer: 'Umbrella', options: ['Umbrella', 'Sunglasses', 'Swimsuit', 'Balloon'] },
  { prompt: 'Maya is going to the beach. What should she pack?', answer: 'Sunscreen', options: ['Winter coat', 'Sunscreen', 'Rain boots', 'Scarf'] },
  { prompt: 'Maya is visiting a cold hill station. What should she pack?', answer: 'Warm jacket', options: ['Warm jacket', 'Beach towel', 'Fan', 'Sandals'] },
  { prompt: "Maya is staying at her grandmother's home overnight. What should she pack?", answer: 'Toothbrush', options: ['Toothbrush', 'Kite', 'Flower pot', 'Toy car'] },
  { prompt: 'Maya is going on a sunny picnic. What should she pack?', answer: 'Water bottle', options: ['Water bottle', 'Pillow', 'Blanket', 'Umbrella stand'] },
  { prompt: 'Maya is going for a forest walk. What should she pack?', answer: 'Walking shoes', options: ['High heels', 'Walking shoes', 'Slippers', 'Roller skates'] },
];

export function PackYourBagsGame({ onExit, onComplete }: { onExit: () => void; onComplete?: () => void }) {
  const { t: tr, fontMedium, fontBold } = useLanguage();
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState(0);

  const complete = index === scenarios.length;
  const scenario = scenarios[index];
  const options = useMemo(() => {
    if (!scenario) return [];
    const shuffled = [...scenario.options];
    for (let optionIndex = shuffled.length - 1; optionIndex > 0; optionIndex -= 1) {
      const randomIndex = Math.floor(Math.random() * (optionIndex + 1));
      [shuffled[optionIndex], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[optionIndex]];
    }
    return shuffled;
  }, [index]);

  if (complete) {
    return (
      <View style={styles.container}>
        <View style={styles.completeCard}>
          <Text style={[styles.completeTitle, { fontFamily: fontMedium }]}>{tr('packBagsResult', score)}</Text>
          <Pressable
            accessibilityRole="button"
            onPress={() => { setIndex(0); setScore(0); setSelected(null); }}
            style={styles.primaryButton}
          >
            <Text style={[styles.primaryText, { fontFamily: fontBold }]}>{tr('playAgain')}</Text>
          </Pressable>
          <Pressable accessibilityRole="button" onPress={onExit} style={styles.outlineButton}>
            <Text style={[styles.outlineText, { fontFamily: fontBold }]}>{tr('backToGames')}</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  const correct = selected === scenario.answer;
  const choose = (option: string) => {
    if (selected) return;
    setSelected(option);
    if (option === scenario.answer) setScore((value) => value + 1);
  };

  return (
    <View style={styles.container}>
      <Pressable accessibilityRole="button" onPress={onExit} style={styles.backButton}>
        <Text style={[styles.backText, { fontFamily: fontMedium }]}>‹ {tr('backToGames')}</Text>
      </Pressable>
      <Text style={[styles.title, { fontFamily: fontMedium }]}>{tr('packBagsTitle')}</Text>
      <Text style={[styles.progress, { fontFamily: fontMedium }]}>Trip {index + 1} of {scenarios.length}</Text>
      <View style={styles.scenarioCard}>
        <Text style={[styles.mayaName, { fontFamily: fontBold }]}>Help Maya</Text>
        <Text style={[styles.scenarioText, { fontFamily: fontMedium }]}>{scenario.prompt}</Text>
      </View>
      <Text style={[styles.question, { fontFamily: fontMedium }]}>Choose one item:</Text>
      <View style={styles.options}>
        {options.map((option) => {
          const answer = option === scenario.answer;
          const chosen = option === selected;
          return (
            <Pressable
              accessibilityRole="button"
              disabled={Boolean(selected)}
              key={option}
              onPress={() => choose(option)}
              style={({ pressed }) => [
                styles.option,
                selected && answer && styles.correctOption,
                chosen && !answer && styles.incorrectOption,
                pressed && !selected && styles.pressed,
              ]}
            >
              <Text style={[styles.optionText, { fontFamily: fontMedium }]}>{option}</Text>
            </Pressable>
          );
        })}
      </View>
      {selected && (
        <View style={styles.feedback}>
          <Text style={[styles.feedbackText, correct ? styles.correctText : styles.incorrectText, { fontFamily: fontMedium }]}>
            {correct ? tr('correct') : `${scenario.answer} — ${tr('incorrect')}`}
          </Text>
          <Pressable
            accessibilityRole="button"
            onPress={() => {
              setSelected(null);
              const next = index + 1;
              if (next === scenarios.length) onComplete?.();
              setIndex(next);
            }}
            style={styles.primaryButton}
          >
            <Text style={[styles.primaryText, { fontFamily: fontBold }]}>
              {index + 1 === scenarios.length ? tr('score') : tr('next')}
            </Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { ...StyleSheet.absoluteFillObject, backgroundColor: '#F9F6F0', left: -27, paddingHorizontal: 26, right: -27 },
  backButton: { alignSelf: 'flex-start', marginTop: 28, paddingVertical: 10 },
  backText: { color: '#2E7359', fontSize: 18 },
  title: { color: '#000', fontSize: 40, textAlign: 'center' },
  progress: { color: '#786F6F', fontSize: 16, marginTop: 7, textAlign: 'center' },
  scenarioCard: { backgroundColor: '#E7EFE7', borderColor: 'rgba(0, 0, 0, 0.25)', borderRadius: 24, borderWidth: 1.5, marginTop: 35, padding: 25 },
  mayaName: { color: '#2E7359', fontSize: 22, textAlign: 'center' },
  scenarioText: { color: '#000', fontSize: 21, lineHeight: 31, marginTop: 14, textAlign: 'center' },
  question: { color: '#000', fontSize: 20, marginTop: 30, textAlign: 'center' },
  options: { gap: 12, marginTop: 14 },
  option: { alignItems: 'center', backgroundColor: '#FFF', borderColor: 'rgba(0, 0, 0, 0.25)', borderRadius: 16, borderWidth: 1.5, height: 55, justifyContent: 'center' },
  optionText: { color: '#000', fontSize: 19 },
  correctOption: { backgroundColor: '#DDEDDD', borderColor: '#2E7359' },
  incorrectOption: { backgroundColor: '#F8DEDE', borderColor: '#B85858' },
  feedback: { alignItems: 'center', marginTop: 18 },
  feedbackText: { fontSize: 17, lineHeight: 24, marginBottom: 12, textAlign: 'center' },
  correctText: { color: '#2E7359' },
  incorrectText: { color: '#9B3E3E' },
  primaryButton: { alignItems: 'center', backgroundColor: '#2E7359', borderRadius: 12, height: 52, justifyContent: 'center', width: '100%' },
  primaryText: { color: '#FFF', fontSize: 18 },
  completeCard: { alignItems: 'center', borderColor: 'rgba(0, 0, 0, 0.2)', borderRadius: 24, borderWidth: 1.5, marginTop: 250, padding: 26 },
  completeTitle: { color: '#000', fontSize: 20, lineHeight: 30, marginVertical: 18, textAlign: 'center' },
  outlineButton: { alignItems: 'center', borderColor: '#2E7359', borderRadius: 12, borderWidth: 1, height: 52, justifyContent: 'center', marginTop: 12, width: '100%' },
  outlineText: { color: '#2E7359', fontSize: 18 },
  pressed: { opacity: 0.72 },
});
