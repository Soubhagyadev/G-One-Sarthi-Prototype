import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('g-one-sarthi.db');

db.execSync(`
  CREATE TABLE IF NOT EXISTS kv_store (
    key TEXT PRIMARY KEY NOT NULL,
    value TEXT NOT NULL
  );
`);

export async function setItem(key: string, value: string): Promise<void> {
  await db.runAsync(
    `INSERT INTO kv_store (key, value)
     VALUES (?, ?)
     ON CONFLICT(key) DO UPDATE SET value = excluded.value;`,
    [key, value],
  );
}

export async function getItem(key: string): Promise<string | null> {
  const result = await db.getFirstAsync<{ value: string }>(
    'SELECT value FROM kv_store WHERE key = ? LIMIT 1',
    [key],
  );
  return result?.value ?? null;
}

export async function multiGet(keys: string[]): Promise<Array<[string, string | null]>> {
  if (keys.length === 0) return [];

  const placeholders = keys.map(() => '?').join(', ');
  const rows = await db.getAllAsync<{ key: string; value: string }>(
    `SELECT key, value FROM kv_store WHERE key IN (${placeholders})`,
    keys,
  );

  const byKey = new Map(rows.map((row) => [row.key, row.value]));
  return keys.map((key) => [key, byKey.get(key) ?? null]);
}

export async function multiSet(entries: Array<[string, string]>): Promise<void> {
  if (entries.length === 0) return;

  await Promise.all(
    entries.map(([key, value]) => setItem(key, value)),
  );
}

export async function removeItem(key: string): Promise<void> {
  await db.runAsync('DELETE FROM kv_store WHERE key = ?', [key]);
}

export async function migrateLegacyAsyncStorage(): Promise<void> {
  const legacyKeys = [
    'streakCount',
    'streakLastDate',
    'gamesCompletedDate',
    'gamesCompletedList',
    'dismissedRemindersDate',
    'dismissedRemindersList',
    'lastActive',
    'weeklyHistory',
    'caregiverNotes_',
    'language',
    'patientName',
    'reminders',
  ];

  const values = await AsyncStorage.multiGet(legacyKeys);

  for (const [key, value] of values) {
    if (key && value !== null) {
      await setItem(key, value);
    }
  }

  const noteKeys = await AsyncStorage.getAllKeys();
  for (const key of noteKeys) {
    if (key.startsWith('caregiverNotes_')) {
      const value = await AsyncStorage.getItem(key);
      if (value !== null) {
        await setItem(key, value);
      }
    }
  }
}
