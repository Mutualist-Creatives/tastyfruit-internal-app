-- Complete Product & Fruit Type Data Seeding
-- Based on lib/produk-data.ts
-- Run this in Supabase SQL Editor

-- Clear existing data first
DELETE FROM fruit_types WHERE "productId" IN (
  SELECT id FROM products WHERE slug IN ('pisang', 'melon', 'alpukat')
);
DELETE FROM products WHERE slug IN ('pisang', 'melon', 'alpukat');

-- ============================================
-- PRODUCT 1: PISANG
-- ============================================

INSERT INTO products (
  slug, name, description, price, category, 
  stock, "isActive", "layoutType", "characterSlug", 
  gesture, "fruitCardType", "bgGradient", "fruitCardImage", nutrition
) VALUES (
  'pisang',
  'Pisang',
  'Pisang Tasty Fruit® memiliki rasa yang <b>manis</b>, dan <b>kesegaran yang terjamin</b>. Kenali jenis-jenis pisang kami dan pilih yang terbaik untukmu!',
  25000,
  'Buah',
  100,
  true,
  'layout-a',
  'mr-tasty',
  '/assets/mascots/pisang/pisang-gesture-01.png',
  'layout-a',
  '',
  '/assets/produk/pisang/pisang-card.png',
  '{
    "energy": "89 kcal",
    "totalFat": "0.3g",
    "cholesterol": "0mg",
    "fiber": "2.6g",
    "carbohydrates": "22",
    "protein": "1.1g",
    "sodium": "1mg",
    "magnesium": "27mg",
    "potassium": "358mg"
  }'::jsonb
);

-- Pisang Fruit Types
INSERT INTO fruit_types (slug, name, image, description, "productId")
SELECT 
  'tasty-fruit-volcana',
  'Tasty Fruit Volcana',
  '/assets/produk/pisang/Tasty Fruit Volcana.png',
  'Setiap kemasan Tasty Fruit® Volcana berisikan 4-5 pisang premium Grade A, hasil budidaya di dataran tinggi dengan tanah vulkanik yang kaya mineral. Kami menjamin setiap buah aman dikonsumsi dengan proses budidaya yang bebas residu pestisida.',
  p.id
FROM products p WHERE p.slug = 'pisang';

INSERT INTO fruit_types (slug, name, image, description, "productId")
SELECT 
  'tasty-fruit-pops',
  'Tasty Fruit Pops',
  '/assets/produk/pisang/Tasty Fruit Pops.png',
  'Tasty Fruit® Pops berisi tiga pisang Grade A berukuran kecil, ideal untuk camilan sehat. Pisang Tasty Fruit® dibudidayakan di dataran tinggi dengan tanah vulkanik, dijamin bebas residu pestisida, memberikan pisang dengan kualitas terbaik<br><br><b>Pop-sized</b> treats, oh-so-<b>sweet!</b>',
  p.id
FROM products p WHERE p.slug = 'pisang';

INSERT INTO fruit_types (slug, name, image, description, "productId")
SELECT 
  'tasty-fruit-twin',
  'Tasty Fruit Twin',
  '/assets/produk/pisang/Tasty Fruit Twin.png',
  'Dua pisang Cavendish premium dikemas dalam Tasty Fruit® Twin untuk konsumsi snack sehat Anda! Kami memastikan buah kami bebas residu pestisida dan ditumbuhkan di dataran tinggi dengan tanah vulkanik yang menghasilkan buah dengan tekstur dan rasa yang unik.',
  p.id
FROM products p WHERE p.slug = 'pisang';

INSERT INTO fruit_types (slug, name, image, description, "productId")
SELECT 
  'tasty-fruit-max',
  'Tasty Fruit Max',
  '/assets/produk/pisang/Tasty Fruit Max.png',
  'Tasty Fruit® Max berisikan tiga buah pisang Cavendish premium yang dibudidayakan secara etis di dataran tinggi dengan tanah vulkanik dan bebas residu pestisida, sebuah komitmen untuk menjaga keberlanjutan <br><br><b>Three</b>''s the charm, keeps you from <b>harm!</b>',
  p.id
FROM products p WHERE p.slug = 'pisang';

INSERT INTO fruit_types (slug, name, image, description, "productId")
SELECT 
  'tasty-fruit-one',
  'Tasty Fruit One',
  '/assets/produk/pisang/Tasty Fruit One.png',
  'Tinggal kupas, langsung hap! <br><br>Tasty Fruit® One adalah penyelamat yang hadir di saat-saat paling dibutuhkan. Satu pisang Cavendish premium ini bukan cuma praktis, tapi juga kaya energi dan nutrisi dari dataran tinggi. Dijamin bebas residu pestisida, bikin kamu siap hadapi hari tanpa drama!',
  p.id
FROM products p WHERE p.slug = 'pisang';

-- ============================================
-- PRODUCT 2: MELON
-- ============================================

INSERT INTO products (
  slug, name, description, price, category, 
  stock, "isActive", "layoutType", "characterSlug", 
  gesture, "fruitCardType", "bgGradient", "fruitCardImage", nutrition
) VALUES (
  'melon',
  'Melon',
  '<b>Manis lembut atau manis renyah?</b> <br><br>Tasty Fruit® memiliki dua melon yang istimewa dengan sensasi berbeda. Yuk, cari tahu dan pilih melon Tasty Fruit® yang sesuai dengan seleramu!',
  45000,
  'Buah',
  50,
  true,
  'layout-b',
  'oishi-maru',
  '/assets/mascots/melon/melon-gesture-03.png',
  'layout-b',
  '#B5FE28',
  '/assets/produk/melon/melon-card.png',
  '{
    "energy": "34 kcal",
    "totalFat": "0.2g",
    "cholesterol": "0mg",
    "fiber": "0.9g",
    "carbohydrates": "8.2g",
    "protein": "0.8g",
    "sodium": "16mg",
    "magnesium": "12mg",
    "potassium": "267mg"
  }'::jsonb
);

-- Melon Fruit Types
INSERT INTO fruit_types (slug, name, image, description, "productId")
SELECT 
  'aurora-melon',
  'Aurora Melon',
  '/assets/produk/melon/Aurora Melon.png',
  'Tasty Fruit® Aurora melon terkenal dengan teksturnya yang renyah dan juicy. Dibudidayakan di dataran tinggi dengan tanah vulkanik, melon ini memiliki keseimbangan sempurna antara rasa manis dan keharuman yang alami. ',
  p.id
FROM products p WHERE p.slug = 'melon';

INSERT INTO fruit_types (slug, name, image, description, "productId")
SELECT 
  'fujisawa-melon',
  'Fujisawa Melon',
  '/assets/produk/melon/Fujisawa Melon.png',
  'Tasty Fruit® Fujisawa Melon adalah hasil dari keseimbangan sempurna antara alam dan budidaya yang presisi. Melon kami memiliki tekstur yang renyah dan rasa manis yang terukur dengan baik, bukan kebetulan, melainkan perpaduan dari tanah vulkanik dataran tinggi dan perawatan buah ahli dan dari hati. ',
  p.id
FROM products p WHERE p.slug = 'melon';

-- ============================================
-- PRODUCT 3: ALPUKAT
-- ============================================

INSERT INTO products (
  slug, name, description, price, category, 
  stock, "isActive", "layoutType", "characterSlug", 
  gesture, "fruitCardType", "bgGradient", "fruitCardImage", nutrition
) VALUES (
  'alpukat',
  'Alpukat',
  'Alpukat Hass Tasty Fruit® memiliki <b>tekstur lembut</b> dan <b>rasa gurih</b> yang segar. Cari tahu dan rasakan alpukat haas yang tak tertandingi!',
  35000,
  'Buah',
  75,
  true,
  'layout-a',
  'nami',
  '/assets/mascots/alpukat/alpukat-gesture-03.png',
  'layout-b',
  '',
  '/assets/produk/alpukat/alpukat-card.png',
  '{
    "energy": "160 kcal",
    "totalFat": "14.7g",
    "cholesterol": "0mg",
    "fiber": "6.7g",
    "carbohydrates": "8.5g",
    "protein": "2g",
    "sodium": "7mg",
    "magnesium": "29mg",
    "potassium": "485mg"
  }'::jsonb
);

-- Alpukat Fruit Types
INSERT INTO fruit_types (slug, name, image, description, "productId")
SELECT 
  'hass-avocado',
  'Hass Avocado',
  '/assets/produk/alpukat/Hass Avocado.png',
  'Tasty Fruit® Alpukat Hass Grade A adalah pilihan terbaik untuk melengkapi menu sehat Anda. Dibudidayakan secara cermat di dataran tinggi dengan tanah vulkanik, alpukat ini kaya akan lemak tak jenuh tunggal yang baik bagi tubuh.',
  p.id
FROM products p WHERE p.slug = 'alpukat';

-- ============================================
-- VERIFY DATA
-- ============================================

-- Check products
SELECT 
  slug,
  name,
  category,
  "layoutType",
  "characterSlug",
  "fruitCardType"
FROM products
WHERE slug IN ('pisang', 'melon', 'alpukat')
ORDER BY slug;

-- Check fruit types
SELECT 
  ft.slug,
  ft.name,
  p.slug as product_slug
FROM fruit_types ft
JOIN products p ON ft."productId" = p.id
WHERE p.slug IN ('pisang', 'melon', 'alpukat')
ORDER BY p.slug, ft.slug;

-- Count summary
SELECT 
  'Products' as type,
  COUNT(*) as count
FROM products
WHERE slug IN ('pisang', 'melon', 'alpukat')
UNION ALL
SELECT 
  'Fruit Types' as type,
  COUNT(*) as count
FROM fruit_types ft
JOIN products p ON ft."productId" = p.id
WHERE p.slug IN ('pisang', 'melon', 'alpukat');
