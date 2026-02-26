import type { Category, Product } from "@/types/catalog";

export interface CategoryGroup {
  id: string | null;
  name: string;
  sort_order: number;
  products: Product[];
}

export function formatPrice(p: Product): string {
  if (p.price_type === "negotiable") return "По договорённости";
  return `${p.price?.toLocaleString("ru-RU") ?? "—"} ${p.currency}`;
}

export function pluralProducts(count: number): string {
  const mod10 = count % 10;
  const mod100 = count % 100;
  if (mod10 === 1 && mod100 !== 11) return `${count} позиция`;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20))
    return `${count} позиции`;
  return `${count} позиций`;
}

export function groupProductsByCategory(
  products: Product[],
  categories: Category[]
): CategoryGroup[] {
  const sorted = [...products].sort(
    (a, b) =>
      a.sort_order - b.sort_order || a.created_at.localeCompare(b.created_at)
  );

  // categories arrive pre-sorted by sort_order from the service
  const groups: CategoryGroup[] = categories
    .map((cat) => ({
      id: cat.id,
      name: cat.name,
      sort_order: cat.sort_order,
      products: sorted.filter((p) => p.category_id === cat.id),
    }))
    .filter((g) => g.products.length > 0);

  const uncategorized = sorted.filter((p) => !p.category_id);
  if (uncategorized.length > 0) {
    groups.push({
      id: null,
      name: "Без категории",
      sort_order: 9999,
      products: uncategorized,
    });
  }

  return groups;
}

export function groupKey(id: string | null): string {
  return id ?? "uncategorized";
}
