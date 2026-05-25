-- ===========================================================================
-- ELV.GRADUATION — Migration: tambah dukungan video di portfolio
-- Menambah kolom `video` (URL ke file mp4) di tabel public.portfolio.
-- Jika diisi, frontend akan menampilkan <video> auto-play loop muted di grid
-- dan <video controls> di lightbox. Field `img` tetap dipakai sebagai poster.
--
-- Run in: Supabase Dashboard → SQL Editor → New query → paste → Run
-- ===========================================================================

alter table public.portfolio
  add column if not exists video text;
