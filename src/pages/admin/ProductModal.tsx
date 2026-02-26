import { useState } from "react";
import { X, Loader2 } from "lucide-react";
import type { Category, Product, PriceType, ProductInsert } from "@/types/catalog";
import * as productService from "@/services/products";
import * as categoryService from "@/services/categories";

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

export interface ProductModalProps {
  product: Product | null;
  categories: Category[];
  defaultCategoryId?: string | null;
  onClose: () => void;
  onSaved: () => void;
  onCategoryCreated: (cat: Category) => void;
}

export function ProductModal({
  product,
  categories,
  defaultCategoryId,
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
      : { ...EMPTY_FORM, category_id: defaultCategoryId ?? "" }
  );
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>(
    {}
  );
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

        <div className="max-h-[70vh] space-y-4 overflow-y-auto px-6 py-5">
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
              className="w-full resize-none rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30"
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
