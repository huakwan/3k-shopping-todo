# 🛍️ Shopping Todo List

เว็บแอปจัดการรายการซื้อของ สร้างด้วย **SvelteKit + TypeScript + Tailwind CSS + Supabase**
ดีไซน์สไตล์ Glassmorphism พื้นหลังไล่สีม่วง → ฟ้า รองรับ CRUD, Realtime sync และ Row Level Security

---

## ✨ ฟีเจอร์

- 🛒 เพิ่ม / แก้ไข / ลบ / ทำเครื่องหมายซื้อแล้ว ผ่าน Popup และ Card
- 🔍 ค้นหา, กรองตามหมวดหมู่ / สถานะ, เรียงลำดับ (ใหม่สุด, เก่าสุด, ชื่อ, หมวดหมู่)
- 🏷️ 12 หมวดหมู่: เนื้อสัตว์ ผัก ผลไม้ เครื่องดื่ม อาหารแช่แข็ง เบเกอรี่ ของแห้ง ขนม เครื่องปรุง ของใช้ในบ้าน ของใช้ส่วนตัว อื่นๆ
- ⚡ Realtime sync ข้ามอุปกรณ์/แท็บ ผ่าน Supabase Realtime
- 🔐 Row Level Security — ข้อมูลแต่ละผู้ใช้แยกจากกัน (ใช้ Anonymous Auth ไม่ต้องสมัครสมาชิก)
- 🔔 Toast notification, animation, responsive design (มือถือ/แท็บเล็ต/desktop)
- 🟣🔵 พื้นหลังไล่สีม่วง→ฟ้าแบบ Glassmorphism, ปุ่มหลักสีน้ำเงินขอบขาว, Floating Add Button

---

## 📁 โครงสร้างโปรเจกต์

```
shopping-todo/
├── src/
│   ├── lib/
│   │   ├── components/
│   │   │   ├── StatsHeader.svelte       # หัวข้อ + แถบ progress
│   │   │   ├── FilterBar.svelte         # Search / Filter / Sort
│   │   │   ├── ItemCard.svelte          # Card รายการสินค้า
│   │   │   ├── CategoryBadge.svelte     # ป้ายหมวดหมู่
│   │   │   ├── EmptyState.svelte        # หน้าจอไม่มีรายการ
│   │   │   ├── FloatingAddButton.svelte # ปุ่ม + ลอย
│   │   │   ├── ItemFormPopup.svelte     # Popup เพิ่ม/แก้ไขสินค้า
│   │   │   └── ToastContainer.svelte    # การแจ้งเตือน
│   │   ├── stores/
│   │   │   ├── shoppingStore.ts         # State, CRUD, Realtime subscription
│   │   │   └── toast.ts                 # Toast store
│   │   ├── supabase/
│   │   │   ├── client.ts                # Supabase client singleton
│   │   │   └── database.types.ts        # Type ของตาราง DB
│   │   └── types/
│   │       └── shopping.ts              # Types, หมวดหมู่, หน่วย
│   ├── routes/
│   │   ├── +layout.svelte               # Layout + พื้นหลัง gradient + anonymous auth
│   │   └── +page.svelte                 # หน้าหลัก
│   ├── app.css                          # Tailwind + glass utility classes
│   ├── app.d.ts
│   └── app.html
├── supabase/
│   └── schema.sql                       # SQL schema, RLS, Realtime, trigger
├── static/
│   └── favicon.svg
├── .env.example
├── tailwind.config.js
├── svelte.config.js
├── vite.config.ts
├── tsconfig.json
└── package.json
```

---

## 🚀 เริ่มต้นใช้งาน

### 1. ติดตั้ง dependencies

```bash
npm install
```

### 2. สร้างโปรเจกต์ Supabase

1. ไปที่ [supabase.com](https://supabase.com) → สร้างโปรเจกต์ใหม่
2. เปิด **SQL Editor** แล้วรันไฟล์ทั้งหมดใน `supabase/schema.sql`
   - สร้างตาราง `shopping_items`
   - เปิด Row Level Security + Policies (เห็น/แก้ไขได้แค่ข้อมูลของตัวเอง)
   - เปิด Realtime สำหรับตารางนี้
   - สร้าง trigger อัปเดต `updated_at` อัตโนมัติ
3. ไปที่ **Authentication → Sign In / Providers** → เปิด **Allow anonymous sign-ins**
   (แอปนี้ใช้ Anonymous Auth เพื่อให้ผู้ใช้เริ่มใช้งานได้ทันทีโดย RLS ยังแยกข้อมูลแต่ละคน)
4. ไปที่ **Settings → API** → คัดลอก `Project URL` และ `anon public key`

### 3. ตั้งค่า Environment Variables

```bash
cp .env.example .env
```

แก้ไขไฟล์ `.env`:

```
PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key
```

### 4. รันโปรเจกต์

```bash
npm run dev
```

เปิดเบราว์เซอร์ที่ `http://localhost:5173`

---

## 🗄️ โครงสร้างตาราง Supabase

ตาราง `shopping_items`:

| คอลัมน์        | ชนิด          | คำอธิบาย                              |
| -------------- | ------------- | -------------------------------------- |
| `id`           | `uuid`        | Primary key                            |
| `user_id`      | `uuid`        | อ้างอิง `auth.users.id`                |
| `name`         | `text`        | ชื่อสินค้า                             |
| `quantity`     | `numeric`     | จำนวน                                  |
| `unit`         | `text`        | หน่วย (ชิ้น, กล่อง, กก. ฯลฯ)            |
| `category`     | `text`        | หมวดหมู่ (12 ค่าที่กำหนดไว้)            |
| `note`         | `text`        | หมายเหตุ (nullable)                    |
| `is_purchased` | `boolean`     | สถานะซื้อแล้ว                          |
| `created_at`   | `timestamptz` | วันเวลาที่สร้าง                        |
| `updated_at`   | `timestamptz` | วันเวลาที่แก้ไขล่าสุด (auto by trigger) |

RLS เปิดใช้งานทั้ง 4 policy (select/insert/update/delete) โดยจำกัดด้วย `auth.uid() = user_id`
ดูรายละเอียดทั้งหมดใน [`supabase/schema.sql`](./supabase/schema.sql)

---

## 🛠️ เทคโนโลยีที่ใช้

| ส่วน         | เทคโนโลยี                                |
| ------------ | ----------------------------------------- |
| Framework    | SvelteKit 2 + Svelte 4                    |
| ภาษา         | TypeScript                                |
| Styling      | Tailwind CSS 3 (custom glass utilities)   |
| Backend      | Supabase (Postgres, Auth, Realtime)       |
| Auth         | Supabase Anonymous Sign-In                |
| Realtime     | `postgres_changes` ผ่าน Supabase Realtime |
| Hosting      | Vercel / Netlify / Cloudflare Pages       |

---

## ☁️ วิธี Deploy

### ตัวเลือก A: Vercel (แนะนำ)

1. Push โค้ดขึ้น GitHub
2. ไปที่ [vercel.com](https://vercel.com) → **New Project** → เลือก repo นี้
3. Vercel จะตรวจจับ SvelteKit อัตโนมัติ (ใช้ `@sveltejs/adapter-auto`)
4. ใส่ Environment Variables ในหน้า Project Settings → Environment Variables:
   - `PUBLIC_SUPABASE_URL`
   - `PUBLIC_SUPABASE_ANON_KEY`
5. กด **Deploy**

### ตัวเลือก B: Netlify

1. ติดตั้ง adapter: `npm install -D @sveltejs/adapter-netlify`
2. แก้ `svelte.config.js` ให้ import adapter จาก `@sveltejs/adapter-netlify` แทน
3. Push ขึ้น GitHub แล้วเชื่อมต่อกับ Netlify
4. ตั้งค่า Build command: `npm run build`, Publish directory: `build`
5. ใส่ Environment Variables ในหน้า Site settings → Environment variables

### ตัวเลือก C: Cloudflare Pages

1. ติดตั้ง adapter: `npm install -D @sveltejs/adapter-cloudflare`
2. แก้ `svelte.config.js` ให้ import adapter จาก `@sveltejs/adapter-cloudflare`
3. เชื่อมต่อ repo กับ Cloudflare Pages, Build command: `npm run build`, Output: `.svelte-kit/cloudflare`
4. ใส่ Environment Variables ในหน้า Pages project settings

> 💡 ไม่ว่าจะ deploy ที่ไหน ต้องตั้งค่า `PUBLIC_SUPABASE_URL` และ `PUBLIC_SUPABASE_ANON_KEY`
> เป็น Environment Variables บน hosting platform เสมอ — ห้าม commit ไฟล์ `.env` ขึ้น Git

---

## 📝 คำสั่งที่ใช้บ่อย

```bash
npm run dev       # รัน dev server
npm run build     # build สำหรับ production
npm run preview   # preview production build ในเครื่อง
npm run check     # ตรวจสอบ type ด้วย svelte-check
```
