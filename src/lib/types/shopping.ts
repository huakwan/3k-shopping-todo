export const CATEGORIES = [
  { id: "meat", label: "เนื้อสัตว์", emoji: "🥩" },
  { id: "vegetable", label: "ผัก", emoji: "🥬" },
  { id: "fruit", label: "ผลไม้", emoji: "🍎" },
  { id: "beverage", label: "เครื่องดื่ม", emoji: "🥛" },
  { id: "frozen", label: "อาหารแช่แข็ง", emoji: "❄️" },
  { id: "bakery", label: "เบเกอรี่", emoji: "🍞" },
  { id: "dry_goods", label: "ของแห้ง", emoji: "🥫" },
  { id: "snack", label: "ขนม", emoji: "🍬" },
  { id: "seasoning", label: "เครื่องปรุง", emoji: "🧂" },
  { id: "household", label: "ของใช้ในบ้าน", emoji: "🧼" },
  { id: "personal_care", label: "ของใช้ส่วนตัว", emoji: "🧻" },
  { id: "other", label: "อื่นๆ", emoji: "📦" },
] as const;

export type CategoryId = (typeof CATEGORIES)[number]["id"];

export const UNITS = [
  "ชิ้น",
  "กล่อง",
  "แพ็ค",
  "ถุง",
  "ขวด",
  "กระป๋อง",
  "กก.",
  "กรัม",
  "ลิตร",
  "มล.",
  "ฟอง",
  "ลูก",
  "ห่อ",
  "มัด",
  "แผง",
] as const;

export interface ShoppingItem {
  id: string;
  user_id: string;
  name: string;
  quantity: number;
  unit: string;
  category: CategoryId;
  note: string | null;
  is_purchased: boolean;
  created_at: string;
  updated_at: string;
}

export type NewShoppingItem = Pick<
  ShoppingItem,
  "name" | "quantity" | "unit" | "category" | "note"
>;

export type SortOption =
  "created_desc" | "created_asc" | "name_asc" | "category_asc";

export type FilterStatus = "all" | "pending" | "purchased";

export interface ToastMessage {
  id: number;
  type: "success" | "error" | "info";
  message: string;
}
