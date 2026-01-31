-- Migration for username-only authentication
-- Run this in Supabase SQL Editor

-- 1. Add username column if not exists
alter table public.users add column if not exists username text unique;

-- 2. Create index for faster lookups
create unique index if not exists users_username_idx on public.users (username);

-- 3. Update existing users to have default usernames
update public.users 
set username = lower(regexp_replace(full_name, '[^a-zA-Z0-9]', '_', 'g'))
where username is null;

-- 4. Add email column to users table for fake email storage
alter table public.users add column if not exists email text;

-- 5. Update email with fake emails for existing users
update public.users 
set email = username || '@local.domain'
where email is null and username is not null;

-- 6. Add unique constraint on email
create unique index if not exists users_email_idx on public.users (email);

-- 7. Update RLS policy to allow username lookup
create policy "Allow username lookup for login"
on public.users
for select
using (auth.role() = 'authenticated');

-- 8. View current users
select u.id, u.full_name, u.username, u.email, r.role_name
from public.users u
join public.roles r on r.id = u.role_id;
