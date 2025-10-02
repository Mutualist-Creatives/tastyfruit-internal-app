# 🚀 Quick Guide: Menambahkan User Admin Baru

## ✅ Fitur User Management Sudah Siap!

### 📁 Files Created:

- ✅ `/users` - List all users
- ✅ `/users/tambah` - Create new user
- ✅ `/users/edit/[id]` - Edit user
- ✅ API routes for CRUD operations
- ✅ Validation schemas
- ✅ Sidebar menu updated

## 🎯 Cara Menambahkan User Baru:

### Method 1: Via Dashboard UI (Recommended)

1. **Login sebagai Admin**

   ```
   Email: admin@tastyfruit.com
   Password: TastyFruit2024!
   ```

2. **Buka User Management**

   ```
   Dashboard → Sidebar → Users
   ```

3. **Klik "Tambah User"**

4. **Isi Form:**

   - **Nama**: John Doe
   - **Email**: john@tastyfruit.com
   - **Password**: SecurePass123 (min 8 karakter)
   - **Role**: Pilih salah satu:
     - `Admin` - Full access
     - `Editor` - Can create & edit
     - `Viewer` - Read only

5. **Klik "Simpan User"**

6. **Done!** User baru sudah bisa login

### Method 2: Via API

```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@tastyfruit.com",
    "password": "SecurePass123",
    "role": "editor"
  }'
```

### Method 3: Via Supabase SQL (Direct)

```sql
-- 1. Create user in Supabase Auth first (via Dashboard)
-- 2. Then add to database:

INSERT INTO "User" (id, name, email, role)
VALUES (
  'user-id-from-supabase-auth',
  'John Doe',
  'john@tastyfruit.com',
  'editor'
);
```

## 🔐 Role Permissions:

### Admin

- ✅ Manage users (create, edit, delete)
- ✅ Manage products
- ✅ Manage recipes
- ✅ Manage publications
- ✅ View dashboard

### Editor

- ❌ Cannot manage users
- ✅ Manage products
- ✅ Manage recipes
- ✅ Manage publications
- ✅ View dashboard

### Viewer

- ❌ Cannot manage users
- ❌ Cannot create/edit/delete
- ✅ View products
- ✅ View recipes
- ✅ View publications
- ✅ View dashboard

## 🎨 UI Features:

- ✅ Search users by name/email
- ✅ Filter by role
- ✅ Pagination
- ✅ Edit user info
- ✅ Change user role
- ✅ Delete user
- ✅ Role badges with colors
- ✅ Form validation
- ✅ Loading states
- ✅ Success/error toasts

## 🔒 Security:

- ✅ Only admins can manage users
- ✅ Cannot delete own account
- ✅ Password min 8 characters
- ✅ Email validation
- ✅ Authentication required
- ✅ Supabase Auth integration

## 📊 Test the Feature:

### 1. Access User Management

```
http://localhost:3000/users
```

### 2. Create Test User

```
Name: Test Editor
Email: editor@tastyfruit.com
Password: TestPass123
Role: editor
```

### 3. Login with New User

```
Logout → Login with new credentials
```

### 4. Verify Permissions

```
- Editor should NOT see Users menu
- Editor CAN create products/recipes/publications
```

## 🐛 Troubleshooting:

### "Only admins can create users"

- Make sure you're logged in as admin
- Check your current user role in database

### "User already exists"

- Email must be unique
- Check if user already exists in Supabase Auth

### "Failed to create user"

- Check Supabase connection
- Verify environment variables
- Check console for detailed error

## 📚 Complete Documentation:

For detailed guide: `USER-MANAGEMENT-GUIDE.md`

---

**🎉 User Management is ready to use!**

**Access**: `/users`
**Admin Login**: `admin@tastyfruit.com` / `TastyFruit2024!`
