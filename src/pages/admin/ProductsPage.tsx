import { useState, useEffect } from "react";
import {
  Plus,
  Search,
  Tag,
  Package,
  Pencil,
  Trash2,
  ChevronUp,
  ChevronDown,
  X,
  Loader2,
  AlertCircle,
} from "lucide-react";
import type { Category, Product, PriceType, ProductInsert } from "@/types/catalog";
import * as productService from "@/services/products";
import * as categoryService from "@/services/categories";

// ─── Helpers ────────────────────────────────────────────────────────────────

function formatPrice(p: Product): string {
  if (p.price_type === "negotiable") return "По договорённости";
  return `${p.price?.toLocaleString("ru-RU") ?? "—"} ${p.currency}`;
}

function getCatName(categoryId: string | null, cats: Category[]): string {
  if (!categoryId) return "—";
  return cats.find((c) => c.id === categoryId)?.name ?? "—";
}

// ─── ProductModal ────────────────────────────────────────────────────────────

interface FormData {
  title: string;
  description: string;
  price_type: PriceType;
  price: string;
  currency: string;
  category_id: string;
  is_active: boolean;
}

const EMPTY_FORM: FormData = {
  title: "",
  description: "",
  price_type: "negotiable",
  price: "",
  currency: "KZT",
  category_id: "",
  is_active: true,
};

interface ProductModalProps {
  product: Product | null;
  categories: Category[];
  onClose: () => void;
  onSaved: () => void;
  onCategoryCreated: (cat: Category) => void;
}

function ProductModal({
  product,
  categories,
  onClose,
  onSaved,
  onCategoryCreated,
}: ProductModalProps) {
  const [form, setForm] = useState<FormData>(
    product
      ? {
          title: product.title,
          description: product.description ?? "",
          price_type: product.price_type,
          price: product.price?.toString() ?? "",
          currency: product.currency,
          category_id: product.category_id ?? "",
          is_active: product.is_active,
        }
      : EMPTY_FORM
  );
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [saving, setSaving] = useState(false);
  const [newCatName, setNewCatName] = useState("");
  const [showNewCat, setShowNewCat] = useState(false);
  const [catSaving, setCatSaving] = useState(false);

  const set = <K extends keyof FormData>(key: K, value: FormData[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const validate = (): boolean => {
    const e: Partial<Record<keyof FormData, string>> = {};
    if (!form.title.trim()) e.title = "Обязательное поле";
    if (form.price_type === "fixed") {
      const n = parseFloat(form.price);
      if (!form.price || isNaN(n) || n <= 0) e.price = "Введите цену больше 0";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSaving(true);
    const payload: ProductInsert = {
      title: form.title.trim(),
      description: form.description.trim() || null,
      price_type: form.price_type,
      price: form.price_type === "fixed" ? parseFloat(form.price) : null,
      currency: form.currency,
      category_id: form.category_id || null,
      is_active: form.is_active,
      sort_order: product?.sort_order ?? 0,
    };
    try {
      if (product) {
        await productService.updateProduct(product.id, payload);
      } else {
        await productService.createProduct(payload);
      }
      onSaved();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleAddCategory = async () => {
    if (!newCatName.trim()) return;
    setCatSaving(true);
    try {
      const cat = await categoryService.createCategory(newCatName.trim());
      onCategoryCreated(cat);
      set("category_id", cat.id);
      setNewCatName("");
      setShowNewCat(false);
    } catch (err) {
      console.error(err);
    } finally {
      setCatSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900">
            {product ? "Редактировать товар" : "Новый товар"}
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="space-y-4 px-6 py-5 max-h-[70vh] overflow-y-auto">
          {/* Title */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Название <span className="text-red-500">*</span>
            </label>
            <input
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
              className={`w-full rounded-lg border px-3 py-2 text-sm outline-none transition focus:ring-2 focus:ring-blue-500/30 ${
                errors.title
                  ? "border-red-400 focus:border-red-400"
                  : "border-gray-300 focus:border-blue-500"
              }`}
              placeholder="Название услуги или товара"
            />
            {errors.title && (
              <p className="mt-1 text-xs text-red-500">{errors.title}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Описание
            </label>
            <textarea
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              rows={3}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 resize-none"
              placeholder="Краткое описание услуги..."
            />
          </div>

          {/* Category */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Категория
            </label>
            <div className="flex gap-2">
              <select
                value={form.category_id}
                onChange={(e) => set("category_id", e.target.value)}
                className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30"
              >
                <option value="">— Без категории —</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => setShowNewCat((v) => !v)}
                className="rounded-lg border border-blue-600 px-3 py-2 text-xs font-medium text-blue-600 hover:bg-blue-50 transition-colors"
              >
                + Новая
              </button>
            </div>
            {showNewCat && (
              <div className="mt-2 flex gap-2">
                <input
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAddCategory()}
                  placeholder="Название категории"
                  className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30"
                  autoFocus
                />
                <button
                  onClick={handleAddCategory}
                  disabled={catSaving || !newCatName.trim()}
                  className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-medium text-white hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                  {catSaving ? "..." : "Создать"}
                </button>
              </div>
            )}
          </div>

          {/* Price type */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Тип цены
            </label>
            <div className="flex gap-4">
              {(["negotiable", "fixed"] as PriceType[]).map((pt) => (
                <label key={pt} className="flex cursor-pointer items-center gap-2">
                  <input
                    type="radio"
                    name="price_type"
                    value={pt}
                    checked={form.price_type === pt}
                    onChange={() => set("price_type", pt)}
                    className="accent-blue-600"
                  />
                  <span className="text-sm text-gray-700">
                    {pt === "negotiable" ? "По договорённости" : "Фиксированная"}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Price */}
          {form.price_type === "fixed" && (
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Цена <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.price}
                  onChange={(e) => set("price", e.target.value)}
                  className={`w-full rounded-lg border px-3 py-2 text-sm outline-none transition focus:ring-2 focus:ring-blue-500/30 ${
                    errors.price
                      ? "border-red-400 focus:border-red-400"
                      : "border-gray-300 focus:border-blue-500"
                  }`}
                  placeholder="0"
                />
                {errors.price && (
                  <p className="mt-1 text-xs text-red-500">{errors.price}</p>
                )}
              </div>
              <div className="w-28">
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Валюта
                </label>
                <select
                  value={form.currency}
                  onChange={(e) => set("currency", e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                >
                  <option>KZT</option>
                  <option>USD</option>
                  <option>EUR</option>
                  <option>RUB</option>
                </select>
              </div>
            </div>
          )}

          {/* Active */}
          <label className="flex cursor-pointer items-center gap-3">
            <input
              type="checkbox"
              checked={form.is_active}
              onChange={(e) => set("is_active", e.target.checked)}
              className="h-4 w-4 accent-blue-600"
            />
            <span className="text-sm font-medium text-gray-700">
              Активен (виден на сайте)
            </span>
          </label>
        </div>

        <div className="flex justify-end gap-3 border-t border-gray-100 px-6 py-4">
          <button
            onClick={onClose}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Отмена
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60 transition-colors"
          >
            {saving && <Loader2 size={14} className="animate-spin" />}
            {product ? "Сохранить" : "Добавить"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── CategoryModal ───────────────────────────────────────────────────────────

interface CategoryModalProps {
  categories: Category[];
  onClose: () => void;
  onChanged: () => void;
}

function CategoryModal({ categories, onClose, onChanged }: CategoryModalProps) {
  const [newName, setNewName] = useState("");
  const [adding, setAdding] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [savingId, setSavingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleAdd = async () => {
    if (!newName.trim()) return;
    setAdding(true);
    try {
      await categoryService.createCategory(newName.trim());
      setNewName("");
      onChanged();
    } catch (err) {
      console.error(err);
    } finally {
      setAdding(false);
    }
  };

  const handleRename = async (id: string) => {
    if (!editName.trim()) return;
    setSavingId(id);
    try {
      await categoryService.updateCategory(id, editName.trim());
      setEditId(null);
      onChanged();
    } catch (err) {
      console.error(err);
    } finally {
      setSavingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await categoryService.deleteCategory(id);
      setDeleteId(null);
      onChanged();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900">Управление категориями</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="px-6 py-5">
          {/* Добавить новую */}
          <div className="mb-5 flex gap-2">
            <input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAdd()}
              placeholder="Название новой категории"
              className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30"
            />
            <button
              onClick={handleAdd}
              disabled={adding || !newName.trim()}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {adding ? <Loader2 size={14} className="animate-spin" /> : "Добавить"}
            </button>
          </div>

          {/* Список */}
          <ul className="max-h-64 space-y-2 overflow-y-auto">
            {categories.length === 0 && (
              <li className="py-6 text-center text-sm text-gray-400">
                Категорий пока нет
              </li>
            )}
            {categories.map((cat) => (
              <li
                key={cat.id}
                className="flex items-center gap-2 rounded-xl border border-gray-100 bg-gray-50 px-3 py-2.5"
              >
                {editId === cat.id ? (
                  <>
                    <input
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleRename(cat.id)}
                      autoFocus
                      className="flex-1 rounded-lg border border-gray-300 px-2 py-1 text-sm outline-none focus:border-blue-500"
                    />
                    <button
                      onClick={() => handleRename(cat.id)}
                      disabled={savingId === cat.id}
                      className="text-xs font-semibold text-blue-600 hover:text-blue-700"
                    >
                      {savingId === cat.id ? "..." : "ОК"}
                    </button>
                    <button
                      onClick={() => setEditId(null)}
                      className="text-xs text-gray-400 hover:text-gray-600"
                    >
                      Отмена
                    </button>
                  </>
                ) : deleteId === cat.id ? (
                  <>
                    <span className="flex-1 text-sm text-red-600">
                      Удалить «{cat.name}»?
                    </span>
                    <button
                      onClick={() => handleDelete(cat.id)}
                      className="text-xs font-semibold text-red-600 hover:text-red-700"
                    >
                      Да
                    </button>
                    <button
                      onClick={() => setDeleteId(null)}
                      className="text-xs text-gray-400 hover:text-gray-600"
                    >
                      Нет
                    </button>
                  </>
                ) : (
                  <>
                    <span className="flex-1 text-sm text-gray-800">{cat.name}</span>
                    <button
                      onClick={() => {
                        setEditId(cat.id);
                        setEditName(cat.name);
                      }}
                      className="rounded-lg p-1.5 text-gray-400 hover:bg-white hover:text-gray-600 transition-colors"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={() => setDeleteId(cat.id)}
                      className="rounded-lg p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </>
                )}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex justify-end border-t border-gray-100 px-6 py-4">
          <button
            onClick={onClose}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Закрыть
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── ProductsPage ────────────────────────────────────────────────────────────

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [movingSaving, setMovingSaving] = useState(false);

  // Filters
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [filterCatId, setFilterCatId] = useState("");
  const [showOnlyActive, setShowOnlyActive] = useState(false);

  // Modals
  const [productModal, setProductModal] = useState<{
    open: boolean;
    product?: Product;
  }>({ open: false });
  const [catModal, setCatModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(t);
  }, [search]);

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

  const filtered = products
    .filter((p) => {
      if (showOnlyActive && !p.is_active) return false;
      if (filterCatId && p.category_id !== filterCatId) return false;
      if (
        debouncedSearch &&
        !p.title.toLowerCase().includes(debouncedSearch.toLowerCase())
      )
        return false;
      return true;
    })
    .sort(
      (a, b) =>
        a.sort_order - b.sort_order ||
        a.created_at.localeCompare(b.created_at)
    );

  const handleToggleActive = async (product: Product) => {
    try {
      const updated = await productService.updateProduct(product.id, {
        is_active: !product.is_active,
      });
      setProducts((prev) =>
        prev.map((p) => (p.id === updated.id ? updated : p))
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await productService.deleteProduct(deleteTarget.id);
      setProducts((prev) => prev.filter((p) => p.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleMove = async (productId: string, direction: "up" | "down") => {
    const sorted = [...products].sort(
      (a, b) =>
        a.sort_order - b.sort_order ||
        a.created_at.localeCompare(b.created_at)
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
        newOrder.map((p, i) =>
          productService.updateProduct(p.id, { sort_order: i })
        )
      );
      await loadData();
    } finally {
      setMovingSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Мои товары</h1>
          <p className="mt-0.5 text-sm text-gray-500">
            {products.length}{" "}
            {products.length === 1
              ? "позиция"
              : products.length >= 2 && products.length <= 4
              ? "позиции"
              : "позиций"}{" "}
            в каталоге
          </p>
        </div>
        <button
          onClick={() => setProductModal({ open: true })}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition-colors shadow-sm"
        >
          <Plus size={16} />
          Добавить товар
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          <AlertCircle size={16} className="flex-shrink-0" />
          {error}
        </div>
      )}

      {/* Filters */}
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

        <button
          onClick={() => setCatModal(true)}
          className="ml-auto flex items-center gap-1.5 rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:border-gray-400 transition-colors"
        >
          <Tag size={14} />
          Категории
        </button>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        {filtered.length === 0 ? (
          <div className="py-16 text-center">
            <Package
              size={40}
              className="mx-auto mb-3 text-gray-300"
              strokeWidth={1.5}
            />
            <p className="text-gray-500">Товаров не найдено</p>
            {products.length === 0 && (
              <button
                onClick={() => setProductModal({ open: true })}
                className="mt-3 text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline"
              >
                Добавить первый товар
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Название
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Категория
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Цена
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Активен
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Порядок
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Действия
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((product, idx) => (
                  <tr
                    key={product.id}
                    className="transition-colors hover:bg-blue-50/30"
                  >
                    <td className="px-4 py-3.5">
                      <div className="font-medium text-gray-900">
                        {product.title}
                      </div>
                      {product.description && (
                        <div className="mt-0.5 max-w-xs truncate text-xs text-gray-400">
                          {product.description}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3.5">
                      <span
                        className={`inline-block rounded-full px-2.5 py-1 text-xs font-medium ${
                          product.category_id
                            ? "bg-blue-50 text-blue-700"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {getCatName(product.category_id, categories)}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-gray-700">
                      {formatPrice(product)}
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <button
                        onClick={() => handleToggleActive(product)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          product.is_active ? "bg-blue-600" : "bg-gray-200"
                        }`}
                        aria-label={
                          product.is_active
                            ? "Деактивировать"
                            : "Активировать"
                        }
                      >
                        <span
                          className={`ml-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                            product.is_active
                              ? "translate-x-5"
                              : "translate-x-0"
                          }`}
                        />
                      </button>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center justify-center gap-0.5">
                        <button
                          onClick={() => handleMove(product.id, "up")}
                          disabled={movingSaving || idx === 0}
                          className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700 disabled:opacity-30 transition-colors"
                          title="Переместить вверх"
                        >
                          <ChevronUp size={15} />
                        </button>
                        <button
                          onClick={() => handleMove(product.id, "down")}
                          disabled={movingSaving || idx === filtered.length - 1}
                          className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700 disabled:opacity-30 transition-colors"
                          title="Переместить вниз"
                        >
                          <ChevronDown size={15} />
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() =>
                            setProductModal({ open: true, product })
                          }
                          className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-colors"
                        >
                          <Pencil size={12} />
                          Изменить
                        </button>
                        <button
                          onClick={() => setDeleteTarget(product)}
                          className="flex items-center gap-1.5 rounded-lg border border-red-100 px-3 py-1.5 text-xs font-medium text-red-500 hover:bg-red-50 hover:border-red-200 transition-colors"
                        >
                          <Trash2 size={12} />
                          Удалить
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Product modal */}
      {productModal.open && (
        <ProductModal
          product={productModal.product ?? null}
          categories={categories}
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

      {/* Category modal */}
      {catModal && (
        <CategoryModal
          categories={categories}
          onClose={() => setCatModal(false)}
          onChanged={loadData}
        />
      )}

      {/* Delete confirm */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
              <Trash2 size={20} className="text-red-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">
              Удалить товар?
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              «{deleteTarget.title}» будет удалён безвозвратно.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Отмена
              </button>
              <button
                onClick={handleDelete}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 transition-colors"
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
