-- ==========================================================
-- เปลี่ยน RLS ของตาราง shopping_items
-- จาก "แต่ละคนเห็นแค่ของตัวเอง (auth.uid() = user_id)"
-- เป็น "ทุกคนเห็น/แก้ไขข้อมูลร่วมกันหมด" (ใช้ PIN เดียวกั้นแทน)
-- ==========================================================
-- 1) ลบ policy เดิม (ชื่อตรงกับใน schema จริงของโปรเจกต์)
drop policy if exists "select_own_items" on public.shopping_items;

drop policy if exists "insert_own_items" on public.shopping_items;

drop policy if exists "update_own_items" on public.shopping_items;

drop policy if exists "delete_own_items" on public.shopping_items;

-- 2) สร้าง policy ใหม่ ให้ทุก authenticated user (รวม anonymous sign-in) เข้าถึงข้อมูลร่วมกันได้หมด
create policy "select_all_items" on public.shopping_items for
select
    to authenticated using (true);

create policy "insert_shared_items" on public.shopping_items for insert to authenticated
with
    check (true);

create policy "update_all_items" on public.shopping_items for
update to authenticated using (true)
with
    check (true);

create policy "delete_all_items" on public.shopping_items for delete to authenticated using (true);

-- 3) RLS ต้องยังเปิดอยู่ (เปิดไว้แล้ว ไม่ต้องปิด — ปิดจะอันตรายกว่าเพราะเปิดให้ทุกคนแม้ไม่ login เข้าถึงได้)
alter table public.shopping_items enable row level security;

-- ==========================================================
-- หมายเหตุ: คอลัมน์ user_id ในตารางยังเก็บไว้เหมือนเดิมได้
-- (ไม่ลบออก เผื่ออยากย้อนกลับไปแยกข้อมูลทีหลัง) แค่ policy
-- ไม่ใช้มันกรองแล้วเท่านั้น ทุก user ที่ผ่าน anonymous sign-in
-- (คือทุกคนที่ผ่านหน้า PIN gate) จะเห็นและแก้ไขรายการเดียวกันหมด
-- ==========================================================