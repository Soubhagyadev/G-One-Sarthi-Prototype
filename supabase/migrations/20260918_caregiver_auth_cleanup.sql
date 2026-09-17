create extension if not exists pgcrypto;

drop trigger if exists patient_data_touch_updated_at on public.patient_data;
drop trigger if exists sync_queue_touch_updated_at on public.sync_queue;

create or replace function public.touch_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger patient_data_touch_updated_at
before update on public.patient_data
for each row
execute function public.touch_updated_at();

create trigger sync_queue_touch_updated_at
before update on public.sync_queue
for each row
execute function public.touch_updated_at();

create table if not exists public.caregivers (
  id uuid primary key,
  email text unique not null,
  full_name text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.patient_profiles (
  id uuid primary key default gen_random_uuid(),
  name text not null default 'Patient',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.caregiver_patient_links (
  id uuid primary key default gen_random_uuid(),
  caregiver_id uuid not null references public.caregivers(id) on delete cascade,
  patient_id uuid not null references public.patient_profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (caregiver_id, patient_id)
);

create trigger caregivers_touch_updated_at
before update on public.caregivers
for each row
execute function public.touch_updated_at();

create trigger patient_profiles_touch_updated_at
before update on public.patient_profiles
for each row
execute function public.touch_updated_at();

alter table public.caregivers enable row level security;
alter table public.patient_profiles enable row level security;
alter table public.caregiver_patient_links enable row level security;

drop policy if exists "Caregivers can read own profile" on public.caregivers;
drop policy if exists "Caregivers can upsert own profile" on public.caregivers;
drop policy if exists "Caregivers can update own profile" on public.caregivers;
drop policy if exists "Caregivers can read linked patients" on public.patient_profiles;
drop policy if exists "Caregivers can add patient links" on public.caregiver_patient_links;
drop policy if exists "Caregivers can read their links" on public.caregiver_patient_links;

create policy "Caregivers can read own profile"
on public.caregivers
for select
using (auth.uid() = id);

create policy "Caregivers can upsert own profile"
on public.caregivers
for insert
with check (auth.uid() = id);

create policy "Caregivers can update own profile"
on public.caregivers
for update
using (auth.uid() = id)
with check (auth.uid() = id);

create policy "Caregivers can read linked patients"
on public.patient_profiles
for select
using (
  exists (
    select 1
    from public.caregiver_patient_links cpl
    where cpl.patient_id = patient_profiles.id
      and cpl.caregiver_id = auth.uid()
  )
);

create policy "Caregivers can add patient links"
on public.caregiver_patient_links
for insert
with check (caregiver_id = auth.uid());

create policy "Caregivers can read their links"
on public.caregiver_patient_links
for select
using (caregiver_id = auth.uid());