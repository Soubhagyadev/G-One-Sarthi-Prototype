import { useState } from 'react';
import * as Notifications from 'expo-notifications';
import { Alert, Image, Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SvgUri } from 'react-native-svg';

const uri = (source: number) => Image.resolveAssetSource(source).uri;

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

function Icon({ source, size }: { source: number; size: number }) {
  return <SvgUri height={size} uri={uri(source)} width={size} />;
}

export const reminderIcons = {
  medicine: require('../SVG_Icons/Monitor_Section/Medicine.svg'),
  water: require('../SVG_Icons/Monitor_Section/Water_Drop.svg'),
  walk: require('../SVG_Icons/Monitor_Section/Walking.svg'),
} as const;

export type ReminderIcon = keyof typeof reminderIcons;
export type Reminder = { id: string; icon: ReminderIcon; label: string; notificationId?: string; time: string };

export const initialReminders: Reminder[] = [
  { id: 'medicine', icon: 'medicine', label: 'Take Medicine', time: '8:00 PM' },
  { id: 'water', icon: 'water', label: 'Drink Water', time: '11:00 AM' },
  { id: 'walk', icon: 'walk', label: 'Short Walk', time: '5:00 PM' },
];

const performance = ['Travel Rating', 'Match Pairs', 'Pack Your Bags', 'Watch The Tray', 'People Face'];

type MonitorScreenProps = {
  onGames: () => void;
  onHome: () => void;
  onVoice: () => void;
  reminders: Reminder[];
  setReminders: React.Dispatch<React.SetStateAction<Reminder[]>>;
};

export function MonitorScreen({ onGames, onHome, onVoice, reminders, setReminders }: MonitorScreenProps) {
  const [iconPickerId, setIconPickerId] = useState<string | null>(null);

  const updateReminder = (id: string, changes: Partial<Reminder>) => {
    setReminders((items) => items.map((item) => (item.id === id ? { ...item, ...changes } : item)));
  };

  const addReminder = () => {
    setReminders((items) => [...items, { id: `${Date.now()}`, icon: 'medicine', label: 'New Reminder', time: '9:00 AM' }]);
  };

  const scheduleReminder = async (reminder: Reminder) => {
    const time = parseReminderTime(reminder.time);
    if (!reminder.label.trim() || !time) {
      Alert.alert('Check reminder', 'Enter a reminder and a time such as 8:00 PM.');
      return;
    }
    const permissions = await Notifications.requestPermissionsAsync();
    if (permissions.status !== 'granted') {
      Alert.alert('Notifications are off', 'Please allow notifications so G-One Sarthi can remind you.');
      return;
    }
    if (reminder.notificationId) await Notifications.cancelScheduledNotificationAsync(reminder.notificationId);
    const notificationId = await Notifications.scheduleNotificationAsync({
      content: { body: reminder.label, sound: 'default', title: 'G-One Sarthi Reminder' },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour: time.hour,
        minute: time.minute,
      },
    });
    updateReminder(reminder.id, { notificationId });
    Alert.alert('Reminder added', `${reminder.label} will appear at ${reminder.time}.`);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.heading}>Add Reminders</Text>
        <View style={styles.reminderList}>
          {reminders.map((reminder) => (
            <View key={reminder.id} style={styles.reminderCard}>
              <Pressable accessibilityLabel="Choose reminder icon" accessibilityRole="button" onPress={() => setIconPickerId(reminder.id)} style={styles.iconButton}>
                <Icon size={30} source={reminderIcons[reminder.icon]} />
              </Pressable>
              <TextInput
                accessibilityLabel="Reminder activity"
                onChangeText={(label) => updateReminder(reminder.id, { label })}
                style={styles.reminderLabel}
                value={reminder.label}
              />
              <TextInput
                accessibilityLabel="Reminder time"
                onChangeText={(time) => updateReminder(reminder.id, { time })}
                style={styles.reminderTime}
                value={reminder.time}
              />
              <Pressable accessibilityLabel="Save and schedule reminder" accessibilityRole="button" onPress={() => scheduleReminder(reminder)} style={styles.plusButton}>
                <Icon size={42} source={require('../SVG_Icons/Monitor_Section/Plus_Button_3.svg')} />
              </Pressable>
            </View>
          ))}
        </View>
        <Pressable accessibilityRole="button" onPress={addReminder} style={styles.addReminderButton}>
          <Text style={styles.addReminderText}>+ Add another reminder</Text>
        </Pressable>
        <Text style={styles.example}>Example: Remember To Take Medicine at 10:00PM</Text>

        <Text style={styles.analyticsHeading}>Analytics</Text>
        <View style={styles.analyticsCard}>
          <View style={styles.analyticsTitleRow}>
            <Icon size={38} source={require('../SVG_Icons/Monitor_Section/Controller.svg')} />
            <Text style={styles.analyticsTitle}>Game Performance</Text>
          </View>
          {performance.map((game) => (
            <View key={game} style={styles.performanceRow}>
              <Text style={styles.performanceName}>{game}</Text>
              <View style={styles.progressTrack}><View style={styles.progressFill} /></View>
              <Text style={styles.percent}>100%</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      <View style={styles.navigationBar}>
        <NavItem icon={require('../SVG_Icons/Home/Home.svg')} label="Home" onPress={onHome} />
        <NavItem icon={require('../SVG_Icons/Home/Controller.svg')} label="Games" onPress={onGames} />
        <NavItem icon={require('../SVG_Icons/Home/Voice.svg')} label="Voice Chat" onPress={onVoice} />
        <NavItem icon={require('../SVG_Icons/Home/Health_For_Monitor.svg')} label="Monitor" />
      </View>

      <Modal animationType="fade" onRequestClose={() => setIconPickerId(null)} transparent visible={iconPickerId !== null}>
        <Pressable onPress={() => setIconPickerId(null)} style={styles.modalBackdrop}>
          <View style={styles.iconPicker}>
            <Text style={styles.iconPickerTitle}>Choose an icon</Text>
            <View style={styles.iconChoices}>
              {(Object.keys(reminderIcons) as ReminderIcon[]).map((icon) => (
                <Pressable
                  accessibilityLabel={`Use ${icon} icon`}
                  accessibilityRole="button"
                  key={icon}
                  onPress={() => {
                    if (iconPickerId) updateReminder(iconPickerId, { icon });
                    setIconPickerId(null);
                  }}
                  style={styles.iconChoice}
                >
                  <Icon size={45} source={reminderIcons[icon]} />
                </Pressable>
              ))}
            </View>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

function parseReminderTime(value: string) {
  const match = value.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) return null;
  const hour = Number(match[1]);
  const minute = Number(match[2]);
  if (hour < 1 || hour > 12 || minute > 59) return null;
  return { hour: (hour % 12) + (match[3].toUpperCase() === 'PM' ? 12 : 0), minute };
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
  container: { ...StyleSheet.absoluteFillObject, backgroundColor: '#F9F6F0', left: -27, right: -27 },
  content: { paddingBottom: 120, paddingHorizontal: 22, paddingTop: 30 },
  heading: { color: '#000', fontFamily: 'Lora-Medium', fontSize: 44, letterSpacing: -1.6, lineHeight: 56 },
  reminderList: { gap: 14, marginTop: 16 },
  reminderCard: { alignItems: 'center', borderColor: 'rgba(0, 0, 0, 0.25)', borderRadius: 18, borderWidth: 1.5, flexDirection: 'row', height: 62, paddingHorizontal: 9 },
  iconButton: { alignItems: 'center', height: 46, justifyContent: 'center', width: 38 },
  reminderLabel: { color: '#000', flex: 1, fontFamily: 'Lora-Medium', fontSize: 15, marginLeft: 6, padding: 0 },
  reminderTime: { color: '#000', fontFamily: 'Lora-Medium', fontSize: 12, marginRight: 2, padding: 0, width: 66 },
  plusButton: { alignItems: 'center', height: 48, justifyContent: 'center', width: 40 },
  addReminderButton: { alignItems: 'center', borderColor: '#2E7359', borderRadius: 12, borderWidth: 1, marginTop: 12, paddingVertical: 10 },
  addReminderText: { color: '#2E7359', fontFamily: 'Lora-Medium', fontSize: 16 },
  example: { color: '#786F6F', fontFamily: 'Lora-Medium', fontSize: 14, lineHeight: 19, marginTop: 16 },
  analyticsHeading: { color: '#000', fontFamily: 'Lora-Medium', fontSize: 40, letterSpacing: -1.4, marginTop: 20 },
  analyticsCard: { borderColor: 'rgba(0, 0, 0, 0.25)', borderRadius: 25, borderWidth: 2, marginTop: 8, padding: 18 },
  analyticsTitleRow: { alignItems: 'center', flexDirection: 'row', marginBottom: 12 },
  analyticsTitle: { color: '#000', fontFamily: 'Lora-Medium', fontSize: 20, marginLeft: 12 },
  performanceRow: { alignItems: 'center', flexDirection: 'row', height: 44 },
  performanceName: { color: '#000', fontFamily: 'Lora-Medium', fontSize: 14, width: 130 },
  progressTrack: { backgroundColor: '#E6E2DC', borderRadius: 14, flex: 1, height: 20, overflow: 'hidden' },
  progressFill: { backgroundColor: '#2E7359', borderRadius: 14, height: '100%', width: '100%' },
  percent: { color: '#000', fontFamily: 'Lora-Medium', fontSize: 11, marginLeft: 8 },
  navigationBar: { alignItems: 'center', backgroundColor: '#2E7359', borderRadius: 50, bottom: 20, flexDirection: 'row', height: 78, justifyContent: 'space-around', left: 22, position: 'absolute', right: 22 },
  navItem: { alignItems: 'center', minWidth: 55 },
  navLabel: { color: '#FFF', fontFamily: 'Lora-Medium', fontSize: 11, marginTop: 2 },
  pressed: { opacity: 0.72 },
  modalBackdrop: { alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.38)', flex: 1, justifyContent: 'center', padding: 30 },
  iconPicker: { backgroundColor: '#F9F6F0', borderRadius: 20, padding: 22, width: '100%' },
  iconPickerTitle: { color: '#000', fontFamily: 'Lora-Medium', fontSize: 22, textAlign: 'center' },
  iconChoices: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 20 },
  iconChoice: { alignItems: 'center', borderColor: 'rgba(0, 0, 0, 0.15)', borderRadius: 14, borderWidth: 1, height: 70, justifyContent: 'center', width: 70 },
});
