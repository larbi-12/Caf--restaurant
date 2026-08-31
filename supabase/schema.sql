-- ============================================================
-- Maison Noor — Supabase schema
-- Run this once in Supabase Dashboard → SQL Editor (or via CLI).
-- Safe to re-run: uses IF NOT EXISTS / DROP POLICY IF EXISTS guards.
-- ============================================================

create extension if not exists "pgcrypto";

-- ------------------------------------------------------------
-- updated_at trigger helper
-- ------------------------------------------------------------
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- ------------------------------------------------------------
-- admin_users — whitelist of emails allowed to manage the site.
-- Add the owner's Gmail address here after they've logged in once.
-- ------------------------------------------------------------
create table if not exists admin_users (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  full_name text,
  created_at timestamptz not null default now()
);

create or replace function is_admin()
returns boolean as $$
  select exists (
    select 1 from admin_users
    where email = (auth.jwt() ->> 'email')
  );
$$ language sql stable security definer;

-- ------------------------------------------------------------
-- restaurant_settings — single row (id = 1)
-- ------------------------------------------------------------
create table if not exists restaurant_settings (
  id int primary key default 1,
  restaurant_name text not null default 'Maison Noor',
  logo_url text,
  favicon_url text,
  tagline text,
  description text,
  phone text,
  email text,
  whatsapp text,
  address text,
  city text,
  country text,
  google_maps_url text,
  instagram_url text,
  facebook_url text,
  tiktok_url text,
  opening_hours jsonb not null default '[]'::jsonb,
  hero_title text,
  hero_subtitle text,
  hero_description text,
  hero_image_url text,
  cta_text text,
  cta_link text,
  primary_color text default '#14110f',
  secondary_color text default '#b08a4e',
  updated_at timestamptz not null default now(),
  constraint single_row check (id = 1)
);

drop trigger if exists trg_restaurant_settings_updated on restaurant_settings;
create trigger trg_restaurant_settings_updated
  before update on restaurant_settings
  for each row execute function set_updated_at();

-- ------------------------------------------------------------
-- menu_categories
-- ------------------------------------------------------------
create table if not exists menu_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  description text,
  image_url text,
  display_order int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists trg_menu_categories_updated on menu_categories;
create trigger trg_menu_categories_updated
  before update on menu_categories
  for each row execute function set_updated_at();

-- ------------------------------------------------------------
-- menu_items
-- ------------------------------------------------------------
create table if not exists menu_items (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references menu_categories(id) on delete set null,
  name text not null,
  slug text unique not null,
  description text,
  long_description text,
  price numeric(10, 2) not null default 0,
  image_url text,
  ingredients text[] not null default '{}',
  allergens text[] not null default '{}',
  is_featured boolean not null default false,
  is_available boolean not null default true,
  display_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_menu_items_category on menu_items(category_id);

drop trigger if exists trg_menu_items_updated on menu_items;
create trigger trg_menu_items_updated
  before update on menu_items
  for each row execute function set_updated_at();

-- ------------------------------------------------------------
-- experiences
-- ------------------------------------------------------------
create table if not exists experiences (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  description text,
  long_description text,
  image_url text,
  gallery_urls text[] not null default '{}',
  price text,
  duration text,
  capacity text,
  included text[] not null default '{}',
  hours text,
  faq jsonb not null default '[]'::jsonb,
  is_active boolean not null default true,
  display_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists trg_experiences_updated on experiences;
create trigger trg_experiences_updated
  before update on experiences
  for each row execute function set_updated_at();

-- ------------------------------------------------------------
-- events
-- ------------------------------------------------------------
create table if not exists events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  description text,
  content text,
  image_url text,
  event_date date not null,
  event_time text,
  price text,
  capacity text,
  location text,
  program text[] not null default '{}',
  menu_special text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_events_date on events(event_date);

drop trigger if exists trg_events_updated on events;
create trigger trg_events_updated
  before update on events
  for each row execute function set_updated_at();

-- ------------------------------------------------------------
-- gallery
-- ------------------------------------------------------------
create table if not exists gallery (
  id uuid primary key default gen_random_uuid(),
  title text,
  image_url text not null,
  category text,
  display_order int not null default 0,
  is_featured boolean not null default false,
  created_at timestamptz not null default now()
);

-- ------------------------------------------------------------
-- articles
-- ------------------------------------------------------------
create table if not exists articles (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  subtitle text,
  excerpt text,
  content text,
  cover_image_url text,
  category text,
  author text,
  published_at timestamptz,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists trg_articles_updated on articles;
create trigger trg_articles_updated
  before update on articles
  for each row execute function set_updated_at();

-- ------------------------------------------------------------
-- testimonials
-- ------------------------------------------------------------
create table if not exists testimonials (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text,
  avatar_url text,
  rating int not null default 5 check (rating between 1 and 5),
  content text not null,
  is_published boolean not null default true,
  display_order int not null default 0,
  created_at timestamptz not null default now()
);

-- ------------------------------------------------------------
-- faqs
-- ------------------------------------------------------------
create table if not exists faqs (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  answer text not null,
  category text default 'general',
  display_order int not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now()
);

-- ------------------------------------------------------------
-- statistics
-- ------------------------------------------------------------
create table if not exists statistics (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  value numeric not null default 0,
  suffix text default '',
  icon text,
  display_order int not null default 0,
  is_active boolean not null default true
);

-- ------------------------------------------------------------
-- reservations
-- ------------------------------------------------------------
create table if not exists reservations (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null,
  phone text not null,
  email text not null,
  reservation_date date not null,
  reservation_time text not null,
  guests int not null default 2,
  occasion text,
  message text,
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'cancelled', 'completed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_reservations_date on reservations(reservation_date);
create index if not exists idx_reservations_status on reservations(status);

drop trigger if exists trg_reservations_updated on reservations;
create trigger trg_reservations_updated
  before update on reservations
  for each row execute function set_updated_at();

-- ------------------------------------------------------------
-- contact_messages
-- ------------------------------------------------------------
create table if not exists contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  subject text,
  message text not null,
  status text not null default 'new' check (status in ('new', 'read', 'replied', 'archived')),
  created_at timestamptz not null default now()
);

create index if not exists idx_contact_messages_status on contact_messages(status);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

alter table admin_users enable row level security;
alter table restaurant_settings enable row level security;
alter table menu_categories enable row level security;
alter table menu_items enable row level security;
alter table experiences enable row level security;
alter table events enable row level security;
alter table gallery enable row level security;
alter table articles enable row level security;
alter table testimonials enable row level security;
alter table faqs enable row level security;
alter table statistics enable row level security;
alter table reservations enable row level security;
alter table contact_messages enable row level security;

-- admin_users: only admins can read the list; nobody writes via API (managed via SQL editor).
drop policy if exists "admin_users_select_admin" on admin_users;
create policy "admin_users_select_admin" on admin_users for select using (is_admin());

-- restaurant_settings: public read, admin write
drop policy if exists "settings_public_read" on restaurant_settings;
create policy "settings_public_read" on restaurant_settings for select using (true);
drop policy if exists "settings_admin_write" on restaurant_settings;
create policy "settings_admin_write" on restaurant_settings for all using (is_admin()) with check (is_admin());

-- menu_categories: public reads active rows, admin full access
drop policy if exists "categories_public_read" on menu_categories;
create policy "categories_public_read" on menu_categories for select using (is_active = true or is_admin());
drop policy if exists "categories_admin_write" on menu_categories;
create policy "categories_admin_write" on menu_categories for all using (is_admin()) with check (is_admin());

-- menu_items
drop policy if exists "menu_items_public_read" on menu_items;
create policy "menu_items_public_read" on menu_items for select using (is_available = true or is_admin());
drop policy if exists "menu_items_admin_write" on menu_items;
create policy "menu_items_admin_write" on menu_items for all using (is_admin()) with check (is_admin());

-- experiences
drop policy if exists "experiences_public_read" on experiences;
create policy "experiences_public_read" on experiences for select using (is_active = true or is_admin());
drop policy if exists "experiences_admin_write" on experiences;
create policy "experiences_admin_write" on experiences for all using (is_admin()) with check (is_admin());

-- events
drop policy if exists "events_public_read" on events;
create policy "events_public_read" on events for select using (is_active = true or is_admin());
drop policy if exists "events_admin_write" on events;
create policy "events_admin_write" on events for all using (is_admin()) with check (is_admin());

-- gallery
drop policy if exists "gallery_public_read" on gallery;
create policy "gallery_public_read" on gallery for select using (true);
drop policy if exists "gallery_admin_write" on gallery;
create policy "gallery_admin_write" on gallery for all using (is_admin()) with check (is_admin());

-- articles
drop policy if exists "articles_public_read" on articles;
create policy "articles_public_read" on articles for select using (is_published = true or is_admin());
drop policy if exists "articles_admin_write" on articles;
create policy "articles_admin_write" on articles for all using (is_admin()) with check (is_admin());

-- testimonials
drop policy if exists "testimonials_public_read" on testimonials;
create policy "testimonials_public_read" on testimonials for select using (is_published = true or is_admin());
drop policy if exists "testimonials_admin_write" on testimonials;
create policy "testimonials_admin_write" on testimonials for all using (is_admin()) with check (is_admin());

-- faqs
drop policy if exists "faqs_public_read" on faqs;
create policy "faqs_public_read" on faqs for select using (is_published = true or is_admin());
drop policy if exists "faqs_admin_write" on faqs;
create policy "faqs_admin_write" on faqs for all using (is_admin()) with check (is_admin());

-- statistics
drop policy if exists "statistics_public_read" on statistics;
create policy "statistics_public_read" on statistics for select using (is_active = true or is_admin());
drop policy if exists "statistics_admin_write" on statistics;
create policy "statistics_admin_write" on statistics for all using (is_admin()) with check (is_admin());

-- reservations: anyone can INSERT (public booking form), only admins can read/update/delete
drop policy if exists "reservations_public_insert" on reservations;
create policy "reservations_public_insert" on reservations for insert to anon, authenticated with check (true);
drop policy if exists "reservations_admin_read" on reservations;
create policy "reservations_admin_read" on reservations for select using (is_admin());
drop policy if exists "reservations_admin_update" on reservations;
create policy "reservations_admin_update" on reservations for update using (is_admin()) with check (is_admin());
drop policy if exists "reservations_admin_delete" on reservations;
create policy "reservations_admin_delete" on reservations for delete using (is_admin());

-- contact_messages: anyone can INSERT (public contact form), only admins can read/update/delete
drop policy if exists "contact_messages_public_insert" on contact_messages;
create policy "contact_messages_public_insert" on contact_messages for insert to anon, authenticated with check (true);
drop policy if exists "contact_messages_admin_read" on contact_messages;
create policy "contact_messages_admin_read" on contact_messages for select using (is_admin());
drop policy if exists "contact_messages_admin_update" on contact_messages;
create policy "contact_messages_admin_update" on contact_messages for update using (is_admin()) with check (is_admin());
drop policy if exists "contact_messages_admin_delete" on contact_messages;
create policy "contact_messages_admin_delete" on contact_messages for delete using (is_admin());

-- ============================================================
-- REALTIME
-- ============================================================
alter publication supabase_realtime add table reservations;

-- ============================================================
-- STORAGE BUCKETS
-- ============================================================
insert into storage.buckets (id, name, public)
values
  ('restaurant', 'restaurant', true),
  ('menu', 'menu', true),
  ('gallery', 'gallery', true),
  ('events', 'events', true),
  ('articles', 'articles', true),
  ('testimonials', 'testimonials', true),
  ('experiences', 'experiences', true)
on conflict (id) do nothing;

-- Public read on all bucket objects, admin-only write/delete.
drop policy if exists "storage_public_read" on storage.objects;
create policy "storage_public_read" on storage.objects for select
  using (bucket_id in ('restaurant','menu','gallery','events','articles','testimonials','experiences'));

drop policy if exists "storage_admin_insert" on storage.objects;
create policy "storage_admin_insert" on storage.objects for insert
  with check (
    bucket_id in ('restaurant','menu','gallery','events','articles','testimonials','experiences')
    and is_admin()
  );

drop policy if exists "storage_admin_update" on storage.objects;
create policy "storage_admin_update" on storage.objects for update
  using (
    bucket_id in ('restaurant','menu','gallery','events','articles','testimonials','experiences')
    and is_admin()
  );

drop policy if exists "storage_admin_delete" on storage.objects;
create policy "storage_admin_delete" on storage.objects for delete
  using (
    bucket_id in ('restaurant','menu','gallery','events','articles','testimonials','experiences')
    and is_admin()
  );

-- ============================================================
-- Ensure a settings row always exists
-- ============================================================
insert into restaurant_settings (id) values (1) on conflict (id) do nothing;
