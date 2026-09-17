import { getItem } from './storage';
import { supabase } from './supabaseClient';

export const PATIENT_ID = 'demo-patient';
export const DEVICE_ID = 'device-local';

async function getPatientId(): Promise<string> {
  return (await getItem('patientId')) || PATIENT_ID;
}

export async function enqueueSync(
  entityId: string,
  value: unknown,
  action: 'insert' | 'update' | 'delete' = 'update',
): Promise<boolean> {
  if (!supabase) return false;

  const patientId = await getPatientId();

  const { error } = await supabase.from('sync_queue').insert({
    patient_id: patientId,
    device_id: DEVICE_ID,
    entity_type: 'patient_state',
    entity_id: entityId,
    action,
    payload: { value },
    status: 'pending',
  });

  return !error;
}

export async function savePatientState(key: string, value: unknown): Promise<boolean> {
  if (!supabase) return false;

  const patientId = await getPatientId();

  const { data: existingRows, error: selectError } = await supabase
    .from('patient_data')
    .select('id')
    .eq('patient_id', patientId)
    .eq('key', key)
    .limit(1);

  if (selectError) {
    console.warn('Supabase patient_data select failed:', selectError.message);
    return false;
  }

  const payload = {
    patient_id: patientId,
    device_id: DEVICE_ID,
    key,
    value,
    updated_at: new Date().toISOString(),
  };

  if (existingRows && existingRows.length > 0) {
    const { error } = await supabase
      .from('patient_data')
      .update(payload)
      .eq('id', existingRows[0].id);

    if (!error) {
      await enqueueSync(key, value, 'update');
      return true;
    }

    console.warn('Supabase patient_data update failed:', error.message);
    return false;
  }

  const { error: insertError } = await supabase.from('patient_data').insert(payload);
  if (!insertError) {
    await enqueueSync(key, value, 'insert');
    return true;
  }

  console.warn('Supabase patient_data insert failed:', insertError.message);
  return false;
}

export async function syncPendingQueue(): Promise<boolean> {
  if (!supabase) return false;

  const patientId = await getPatientId();

  const { data, error } = await supabase
    .from('sync_queue')
    .select('*')
    .eq('patient_id', patientId)
    .eq('status', 'pending')
    .order('created_at', { ascending: true });

  if (error || !data) return false;

  for (const row of data) {
    if (row.payload && typeof row.payload === 'object' && 'value' in row.payload) {
      await savePatientState(String(row.entity_id), (row.payload as { value: unknown }).value);
    }

    await supabase
      .from('sync_queue')
      .update({ status: 'done', updated_at: new Date().toISOString() })
      .eq('id', row.id);
  }

  return true;
}
