-- ===========================================================================
-- ELV.GRADUATION — Supabase schema
-- Run in: Supabase Dashboard → SQL Editor → New query → paste → Run
-- ===========================================================================

-- Drop everything (safe to re-run during development) -----------------------
drop table if exists public.bookings           cascade;
drop table if exists public.nav_links          cascade;
drop table if exists public.marquee_items      cascade;
drop table if exists public.stats              cascade;
drop table if exists public.testimonials       cascade;
drop table if exists public.process_steps      cascade;
drop table if exists public.portfolio          cascade;
drop table if exists public.portfolio_categories cascade;
drop table if exists public.packages           cascade;
drop table if exists public.site_settings      cascade;

-- ===========================================================================
-- SITE SETTINGS  (singleton — id = 1)
-- ===========================================================================
create table public.site_settings (
  id                    smallint primary key default 1 check (id = 1),
  brand                 text   not null default 'ELV GRADUATION',
  whatsapp_phone        text   default '6281288880188',
  whatsapp_message      text   default 'Halo ELV, saya tertarik untuk booking sesi foto wisuda.',
  email                 text   default 'halo@elvgraduation.id',
  address_line1         text   default 'Jl. Jenderal Sudirman No. 88',
  address_line2         text   default 'Pekanbaru, Riau 28282',
  hours                 text   default 'Selasa – Minggu · 10.00 – 19.00 WIB',
  est                   text   default 'Est. 2018 · Pekanbaru',
  hero_bg               text   default 'https://images.unsplash.com/photo-1627556704290-2b1f5853ff78?auto=format&fit=crop&w=2200&q=80',
  about_img             text   default 'https://images.unsplash.com/photo-1606761568499-6d2451b23c66?auto=format&fit=crop&w=1400&q=80',
  hero_description      text   default 'ELV.GRADUATION adalah studio fotografi wisuda yang mengabadikan empat tahun perjuangan Anda dalam satu sore yang tak akan terulang. Cinematic, intim, dan dibuat untuk dipajang seumur hidup.',
  about_body            text   default 'Kami bukan studio besar. Kami tim enam orang — dua fotografer utama, satu videografer, dua asisten, satu MUA langganan — yang sengaja menerima maksimal empat klien wisuda per minggu. Kualitas hanya bisa terjaga dengan ritme yang lambat.',
  footer_tagline        text   default 'Studio fotografi wisuda berbasis di Pekanbaru, Riau. Mengabadikan satu sore yang tak terulang — sejak 2018.',
  copyright             text   default '© 2026 ELV.GRADUATION · PT Cahaya Akhir Studio',
  instagram_url         text   default '#',
  tiktok_url            text   default '#',
  youtube_url           text   default '#',
  updated_at            timestamptz not null default now()
);

insert into public.site_settings (id) values (1) on conflict (id) do nothing;

-- ===========================================================================
-- PACKAGES  (esensi / anggun / magnum)
-- ===========================================================================
create table public.packages (
  id          text primary key,
  name        text not null,
  italic      text default '',
  tagline     text,
  currency    text not null default 'IDR',
  amount      text not null,
  unit        text not null default 'k / sesi',
  featured    boolean not null default false,
  tag         text,
  features    text[] not null default '{}',
  position    int not null default 0,
  created_at  timestamptz not null default now()
);
create index packages_position_idx on public.packages (position);

-- ===========================================================================
-- PORTFOLIO + categories
-- ===========================================================================
create table public.portfolio_categories (
  key       text primary key,        -- semua / outdoor / studio / group / cinematic
  label     text not null,
  position  int not null default 0
);

create table public.portfolio (
  id          bigserial primary key,
  cat         text not null references public.portfolio_categories (key) on update cascade,
  title       text not null,
  sub         text,
  span        text not null default 's-3x4',   -- grid span class
  img         text not null,
  position    int not null default 0,
  created_at  timestamptz not null default now()
);
create index portfolio_position_idx on public.portfolio (position);
create index portfolio_cat_idx on public.portfolio (cat);

-- ===========================================================================
-- PROCESS STEPS
-- ===========================================================================
create table public.process_steps (
  id          bigserial primary key,
  n           text not null,         -- 01 / 02 …
  title       text not null,
  em          text not null,         -- italic display label
  body        text not null,
  position    int not null default 0
);
create index process_steps_position_idx on public.process_steps (position);

-- ===========================================================================
-- TESTIMONIALS
-- ===========================================================================
create table public.testimonials (
  id          bigserial primary key,
  quote       text not null,
  name        text not null,
  meta        text,
  initial     text,
  position    int not null default 0,
  created_at  timestamptz not null default now()
);
create index testimonials_position_idx on public.testimonials (position);

-- ===========================================================================
-- STATS
-- ===========================================================================
create table public.stats (
  id          bigserial primary key,
  n           text not null,         -- 480 / 12 / 7
  em          text default '',       -- + / "" / th
  l           text not null,         -- label
  position    int not null default 0
);
create index stats_position_idx on public.stats (position);

-- ===========================================================================
-- MARQUEE
-- ===========================================================================
create table public.marquee_items (
  id          bigserial primary key,
  text        text not null,
  position    int not null default 0
);
create index marquee_items_position_idx on public.marquee_items (position);

-- ===========================================================================
-- NAV LINKS
-- ===========================================================================
create table public.nav_links (
  id          bigserial primary key,
  label       text not null,
  href        text not null,
  position    int not null default 0
);
create index nav_links_position_idx on public.nav_links (position);

-- ===========================================================================
-- BOOKINGS  (form submissions)
-- ===========================================================================
create table public.bookings (
  id              bigserial primary key,
  name            text not null,
  email           text,
  phone           text,
  package_id      text references public.packages(id) on delete set null,
  session_date    date,
  campus          text,
  note            text,
  status          text not null default 'new',   -- new / contacted / scheduled / done / cancelled
  created_at      timestamptz not null default now()
);
create index bookings_created_idx on public.bookings (created_at desc);
create index bookings_status_idx  on public.bookings (status);

-- ===========================================================================
-- ROW LEVEL SECURITY
-- ===========================================================================
alter table public.site_settings        enable row level security;
alter table public.packages             enable row level security;
alter table public.portfolio            enable row level security;
alter table public.portfolio_categories enable row level security;
alter table public.process_steps        enable row level security;
alter table public.testimonials         enable row level security;
alter table public.stats                enable row level security;
alter table public.marquee_items        enable row level security;
alter table public.nav_links            enable row level security;
alter table public.bookings             enable row level security;

-- Public READ on content tables --------------------------------------------
do $$
declare t text;
begin
  for t in select unnest(array[
      'site_settings','packages','portfolio','portfolio_categories',
      'process_steps','testimonials','stats','marquee_items','nav_links'
    ])
  loop
    execute format(
      'create policy "%I read for everyone" on public.%I for select using (true);',
      t || '_read', t
    );
    execute format(
      'create policy "%I write authed"    on public.%I for all
         to authenticated using (true) with check (true);',
      t || '_write', t
    );
  end loop;
end $$;

-- Bookings: anyone can INSERT, only authenticated can SELECT/UPDATE/DELETE -
create policy "bookings_insert_anyone" on public.bookings
  for insert to anon, authenticated
  with check (true);

create policy "bookings_select_authed" on public.bookings
  for select to authenticated using (true);

create policy "bookings_update_authed" on public.bookings
  for update to authenticated using (true) with check (true);

create policy "bookings_delete_authed" on public.bookings
  for delete to authenticated using (true);

-- ===========================================================================
-- STORAGE BUCKET: images  (public read, authenticated write)
-- ===========================================================================
insert into storage.buckets (id, name, public)
values ('images', 'images', true)
on conflict (id) do update set public = true;

drop policy if exists "images_read_public" on storage.objects;
drop policy if exists "images_write_authed" on storage.objects;
drop policy if exists "images_update_authed" on storage.objects;
drop policy if exists "images_delete_authed" on storage.objects;

create policy "images_read_public"
  on storage.objects for select
  using (bucket_id = 'images');

create policy "images_write_authed"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'images');

create policy "images_update_authed"
  on storage.objects for update to authenticated
  using (bucket_id = 'images')
  with check (bucket_id = 'images');

create policy "images_delete_authed"
  on storage.objects for delete to authenticated
  using (bucket_id = 'images');

-- ===========================================================================
-- updated_at trigger for site_settings
-- ===========================================================================
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

drop trigger if exists site_settings_set_updated_at on public.site_settings;
create trigger site_settings_set_updated_at
  before update on public.site_settings
  for each row execute function public.set_updated_at();
