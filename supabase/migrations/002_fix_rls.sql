-- =============================================================
-- ИСПРАВЛЕНИЕ RLS: убираем JOIN auth.users, читаем email из JWT
-- Запусти в Supabase → SQL Editor → Run
-- =============================================================

-- Удаляем старые политики
DROP POLICY IF EXISTS "admin_emails_self_read"  ON admin_emails;
DROP POLICY IF EXISTS "categories_admin_all"    ON categories;
DROP POLICY IF EXISTS "products_admin_all"      ON products;

-- ── admin_emails: пользователь видит только свою строку ───────
CREATE POLICY "admin_emails_self_read" ON admin_emails
  FOR SELECT
  USING (email = (auth.jwt() ->> 'email'));

-- ── categories: полный доступ для супер-админа ────────────────
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

-- ── products: полный доступ для супер-админа ──────────────────
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
