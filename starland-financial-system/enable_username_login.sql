-- Run this in Supabase SQL Editor to enable username login

-- 1. Add username column to users table
alter table public.users add column if not exists username text unique;

-- 2. Create index for faster lookups
create unique index if not exists users_username_idx on public.users (username);

-- 3. Update existing users to have a default username (customize as needed)
update public.users 
set username = lower(regexp_replace(full_name, '[^a-zA-Z0-9]', '_', 'g'))
where username is null;

-- 4. Add RLS policy to allow username lookup during login
create policy "Allow username lookup for login"
on public.users
for select
using (auth.role() = 'authenticated');

-- 5. Optional: View current users and usernames
select u.id, u.full_name, u.username, u.email, r.role_name
from public.users u
join public.roles r on r.id = u.role_id;
