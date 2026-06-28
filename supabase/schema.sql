-- =========================================================
-- Shopping Todo List — Supabase Schema
-- รันสคริปต์นี้ทั้งหมดใน Supabase Dashboard > SQL Editor
-- =========================================================

-- 1) เปิดใช้งาน extension ที่จำเป็น (มักเปิดอยู่แล้วโดย default)
create extension if not exists "uuid-ossp";

-- 2) สร้างตาราง shopping_items
create table if not exists public.shopping_items (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  name        text not null check (char_length(trim(name)) > 0),
  quantity    numeric not null default 1 check (quantity >= 0),
  unit        text not null default 'ชิ้น',
  category    text not null default 'other' check (
    category in (
      'meat', 'vegetable', 'fruit', 'beverage', 'frozen',
      'bakery', 'dry_goods', 'snack', 'seasoning',
      'household', 'personal_care', 'other'
    )
  ),
  note        text,
  is_purchased boolean not null default false,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- 3) Index สำหรับ query ที่ใช้บ่อย
create index if not exists shopping_items_user_id_idx on public.shopping_items(user_id);
create index if not exists shopping_items_created_at_idx on public.shopping_items(created_at desc);
create index if not exists shopping_items_category_idx on public.shopping_items(category);
create index if not exists shopping_items_is_purchased_idx on public.shopping_items(is_purchased);

-- 4) Trigger สำหรับอัปเดต updated_at อัตโนมัติ
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_shopping_items_updated_at on public.shopping_items;
create trigger set_shopping_items_updated_at
  before update on public.shopping_items
  for each row
  execute function public.set_updated_at();

-- 5) เปิดใช้งาน Row Level Security (RLS)
alter table public.shopping_items enable row level security;

-- 6) Policies: ผู้ใช้แต่ละคนเห็นและจัดการได้เฉพาะรายการของตัวเอง
drop policy if exists "select_own_items" on public.shopping_items;
create policy "select_own_items"
  on public.shopping_items
  for select
  using (auth.uid() = user_id);

drop policy if exists "insert_own_items" on public.shopping_items;
create policy "insert_own_items"
  on public.shopping_items
  for insert
  with check (auth.uid() = user_id);

drop policy if exists "update_own_items" on public.shopping_items;
create policy "update_own_items"
  on public.shopping_items
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "delete_own_items" on public.shopping_items;
create policy "delete_own_items"
  on public.shopping_items
  for delete
  using (auth.uid() = user_id);

-- 7) เปิดใช้งาน Realtime สำหรับตารางนี้
-- (ถ้า publication "supabase_realtime" ยังไม่มีตารางนี้ ให้รันคำสั่งนี้)
alter publication supabase_realtime add table public.shopping_items;

-- =========================================================
-- หมายเหตุสำคัญ: Anonymous Auth
-- =========================================================
-- แอปนี้ใช้ Supabase Anonymous Sign-In เพื่อให้ทุกคนใช้แอปได้ทันที
-- โดยไม่ต้องสมัครสมาชิก แต่ยังมี user_id แยกของแต่ละเบราว์เซอร์/อุปกรณ์
-- เพื่อให้ RLS แยกข้อมูลได้ถูกต้อง
--
-- วิธีเปิดใช้งาน:
-- ไปที่ Supabase Dashboard > Authentication > Sign In / Providers
-- เปิด toggle "Allow anonymous sign-ins"
--
-- หากต้องการให้ผู้ใช้ login ด้วยอีเมล/รหัสผ่านจริงในอนาคต สามารถใช้
-- supabase.auth.linkIdentity() เพื่อแปลง anonymous user เป็น user
-- ถาวรได้โดยไม่เสียข้อมูลเดิม
-- =========================================================

-- =========================================================
-- (ตัวเลือก) ข้อมูลตัวอย่างสำหรับทดสอบ
-- รันหลังจากที่มี user แล้ว (แทนที่ '<YOUR_USER_ID>' ด้วย uuid จริง)
-- =========================================================
-- insert into public.shopping_items (user_id, name, quantity, unit, category, note)
-- values
--   ('<YOUR_USER_ID>', 'นมสด UHT', 2, 'กล่อง', 'beverage', 'แบรนด์โฟร์โมสต์'),
--   ('<YOUR_USER_ID>', 'อกไก่', 1, 'กก.', 'meat', null),
--   ('<YOUR_USER_ID>', 'แอปเปิ้ลฟูจิ', 6, 'ลูก', 'fruit', null);
