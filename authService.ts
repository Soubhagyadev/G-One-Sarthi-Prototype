import * as AuthSession from 'expo-auth-session';
import Constants from 'expo-constants';
import * as WebBrowser from 'expo-web-browser';
import { getSupabaseClient } from './supabaseClient';
import { getItem, setItem } from './storage';

export type CaregiverSession = {
  userId: string;
  email: string | null;
  fullName: string | null;
  avatarUrl: string | null;
};

async function ensureCaregiverSession(user: { id: string; email?: string; user_metadata?: Record<string, unknown> }) {
  const supabase = getSupabaseClient();
  if (!supabase) {
    throw new Error('Supabase is not configured.');
  }

  const caregiver = {
    userId: user.id,
    email: user.email ?? null,
    fullName: (user.user_metadata?.full_name as string | undefined) ??
      (user.user_metadata?.name as string | undefined) ?? user.email ?? null,
    avatarUrl: (user.user_metadata?.avatar_url as string | undefined) ?? null,
  };

  const { error: upsertError } = await supabase.from('caregivers').upsert(
    {
      id: user.id,
      email: caregiver.email,
      full_name: caregiver.fullName,
      avatar_url: caregiver.avatarUrl,
    },
    { onConflict: 'id' },
  );
  if (upsertError) throw upsertError;

  const storedPatientId = await getItem('patientId');
  const patientId = storedPatientId || (await createPatientProfile(supabase, await getItem('patientName')));
  await setItem('patientId', patientId);

  const { error: linkError } = await supabase.from('caregiver_patient_links').upsert(
    { caregiver_id: user.id, patient_id: patientId },
    { onConflict: 'caregiver_id,patient_id' },
  );
  if (linkError) throw linkError;

  return caregiver;
}

export async function signInWithEmail(email: string, password: string): Promise<CaregiverSession> {
  const supabase = getSupabaseClient();
  if (!supabase) throw new Error('Supabase is not configured.');

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error || !data.user) throw error || new Error('Unable to log in with these details.');
  return ensureCaregiverSession(data.user);
}

export async function signUpWithEmail(email: string, password: string): Promise<boolean> {
  const supabase = getSupabaseClient();
  if (!supabase) throw new Error('Supabase is not configured.');

  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) throw error;
  if (!data.user) throw new Error('Unable to create the caregiver account.');
  if (!data.session) return false;
  await ensureCaregiverSession(data.user);
  return true;
}

export async function signInWithGoogle(): Promise<CaregiverSession> {
  const supabase = getSupabaseClient();
  if (!supabase) {
    throw new Error('Supabase is not configured. Add the URL and anon key to the app config or environment variables.');
  }

  const redirectTo = Constants.appOwnership === 'expo'
    ? AuthSession.makeRedirectUri({ path: 'auth/callback' })
    : AuthSession.makeRedirectUri({ scheme: 'gonesarthi', path: 'auth/callback' });

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
    },
  });

  if (error) {
    throw error;
  }

  if (!data.url) {
    throw new Error('Google sign-in did not return a valid redirect URL.');
  }

  const authResult = await WebBrowser.openAuthSessionAsync(data.url, redirectTo);

  if (authResult.type !== 'success') {
    throw new Error('Google sign-in was cancelled or failed.');
  }

  const code = authResult.url.match(/[?&]code=([^&]+)/)?.[1];
  let sessionData;
  let sessionError;

  if (code) {
    ({ data: sessionData, error: sessionError } = await supabase.auth.exchangeCodeForSession(
      decodeURIComponent(code),
    ));
  } else {
    const accessToken = authResult.url.match(/[#?&]access_token=([^&]+)/)?.[1];
    const refreshToken = authResult.url.match(/[#?&]refresh_token=([^&]+)/)?.[1];
    if (!accessToken || !refreshToken) {
      throw new Error('Google sign-in did not return a valid session. Check the Supabase redirect URL configuration.');
    }
    ({ data: sessionData, error: sessionError } = await supabase.auth.setSession({
      access_token: decodeURIComponent(accessToken),
      refresh_token: decodeURIComponent(refreshToken),
    }));
  }
  if (sessionError) {
    throw sessionError;
  }

  const user = sessionData.session?.user;
  if (!user || !user.id) {
    throw new Error('Google sign-in completed, but no user session was returned.');
  }

  return ensureCaregiverSession(user);
}

async function createPatientProfile(supabase: NonNullable<ReturnType<typeof getSupabaseClient>>, name: string | null) {
  const { data, error } = await supabase
    .from('patient_profiles')
    .insert({ name: name?.trim() || 'Patient' })
    .select('id')
    .single();

  if (error || !data) {
    throw error || new Error('Unable to create the patient profile.');
  }

  return data.id as string;
}