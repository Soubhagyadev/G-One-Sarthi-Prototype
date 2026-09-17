alter table public.patient_profiles enable row level security;
alter table public.caregiver_patient_links enable row level security;

drop policy if exists "Caregivers can create patient profiles" on public.patient_profiles;
drop policy if exists "Caregivers can update linked patients" on public.patient_profiles;
drop policy if exists "Caregivers can update their links" on public.caregiver_patient_links;

create policy "Caregivers can create patient profiles"
on public.patient_profiles
for insert
with check (auth.uid() is not null);

create policy "Caregivers can update linked patients"
on public.patient_profiles
for update
using (
  exists (
    select 1
    from public.caregiver_patient_links cpl
    where cpl.patient_id = patient_profiles.id
      and cpl.caregiver_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.caregiver_patient_links cpl
    where cpl.patient_id = patient_profiles.id
      and cpl.caregiver_id = auth.uid()
  )
);

create policy "Caregivers can update their links"
on public.caregiver_patient_links
for update
using (caregiver_id = auth.uid())
with check (caregiver_id = auth.uid());
