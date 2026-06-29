import { createClient } from "@supabase/supabase-js";
import {
  PUBLIC_SUPABASE_URL,
  PUBLIC_SUPABASE_ANON_KEY,
} from "$env/static/public";
import type { Database } from "./database.types";

if (!PUBLIC_SUPABASE_URL || !PUBLIC_SUPABASE_ANON_KEY) {
  console.warn(
    "⚠️ ไม่พบค่า PUBLIC_SUPABASE_URL หรือ PUBLIC_SUPABASE_ANON_KEY กรุณาตั้งค่าในไฟล์ .env (ดูตัวอย่างใน .env.example)",
  );
}

export const supabase = createClient<Database>(
  PUBLIC_SUPABASE_URL ?? "",
  PUBLIC_SUPABASE_ANON_KEY ?? "",
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      // ใช้ anonymous sign-in สำหรับแอปนี้ (ดู +layout.svelte)
      detectSessionInUrl: false,
    },
    realtime: {
      params: {
        eventsPerSecond: 10,
      },
    },
  },
);
