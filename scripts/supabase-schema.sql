-- TastyFruit Complete Database Schema for Supabase
-- Run this in Supabase SQL Editor

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing tables if needed (be careful in production!)
-- DROP TABLE IF EXISTS fruit_types CASCADE;
-- DROP TABLE IF EXISTS products CASCADE;
-- DROP TABLE IF EXISTS recipes CASCADE;
-- DROP TABLE IF EXISTS publications CASCADE;
-- DROP TABLE IF EXISTS users CASCADE;

-- ============================================
-- PRODUCTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS products (
    id TEXT DEFAULT gen_random_uuid()::text PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
    category VARCHAR(50) NOT NULL,
    "imageUrl" TEXT,
    stock INTEGER DEFAULT 0 CHECK (stock >= 0),
    "isActive" BOOLEAN DEFAULT true,
    
    -- Product specific fields
    "layoutType" VARCHAR(20), -- 'layout-a' or 'layout-b'
    "characterSlug" VARCHAR(50),
    gesture TEXT,
    "fruitCardType" VARCHAR(20),
    "bgGradient" VARCHAR(50),
    "fruitCardImage" TEXT,
    
    -- Nutrition info (JSON)
    nutrition JSONB,
    
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- FRUIT TYPES TABLE (Product Variants)
-- ============================================
CREATE TABLE IF NOT EXISTS fruit_types (
    id TEXT DEFAULT gen_random_uuid()::text PRIMARY KEY,
    "productId" TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    slug TEXT NOT NULL,
    image TEXT NOT NULL,
    description TEXT,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- RECIPES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS recipes (
    id TEXT DEFAULT gen_random_uuid()::text PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    "imageUrl" TEXT,
    
    -- Recipe details
    servings VARCHAR(20), -- e.g., "6-8", "1", "2"
    "cookingTime" VARCHAR(50), -- e.g., "60 minutes"
    author VARCHAR(100) NOT NULL,
    difficulty VARCHAR(10) DEFAULT 'Easy' CHECK (difficulty IN ('Easy', 'Medium', 'Hard')),
    
    -- Ingredients and instructions (JSON)
    ingredients JSONB NOT NULL, -- [{name, amount, note?}]
    instructions JSONB NOT NULL, -- [{title, description}]
    
    "isPublished" BOOLEAN DEFAULT false,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- PUBLICATIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS publications (
    id TEXT DEFAULT gen_random_uuid()::text PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL, -- HTML content
    excerpt VARCHAR(500),
    author VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL, -- 'Event', 'Aktivitas', 'Produk', 'Informasi'
    "imageUrl" TEXT,
    "isPublished" BOOLEAN DEFAULT false,
    "publishedAt" TIMESTAMP WITH TIME ZONE,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- USERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS users (
    id TEXT DEFAULT gen_random_uuid()::text PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(100),
    role VARCHAR(20) DEFAULT 'admin',
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- TRIGGERS FOR UPDATED_AT
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW."updatedAt" = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers
DROP TRIGGER IF EXISTS update_products_updated_at ON products;
CREATE TRIGGER update_products_updated_at 
    BEFORE UPDATE ON products 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_fruit_types_updated_at ON fruit_types;
CREATE TRIGGER update_fruit_types_updated_at 
    BEFORE UPDATE ON fruit_types 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_recipes_updated_at ON recipes;
CREATE TRIGGER update_recipes_updated_at 
    BEFORE UPDATE ON recipes 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_publications_updated_at ON publications;
CREATE TRIGGER update_publications_updated_at 
    BEFORE UPDATE ON publications 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_is_active ON products("isActive");
CREATE INDEX IF NOT EXISTS idx_fruit_types_product_id ON fruit_types("productId");
CREATE INDEX IF NOT EXISTS idx_recipes_is_published ON recipes("isPublished");
CREATE INDEX IF NOT EXISTS idx_publications_category ON publications(category);
CREATE INDEX IF NOT EXISTS idx_publications_is_published ON publications("isPublished");

-- Success message
SELECT 'Database schema created successfully!' as message;