import { StyleSheet, Text, TextInput, Pressable, View } from 'react-native';
import { useLanguage } from '../LanguageContext';

type AskingForNameProps = {
  name: string;
  onBack: () => void;
  onChangeName: (name: string) => void;
  onProceed: () => void;
};

export function AskingForName({ name, onBack, onChangeName, onProceed }: AskingForNameProps) {
  const { t: tr, fontMedium, fontBold, headingStyle } = useLanguage();

  return (
    <View style={styles.container}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Go back"
        onPress={onBack}
        style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}
      >
        <Text style={[styles.backText, { fontFamily: fontMedium }]}>{tr('back')}</Text>
      </Pressable>
      <View style={styles.body}>
        <Text style={[styles.question, { fontFamily: fontMedium, ...headingStyle(52, 64) }]}>{tr('whatsYourName')}</Text>
        <TextInput
          accessibilityLabel="Your name"
          onChangeText={onChangeName}
          placeholder={tr('namePlaceholder')}
          placeholderTextColor="#786F6F"
          selectTextOnFocus
          style={[styles.nameInput, { fontFamily: fontMedium }]}
          value={name}
        />
        <Pressable
          accessibilityRole="button"
          onPress={onProceed}
          style={({ pressed }) => [styles.proceedButton, pressed && styles.pressed]}
        >
          <Text style={[styles.proceedText, { fontFamily: fontBold }]}>{tr('proceed')}</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 14,
    paddingTop: 28,
  },
  backButton: {
    alignSelf: 'flex-start',
    paddingVertical: 8,
    marginBottom: 16,
  },
  backText: {
    color: '#2E7359',
    fontSize: 18,
  },
  body: {
    flex: 1,
    justifyContent: 'center',
    paddingBottom: 60,
  },
  question: {
    color: '#000000',
    fontSize: 52,
  },
  nameInput: {
    borderBottomColor: '#000000',
    borderBottomWidth: 1,
    color: '#786F6F',
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
    fontSize: 20,
  },
  pressed: {
    opacity: 0.72,
  },
});
