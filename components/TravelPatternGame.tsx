import { useMemo, useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

type Round = { answer: string; image: number; options: string[] };

const rounds: Round[] = [
  { answer: 'Happy', image: require('../app_image/Games/Travel_Pattern/Happy.png'), options: ['Happy', 'Sad', 'Worried', 'Angry'] },
  { answer: 'Sad', image: require('../app_image/Games/Travel_Pattern/Sad.png'), options: ['Sad', 'Happy', 'Calm', 'Surprised'] },
  { answer: 'Worried', image: require('../app_image/Games/Travel_Pattern/Worried.png'), options: ['Worried', 'Happy', 'Angry', 'Calm'] },
  { answer: 'Surprised', image: require('../app_image/Games/Travel_Pattern/Surprised.png'), options: ['Surprised', 'Sad', 'Calm', 'Happy'] },
  { answer: 'Calm', image: require('../app_image/Games/Travel_Pattern/Calm.png'), options: ['Calm', 'Angry', 'Worried', 'Sad'] },
  { answer: 'Angry', image: require('../app_image/Games/Travel_Pattern/Angry.png'), options: ['Angry', 'Happy', 'Calm', 'Surprised'] },
];

export function TravelPatternGame({ onExit, onComplete }: { onExit: () => void; onComplete?: () => void }) {
  const [roundIndex, setRoundIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const isComplete = roundIndex === rounds.length;
  const round = rounds[roundIndex];
  const progress = useMemo(() => `${Math.min(roundIndex + 1, rounds.length)} of ${rounds.length}`, [roundIndex]);

  if (isComplete) {
    return (
      <View style={styles.container}>
        <View style={styles.completeCard}>
          <Text style={styles.completeTitle}>Wonderful work!</Text>
          <Text style={styles.completeText}>You recognised {score} out of {rounds.length} emotions.</Text>
          <Pressable accessibilityRole="button" onPress={onExit} style={styles.primaryButton}><Text style={styles.primaryText}>Back To Games</Text></Pressable>
        </View>
      </View>
    );
  }

  const correct = selected === round.answer;
  const choose = (option: string) => {
    if (selected) return;
    setSelected(option);
    if (option === round.answer) setScore((value) => value + 1);
  };

  return (
    <View style={styles.container}>
      <Pressable accessibilityRole="button" onPress={onExit} style={styles.backButton}><Text style={styles.backText}>‹ Games</Text></Pressable>
      <Text style={styles.heading}>How is she feeling?</Text>
      <Text style={styles.progress}>{progress}</Text>
      <Image accessibilityLabel="Person showing an emotion" resizeMode="contain" source={round.image} style={styles.personImage} />
      <View style={styles.optionGrid}>
        {round.options.map((option) => {
          const answer = option === round.answer;
          const chosen = option === selected;
          return (
            <Pressable accessibilityRole="button" disabled={Boolean(selected)} key={option} onPress={() => choose(option)} style={({ pressed }) => [styles.option, selected && answer && styles.correctOption, chosen && !answer && styles.incorrectOption, pressed && !selected && styles.pressed]}>
              <Text style={styles.optionText}>{option}</Text>
            </Pressable>
          );
        })}
      </View>
      {selected && (
        <View style={styles.feedback}>
          <Text style={[styles.feedbackText, correct ? styles.correctText : styles.incorrectText]}>{correct ? 'That’s right! Well done.' : `That is ${round.answer}. Let’s remember it.`}</Text>
          <Pressable accessibilityRole="button" onPress={() => { setSelected(null); const next = roundIndex + 1; if (next === rounds.length) onComplete?.(); setRoundIndex(next); }} style={styles.primaryButton}><Text style={styles.primaryText}>{roundIndex + 1 === rounds.length ? 'See Result' : 'Next Person'}</Text></Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { ...StyleSheet.absoluteFillObject, backgroundColor: '#F9F6F0', left: -27, paddingHorizontal: 26, right: -27 },
  backButton: { alignSelf: 'flex-start', marginTop: 28, paddingVertical: 10 }, backText: { color: '#2E7359', fontFamily: 'Lora-Medium', fontSize: 18 },
  heading: { color: '#000', fontFamily: 'Lora-Medium', fontSize: 38, letterSpacing: -1.3, lineHeight: 48, marginTop: 8, textAlign: 'center' }, progress: { color: '#786F6F', fontFamily: 'Lora-Medium', fontSize: 16, marginTop: 8, textAlign: 'center' },
  personImage: { alignSelf: 'center', height: 300, marginTop: 6, width: 300 }, optionGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, justifyContent: 'space-between', marginTop: 8 },
  option: { alignItems: 'center', backgroundColor: '#FFF', borderColor: 'rgba(0, 0, 0, 0.25)', borderRadius: 16, borderWidth: 1.5, height: 58, justifyContent: 'center', width: '47%' }, optionText: { color: '#000', fontFamily: 'Lora-Medium', fontSize: 19 },
  correctOption: { backgroundColor: '#DDEDDD', borderColor: '#2E7359' }, incorrectOption: { backgroundColor: '#F8DEDE', borderColor: '#B85858' }, feedback: { alignItems: 'center', marginTop: 16 }, feedbackText: { fontFamily: 'Lora-Medium', fontSize: 17, marginBottom: 10, textAlign: 'center' }, correctText: { color: '#2E7359' }, incorrectText: { color: '#9B3E3E' },
  primaryButton: { alignItems: 'center', backgroundColor: '#2E7359', borderRadius: 12, height: 52, justifyContent: 'center', width: '100%' }, primaryText: { color: '#FFF', fontFamily: 'Lora-Bold', fontSize: 18 },
  completeCard: { alignItems: 'center', borderColor: 'rgba(0, 0, 0, 0.2)', borderRadius: 24, borderWidth: 1.5, marginTop: 250, padding: 26 }, completeTitle: { color: '#000', fontFamily: 'Lora-Medium', fontSize: 38, textAlign: 'center' }, completeText: { color: '#000', fontFamily: 'Lora-Medium', fontSize: 18, lineHeight: 27, marginVertical: 18, textAlign: 'center' }, pressed: { opacity: 0.72 },
});
