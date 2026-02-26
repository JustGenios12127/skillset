import { ChevronUp, ChevronDown, MoreHorizontal, Pencil, Trash2, Copy } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Product } from "@/types/catalog";
import { formatPrice } from "./utils/catalogUtils";

export interface ProductRowProps {
  product: Product;
  isFirst: boolean;
  isLast: boolean;
  movingSaving: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onToggleActive: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}

export function ProductRow({
  product,
  isFirst,
  isLast,
  movingSaving,
  onEdit,
  onDelete,
  onDuplicate,
  onToggleActive,
  onMoveUp,
  onMoveDown,
}: ProductRowProps) {
  return (
    <div className="group flex items-center gap-3 border-b border-gray-100 px-4 py-3 transition-colors last:border-0 hover:bg-blue-50/30">
      {/* Sort buttons — appear on hover */}
      <div className="flex flex-col gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
        <button
          onClick={onMoveUp}
          disabled={isFirst || movingSaving}
          title="Переместить вверх"
          className="rounded p-0.5 text-gray-300 transition-colors hover:bg-gray-100 hover:text-gray-600 disabled:opacity-20 disabled:cursor-not-allowed"
        >
          <ChevronUp size={13} />
        </button>
        <button
          onClick={onMoveDown}
          disabled={isLast || movingSaving}
          title="Переместить вниз"
          className="rounded p-0.5 text-gray-300 transition-colors hover:bg-gray-100 hover:text-gray-600 disabled:opacity-20 disabled:cursor-not-allowed"
        >
          <ChevronDown size={13} />
        </button>
      </div>

      {/* Title + description */}
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-gray-900">
          {product.title}
        </p>
        {product.description && (
          <p className="mt-0.5 truncate text-xs text-gray-400">
            {product.description}
          </p>
        )}
      </div>

      {/* Price */}
      <span
        className={`shrink-0 whitespace-nowrap text-sm ${
          product.price_type === "negotiable"
            ? "text-gray-400 italic"
            : "text-gray-700"
        }`}
      >
        {formatPrice(product)}
      </span>

      {/* Active toggle */}
      <button
        onClick={onToggleActive}
        title={product.is_active ? "Деактивировать" : "Активировать"}
        className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors ${
          product.is_active ? "bg-blue-600" : "bg-gray-200"
        }`}
      >
        <span
          className={`ml-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${
            product.is_active ? "translate-x-4" : "translate-x-0"
          }`}
        />
      </button>

      {/* Actions dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600">
            <MoreHorizontal size={15} />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-44">
          <DropdownMenuItem onClick={onEdit} className="cursor-pointer">
            <Pencil size={13} className="mr-2 shrink-0" />
            Изменить
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onDuplicate} className="cursor-pointer">
            <Copy size={13} className="mr-2 shrink-0" />
            Дублировать
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={onDelete}
            className="cursor-pointer text-red-600 focus:bg-red-50 focus:text-red-600"
          >
            <Trash2 size={13} className="mr-2 shrink-0" />
            Удалить
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
