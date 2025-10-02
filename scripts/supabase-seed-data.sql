-- TastyFruit Seed Data
-- Run this AFTER running supabase-schema.sql

-- ============================================
-- SEED PRODUCTS (Pisang, Melon, Alpukat)
-- ============================================

-- 1. PISANG
INSERT INTO products (
    slug, name, description, price, category, "layoutType", 
    "characterSlug", gesture, "fruitCardType", "fruitCardImage",
    nutrition, stock, "isActive"
) VALUES (
    'pisang',
    'Pisang Tasty Fruit',
    'Pisang Tasty Fruit® memiliki rasa yang <b>manis</b>, dan <b>kesegaran yang terjamin</b>. Kenali jenis-jenis pisang kami dan pilih yang terbaik untukmu!',
    25000,
    'Buah Segar',
    'layout-a',
    'mr-tasty',
    '/assets/mascots/pisang/pisang-gesture-01.png',
    'layout-a',
    '/assets/produk/pisang/pisang-card.png',
    '{"energy": "89 kcal", "totalFat": "0.3g", "cholesterol": "0mg", "fiber": "2.6g", "carbohydrates": "22g", "protein": "1.1g", "sodium": "1mg", "magnesium": "27mg", "potassium": "358mg"}'::jsonb,
    100,
    true
) ON CONFLICT (slug) DO NOTHING;

-- Pisang Fruit Types
INSERT INTO fruit_types ("productId", name, slug, image, description)
SELECT 
    id,
    'Tasty Fruit Volcana',
    'tasty-fruit-volcana',
    '/assets/produk/pisang/Tasty Fruit Volcana.png',
    'Setiap kemasan Tasty Fruit® Volcana berisikan 4-5 pisang premium Grade A, hasil budidaya di dataran tinggi dengan tanah vulkanik yang kaya mineral.'
FROM products WHERE slug = 'pisang'
ON CONFLICT DO NOTHING;

INSERT INTO fruit_types ("productId", name, slug, image, description)
SELECT 
    id,
    'Tasty Fruit Pops',
    'tasty-fruit-pops',
    '/assets/produk/pisang/Tasty Fruit Pops.png',
    'Tasty Fruit® Pops berisi tiga pisang Grade A berukuran kecil, ideal untuk camilan sehat. <b>Pop-sized</b> treats, oh-so-<b>sweet!</b>'
FROM products WHERE slug = 'pisang'
ON CONFLICT DO NOTHING;

INSERT INTO fruit_types ("productId", name, slug, image, description)
SELECT 
    id,
    'Tasty Fruit Twin',
    'tasty-fruit-twin',
    '/assets/produk/pisang/Tasty Fruit Twin.png',
    'Dua pisang Cavendish premium dikemas dalam Tasty Fruit® Twin untuk konsumsi snack sehat Anda!'
FROM products WHERE slug = 'pisang'
ON CONFLICT DO NOTHING;

-- 2. MELON
INSERT INTO products (
    slug, name, description, price, category, "layoutType",
    "characterSlug", gesture, "fruitCardType", "bgGradient", "fruitCardImage",
    nutrition, stock, "isActive"
) VALUES (
    'melon',
    'Melon Tasty Fruit',
    '<b>Manis lembut atau manis renyah?</b> <br><br>Tasty Fruit® memiliki dua melon yang istimewa dengan sensasi berbeda.',
    45000,
    'Buah Segar',
    'layout-b',
    'oishi-maru',
    '/assets/mascots/melon/melon-gesture-03.png',
    'layout-b',
    '#B5FE28',
    '/assets/produk/melon/melon-card.png',
    '{"energy": "34 kcal", "totalFat": "0.2g", "cholesterol": "0mg", "fiber": "0.9g", "carbohydrates": "8.2g", "protein": "0.8g", "sodium": "16mg", "magnesium": "12mg", "potassium": "267mg"}'::jsonb,
    50,
    true
) ON CONFLICT (slug) DO NOTHING;

-- Melon Fruit Types
INSERT INTO fruit_types ("productId", name, slug, image, description)
SELECT 
    id,
    'Aurora Melon',
    'aurora-melon',
    '/assets/produk/melon/Aurora Melon.png',
    'Tasty Fruit® Aurora melon terkenal dengan teksturnya yang renyah dan juicy. Dibudidayakan di dataran tinggi dengan tanah vulkanik.'
FROM products WHERE slug = 'melon'
ON CONFLICT DO NOTHING;

INSERT INTO fruit_types ("productId", name, slug, image, description)
SELECT 
    id,
    'Fujisawa Melon',
    'fujisawa-melon',
    '/assets/produk/melon/Fujisawa Melon.png',
    'Tasty Fruit® Fujisawa Melon adalah hasil dari keseimbangan sempurna antara alam dan budidaya yang presisi.'
FROM products WHERE slug = 'melon'
ON CONFLICT DO NOTHING;

-- 3. ALPUKAT
INSERT INTO products (
    slug, name, description, price, category, "layoutType",
    "characterSlug", gesture, "fruitCardType", "fruitCardImage",
    nutrition, stock, "isActive"
) VALUES (
    'alpukat',
    'Alpukat Hass Tasty Fruit',
    'Alpukat Hass Tasty Fruit® memiliki <b>tekstur lembut</b> dan <b>rasa gurih</b> yang segar.',
    35000,
    'Buah Segar',
    'layout-a',
    'nami',
    '/assets/mascots/alpukat/alpukat-gesture-03.png',
    'layout-b',
    '/assets/produk/alpukat/alpukat-card.png',
    '{"energy": "160 kcal", "totalFat": "14.7g", "cholesterol": "0mg", "fiber": "6.7g", "carbohydrates": "8.5g", "protein": "2g", "sodium": "7mg", "magnesium": "29mg", "potassium": "485mg"}'::jsonb,
    40,
    true
) ON CONFLICT (slug) DO NOTHING;

-- Alpukat Fruit Type
INSERT INTO fruit_types ("productId", name, slug, image, description)
SELECT 
    id,
    'Hass Avocado',
    'hass-avocado',
    '/assets/produk/alpukat/Hass Avocado.png',
    'Tasty Fruit® Alpukat Hass Grade A adalah pilihan terbaik untuk melengkapi menu sehat Anda.'
FROM products WHERE slug = 'alpukat'
ON CONFLICT DO NOTHING;

-- ============================================
-- SEED RECIPES
-- ============================================

INSERT INTO recipes (
    title, description, "imageUrl", servings, "cookingTime", author, difficulty,
    ingredients, instructions, "isPublished"
) VALUES (
    'Banana Bread',
    'Roti pisang klasik yang lembut dan harum',
    '/assets/landing-page/what-to-cook/png/photo-3.png',
    '6-8',
    '60 minutes',
    'John Doe',
    'Easy',
    '[
        {"name": "Pisang Matang", "amount": "3 buah", "note": "Lumatkan hingga halus"},
        {"name": "Tepung Terigu", "amount": "1 1/2 cangkir"},
        {"name": "Gula", "amount": "1 cangkir"},
        {"name": "Telur", "amount": "1 butir"},
        {"name": "Mentega", "amount": "1/3 cangkir", "note": "Lelehkan"}
    ]'::jsonb,
    '[
        {"title": "Panaskan Oven", "description": "Siapkan oven di suhu 175°C dan olesi loyang roti dengan mentega dan tepung."},
        {"title": "Campurkan Bahan Basah", "description": "Lumatkan pisang, lalu masukkan mentega cair, gula, telur, dan vanila. Aduk hingga rata."},
        {"title": "Campurkan Bahan Kering", "description": "Di mangkuk terpisah, campurkan tepung terigu, baking soda, dan garam."},
        {"title": "Satukan Adonan", "description": "Masukkan campuran kering ke dalam campuran pisang, aduk perlahan hingga tercampur."},
        {"title": "Panggang Roti", "description": "Tuang adonan ke dalam loyang dan panggang selama 55-65 menit atau hingga matang sempurna."}
    ]'::jsonb,
    true
),
(
    'Smoothie Bowl',
    'Smoothie bowl segar dengan topping favorit',
    '/assets/landing-page/what-to-cook/png/photo-1.png',
    '1',
    '10 minutes',
    'Alex Johnson',
    'Easy',
    '[
        {"name": "Aneka Beri Beku", "amount": "1 1/2 cangkir"},
        {"name": "Pisang Beku", "amount": "1 buah", "note": "Potong-potong"},
        {"name": "Yogurt", "amount": "1/2 cangkir"},
        {"name": "Topping (Granola, Buah)", "amount": "Secukupnya"}
    ]'::jsonb,
    '[
        {"title": "Blender Semua Bahan", "description": "Masukkan aneka beri beku, potongan pisang beku, dan yogurt ke dalam blender."},
        {"title": "Haluskan hingga Kental", "description": "Blender dengan kecepatan tinggi hingga adonan menjadi kental dan halus seperti es krim."},
        {"title": "Sajikan dan Hias", "description": "Tuang smoothie ke dalam mangkuk, lalu hias dengan granola, irisan buah segar, atau topping favorit lainnya."}
    ]'::jsonb,
    true
) ON CONFLICT DO NOTHING;

-- ============================================
-- SEED PUBLICATIONS
-- ============================================

INSERT INTO publications (
    title, content, excerpt, author, category, "imageUrl", "isPublished", "publishedAt"
) VALUES (
    'Pop-up booth Tasty Fruit hadir di Farmer''s Market Summarecon Mall Serpong!',
    '<h2>Terobosan Baru di Dunia Kuliner</h2><p>Industri makanan terus berkembang, dan kami di <strong>Tasty Fruit</strong> selalu berada di garis depan inovasi. Baru-baru ini, tim R&D kami berhasil menciptakan serangkaian produk makanan sehat yang tidak hanya lezat tetapi juga kaya akan nutrisi.</p><p><em>Fokus utama kami adalah mengurangi gula dan garam tanpa mengorbankan rasa.</em> Kami percaya bahwa makanan sehat harus bisa dinikmati oleh semua orang.</p>',
    'Tasty Fruit hadir di Farmer''s Market dengan booth pop-up yang menawarkan produk segar dan sehat.',
    'Tim Tasty Fruit',
    'Event',
    '/assets/artikel/publikasi/houses.jpg',
    true,
    NOW()
),
(
    'Jalan-jalan ke kebun Tasty Fruit, yuk!',
    '<h2>Kunjungi Kebun Kami</h2><p>Kami mengundang Anda untuk mengunjungi kebun Tasty Fruit dan melihat langsung bagaimana kami menanam buah-buahan berkualitas tinggi dengan metode organik.</p><p>Pengalaman edukatif yang menyenangkan untuk seluruh keluarga!</p>',
    'Ajakan untuk mengunjungi kebun Tasty Fruit dan melihat proses budidaya buah organik.',
    'Jane Doe',
    'Aktivitas',
    '/assets/artikel/publikasi/farmer.jpg',
    false,
    NULL
),
(
    'Produk baru dari Tasty Fruit: Volcana!',
    '<h2>Introducing Volcana</h2><p>Pisang premium dari dataran tinggi vulkanik yang kaya mineral. Setiap kemasan berisi 4-5 pisang Grade A dengan kualitas terbaik.</p>',
    'Peluncuran produk baru Tasty Fruit Volcana - pisang premium dari dataran tinggi.',
    'John Smith',
    'Produk',
    '/assets/artikel/publikasi/farmer-2.jpg',
    true,
    NOW()
) ON CONFLICT DO NOTHING;

-- ============================================
-- SEED ADMIN USER
-- ============================================

INSERT INTO users (email, name, role) VALUES 
('admin@tastyfruit.com', 'Admin TastyFruit', 'admin')
ON CONFLICT (email) DO NOTHING;

-- Success message
SELECT 'Seed data inserted successfully!' as message,
       (SELECT COUNT(*) FROM products) as products_count,
       (SELECT COUNT(*) FROM fruit_types) as fruit_types_count,
       (SELECT COUNT(*) FROM recipes) as recipes_count,
       (SELECT COUNT(*) FROM publications) as publications_count;