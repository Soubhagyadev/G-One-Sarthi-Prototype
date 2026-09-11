import { useState } from 'react';
import DateTimePicker, { type DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { Alert, Image, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SvgUri } from 'react-native-svg';

const uri = (source: number) => Image.resolveAssetSource(source).uri;

function Icon({ source, size }: { source: number; size: number }) {
  return <SvgUri height={size} uri={uri(source)} width={size} />;
}

export const reminderIcons = {
  medicine: require('../SVG_Icons/Monitor_Section/Medicine.svg'),
  water: require('../SVG_Icons/Monitor_Section/Water_Drop.svg'),
  walk: require('../SVG_Icons/Monitor_Section/Walking.svg'),
} as const;

export type ReminderIcon = keyof typeof reminderIcons;
export type Reminder = { id: string; icon: ReminderIcon; label: string; time: string };

export const initialReminders: Reminder[] = [
  { id: 'medicine', icon: 'medicine', label: 'Take Medicine', time: '8:00 PM' },
  { id: 'water', icon: 'water', label: 'Drink Water', time: '11:00 AM' },
  { id: 'walk', icon: 'walk', label: 'Short Walk', time: '5:00 PM' },
];

const performance: { label: string; gameId: string }[] = [
  { label: 'Travel Rating',  gameId: 'travelGame' },
  { label: 'Match Pairs',    gameId: 'matchPairs' },
  { label: 'Pack Your Bags', gameId: 'packYourBags' },
  { label: 'Watch The Tray', gameId: 'watchTheTray' },
  { label: 'People Face',    gameId: 'peopleFace' },
];

type MonitorScreenProps = {
  onGames: () => void;
  onHome: () => void;
  onVoice: () => void;
  reminders: Reminder[];
  setReminders: React.Dispatch<React.SetStateAction<Reminder[]>>;
  gamesCompleted: Set<string>;
  streak: number;
  lastActive: string;
  weeklyHistory: { date: string; count: number }[];
  remindersTotal: number;
  remindersDone: number;
};

export function MonitorScreen({ onGames, onHome, onVoice, reminders, setReminders, gamesCompleted, streak, lastActive, weeklyHistory, remindersTotal, remindersDone }: MonitorScreenProps) {
  const [iconPickerId, setIconPickerId] = useState<string | null>(null);
  const [timePickerId, setTimePickerId] = useState<string | null>(null);

  // Convert "8:00 PM" → Date object (today's date with that time)
  const timeStringToDate = (time: string): Date => {
    const match = time.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
    const date = new Date();
    if (match) {
      let hour = Number(match[1]);
      const minute = Number(match[2]);
      const isPM = match[3].toUpperCase() === 'PM';
      if (isPM && hour !== 12) hour += 12;
      if (!isPM && hour === 12) hour = 0;
      date.setHours(hour, minute, 0, 0);
    }
    return date;
  };

  // Convert Date → "8:00 PM"
  const dateToTimeString = (date: Date): string => {
    let hour = date.getHours();
    const minute = date.getMinutes();
    const ampm = hour >= 12 ? 'PM' : 'AM';
    hour = hour % 12 || 12;
    return `${hour}:${minute.toString().padStart(2, '0')} ${ampm}`;
  };

  const updateReminder = (id: string, changes: Partial<Reminder>) => {
    setReminders((items) => items.map((item) => (item.id === id ? { ...item, ...changes } : item)));
  };

  const addReminder = () => {
    setReminders((items) => [...items, { id: `${Date.now()}`, icon: 'medicine', label: 'New Reminder', time: '9:00 AM' }]);
  };

  const deleteReminder = (id: string) => {
    setReminders((items) => items.filter((item) => item.id !== id));
  };

  const saveReminder = (reminder: Reminder) => {
    const valid = reminder.time.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
    if (!reminder.label.trim() || !valid) {
      Alert.alert('Check reminder', 'Enter a label and a time such as 8:00 PM.');
      return;
    }
    Alert.alert('Reminder saved', `${reminder.label} is set for ${reminder.time}.`);
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
              <Pressable
                accessibilityLabel="Set reminder time"
                accessibilityRole="button"
                onPress={() => setTimePickerId(reminder.id)}
                style={({ pressed }) => [styles.timeButton, pressed && styles.pressed]}
              >
                <Text style={styles.timeButtonText}>{reminder.time}</Text>
              </Pressable>
              <Pressable accessibilityLabel="Save reminder" accessibilityRole="button" onPress={() => saveReminder(reminder)} style={styles.plusButton}>
                <Icon size={42} source={require('../SVG_Icons/Monitor_Section/Plus_Button_3.svg')} />
              </Pressable>
              <Pressable
                accessibilityLabel="Delete reminder"
                accessibilityRole="button"
                onPress={() => deleteReminder(reminder.id)}
                style={styles.deleteButton}
              >
                <Text style={styles.deleteText}>✕</Text>
              </Pressable>
            </View>
          ))}
        </View>
        <Pressable accessibilityRole="button" onPress={addReminder} style={styles.addReminderButton}>
          <Text style={styles.addReminderText}>+ Add another reminder</Text>
        </Pressable>
        <Text style={styles.example}>Example: Remember To Take Medicine at 10:00PM</Text>

        {/* Native time picker — renders inline on Android, modal sheet on iOS */}
        {timePickerId !== null && (
          <DateTimePicker
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            is24Hour={false}
            mode="time"
            onChange={(_event: DateTimePickerEvent, date?: Date) => {
              if (date) updateReminder(timePickerId, { time: dateToTimeString(date) });
              if (Platform.OS === 'android') setTimePickerId(null);
            }}
            onTouchCancel={() => setTimePickerId(null)}
            style={Platform.OS === 'ios' ? styles.iosPicker : undefined}
            themeVariant="light"
            value={timeStringToDate(reminders.find(r => r.id === timePickerId)?.time ?? '12:00 PM')}
          />
        )}
        {Platform.OS === 'ios' && timePickerId !== null && (
          <Pressable
            accessibilityRole="button"
            onPress={() => setTimePickerId(null)}
            style={styles.iosPickerDone}
          >
            <Text style={styles.iosPickerDoneText}>Done</Text>
          </Pressable>
        )}

        <Text style={styles.analyticsHeading}>Analytics</Text>

        {/* ── Card 1: Today's Summary ── */}
        <View style={styles.analyticsCard}>
          <Text style={styles.cardTitle}>Today's Summary</Text>
          <View style={styles.summaryRow}>
            <View style={styles.summaryBlock}>
              <View style={styles.bigCircle}>
                <Text style={styles.bigCircleNumber}>{gamesCompleted.size}</Text>
                <Text style={styles.bigCircleOf}>/5</Text>
              </View>
              <Text style={styles.summaryLabel}>Games{'\n'}Played</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryBlock}>
              <View style={[styles.bigCircle, styles.bigCircleOrange]}>
                <Text style={styles.bigCircleNumber}>{streak}</Text>
              </View>
              <Text style={styles.summaryLabel}>Day{'\n'}Streak</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryBlock}>
              <View style={[styles.bigCircle, styles.bigCircleBlue]}>
                <Text style={styles.bigCircleNumber}>{remindersDone}</Text>
                <Text style={styles.bigCircleOf}>/{remindersTotal}</Text>
              </View>
              <Text style={styles.summaryLabel}>Reminders{'\n'}Done</Text>
            </View>
          </View>
        </View>

        {/* ── Card 2: Last Active ── */}
        <View style={[styles.analyticsCard, styles.lastActiveCard]}>
          <View style={styles.lastActiveRow}>
            <View>
              <Text style={styles.cardTitle}>Last Active</Text>
              <Text style={styles.lastActiveValue}>{lastActive || 'Just now'}</Text>
            </View>
            <View style={styles.activeDot} />
          </View>
        </View>

        {/* ── Card 3: Reminders Status ── */}
        <View style={styles.analyticsCard}>
          <Text style={styles.cardTitle}>Reminders Today</Text>
          <View style={styles.reminderStatusRow}>
            <Text style={styles.reminderStatusFraction}>
              {remindersDone}<Text style={styles.reminderStatusTotal}>/{remindersTotal}</Text>
            </Text>
            <Text style={styles.reminderStatusLabel}>
              {remindersDone === remindersTotal && remindersTotal > 0
                ? 'All done! Great job.'
                : remindersDone === 0
                ? 'None completed yet'
                : `${remindersTotal - remindersDone} remaining`}
            </Text>
          </View>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, {
              width: remindersTotal > 0 ? `${Math.round((remindersDone / remindersTotal) * 100)}%` : '0%'
            }]} />
          </View>
        </View>

        {/* ── Card 4: 7-Day Game History ── */}
        <View style={styles.analyticsCard}>
          <Text style={styles.cardTitle}>7-Day Activity</Text>
          <Text style={styles.cardSubtitle}>Games played per day</Text>
          <View style={styles.chartRow}>
            {weeklyHistory.map((day, i) => {
              const isToday = i === 6;
              const barHeight = day.count === 0 ? 6 : Math.max(20, (day.count / 5) * 80);
              const dayLabel = new Date(day.date + 'T00:00:00').toLocaleDateString('en', { weekday: 'short' }).slice(0, 1);
              return (
                <View key={day.date} style={styles.chartColumn}>
                  <Text style={styles.chartCount}>{day.count > 0 ? day.count : ''}</Text>
                  <View style={styles.chartBarWrapper}>
                    <View style={[
                      styles.chartBar,
                      { height: barHeight },
                      isToday ? styles.chartBarToday : day.count > 0 ? styles.chartBarDone : styles.chartBarEmpty,
                    ]} />
                  </View>
                  <Text style={[styles.chartDay, isToday && styles.chartDayToday]}>{isToday ? 'Now' : dayLabel}</Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* ── Card 5: Per-game performance ── */}
        <View style={styles.analyticsCard}>
          <View style={styles.analyticsTitleRow}>
            <Icon size={38} source={require('../SVG_Icons/Monitor_Section/Controller.svg')} />
            <Text style={styles.analyticsTitle}>Game Performance</Text>
          </View>
          {performance.map(({ label, gameId }) => {
            const done = gamesCompleted.has(gameId);
            return (
              <View key={gameId} style={styles.performanceRow}>
                <Text style={styles.performanceName}>{label}</Text>
                <View style={styles.progressTrack}>
                  <View style={[styles.progressFill, { width: done ? '100%' : '0%' }]} />
                </View>
                <Text style={styles.percent}>{done ? '✓' : '—'}</Text>
              </View>
            );
          })}
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
  plusButton: { alignItems: 'center', height: 48, justifyContent: 'center', width: 40 },
  timeButton: { alignItems: 'center', backgroundColor: '#E7EFE7', borderColor: '#2E7359', borderRadius: 10, borderWidth: 1, justifyContent: 'center', marginRight: 4, paddingHorizontal: 8, paddingVertical: 6 },
  timeButtonText: { color: '#2E7359', fontFamily: 'Lora-Medium', fontSize: 13 },
  iosPicker: { backgroundColor: '#F9F6F0', width: '100%' },
  iosPickerDone: { alignItems: 'center', backgroundColor: '#2E7359', borderRadius: 10, marginHorizontal: 22, marginTop: 4, paddingVertical: 10 },
  iosPickerDoneText: { color: '#FFF', fontFamily: 'Lora-Bold', fontSize: 16 },
  deleteButton: { alignItems: 'center', height: 48, justifyContent: 'center', marginLeft: 2, width: 32 },
  deleteText: { color: '#B85858', fontFamily: 'Lora-Medium', fontSize: 18 },
  addReminderButton: { alignItems: 'center', borderColor: '#2E7359', borderRadius: 12, borderWidth: 1, marginTop: 12, paddingVertical: 10 },
  addReminderText: { color: '#2E7359', fontFamily: 'Lora-Medium', fontSize: 16 },
  example: { color: '#786F6F', fontFamily: 'Lora-Medium', fontSize: 14, lineHeight: 19, marginTop: 16 },
  analyticsHeading: { color: '#000', fontFamily: 'Lora-Medium', fontSize: 40, letterSpacing: -1.4, marginTop: 20 },
  analyticsCard: { borderColor: 'rgba(0, 0, 0, 0.25)', borderRadius: 25, borderWidth: 2, marginTop: 14, padding: 18 },
  cardTitle: { color: '#000', fontFamily: 'Lora-Medium', fontSize: 20, marginBottom: 14 },
  cardSubtitle: { color: '#786F6F', fontFamily: 'Lora-Medium', fontSize: 13, marginBottom: 14, marginTop: -10 },

  // Summary card
  summaryRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' },
  summaryBlock: { alignItems: 'center', flex: 1 },
  summaryDivider: { width: 1, height: 80, backgroundColor: 'rgba(0,0,0,0.1)' },
  bigCircle: { alignItems: 'center', backgroundColor: '#E7EFE7', borderColor: '#2E7359', borderRadius: 40, borderWidth: 2, flexDirection: 'row', height: 72, justifyContent: 'center', width: 72 },
  bigCircleOrange: { backgroundColor: '#FFF3E0', borderColor: '#E0943A' },
  bigCircleBlue: { backgroundColor: '#E2EFF4', borderColor: '#3A7FA0' },
  bigCircleNumber: { color: '#000', fontFamily: 'Lora-Bold', fontSize: 28 },
  bigCircleOf: { color: '#786F6F', fontFamily: 'Lora-Medium', fontSize: 14, marginTop: 6 },
  summaryLabel: { color: '#786F6F', fontFamily: 'Lora-Medium', fontSize: 12, marginTop: 8, textAlign: 'center' },

  // Last active card
  lastActiveCard: { backgroundColor: '#F0F8F0' },
  lastActiveRow: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' },
  lastActiveValue: { color: '#2E7359', fontFamily: 'Lora-Bold', fontSize: 22, marginTop: 2 },
  activeDot: { backgroundColor: '#2E7359', borderRadius: 10, height: 20, width: 20 },

  // Reminders status card
  reminderStatusRow: { alignItems: 'baseline', flexDirection: 'row', gap: 10, marginBottom: 10 },
  reminderStatusFraction: { color: '#000', fontFamily: 'Lora-Bold', fontSize: 36 },
  reminderStatusTotal: { color: '#786F6F', fontFamily: 'Lora-Medium', fontSize: 22 },
  reminderStatusLabel: { color: '#786F6F', fontFamily: 'Lora-Medium', fontSize: 15 },

  // 7-day chart
  chartRow: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', height: 110 },
  chartColumn: { alignItems: 'center', flex: 1 },
  chartBarWrapper: { alignItems: 'center', justifyContent: 'flex-end', height: 86, width: '100%' },
  chartBar: { borderRadius: 6, width: '60%' },
  chartBarToday: { backgroundColor: '#2E7359' },
  chartBarDone: { backgroundColor: '#A8C9BC' },
  chartBarEmpty: { backgroundColor: '#E6E2DC', height: 6 },
  chartCount: { color: '#2E7359', fontFamily: 'Lora-Bold', fontSize: 11, marginBottom: 2 },
  chartDay: { color: '#786F6F', fontFamily: 'Lora-Medium', fontSize: 11, marginTop: 4 },
  chartDayToday: { color: '#2E7359', fontFamily: 'Lora-Bold' },

  // Per-game performance
  analyticsTitleRow: { alignItems: 'center', flexDirection: 'row', marginBottom: 12 },
  analyticsTitle: { color: '#000', fontFamily: 'Lora-Medium', fontSize: 20, marginLeft: 12 },
  performanceRow: { alignItems: 'center', flexDirection: 'row', height: 44 },
  performanceName: { color: '#000', fontFamily: 'Lora-Medium', fontSize: 14, width: 130 },
  progressTrack: { backgroundColor: '#E6E2DC', borderRadius: 14, flex: 1, height: 20, overflow: 'hidden' },
  progressFill: { backgroundColor: '#2E7359', borderRadius: 14, height: '100%', width: '100%' },
  percent: { color: '#2E7359', fontFamily: 'Lora-Bold', fontSize: 15, marginLeft: 8, width: 20 },
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
