create extension if not exists pgcrypto;

create table if not exists public.patient_data (
  id uuid primary key default gen_random_uuid(),
  patient_id text not null,
  device_id text,
  key text not null,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create index if not exists idx_patient_data_patient_key
  on public.patient_data (patient_id, key);

create index if not exists idx_patient_data_updated_at
  on public.patient_data (updated_at desc);

create table if not exists public.sync_queue (
  id uuid primary key default gen_random_uuid(),
  patient_id text not null,
  device_id text,
  entity_type text not null,
  entity_id text not null,
  action text not null check (action in ('insert', 'update', 'delete')),
  payload jsonb not null default '{}'::jsonb,
  status text not null default 'pending' check (status in ('pending', 'syncing', 'done', 'failed')),
  retry_count int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_sync_queue_patient_status
  on public.sync_queue (patient_id, status, created_at);

create index if not exists idx_sync_queue_entity
  on public.sync_queue (entity_type, entity_id);

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

alter table public.patient_data enable row level security;
alter table public.sync_queue enable row level security;

drop policy if exists "Patients can read their own data" on public.patient_data;
drop policy if exists "Patients can insert their own data" on public.patient_data;
drop policy if exists "Patients can update their own data" on public.patient_data;
drop policy if exists "Patients can delete their own data" on public.patient_data;
drop policy if exists "Patients can read their own sync queue" on public.sync_queue;
drop policy if exists "Patients can insert their own sync queue" on public.sync_queue;
drop policy if exists "Patients can update their own sync queue" on public.sync_queue;
drop policy if exists "Patients can delete their own sync queue" on public.sync_queue;

create policy "Patients can read their own data"
on public.patient_data
for select
using (true);

create policy "Patients can insert their own data"
on public.patient_data
for insert
with check (true);

create policy "Patients can update their own data"
on public.patient_data
for update
using (true)
with check (true);

create policy "Patients can delete their own data"
on public.patient_data
for delete
using (true);

create policy "Patients can read their own sync queue"
on public.sync_queue
for select
using (true);

create policy "Patients can insert their own sync queue"
on public.sync_queue
for insert
with check (true);

create policy "Patients can update their own sync queue"
on public.sync_queue
for update
using (true)
with check (true);

create policy "Patients can delete their own sync queue"
on public.sync_queue
for delete
using (true);
