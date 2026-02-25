-- =============================================================
-- ШАГИ:
-- 1. Вставь весь этот SQL в Supabase → SQL Editor → Run
-- =============================================================

-- ── 1. Таблица для проверки прав супер-админа ────────────────
CREATE TABLE IF NOT EXISTS admin_emails (
  email text PRIMARY KEY
);

INSERT INTO admin_emails (email)
VALUES ('admin@gmail.com')
ON CONFLICT DO NOTHING;

-- ── 2. Категории ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS categories (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  name        text        NOT NULL UNIQUE,
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- ── 3. Товары / услуги ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS products (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  title       text        NOT NULL,
  description text,
  price_type  text        NOT NULL DEFAULT 'negotiable'
                          CHECK (price_type IN ('negotiable', 'fixed')),
  price       numeric,
  currency    text        NOT NULL DEFAULT 'KZT',
  category_id uuid        REFERENCES categories(id) ON DELETE SET NULL,
  is_active   boolean     NOT NULL DEFAULT true,
  sort_order  int         NOT NULL DEFAULT 0,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

-- ── 4. Триггер auto-update поля updated_at ───────────────────
CREATE OR REPLACE FUNCTION fn_set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_products_updated_at ON products;
CREATE TRIGGER trg_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION fn_set_updated_at();

-- ── 5. RLS ────────────────────────────────────────────────────
ALTER TABLE admin_emails ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories   ENABLE ROW LEVEL SECURITY;
ALTER TABLE products     ENABLE ROW LEVEL SECURITY;

-- admin_emails: пользователь видит только свою строку (email из JWT)
DROP POLICY IF EXISTS "admin_emails_self_read" ON admin_emails;
CREATE POLICY "admin_emails_self_read" ON admin_emails
  FOR SELECT
  USING (email = (auth.jwt() ->> 'email'));

-- categories: полный доступ только супер-админу
DROP POLICY IF EXISTS "categories_admin_all" ON categories;
CREATE POLICY "categories_admin_all" ON categories
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM admin_emails
      WHERE email = (auth.jwt() ->> 'email')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_emails
      WHERE email = (auth.jwt() ->> 'email')
    )
  );

-- TODO: раскомментировать когда публичный сайт будет читать из Supabase
-- CREATE POLICY "categories_public_read" ON categories
--   FOR SELECT USING (true);

-- products: полный доступ только супер-админу
DROP POLICY IF EXISTS "products_admin_all" ON products;
CREATE POLICY "products_admin_all" ON products
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM admin_emails
      WHERE email = (auth.jwt() ->> 'email')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_emails
      WHERE email = (auth.jwt() ->> 'email')
    )
  );

-- TODO: раскомментировать когда публичный сайт будет читать из Supabase
-- CREATE POLICY "products_public_read" ON products
--   FOR SELECT USING (is_active = true);
