import { useState } from "react";
import { X, Loader2, Pencil, Trash2 } from "lucide-react";
import type { Category } from "@/types/catalog";
import * as categoryService from "@/services/categories";

export interface CategoryModalProps {
  categories: Category[];
  onClose: () => void;
  onChanged: () => void;
}

export function CategoryModal({
  categories,
  onClose,
  onChanged,
}: CategoryModalProps) {
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
          <h2 className="text-lg font-semibold text-gray-900">
            Управление категориями
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="px-6 py-5">
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
              {adding ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                "Добавить"
              )}
            </button>
          </div>

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
                      onKeyDown={(e) =>
                        e.key === "Enter" && handleRename(cat.id)
                      }
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
                    <span className="flex-1 text-sm text-gray-800">
                      {cat.name}
                    </span>
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
