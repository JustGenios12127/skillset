-- =============================================================
-- Запусти в Supabase → SQL Editor → Run
-- Добавляет sort_order для категорий + публичное чтение
-- =============================================================

-- Добавить sort_order в categories (если ещё нет)
ALTER TABLE categories ADD COLUMN IF NOT EXISTS sort_order int NOT NULL DEFAULT 0;

-- ── Публичное чтение категорий ────────────────────────────────
DROP POLICY IF EXISTS "categories_public_read" ON categories;
CREATE POLICY "categories_public_read" ON categories
  FOR SELECT
  USING (true);

-- ── Публичное чтение активных товаров ────────────────────────
DROP POLICY IF EXISTS "products_public_read" ON products;
CREATE POLICY "products_public_read" ON products
  FOR SELECT
  USING (is_active = true);
