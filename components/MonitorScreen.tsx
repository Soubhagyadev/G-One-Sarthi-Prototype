import { useEffect, useState } from 'react';
import * as Notifications from 'expo-notifications';
import { getItem, setItem } from '../storage';
import { savePatientState } from '../syncService';
import DateTimePicker, { type DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { Alert, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SvgProps } from 'react-native-svg';
import { useLanguage } from '../LanguageContext';

type SvgComponent = (props: SvgProps) => React.ReactElement | null;

function Icon({ source, size }: { source: SvgComponent | { default: SvgComponent }; size: number }) {
  const SvgIcon = (source as any).default ?? source;
  return <SvgIcon width={size} height={size} />;
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
  const { t: tr, fontMedium, fontBold, headingStyle } = useLanguage();

  const [iconPickerId, setIconPickerId] = useState<string | null>(null);
  const [timePickerId, setTimePickerId] = useState<string | null>(null);
  const [notes, setNotes] = useState('');
  const [notesSaved, setNotesSaved] = useState(false);

  // Load saved notes on mount
  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10);
    getItem(`caregiverNotes_${today}`).then(saved => {
      if (saved) setNotes(saved);
    }).catch(() => undefined);
  }, []);

  const saveNotes = async () => {
    const today = new Date().toISOString().slice(0, 10);
    await setItem(`caregiverNotes_${today}`, notes);
    await savePatientState(`caregiverNotes_${today}`, notes);
    setNotesSaved(true);
    setTimeout(() => setNotesSaved(false), 2000);
  };

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
    Notifications.cancelScheduledNotificationAsync(id).catch(() => {});
    setReminders((items) => items.filter((item) => item.id !== id));
  };

  const saveReminder = async (reminder: Reminder) => {
    const valid = reminder.time.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
    if (!reminder.label.trim() || !valid) {
      Alert.alert(tr('checkReminder'), tr('checkReminderMsg'));
      return;
    }

    // Request notification permissions and schedule
    const { status } = await Notifications.requestPermissionsAsync();
    if (status === 'granted') {
      // Cancel any previous notification for this reminder id
      await Notifications.cancelScheduledNotificationAsync(reminder.id).catch(() => {});

      const triggerDate = timeStringToDate(reminder.time);
      // If the time has already passed today, schedule for tomorrow
      if (triggerDate <= new Date()) {
        triggerDate.setDate(triggerDate.getDate() + 1);
      }

      const iconEmoji = reminder.icon === 'water' ? '💧' : reminder.icon === 'walk' ? '🚶' : '💊';

      await Notifications.scheduleNotificationAsync({
        identifier: reminder.id,
        content: {
          title: `${iconEmoji} ${reminder.label}`,
          body: `It's time! ${reminder.label} — ${reminder.time}`,
          sound: true,
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DAILY,
          hour: triggerDate.getHours(),
          minute: triggerDate.getMinutes(),
        },
      });

      Alert.alert(tr('checkReminder'), tr('reminderSavedAlert', reminder.label, reminder.time));
    } else {
      Alert.alert(tr('checkReminder'), tr('reminderSavedAlert', reminder.label, reminder.time));
    }
  };

  const performance: { labelKey: 'gameTravelRating' | 'gameMatchPairs' | 'gamePackBags' | 'gameWatchTray' | 'gamePeopleFace'; gameId: string }[] = [
    { labelKey: 'gameTravelRating', gameId: 'travelGame' },
    { labelKey: 'gameMatchPairs',   gameId: 'matchPairs' },
    { labelKey: 'gamePackBags',     gameId: 'packYourBags' },
    { labelKey: 'gameWatchTray',    gameId: 'watchTheTray' },
    { labelKey: 'gamePeopleFace',   gameId: 'peopleFace' },
  ];

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={[styles.heading, { fontFamily: fontMedium, ...headingStyle(44, 56) }]}>{tr('addReminders')}</Text>
        <View style={styles.reminderList}>
          {reminders.map((reminder) => (
            <View key={reminder.id} style={styles.reminderCard}>
              <Pressable accessibilityLabel="Choose reminder icon" accessibilityRole="button" onPress={() => setIconPickerId(reminder.id)} style={styles.iconButton}>
                <Icon size={30} source={reminderIcons[reminder.icon]} />
              </Pressable>
              <TextInput
                accessibilityLabel="Reminder activity"
                onChangeText={(label) => updateReminder(reminder.id, { label })}
                style={[styles.reminderLabel, { fontFamily: fontMedium }]}
                value={reminder.label}
              />
              <Pressable
                accessibilityLabel="Set reminder time"
                accessibilityRole="button"
                onPress={() => setTimePickerId(reminder.id)}
                style={({ pressed }) => [styles.timeButton, pressed && styles.pressed]}
              >
                <Text style={[styles.timeButtonText, { fontFamily: fontMedium }]}>{reminder.time}</Text>
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
                <Text style={[styles.deleteText, { fontFamily: fontMedium }]}>✕</Text>
              </Pressable>
            </View>
          ))}
        </View>
        <Pressable accessibilityRole="button" onPress={addReminder} style={styles.addReminderButton}>
          <Text style={[styles.addReminderText, { fontFamily: fontMedium }]}>{tr('addAnotherReminder')}</Text>
        </Pressable>
        <Text style={[styles.example, { fontFamily: fontMedium }]}>{tr('reminderExample')}</Text>

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
            <Text style={[styles.iosPickerDoneText, { fontFamily: fontBold }]}>Done</Text>
          </Pressable>
        )}

        <Text style={[styles.analyticsHeading, { fontFamily: fontMedium }]}>{tr('analytics')}</Text>

        {/* ── Card 1: Today's Summary ── */}
        <View style={styles.analyticsCard}>
          <Text style={[styles.cardTitle, { fontFamily: fontMedium }]}>{tr('todaysSummary')}</Text>
          <View style={styles.summaryRow}>
            <View style={styles.summaryBlock}>
              <View style={styles.bigCircle}>
                <Text style={[styles.bigCircleNumber, { fontFamily: fontBold }]}>{gamesCompleted.size}</Text>
                <Text style={[styles.bigCircleOf, { fontFamily: fontMedium }]}>/5</Text>
              </View>
              <Text style={[styles.summaryLabel, { fontFamily: fontMedium }]}>{tr('gamesPlayed')}</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryBlock}>
              <View style={[styles.bigCircle, styles.bigCircleOrange]}>
                <Text style={[styles.bigCircleNumber, { fontFamily: fontBold }]}>{streak}</Text>
              </View>
              <Text style={[styles.summaryLabel, { fontFamily: fontMedium }]}>{tr('dayStreak')}</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryBlock}>
              <View style={[styles.bigCircle, styles.bigCircleBlue]}>
                <Text style={[styles.bigCircleNumber, { fontFamily: fontBold }]}>{remindersDone}</Text>
                <Text style={[styles.bigCircleOf, { fontFamily: fontMedium }]}>/{remindersTotal}</Text>
              </View>
              <Text style={[styles.summaryLabel, { fontFamily: fontMedium }]}>{tr('remindersDone')}</Text>
            </View>
          </View>
        </View>

        {/* ── Card 2: Last Active ── */}
        <View style={[styles.analyticsCard, styles.lastActiveCard]}>
          <View style={styles.lastActiveRow}>
            <View>
              <Text style={[styles.cardTitle, { fontFamily: fontMedium }]}>{tr('lastActive')}</Text>
              <Text style={[styles.lastActiveValue, { fontFamily: fontBold }]}>{lastActive || 'Just now'}</Text>
            </View>
            <View style={styles.activeDot} />
          </View>
        </View>

        {/* ── Card 3: Reminders Status ── */}
        <View style={styles.analyticsCard}>
          <Text style={[styles.cardTitle, { fontFamily: fontMedium }]}>{tr('remindersToday')}</Text>
          <View style={styles.reminderStatusRow}>
            <Text style={[styles.reminderStatusFraction, { fontFamily: fontBold }]}>
              {remindersDone}<Text style={[styles.reminderStatusTotal, { fontFamily: fontMedium }]}>/{remindersTotal}</Text>
            </Text>
            <Text style={[styles.reminderStatusLabel, { fontFamily: fontMedium }]}>
              {remindersDone === remindersTotal && remindersTotal > 0
                ? tr('allDone')
                : remindersDone === 0
                ? tr('noneCompleted')
                : tr('remaining', remindersTotal - remindersDone)}
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
          <Text style={[styles.cardTitle, { fontFamily: fontMedium }]}>{tr('sevenDayActivity')}</Text>
          <Text style={[styles.cardSubtitle, { fontFamily: fontMedium }]}>{tr('gamesPerDay')}</Text>
          <View style={styles.chartRow}>
            {weeklyHistory.map((day, i) => {
              const isToday = i === 6;
              const barHeight = day.count === 0 ? 6 : Math.max(20, (day.count / 5) * 80);
              const dayLabel = new Date(day.date + 'T00:00:00').toLocaleDateString('en', { weekday: 'short' }).slice(0, 1);
              return (
                <View key={day.date} style={styles.chartColumn}>
                  <Text style={[styles.chartCount, { fontFamily: fontBold }]}>{day.count > 0 ? day.count : ''}</Text>
                  <View style={styles.chartBarWrapper}>
                    <View style={[
                      styles.chartBar,
                      { height: barHeight },
                      isToday ? styles.chartBarToday : day.count > 0 ? styles.chartBarDone : styles.chartBarEmpty,
                    ]} />
                  </View>
                  <Text style={[styles.chartDay, isToday && styles.chartDayToday, { fontFamily: isToday ? fontBold : fontMedium }]}>
                    {isToday ? 'Now' : dayLabel}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* ── Card 5: Per-game performance ── */}
        <View style={styles.analyticsCard}>
          <View style={styles.analyticsTitleRow}>
            <Icon size={38} source={require('../SVG_Icons/Monitor_Section/Controller.svg')} />
            <Text style={[styles.analyticsTitle, { fontFamily: fontMedium }]}>{tr('gamePerformance')}</Text>
          </View>
          {performance.map(({ labelKey, gameId }) => {
            const done = gamesCompleted.has(gameId);
            return (
              <View key={gameId} style={styles.performanceRow}>
                <Text style={[styles.performanceName, { fontFamily: fontMedium }]}>{tr(labelKey)}</Text>
                <View style={styles.progressTrack}>
                  <View style={[styles.progressFill, { width: done ? '100%' : '0%' }]} />
                </View>
                <Text style={[styles.percent, { fontFamily: fontBold }]}>{done ? '✓' : '—'}</Text>
              </View>
            );
          })}
        </View>

        {/* ── Card 6: Caregiver Notes ── */}
        <View style={styles.analyticsCard}>
          <Text style={[styles.cardTitle, { fontFamily: fontMedium }]}>{tr('caregiverNotes')}</Text>
          <Text style={[styles.notesHint, { fontFamily: fontMedium }]}>{tr('caregiverNotesHint')}</Text>
          <TextInput
            accessibilityLabel="Caregiver notes"
            multiline
            onChangeText={text => { setNotes(text); setNotesSaved(false); }}
            placeholder={tr('caregiverNotesPlaceholder')}
            placeholderTextColor="#B0A8A8"
            style={[styles.notesInput, { fontFamily: fontMedium }]}
            value={notes}
          />
          <Pressable
            accessibilityRole="button"
            onPress={saveNotes}
            style={({ pressed }) => [styles.notesSaveButton, notesSaved && styles.notesSavedButton, pressed && styles.pressed]}
          >
            <Text style={[styles.notesSaveText, { fontFamily: fontBold }]}>{notesSaved ? tr('saved') : tr('saveNotes')}</Text>
          </Pressable>
        </View>
      </ScrollView>

      <View style={styles.navigationBar}>
        <NavItem icon={require('../SVG_Icons/Home/Home.svg')} label={tr('navHome')} onPress={onHome} fontMedium={fontMedium} />
        <NavItem icon={require('../SVG_Icons/Home/Controller.svg')} label={tr('navGames')} onPress={onGames} fontMedium={fontMedium} />
        <NavItem icon={require('../SVG_Icons/Home/Voice.svg')} label={tr('navVoice')} onPress={onVoice} fontMedium={fontMedium} />
        <NavItem icon={require('../SVG_Icons/Home/Health_For_Monitor.svg')} label={tr('navMonitor')} fontMedium={fontMedium} />
      </View>

      <Modal animationType="fade" onRequestClose={() => setIconPickerId(null)} transparent visible={iconPickerId !== null}>
        <Pressable onPress={() => setIconPickerId(null)} style={styles.modalBackdrop}>
          <View style={styles.iconPicker}>
            <Text style={[styles.iconPickerTitle, { fontFamily: fontMedium }]}>Choose an icon</Text>
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

function NavItem({ icon, label, onPress, fontMedium }: { icon: SvgComponent; label: string; onPress?: () => void; fontMedium: string }) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={({ pressed }) => [styles.navItem, pressed && styles.pressed]}>
      <Icon size={34} source={icon} />
      <Text style={[styles.navLabel, { fontFamily: fontMedium }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { ...StyleSheet.absoluteFillObject, backgroundColor: '#F9F6F0', left: -27, right: -27 },
  content: { paddingBottom: 120, paddingHorizontal: 22, paddingTop: 30 },
  heading: { color: '#000', fontSize: 44 },
  reminderList: { gap: 14, marginTop: 16 },
  reminderCard: { alignItems: 'center', borderColor: 'rgba(0, 0, 0, 0.25)', borderRadius: 18, borderWidth: 1.5, flexDirection: 'row', height: 62, paddingHorizontal: 9 },
  iconButton: { alignItems: 'center', height: 46, justifyContent: 'center', width: 38 },
  reminderLabel: { color: '#000', flex: 1, fontSize: 15, marginLeft: 6, padding: 0 },
  plusButton: { alignItems: 'center', height: 48, justifyContent: 'center', width: 40 },
  timeButton: { alignItems: 'center', backgroundColor: '#E7EFE7', borderColor: '#2E7359', borderRadius: 10, borderWidth: 1, justifyContent: 'center', marginRight: 4, paddingHorizontal: 8, paddingVertical: 6 },
  timeButtonText: { color: '#2E7359', fontSize: 13 },
  iosPicker: { backgroundColor: '#F9F6F0', width: '100%' },
  iosPickerDone: { alignItems: 'center', backgroundColor: '#2E7359', borderRadius: 10, marginHorizontal: 22, marginTop: 4, paddingVertical: 10 },
  iosPickerDoneText: { color: '#FFF', fontSize: 16 },
  deleteButton: { alignItems: 'center', height: 48, justifyContent: 'center', marginLeft: 2, width: 32 },
  deleteText: { color: '#B85858', fontSize: 18 },
  addReminderButton: { alignItems: 'center', borderColor: '#2E7359', borderRadius: 12, borderWidth: 1, marginTop: 12, paddingVertical: 10 },
  addReminderText: { color: '#2E7359', fontSize: 16 },
  example: { color: '#786F6F', fontSize: 14, lineHeight: 19, marginTop: 16 },
  analyticsHeading: { color: '#000', fontSize: 40, marginTop: 20 },
  analyticsCard: { borderColor: 'rgba(0, 0, 0, 0.25)', borderRadius: 25, borderWidth: 2, marginTop: 14, padding: 18 },
  cardTitle: { color: '#000', fontSize: 20, marginBottom: 14 },
  cardSubtitle: { color: '#786F6F', fontSize: 13, marginBottom: 14, marginTop: -10 },

  // Summary card
  summaryRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' },
  summaryBlock: { alignItems: 'center', flex: 1 },
  summaryDivider: { width: 1, height: 80, backgroundColor: 'rgba(0,0,0,0.1)' },
  bigCircle: { alignItems: 'center', backgroundColor: '#E7EFE7', borderColor: '#2E7359', borderRadius: 40, borderWidth: 2, flexDirection: 'row', height: 72, justifyContent: 'center', width: 72 },
  bigCircleOrange: { backgroundColor: '#FFF3E0', borderColor: '#E0943A' },
  bigCircleBlue: { backgroundColor: '#E2EFF4', borderColor: '#3A7FA0' },
  bigCircleNumber: { color: '#000', fontSize: 28 },
  bigCircleOf: { color: '#786F6F', fontSize: 14, marginTop: 6 },
  summaryLabel: { color: '#786F6F', fontSize: 12, marginTop: 8, textAlign: 'center' },

  // Last active card
  lastActiveCard: { backgroundColor: '#F0F8F0' },
  lastActiveRow: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' },
  lastActiveValue: { color: '#2E7359', fontSize: 22, marginTop: 2 },
  activeDot: { backgroundColor: '#2E7359', borderRadius: 10, height: 20, width: 20 },

  // Reminders status card
  reminderStatusRow: { alignItems: 'baseline', flexDirection: 'row', gap: 10, marginBottom: 10 },
  reminderStatusFraction: { color: '#000', fontSize: 36 },
  reminderStatusTotal: { color: '#786F6F', fontSize: 22 },
  reminderStatusLabel: { color: '#786F6F', fontSize: 15 },

  // 7-day chart
  chartRow: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', height: 110 },
  chartColumn: { alignItems: 'center', flex: 1 },
  chartBarWrapper: { alignItems: 'center', justifyContent: 'flex-end', height: 86, width: '100%' },
  chartBar: { borderRadius: 6, width: '60%' },
  chartBarToday: { backgroundColor: '#2E7359' },
  chartBarDone: { backgroundColor: '#A8C9BC' },
  chartBarEmpty: { backgroundColor: '#E6E2DC', height: 6 },
  chartCount: { color: '#2E7359', fontSize: 11, marginBottom: 2 },
  chartDay: { color: '#786F6F', fontSize: 11, marginTop: 4 },
  chartDayToday: { color: '#2E7359' },

  // Per-game performance
  analyticsTitleRow: { alignItems: 'center', flexDirection: 'row', marginBottom: 12 },
  analyticsTitle: { color: '#000', fontSize: 20, marginLeft: 12 },
  performanceRow: { alignItems: 'center', flexDirection: 'row', height: 44 },
  performanceName: { color: '#000', fontSize: 14, width: 130 },
  progressTrack: { backgroundColor: '#E6E2DC', borderRadius: 14, flex: 1, height: 20, overflow: 'hidden' },
  progressFill: { backgroundColor: '#2E7359', borderRadius: 14, height: '100%', width: '100%' },
  percent: { color: '#2E7359', fontSize: 15, marginLeft: 8, width: 20 },

  // Caregiver notes
  notesHint: { color: '#786F6F', fontSize: 13, lineHeight: 19, marginBottom: 12, marginTop: -8 },
  notesInput: { backgroundColor: '#F5F2EC', borderColor: 'rgba(0,0,0,0.15)', borderRadius: 14, borderWidth: 1.5, color: '#000', fontSize: 15, lineHeight: 22, minHeight: 110, padding: 14, textAlignVertical: 'top' },
  notesSaveButton: { alignItems: 'center', backgroundColor: '#2E7359', borderRadius: 12, height: 46, justifyContent: 'center', marginTop: 12 },
  notesSavedButton: { backgroundColor: '#4A9E6B' },
  notesSaveText: { color: '#FFF', fontSize: 16 },

  // Nav
  navigationBar: { alignItems: 'center', backgroundColor: '#2E7359', borderRadius: 50, bottom: 20, flexDirection: 'row', height: 78, justifyContent: 'space-around', left: 22, position: 'absolute', right: 22, shadowColor: '#000', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.22, shadowRadius: 14, elevation: 12 },
  navItem: { alignItems: 'center', minWidth: 55 },
  navLabel: { color: '#FFF', fontSize: 11, marginTop: 2 },
  pressed: { opacity: 0.72 },

  // Modal
  modalBackdrop: { alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.38)', flex: 1, justifyContent: 'center', padding: 30 },
  iconPicker: { backgroundColor: '#F9F6F0', borderRadius: 20, padding: 22, width: '100%' },
  iconPickerTitle: { color: '#000', fontSize: 22, textAlign: 'center' },
  iconChoices: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 20 },
  iconChoice: { alignItems: 'center', borderColor: 'rgba(0, 0, 0, 0.15)', borderRadius: 14, borderWidth: 1, height: 70, justifyContent: 'center', width: 70 },
});
