export interface Database {
  public: {
    Tables: {
      shopping_items: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          quantity: number;
          unit: string;
          category: string;
          note: string | null;
          is_purchased: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string;
          name: string;
          quantity: number;
          unit: string;
          category: string;
          note?: string | null;
          is_purchased?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          quantity?: number;
          unit?: string;
          category?: string;
          note?: string | null;
          is_purchased?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
