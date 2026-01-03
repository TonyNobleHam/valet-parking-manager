-- Run this query in your Supabase SQL Editor

create table valet_cards (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  card_name text not null,
  monthly_limit integer not null default 0,
  remaining_count integer not null default 0,
  hotels jsonb default '[]'::jsonb
);

-- Turn on Row Level Security (RLS) is generally recommended, 
-- but for this simple synced app we can start with public access 
-- OR create a policy.
-- For simplicity in this demo, we will disable RLS or create a public policy.

alter table valet_cards enable row level security;

create policy "Enable all access for all users" on valet_cards
  for all using (true) with check (true);
