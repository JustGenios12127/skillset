export type PriceType = "negotiable" | "fixed";

export interface Category {
  id: string;
  name: string;
  created_at: string;
}

export interface Product {
  id: string;
  title: string;
  description: string | null;
  price_type: PriceType;
  price: number | null;
  currency: string;
  category_id: string | null;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export type ProductInsert = Omit<Product, "id" | "created_at" | "updated_at">;
export type ProductUpdate = Partial<ProductInsert>;
