# 👤 Cara Membuat Admin User di Supabase

## 🎯 Option 1: Via Supabase Dashboard (Recommended)

### Step 1: Buka Authentication

1. Login ke [supabase.com](https://supabase.com)
2. Pilih project **"tastyfruit"**
3. Buka **Authentication** > **Users**

### Step 2: Add User

1. Klik **"Add user"** (tombol hijau)
2. Isi form:
   ```
   Email: admin@tastyfruit.com
   Password: TastyFruit2024!
   ```
3. ✅ **Centang "Email Confirm"** (agar langsung verified)
4. Klik **"Create user"**

### Step 3: Verify User Created

- User akan muncul di list dengan status **"Confirmed"**
- Email: `admin@tastyfruit.com`
- Status: ✅ Confirmed

## 🎯 Option 2: Via SQL (Advanced)

Jika ingin create via SQL, buka **SQL Editor** dan run:

```sql
-- Insert user ke auth.users (Supabase auth table)
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'admin@tastyfruit.com',
  crypt('TastyFruit2024!', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '{"provider": "email", "providers": ["email"]}',
  '{"name": "Admin TastyFruit"}',
  false,
  '',
  '',
  '',
  ''
);

-- Insert ke users table kita (optional)
INSERT INTO users (email, name, role) VALUES
('admin@tastyfruit.com', 'Admin TastyFruit', 'admin');
```

## 🧪 Test Login

Setelah user dibuat, test login:

1. **Start development server:**

   ```bash
   bun run dev
   ```

2. **Buka:** http://localhost:3000/login

3. **Login dengan:**

   - **Email:** `admin@tastyfruit.com`
   - **Password:** `TastyFruit2024!`

4. **Expected result:** Redirect ke dashboard

## 🔧 Troubleshooting

### Jika login gagal:

1. **Check console browser** untuk error messages
2. **Check terminal** untuk server errors
3. **Verify environment variables** dengan `bun run setup:check`

### Jika user tidak bisa login:

1. **Check di Supabase Dashboard** > **Authentication** > **Users**
2. **Pastikan status "Confirmed"** (bukan "Unconfirmed")
3. **Reset password** jika perlu

### Jika redirect tidak bekerja:

1. **Check Site URL** di **Authentication** > **Settings**
2. **Pastikan:** `http://localhost:3000`
3. **Check Redirect URLs:** `http://localhost:3000/auth/callback`

## 🎯 Multiple Admin Users (Optional)

Untuk menambah admin lain:

```
Email: admin2@tastyfruit.com
Password: TastyFruit2024!

Email: manager@tastyfruit.com
Password: TastyFruit2024!
```

## 🔐 Password Policy

Recommended password format:

- **Minimal 8 karakter**
- **Kombinasi huruf besar, kecil, angka, simbol**
- **Contoh:** `TastyFruit2024!`, `Admin123!@#`, `Supabase2024$`
