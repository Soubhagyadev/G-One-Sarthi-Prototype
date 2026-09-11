import { StyleSheet, Text, TextInput, Pressable, View } from 'react-native';

type AskingForNameProps = {
  name: string;
  onChangeName: (name: string) => void;
  onProceed: () => void;
};

export function AskingForName({ name, onChangeName, onProceed }: AskingForNameProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.question}>What’s Your{`\n`}Name?</Text>
      <TextInput
        accessibilityLabel="Your name"
        onChangeText={onChangeName}
        selectTextOnFocus
        style={styles.nameInput}
        value={name}
      />
      <Pressable
        accessibilityRole="button"
        onPress={onProceed}
        style={({ pressed }) => [styles.proceedButton, pressed && styles.pressed]}
      >
        <Text style={styles.proceedText}>Proceed</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 220,
    paddingHorizontal: 14,
  },
  question: {
    color: '#000000',
    fontFamily: 'Lora-Medium',
    fontSize: 52,
    letterSpacing: -1.5,
    lineHeight: 64,
  },
  nameInput: {
    borderBottomColor: '#000000',
    borderBottomWidth: 1,
    color: '#786F6F',
    fontFamily: 'Lora-Medium',
    fontSize: 34,
    height: 55,
    lineHeight: 43,
    marginTop: 14,
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  proceedButton: {
    alignItems: 'center',
    backgroundColor: '#2E7359',
    borderColor: '#A18686',
    borderRadius: 12,
    borderWidth: 1,
    height: 50,
    justifyContent: 'center',
    marginTop: 58,
    width: '100%',
  },
  proceedText: {
    color: '#FFFFFF',
    fontFamily: 'Lora-Bold',
    fontSize: 20,
  },
  pressed: {
    opacity: 0.72,
  },
});
