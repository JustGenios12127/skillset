import { useState, useEffect, useMemo } from "react";
import { Plus, Search, Tag, Package, Loader2, AlertCircle, Trash2 } from "lucide-react";
import type { Category, Product, ProductInsert } from "@/types/catalog";
import * as productService from "@/services/products";
import * as categoryService from "@/services/categories";
import {
  groupProductsByCategory,
  groupKey,
  pluralProducts,
  type CategoryGroup,
} from "./utils/catalogUtils";
import { ProductModal } from "./ProductModal";
import { CategoryModal } from "./CategoryModal";
import { CategorySection } from "./CategorySection";
import { CategoryNav } from "./CategoryNav";

export default function ProductsPage() {
  // ─── Data ────────────────────────────────────────────────────────────────
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [movingSaving, setMovingSaving] = useState(false);

  // ─── Filters ─────────────────────────────────────────────────────────────
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [filterCatId, setFilterCatId] = useState("");
  const [showOnlyActive, setShowOnlyActive] = useState(false);

  // ─── Collapse state ──────────────────────────────────────────────────────
  const [collapsedIds, setCollapsedIds] = useState<Set<string>>(new Set());

  // ─── Modals ───────────────────────────────────────────────────────────────
  const [productModal, setProductModal] = useState<{
    open: boolean;
    product?: Product;
    defaultCategoryId?: string | null;
  }>({ open: false });
  const [catModal, setCatModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);

  // ─── Debounce ─────────────────────────────────────────────────────────────
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  // ─── Load data ────────────────────────────────────────────────────────────
  const loadData = async () => {
    try {
      const [prods, cats] = await Promise.all([
        productService.fetchProducts(),
        categoryService.fetchCategories(),
      ]);
      setProducts(prods);
      setCategories(cats);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Не удалось загрузить данные. Проверьте подключение к Supabase.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // ─── Grouping & filtering ─────────────────────────────────────────────────
  const allGroups = useMemo(
    () => groupProductsByCategory(products, categories),
    [products, categories]
  );

  const filteredGroups = useMemo((): CategoryGroup[] => {
    return allGroups
      .map((group) => ({
        ...group,
        products: group.products.filter((p) => {
          if (filterCatId && group.id !== filterCatId) return false;
          if (showOnlyActive && !p.is_active) return false;
          if (
            debouncedSearch &&
            !p.title.toLowerCase().includes(debouncedSearch.toLowerCase())
          )
            return false;
          return true;
        }),
      }))
      .filter((g) => {
        if (filterCatId && g.id !== filterCatId) return false;
        return g.products.length > 0;
      });
  }, [allGroups, filterCatId, showOnlyActive, debouncedSearch]);

  const totalFiltered = filteredGroups.reduce(
    (sum, g) => sum + g.products.length,
    0
  );
  const isFiltering =
    !!debouncedSearch || !!filterCatId || showOnlyActive;

  const allCollapsed =
    filteredGroups.length > 0 &&
    filteredGroups.every((g) => collapsedIds.has(groupKey(g.id)));

  // ─── Collapse handlers ───────────────────────────────────────────────────
  const handleToggleCollapse = (groupId: string | null) => {
    const key = groupKey(groupId);
    setCollapsedIds((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const handleExpandAll = () => setCollapsedIds(new Set());

  const handleCollapseAll = () => {
    setCollapsedIds(new Set(filteredGroups.map((g) => groupKey(g.id))));
  };

  // ─── Product handlers ────────────────────────────────────────────────────
  const handleToggleActive = async (product: Product) => {
    try {
      const updated = await productService.updateProduct(product.id, {
        is_active: !product.is_active,
      });
      setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      await productService.deleteProduct(deleteTarget.id);
      setProducts((prev) => prev.filter((p) => p.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleMove = async (
    productId: string,
    direction: "up" | "down",
    groupProducts: Product[]
  ) => {
    const sorted = [...groupProducts].sort(
      (a, b) =>
        a.sort_order - b.sort_order || a.created_at.localeCompare(b.created_at)
    );
    const idx = sorted.findIndex((p) => p.id === productId);
    if (direction === "up" && idx === 0) return;
    if (direction === "down" && idx === sorted.length - 1) return;

    const swapIdx = direction === "up" ? idx - 1 : idx + 1;
    const newOrder = [...sorted];
    [newOrder[idx], newOrder[swapIdx]] = [newOrder[swapIdx], newOrder[idx]];

    setMovingSaving(true);
    try {
      await Promise.all(
        newOrder.map((p, i) => productService.updateProduct(p.id, { sort_order: i }))
      );
      await loadData();
    } finally {
      setMovingSaving(false);
    }
  };

  const handleDuplicate = async (product: Product) => {
    const payload: ProductInsert = {
      title: product.title + " (копия)",
      description: product.description,
      price_type: product.price_type,
      price: product.price,
      currency: product.currency,
      category_id: product.category_id,
      is_active: false,
      sort_order: product.sort_order + 1,
    };
    try {
      await productService.createProduct(payload);
      await loadData();
    } catch (err) {
      console.error(err);
    }
  };

  // ─── Loading state ────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="space-y-4">
      {/* ── Header ── */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Мои товары</h1>
          <p className="mt-0.5 text-sm text-gray-500">
            {pluralProducts(products.length)} в каталоге
            {isFiltering && totalFiltered !== products.length && (
              <span className="ml-2 text-blue-600">
                · найдено: {totalFiltered} в {filteredGroups.length}{" "}
                {filteredGroups.length === 1 ? "категории" : "категориях"}
              </span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCatModal(true)}
            className="flex items-center gap-1.5 rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-600 transition-colors hover:border-gray-400 hover:bg-gray-50"
          >
            <Tag size={14} />
            Категории
          </button>
          <button
            onClick={() => setProductModal({ open: true })}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700"
          >
            <Plus size={16} />
            Добавить товар
          </button>
        </div>
      </div>

      {/* ── Error ── */}
      {error && (
        <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          <AlertCircle size={16} className="shrink-0" />
          {error}
        </div>
      )}

      {/* ── Filters ── */}
      <div className="flex flex-wrap items-center gap-3 rounded-xl border border-gray-200 bg-white p-3 shadow-sm">
        <div className="relative">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Поиск по названию..."
            className="w-52 rounded-lg border border-gray-300 py-2 pl-9 pr-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30"
          />
        </div>

        <select
          value={filterCatId}
          onChange={(e) => setFilterCatId(e.target.value)}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30"
        >
          <option value="">Все категории</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-600">
          <input
            type="checkbox"
            checked={showOnlyActive}
            onChange={(e) => setShowOnlyActive(e.target.checked)}
            className="h-4 w-4 accent-blue-600"
          />
          Только активные
        </label>

        {isFiltering && (
          <button
            onClick={() => {
              setSearch("");
              setFilterCatId("");
              setShowOnlyActive(false);
            }}
            className="ml-auto text-xs text-gray-400 hover:text-gray-700"
          >
            Сбросить фильтры ×
          </button>
        )}
      </div>

      {/* ── Empty state ── */}
      {products.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-gray-200 bg-white py-20">
          <Package size={44} className="mb-4 text-gray-200" strokeWidth={1.5} />
          <p className="text-gray-500">Товаров пока нет</p>
          <button
            onClick={() => setProductModal({ open: true })}
            className="mt-3 text-sm font-medium text-blue-600 hover:underline"
          >
            Добавить первый товар
          </button>
        </div>
      ) : filteredGroups.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-gray-200 bg-white py-16">
          <Search size={36} className="mb-3 text-gray-200" strokeWidth={1.5} />
          <p className="text-gray-500">Ничего не найдено</p>
          <button
            onClick={() => {
              setSearch("");
              setFilterCatId("");
              setShowOnlyActive(false);
            }}
            className="mt-2 text-sm text-blue-600 hover:underline"
          >
            Сбросить фильтры
          </button>
        </div>
      ) : (
        <>
          {/* ── Category nav ── */}
          <CategoryNav
            groups={filteredGroups}
            allCollapsed={allCollapsed}
            onExpandAll={handleExpandAll}
            onCollapseAll={handleCollapseAll}
          />

          {/* ── Category sections ── */}
          <div className="space-y-3">
            {filteredGroups.map((group) => (
              <CategorySection
                key={group.id ?? "uncategorized"}
                group={group}
                isCollapsed={collapsedIds.has(groupKey(group.id))}
                movingSaving={movingSaving}
                onToggleCollapse={() => handleToggleCollapse(group.id)}
                onEdit={(p) => setProductModal({ open: true, product: p })}
                onDelete={(p) => setDeleteTarget(p)}
                onDuplicate={handleDuplicate}
                onToggleActive={handleToggleActive}
                onMove={handleMove}
                onAddToCategory={(catId) =>
                  setProductModal({ open: true, defaultCategoryId: catId })
                }
              />
            ))}
          </div>
        </>
      )}

      {/* ── Product modal ── */}
      {productModal.open && (
        <ProductModal
          product={productModal.product ?? null}
          categories={categories}
          defaultCategoryId={productModal.defaultCategoryId}
          onClose={() => setProductModal({ open: false })}
          onSaved={() => {
            setProductModal({ open: false });
            loadData();
          }}
          onCategoryCreated={(cat) =>
            setCategories((prev) => [...prev, cat])
          }
        />
      )}

      {/* ── Category modal ── */}
      {catModal && (
        <CategoryModal
          categories={categories}
          onClose={() => setCatModal(false)}
          onChanged={loadData}
        />
      )}

      {/* ── Delete confirm ── */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
              <Trash2 size={20} className="text-red-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Удалить товар?</h3>
            <p className="mt-2 text-sm text-gray-500">
              «{deleteTarget.title}» будет удалён безвозвратно.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
              >
                Отмена
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-700"
              >
                Удалить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
