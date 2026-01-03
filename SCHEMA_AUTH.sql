-- 1. Add user_id to table
alter table valet_cards 
add column user_id uuid references auth.users not null default auth.uid();

-- 2. Enable RLS
alter table valet_cards enable row level security;

-- 3. Create Policies
-- Allow users to insert their own cards
create policy "Enable insert for authenticated users only" 
on valet_cards for insert 
to authenticated 
with check (auth.uid() = user_id);

-- Allow users to view only their own cards
create policy "Enable select for users based on user_id" 
on valet_cards for select 
to authenticated 
using (auth.uid() = user_id);

-- Allow users to update only their own cards
create policy "Enable update for users based on user_id" 
on valet_cards for update 
to authenticated 
using (auth.uid() = user_id);

-- Allow users to delete only their own cards
create policy "Enable delete for users based on user_id" 
on valet_cards for delete 
to authenticated 
using (auth.uid() = user_id);
