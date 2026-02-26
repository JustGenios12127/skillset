import { ChevronDown, ChevronUp, Plus } from "lucide-react";
import type { Product } from "@/types/catalog";
import type { CategoryGroup } from "./utils/catalogUtils";
import { ProductRow } from "./ProductRow";

export interface CategorySectionProps {
  group: CategoryGroup;
  isCollapsed: boolean;
  movingSaving: boolean;
  onToggleCollapse: () => void;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
  onDuplicate: (product: Product) => void;
  onToggleActive: (product: Product) => void;
  onMove: (productId: string, direction: "up" | "down", groupProducts: Product[]) => void;
  onAddToCategory: (categoryId: string | null) => void;
}

export function CategorySection({
  group,
  isCollapsed,
  movingSaving,
  onToggleCollapse,
  onEdit,
  onDelete,
  onDuplicate,
  onToggleActive,
  onMove,
  onAddToCategory,
}: CategorySectionProps) {
  const activeCount = group.products.filter((p) => p.is_active).length;
  const total = group.products.length;

  return (
    <div
      id={`cat-section-${group.id ?? "uncategorized"}`}
      className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"
    >
      {/* Section header */}
      <div className="flex items-center gap-3 border-b border-gray-100 bg-gray-50/60 px-5 py-3.5">
        {/* Title + badges — clicks collapse */}
        <button
          onClick={onToggleCollapse}
          className="flex min-w-0 flex-1 items-center gap-2.5 text-left"
        >
          <span className="truncate text-sm font-semibold text-gray-900">
            {group.name}
          </span>
          <span className="shrink-0 rounded-full bg-gray-200 px-2 py-0.5 text-xs font-medium text-gray-600">
            {total}
          </span>
          {activeCount > 0 && (
            <span className="shrink-0 rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">
              {activeCount} акт.
            </span>
          )}
          {activeCount === 0 && total > 0 && (
            <span className="shrink-0 rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-400">
              все неактивны
            </span>
          )}
        </button>

        {/* Add to this category */}
        <button
          onClick={() => onAddToCategory(group.id)}
          className="flex shrink-0 items-center gap-1 rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs text-gray-500 transition-colors hover:border-blue-300 hover:bg-white hover:text-blue-600"
        >
          <Plus size={12} />
          Добавить
        </button>

        {/* Collapse toggle */}
        <button
          onClick={onToggleCollapse}
          className="shrink-0 rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
          title={isCollapsed ? "Развернуть" : "Свернуть"}
        >
          {isCollapsed ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
        </button>
      </div>

      {/* Product rows */}
      {!isCollapsed && (
        <div>
          {group.products.map((product, idx) => (
            <ProductRow
              key={product.id}
              product={product}
              isFirst={idx === 0}
              isLast={idx === group.products.length - 1}
              movingSaving={movingSaving}
              onEdit={() => onEdit(product)}
              onDelete={() => onDelete(product)}
              onDuplicate={() => onDuplicate(product)}
              onToggleActive={() => onToggleActive(product)}
              onMoveUp={() => onMove(product.id, "up", group.products)}
              onMoveDown={() => onMove(product.id, "down", group.products)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
