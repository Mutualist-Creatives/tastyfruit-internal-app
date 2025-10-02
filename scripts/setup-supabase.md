# Setup Supabase untuk TastyFruit Admin

## 1. Buat Supabase Project

1. Buka https://supabase.com
2. Sign up/Login dengan GitHub atau email
3. Klik "New Project"
4. Isi detail project:
   - Name: `tastyfruit-admin`
   - Database Password: (buat password yang kuat)
   - Region: pilih yang terdekat (Singapore untuk Indonesia)
5. Klik "Create new project"
6. Tunggu ~2 menit sampai project ready

## 2. Get API Keys

1. Di dashboard Supabase, buka **Settings** > **API**
2. Copy credentials berikut:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
   - **service_role key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

## 3. Update .env File

Ganti di file `.env`:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_ANON_KEY_HERE
SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVICE_ROLE_KEY_HERE

# Database (gunakan Supabase PostgreSQL)
DATABASE_URL="postgresql://postgres:YOUR_DB_PASSWORD@db.YOUR_PROJECT_ID.supabase.co:5432/postgres"
```

## 4. Setup Database Schema

1. Di Supabase dashboard, buka **SQL Editor**
2. Run script berikut untuk create tables:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create products table
CREATE TABLE products (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
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
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
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
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
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
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
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
```

## 5. Setup Authentication

1. Di Supabase dashboard, buka **Authentication** > **Settings**
2. Di **Site URL**, masukkan: `http://localhost:3000`
3. Di **Redirect URLs**, tambahkan: `http://localhost:3000/auth/callback`
4. Save settings

## 6. Setup Storage (untuk file upload)

1. Buka **Storage** di Supabase dashboard
2. Klik "Create a new bucket"
3. Nama bucket: `images`
4. Set sebagai **Public bucket** (centang)
5. Klik "Create bucket"

## 7. Create Admin User

1. Buka **Authentication** > **Users**
2. Klik "Add user"
3. Isi email dan password untuk admin
4. Klik "Create user"

## 8. Test Connection

Setelah setup selesai, restart development server:

```bash
bun run dev
```

Coba login dengan email/password yang dibuat di step 7.
