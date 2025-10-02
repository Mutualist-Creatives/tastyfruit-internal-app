-- Seed Admin User untuk TastyFruit
-- Run this in Supabase SQL Editor after creating tables

-- Insert sample admin user ke users table
INSERT INTO users (email, name, role) VALUES 
('admin@tastyfruit.com', 'Admin TastyFruit', 'admin')
ON CONFLICT (email) DO NOTHING;

-- Insert sample data untuk testing
INSERT INTO products (name, description, price, category, stock, "isActive") VALUES
('Mangga Harum Manis', 'Mangga segar dengan rasa manis dan harum yang khas', 25000, 'Buah Segar', 50, true),
('Buah Naga Merah', 'Buah naga merah segar kaya antioksidan', 35000, 'Buah Segar', 30, true),
('Jus Jeruk Segar', 'Jus jeruk segar tanpa pengawet', 15000, 'Jus Buah', 100, true),
('Alpukat Mentega', 'Alpukat mentega premium untuk smoothie', 20000, 'Buah Segar', 25, true),
('Smoothie Strawberry', 'Smoothie strawberry segar dengan yogurt', 18000, 'Smoothie', 40, true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO recipes (title, description, ingredients, instructions, "cookingTime", servings, difficulty, "isPublished") VALUES
('Smoothie Bowl Mangga Naga', 'Smoothie bowl segar dengan kombinasi mangga dan buah naga yang kaya nutrisi', 
 ARRAY['1 buah mangga matang', '1/2 buah naga merah', '1 pisang beku', '100ml susu almond', 'Topping: granola, kacang almond', '1 sdm madu'],
 E'1. Blender mangga, buah naga, dan pisang dengan susu almond hingga halus\n2. Tuang ke dalam bowl\n3. Tambahkan topping granola dan kacang almond\n4. Siram dengan madu\n5. Sajikan segera',
 15, 2, 'Easy', true),
 
('Salad Buah Tropis', 'Salad buah segar dengan dressing madu jeruk nipis yang menyegarkan',
 ARRAY['1 buah mangga', '1 buah nanas', '2 buah kiwi', '1 buah pepaya', '2 sdm madu', '1 jeruk nipis', 'Daun mint segar'],
 E'1. Potong semua buah menjadi dadu berukuran sedang\n2. Campur madu dengan perasan jeruk nipis\n3. Siram dressing ke atas buah\n4. Aduk rata dan diamkan 10 menit\n5. Hias dengan daun mint dan sajikan',
 20, 4, 'Easy', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO publications (title, content, excerpt, author, category, "isPublished", "publishedAt") VALUES
('Manfaat Buah Naga untuk Kesehatan', 
 E'Buah naga merupakan salah satu buah tropis yang kaya akan nutrisi dan memiliki banyak manfaat untuk kesehatan.\n\nKandungan Nutrisi:\n- Vitamin C tinggi untuk sistem imun\n- Antioksidan untuk melawan radikal bebas\n- Serat untuk pencernaan\n- Zat besi untuk mencegah anemia\n\nManfaat untuk kesehatan:\n1. Meningkatkan sistem kekebalan tubuh\n2. Menjaga kesehatan kulit\n3. Membantu pencernaan\n4. Mengontrol gula darah\n5. Menjaga kesehatan jantung', 
 'Buah naga kaya akan antioksidan dan vitamin C yang baik untuk sistem imun tubuh serta memiliki banyak manfaat kesehatan lainnya.', 
 'Admin TastyFruit', 'Kesehatan', true, NOW()),

('Tips Memilih Buah Segar di Pasar', 
 E'Memilih buah segar yang berkualitas memerlukan ketelitian dan pengetahuan yang tepat.\n\nTips Umum:\n1. Perhatikan warna dan tekstur kulit\n2. Cium aroma buah\n3. Tekan lembut untuk cek kematangan\n4. Hindari buah dengan bintik hitam\n\nTips Spesifik per Jenis Buah:\n\nMangga:\n- Pilih yang warnanya cerah\n- Aroma harum di bagian tangkai\n- Tekstur sedikit lunak saat ditekan\n\nAlpukat:\n- Warna hijau tua hingga kehitaman\n- Tekstur sedikit lunak\n- Tidak ada bintik hitam\n\nJeruk:\n- Berat saat digenggam\n- Kulit halus dan mengkilap\n- Aroma segar', 
 'Panduan lengkap untuk memilih buah-buahan segar dengan kualitas terbaik di pasar tradisional maupun supermarket.', 
 'Admin TastyFruit', 'Tips', false)
ON CONFLICT (id) DO NOTHING;

-- Show success message
SELECT 'Sample data inserted successfully!' as message;