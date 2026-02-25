-- =============================================================
-- SEED: все категории и услуги из каталога
-- Запусти в Supabase → SQL Editor → Run
-- БЕЗОПАСНО: использует ON CONFLICT DO NOTHING — не создаёт дубликаты
-- =============================================================

-- ── 1. Категории ─────────────────────────────────────────────
INSERT INTO categories (name, sort_order) VALUES
  ('Аудит и экспертиза',                               0),
  ('Проектирование и консалтинг',                      1),
  ('Аутсорсинг документации',                          2),
  ('Перезарядка огнетушителей (порошковые ОП)',        3),
  ('Перезарядка огнетушителей (углекислотные ОУ)',     4),
  ('Замена комплектующих огнетушителей',               5),
  ('Обучение сотрудников',                             6),
  ('Антитеррористическая защищенность',                7),
  ('Техническое обслуживание систем',                  8),
  ('Планы эвакуации',                                  9),
  ('Огнезащитная обработка',                          10),
  ('Испытательная пожарная лаборатория',              11),
  ('Плакаты по безопасности',                         12),
  ('Журналы',                                         13),
  ('Знаки и таблички',                                14),
  ('Информационные стенды',                           15)
ON CONFLICT (name) DO NOTHING;

-- ── 2. Услуги ────────────────────────────────────────────────
-- Используем INSERT...SELECT чтобы подтянуть category_id по имени.
-- ON CONFLICT (title, category_id) DO NOTHING — нет дублей при повторном запуске.
-- Для этого нужен уникальный индекс:
CREATE UNIQUE INDEX IF NOT EXISTS products_title_cat_uq
  ON products (title, category_id);

-- ── Аудит и экспертиза ───────────────────────────────────────
INSERT INTO products (title, price_type, price, currency, category_id, sort_order, is_active)
SELECT v.title, v.pt, v.price, 'KZT', c.id, v.ord, true
FROM (VALUES
  ('Аудит по пожарной безопасности (на основании аттестата аккредитации)', 'negotiable'::text, NULL::numeric, 0),
  ('Аудит по безопасности и охране труда',                                  'negotiable',       NULL,          1),
  ('Экспертиза объекта по пожарной безопасности',                           'negotiable',       NULL,          2),
  ('Оценка соответствия требованиям законодательства РК (ПБ, ОТ, АТЗ)',    'negotiable',       NULL,          3),
  ('Определение степени огнестойкости и класса конструкционной пожарной опасности', 'fixed', 300000, 4),
  ('Оценка степени рисков по условиям труда',                               'fixed',            12000,         5)
) AS v(title, pt, price, ord)
JOIN categories c ON c.name = 'Аудит и экспертиза'
ON CONFLICT (title, category_id) DO NOTHING;

-- ── Проектирование и консалтинг ──────────────────────────────
INSERT INTO products (title, price_type, price, currency, category_id, sort_order, is_active)
SELECT v.title, v.pt, v.price, 'KZT', c.id, v.ord, true
FROM (VALUES
  ('Проектная деятельность 3 категории (на основании лицензии)',             'negotiable'::text, NULL::numeric, 0),
  ('Разработка комплекса организационно-технических мероприятий',            'fixed',            250000,        1),
  ('Разработка специальных технических условий (СТУ)',                       'fixed',            800000,        2),
  ('Разработка раздела мероприятий по обеспечению пожарной безопасности',   'fixed',            500000,        3),
  ('Консультация эксперта по пожарной безопасности',                        'fixed',            20000,         4),
  ('Расчет времени для эвакуации людей при пожаре',                         'fixed',            50000,         5),
  ('Расчет категории производства по взрывопожарной и пожарной опасности',  'fixed',            200000,        6)
) AS v(title, pt, price, ord)
JOIN categories c ON c.name = 'Проектирование и консалтинг'
ON CONFLICT (title, category_id) DO NOTHING;

-- ── Аутсорсинг документации ──────────────────────────────────
INSERT INTO products (title, price_type, price, currency, category_id, sort_order, is_active)
SELECT v.title, v.pt, v.price, 'KZT', c.id, v.ord, true
FROM (VALUES
  ('Аутсорсинг по пожарной безопасности (разработка и ведение документации)',          'negotiable'::text, NULL::numeric, 0),
  ('Аутсорсинг по безопасности и охране труда (разработка и ведение документации)',   'negotiable',       NULL,          1)
) AS v(title, pt, price, ord)
JOIN categories c ON c.name = 'Аутсорсинг документации'
ON CONFLICT (title, category_id) DO NOTHING;

-- ── Перезарядка огнетушителей (порошковые ОП) ───────────────
INSERT INTO products (title, price_type, price, currency, category_id, sort_order, is_active)
SELECT v.title, 'fixed'::text, v.price, 'KZT', c.id, v.ord, true
FROM (VALUES
  ('Перезарядка ОП-3',   1000::numeric,  0),
  ('Перезарядка ОП-4',   1200,           1),
  ('Перезарядка ОП-5',   1850,           2),
  ('Перезарядка ОП-8',   2800,           3),
  ('Перезарядка ОП-10',  4500,           4),
  ('Перезарядка ОП-25',  8500,           5),
  ('Перезарядка ОП-35',  12500,          6),
  ('Перезарядка ОП-50',  16500,          7),
  ('Перезарядка ОП-80',  25090,          8),
  ('Перезарядка ОП-100', 30250,          9)
) AS v(title, price, ord)
JOIN categories c ON c.name = 'Перезарядка огнетушителей (порошковые ОП)'
ON CONFLICT (title, category_id) DO NOTHING;

-- ── Перезарядка огнетушителей (углекислотные ОУ) ────────────
INSERT INTO products (title, price_type, price, currency, category_id, sort_order, is_active)
SELECT v.title, 'fixed'::text, v.price, 'KZT', c.id, v.ord, true
FROM (VALUES
  ('Перезарядка ОУ-2',  1800::numeric, 0),
  ('Перезарядка ОУ-3',  2200,          1),
  ('Перезарядка ОУ-4',  3900,          2),
  ('Перезарядка ОУ-5',  5900,          3),
  ('Перезарядка ОУ-8',  6900,          4),
  ('Перезарядка ОУ-10', 8700,          5),
  ('Перезарядка ОУ-25', 15000,         6)
) AS v(title, price, ord)
JOIN categories c ON c.name = 'Перезарядка огнетушителей (углекислотные ОУ)'
ON CONFLICT (title, category_id) DO NOTHING;

-- ── Замена комплектующих огнетушителей ──────────────────────
INSERT INTO products (title, price_type, price, currency, category_id, sort_order, is_active)
SELECT v.title, 'fixed'::text, v.price, 'KZT', c.id, v.ord, true
FROM (VALUES
  ('Замена шланга с распылителем',                      1000::numeric, 0),
  ('Замена ЗПУ (ОП-1–10)',                              1800,          1),
  ('Замена ЗПУ (ОП-35–80)',                             7050,          2),
  ('Замена манометра',                                   800,           3),
  ('Раструб к ОУ-1–3 с выкидной трубой',               2000,          4),
  ('Замена ЗПУ (ОУ-1–10)',                              4145,          5),
  ('Раструб к ОУ-5',                                    2700,          6),
  ('Покраска огнетушителя ОП-10',                       2200,          7),
  ('Покраска огнетушителя ОП-35/50',                    5500,          8),
  ('Переосвидетельствование ОП-5',                      1000,          9),
  ('Утилизация огнетушителя (с составлением Акта)',      500,          10)
) AS v(title, price, ord)
JOIN categories c ON c.name = 'Замена комплектующих огнетушителей'
ON CONFLICT (title, category_id) DO NOTHING;

-- ── Обучение сотрудников ─────────────────────────────────────
INSERT INTO products (title, price_type, price, currency, category_id, sort_order, is_active)
SELECT v.title, 'fixed'::text, v.price, 'KZT', c.id, v.ord, true
FROM (VALUES
  ('Безопасность и охрана труда (с сертификатом)',      12000::numeric, 0),
  ('Пожарный минимум (с удостоверением)',                7000,           1),
  ('Электробезопасность до 1000В (с допуском)',          9000,           2),
  ('Электробезопасность свыше 1000В (с допуском)',       9000,           3),
  ('Оказание первой медицинской помощи',                80000,           4),
  ('Добровольные пожарные формирования',                20000,           5),
  ('Антикоррупция — Комплаенс',                         50000,           6),
  ('Члены Согласительной комиссии',                     15000,           7),
  ('Промышленная безопасность',                          6000,           8),
  ('Действия при землетрясении',                       150000,           9),
  ('Поведенческое обучение NEARMISS',                   35000,          10),
  ('Антитеррористическая защищенность (обучение)',      90000,          11)
) AS v(title, price, ord)
JOIN categories c ON c.name = 'Обучение сотрудников'
ON CONFLICT (title, category_id) DO NOTHING;

-- ── Антитеррористическая защищенность ───────────────────────
INSERT INTO products (title, price_type, price, currency, category_id, sort_order, is_active)
SELECT v.title, v.pt, v.price, 'KZT', c.id, v.ord, true
FROM (VALUES
  ('Разработка и изготовление «Паспорта антитеррористической защищенности объекта»', 'negotiable'::text, NULL::numeric, 0)
) AS v(title, pt, price, ord)
JOIN categories c ON c.name = 'Антитеррористическая защищенность'
ON CONFLICT (title, category_id) DO NOTHING;

-- ── Техническое обслуживание систем ─────────────────────────
INSERT INTO products (title, price_type, price, currency, category_id, sort_order, is_active)
SELECT v.title, v.pt, v.price, 'KZT', c.id, v.ord, true
FROM (VALUES
  ('Обслуживание автоматической пожарной сигнализации',                                               'negotiable'::text, NULL::numeric, 0),
  ('Обслуживание систем пожаротушения',                                                               'negotiable',       NULL,           1),
  ('Обслуживание систем автоматического газового пожаротушения',                                      'negotiable',       NULL,           2),
  ('Обслуживание систем автоматического водяного пожаротушения',                                      'negotiable',       NULL,           3),
  ('Техническое освидетельствование модуля газового пожаротушения',                                   'fixed',            50000,          4),
  ('Сервисное обслуживание слаботочных систем (видеонаблюдение, связь, охранная сигнализация, СКУД)', 'negotiable',       NULL,           5),
  ('Интеграция пожарной автоматики с инженерными коммуникациями здания',                              'negotiable',       NULL,           6),
  ('Составление план-графика ППР и ТО систем пожарной автоматики',                                   'fixed',            35000,          7),
  ('Разработка и восстановление проектной документации по пожарной автоматике',                       'negotiable',       NULL,           8),
  ('Разработка и восстановление технической документации (паспорта, формуляры)',                      'fixed',            80000,          9)
) AS v(title, pt, price, ord)
JOIN categories c ON c.name = 'Техническое обслуживание систем'
ON CONFLICT (title, category_id) DO NOTHING;

-- ── Планы эвакуации ──────────────────────────────────────────
INSERT INTO products (title, price_type, price, currency, category_id, sort_order, is_active)
SELECT v.title, 'fixed'::text, v.price, 'KZT', c.id, v.ord, true
FROM (VALUES
  ('План эвакуаций при ЧС (лист А3, ламинация, каз/рус)',             7000::numeric, 0),
  ('План эвакуаций при ЧС (табличка, основа ПВХ, ламинация)',         8000,          1),
  ('План эвакуаций (в рамке под стеклом, каз/рус)',                   9000,          2),
  ('Схема проезда пожарных машин (алюкобонд, 1.2×1.2 м)',            95000,          3)
) AS v(title, price, ord)
JOIN categories c ON c.name = 'Планы эвакуации'
ON CONFLICT (title, category_id) DO NOTHING;

-- ── Огнезащитная обработка ───────────────────────────────────
INSERT INTO products (title, price_type, price, currency, category_id, sort_order, is_active)
SELECT v.title, 'fixed'::text, v.price, 'KZT', c.id, v.ord, true
FROM (VALUES
  ('Обработка деревянных конструкций (кровля, перегородки, стропила) — пропитка «ОГНЕЗА»', 600::numeric,  0),
  ('Обработка деревянных конструкций (пути эвакуации) — лак «Авангард-Гелиос»',            1500,          1)
) AS v(title, price, ord)
JOIN categories c ON c.name = 'Огнезащитная обработка'
ON CONFLICT (title, category_id) DO NOTHING;

-- ── Испытательная пожарная лаборатория ──────────────────────
INSERT INTO products (title, price_type, price, currency, category_id, sort_order, is_active)
SELECT v.title, 'fixed'::text, v.price, 'KZT', c.id, v.ord, true
FROM (VALUES
  ('Испытания параметров систем вентиляции и противодымной защиты',                         350000::numeric, 0),
  ('Испытания обработанных огнезащитой поверхностей (дерево, металл, ткань)',                40000,          1),
  ('Испытание наружных пожарных металлических лестниц и ограждений кровли',                   6000,          2),
  ('Проверка электропроводки, испытание изоляции проводов и заземляющих устройств',          40000,          3),
  ('Измерение сопротивления петли фаза-нуль',                                                40000,          4),
  ('Испытание стеллажей (1 ряд, 1 п.м.)',                                                    3500,          5),
  ('Испытание средств огнезащиты древесины',                                                 80000,          6),
  ('Испытание средств огнезащиты стальных и ж/б конструкций',                               150000,          7),
  ('Испытание пожарных кранов и клапанов',                                                   80000,          8),
  ('Испытание наружной пожарной металлической лестницы',                                      4000,          9),
  ('Испытание металлического ограждения кровли крыши',                                        4000,         10)
) AS v(title, price, ord)
JOIN categories c ON c.name = 'Испытательная пожарная лаборатория'
ON CONFLICT (title, category_id) DO NOTHING;

-- ── Плакаты по безопасности ──────────────────────────────────
INSERT INTO products (title, price_type, price, currency, category_id, sort_order, is_active)
SELECT v.title, 'fixed'::text, 1400, 'KZT', c.id, v.ord, true
FROM (VALUES
  ('Плакат «Действия при пожаре»',                          0),
  ('Плакат «Использование огнетушителя»',                   1),
  ('Плакат «Использование внутреннего пожарного крана»',    2),
  ('Плакат «Первая медицинская помощь»',                     3),
  ('Плакат «Эвакуация населения при ЧС»',                   4),
  ('Плакат «Электробезопасность»',                          5),
  ('Плакат «Техника безопасности на складе»',               6),
  ('Плакат «Компьютерная безопасность»',                    7),
  ('Плакат «10 простых шагов при землетрясении»',           8)
) AS v(title, ord)
JOIN categories c ON c.name = 'Плакаты по безопасности'
ON CONFLICT (title, category_id) DO NOTHING;

-- ── Журналы ──────────────────────────────────────────────────
INSERT INTO products (title, price_type, price, currency, category_id, sort_order, is_active)
SELECT v.title, 'fixed'::text, 1400, 'KZT', c.id, v.ord, true
FROM (VALUES
  ('Журнал регистрации вводного инструктажа',                                         0),
  ('Журнал регистрации инструктажа по пожарной безопасности',                         1),
  ('Журнал регистрации инструктажа по безопасности и охране труда',                   2),
  ('Журнал учета и технического обслуживания огнетушителей',                          3),
  ('Журнал технического обслуживания пожарной автоматики',                            4),
  ('Журнал перекатки пожарных рукавов',                                               5),
  ('Журнал учета несчастных случаев',                                                 6),
  ('Журнал трехступенчатого контроля за состоянием ОТ и ТБ',                         7),
  ('Журнал учебных мероприятий по антитеррористической подготовке',                   8)
) AS v(title, ord)
JOIN categories c ON c.name = 'Журналы'
ON CONFLICT (title, category_id) DO NOTHING;

-- ── Знаки и таблички ─────────────────────────────────────────
INSERT INTO products (title, price_type, price, currency, category_id, sort_order, is_active)
SELECT v.title, 'fixed'::text, v.price, 'KZT', c.id, v.ord, true
FROM (VALUES
  ('Знаки (наклейка, плотность 250гр)',                            350::numeric, 0),
  ('Знаки (табличка, основа ПВХ 3мм, винил)',                      500,          1),
  ('Знаки (алюкобонд 3.5мм, уличные, светоотражающие)',           2700,          2),
  ('Знаки (светонакопительные ФЭС, основа ПВХ 3мм)',              2000,          3)
) AS v(title, price, ord)
JOIN categories c ON c.name = 'Знаки и таблички'
ON CONFLICT (title, category_id) DO NOTHING;

-- ── Информационные стенды ────────────────────────────────────
INSERT INTO products (title, price_type, price, currency, category_id, sort_order, is_active)
SELECT v.title, 'fixed'::text, 3000, 'KZT', c.id, v.ord, true
FROM (VALUES
  ('Стенд «Уголок гражданской защиты»',           0),
  ('Стенд «Уголок пожарной безопасности»',        1),
  ('Стенд «Техника безопасности»',                2),
  ('Стенд «Компьютерная безопасность»',           3),
  ('Стенд «Безопасность и Охрана труда»',         4),
  ('Стенд «Электробезопасность»',                 5),
  ('Стенд «Безопасность на воде»',                6),
  ('Стенд «Оказание первой медицинской помощи»',  7)
) AS v(title, ord)
JOIN categories c ON c.name = 'Информационные стенды'
ON CONFLICT (title, category_id) DO NOTHING;

-- ── Итог ─────────────────────────────────────────────────────
SELECT
  c.name AS category,
  COUNT(p.id) AS products_count
FROM categories c
LEFT JOIN products p ON p.category_id = c.id
GROUP BY c.name, c.sort_order
ORDER BY c.sort_order;
