# 🚀 Setup TastyFruit Supabase Connection

## 📋 Checklist Setup

### ✅ 1. Get Credentials dari Supabase Dashboard

1. Buka project **"tastyfruit"** di [supabase.com](https://supabase.com)
2. Go to **Settings** > **API**
3. Copy credentials berikut:

```
Project URL: https://xxxxx.supabase.co
anon public: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
service_role: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

4. Go to **Settings** > **Database**
5. Copy **Connection string** > **URI**:

```
postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres
```

### ✅ 2. Update .env File

Ganti di file `.env`:

```env
# Database - Supabase PostgreSQL (ganti dengan credentials Anda)
DATABASE_URL="postgresql://postgres:your_db_password@db.abcdefghijklmnop.supabase.co:5432/postgres"
DIRECT_URL="postgresql://postgres:your_db_password@db.abcdefghijklmnop.supabase.co:5432/postgres"

# Supabase - tastyfruit project (ganti dengan credentials Anda)
NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTY5ODc2NTQzMiwiZXhwIjoyMDE0MzQxNDMyfQ.example_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoic2VydmljZV9yb2xlIiwiaWF0IjoxNjk4NzY1NDMyLCJleHAiOjIwMTQzNDE0MzJ9.example_service_role_key_here

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret_here_generate_random_string
```

### ✅ 3. Setup Database Tables

**Option A: Complete Schema (Recommended)**

1. Di Supabase dashboard, buka **SQL Editor**
2. Klik **New query**
3. Copy-paste dari file `scripts/supabase-schema.sql` dan **Run**
4. Kemudian copy-paste dari file `scripts/supabase-seed-data.sql` dan **Run**

**Option B: Manual (Quick Setup)**

1. Di Supabase dashboard, buka **SQL Editor**
2. Klik **New query**
3. Copy-paste script berikut dan **Run**:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create products table
CREATE TABLE products (
    id TEXT DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
    category VARCHAR(50) NOT NULL,
    "imageUrl" TEXT,
    stock INTEGER DEFAULT 0 CHECK (stock >= 0),
    "isActive" BOOLEAN DEFAULT true,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create recipes table
CREATE TABLE recipes (
    id TEXT DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    ingredients TEXT[] NOT NULL,
    instructions TEXT NOT NULL,
    "cookingTime" INTEGER CHECK ("cookingTime" > 0),
    servings INTEGER CHECK (servings > 0),
    difficulty VARCHAR(10) DEFAULT 'Easy' CHECK (difficulty IN ('Easy', 'Medium', 'Hard')),
    "imageUrl" TEXT,
    "isPublished" BOOLEAN DEFAULT false,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create publications table
CREATE TABLE publications (
    id TEXT DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    excerpt VARCHAR(500),
    author VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL,
    "imageUrl" TEXT,
    "isPublished" BOOLEAN DEFAULT false,
    "publishedAt" TIMESTAMP WITH TIME ZONE,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create users table
CREATE TABLE users (
    id TEXT DEFAULT gen_random_uuid() PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(100),
    role VARCHAR(20) DEFAULT 'admin',
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW."updatedAt" = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers for updated_at
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_recipes_updated_at BEFORE UPDATE ON recipes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_publications_updated_at BEFORE UPDATE ON publications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data
INSERT INTO products (name, description, price, category, stock) VALUES
('Mangga Harum Manis', 'Mangga segar dengan rasa manis dan harum yang khas', 25000, 'Buah Segar', 50),
('Buah Naga Merah', 'Buah naga merah segar kaya antioksidan', 35000, 'Buah Segar', 30),
('Jus Jeruk Segar', 'Jus jeruk segar tanpa pengawet', 15000, 'Jus Buah', 100);

INSERT INTO recipes (title, description, ingredients, instructions, "cookingTime", servings, difficulty, "isPublished") VALUES
('Smoothie Bowl Mangga Naga', 'Smoothie bowl segar dengan kombinasi mangga dan buah naga',
 ARRAY['1 buah mangga matang', '1/2 buah naga merah', '1 pisang beku', '100ml susu almond', 'Topping: granola, kacang almond'],
 '1. Blender semua buah dengan susu almond\n2. Tuang ke dalam bowl\n3. Tambahkan topping sesuai selera',
 15, 2, 'Easy', true);

INSERT INTO publications (title, content, excerpt, author, category, "isPublished", "publishedAt") VALUES
('Manfaat Buah Naga untuk Kesehatan', 'Buah naga merupakan salah satu buah tropis yang kaya akan nutrisi...',
 'Buah naga kaya akan antioksidan dan vitamin C yang baik untuk sistem imun tubuh.',
 'Admin TastyFruit', 'Kesehatan', true, NOW());
```

### ✅ 4. Setup Authentication

1. Buka **Authentication** > **Settings**
2. Di **Site URL**, masukkan: `http://localhost:3000`
3. Di **Redirect URLs**, tambahkan: `http://localhost:3000/auth/callback`
4. **Save** settings

### ✅ 5. Create Admin User

1. Buka **Authentication** > **Users**
2. Klik **"Add user"** (tombol hijau)
3. Isi form:
   - **Email**: `admin@tastyfruit.com`
   - **Password**: `TastyFruit2024!`
   - **Email Confirm**: ✅ (centang - PENTING!)
4. Klik **"Create user"**
5. **Verify**: User muncul dengan status "Confirmed"

### ✅ 6. Setup Storage (Optional - untuk file upload)

1. Buka **Storage**
2. Klik **"Create a new bucket"**
3. Nama bucket: `images`
4. ✅ **Public bucket** (centang)
5. Klik **"Create bucket"**

## 🧪 Test Setup

```bash
# Check environment
bun run setup:check

# Generate Prisma client
bun run db:generate

# Start development server
bun run dev
```

## 🔑 Login Credentials

- **Email**: `admin@tastyfruit.com`
- **Password**: `TastyFruit2024!`

## 📚 Additional Resources

- **Create Admin Guide**: `scripts/create-admin-user.md`
- **Sample Data SQL**: `scripts/seed-admin.sql`

## 🎯 Next Steps

1. ✅ Test login di http://localhost:3000/login
2. ✅ Test dashboard di http://localhost:3000/dashboard
3. ✅ Test create product
4. ✅ Test file upload (jika storage sudah setup)

---

**Jika ada error, check console browser dan terminal untuk detail error message.**

## 📝 Contoh Credentials dari Dashboard Supabase

### Dari Settings > API:

```
Project URL: https://abcdefghijklmnop.supabase.co
Project API keys:
  anon public: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTY5ODc2NTQzMiwiZXhwIjoyMDE0MzQxNDMyfQ.example_anon_key_here
  service_role: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoic2VydmljZV9yb2xlIiwiaWF0IjoxNjk4NzY1NDMyLCJleHAiOjIwMTQzNDE0MzJ9.example_service_role_key_here
```

### Dari Settings > Database > Connection string > URI:

```
postgresql://postgres:[YOUR-PASSWORD]@db.abcdefghijklmnop.supabase.co:5432/postgres
```

## 🔄 Copy-Paste Template

Untuk memudahkan, copy template ini ke file `.env` Anda dan ganti dengan credentials actual:

```env
# Database - Supabase PostgreSQL
DATABASE_URL="postgresql://postgres:GANTI_DENGAN_PASSWORD_ANDA@db.GANTI_DENGAN_PROJECT_ID.supabase.co:5432/postgres"
DIRECT_URL="postgresql://postgres:GANTI_DENGAN_PASSWORD_ANDA@db.GANTI_DENGAN_PROJECT_ID.supabase.co:5432/postgres"

# Supabase - tastyfruit project
NEXT_PUBLIC_SUPABASE_URL=https://GANTI_DENGAN_PROJECT_ID.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=GANTI_DENGAN_ANON_KEY_DARI_DASHBOARD
SUPABASE_SERVICE_ROLE_KEY=GANTI_DENGAN_SERVICE_ROLE_KEY_DARI_DASHBOARD

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=generate_random_string_32_characters_long
```

## 🎯 Cara Mudah Generate NEXTAUTH_SECRET

```bash
# Option 1: Using openssl
openssl rand -base64 32

# Option 2: Using node
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# Option 3: Manual - gunakan string random 32+ karakter
```
