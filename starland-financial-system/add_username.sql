-- Add username column to users table
alter table public.users add column username text unique;

-- Create index for faster lookups
create unique index users_username_idx on public.users (username);

-- Optional: update existing users to have a default username (you can customize these)
update public.users set username = lower(replace(full_name, ' ', '_')) where username is null;
