# 👥 User Management - Complete Guide

## 🎯 Overview

Fitur User Management memungkinkan admin untuk:

- ✅ Menambahkan user baru (admin/editor/viewer)
- ✅ Mengedit informasi user
- ✅ Mengubah role dan permissions
- ✅ Menghapus user
- ✅ Mencari dan filter user

## 🔐 Role & Permissions

### Admin

- **Full Access** - Semua fitur tersedia
- Dapat mengelola users (create, edit, delete)
- Dapat mengelola products, recipes, publications
- Dapat melihat dashboard analytics

### Editor

- **Create & Edit** - Dapat membuat dan mengedit konten
- Dapat mengelola products, recipes, publications
- Tidak dapat mengelola users
- Dapat melihat dashboard analytics

### Viewer

- **Read Only** - Hanya dapat melihat
- Dapat melihat products, recipes, publications
- Tidak dapat create, edit, atau delete
- Dapat melihat dashboard analytics

## 📁 Files Created

### Pages

```
app/(dashboard)/users/page.tsx              - List all users
app/(dashboard)/users/tambah/page.tsx       - Create new user
app/(dashboard)/users/edit/[id]/page.tsx    - Edit user
```

### API Routes

```
app/api/users/route.ts                      - GET (list), POST (create)
app/api/users/[id]/route.ts                 - GET, PATCH, DELETE
```

### Validation

```
lib/validations/user.ts                     - Zod schemas
```

## 🚀 How to Use

### 1. Access User Management

```
Dashboard → Sidebar → Users
```

### 2. Create New User

1. **Click**: "Tambah User" button
2. **Fill form**:
   - Nama Lengkap
   - Email
   - Password (min 8 characters)
   - Role (admin/editor/viewer)
3. **Click**: "Simpan User"

### 3. Edit User

1. **Find user** in list
2. **Click**: "Edit" button
3. **Update** information
4. **Click**: "Update User"

### 4. Delete User

1. **Find user** in list
2. **Click**: "Hapus" button
3. **Confirm** deletion

### 5. Search & Filter

- **Search**: By name or email
- **Filter**: By role (admin/editor/viewer)

## 🔧 API Endpoints

### GET /api/users

List all users with pagination and filters

**Query Parameters:**

```
page=1
limit=10
search=john
role=admin
```

**Response:**

```json
{
  "users": [
    {
      "id": "uuid",
      "name": "John Doe",
      "email": "john@tastyfruit.com",
      "role": "admin",
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 5,
    "totalPages": 1
  }
}
```

### POST /api/users

Create new user

**Request Body:**

```json
{
  "name": "John Doe",
  "email": "john@tastyfruit.com",
  "password": "SecurePass123",
  "role": "editor"
}
```

**Response:**

```json
{
  "id": "uuid",
  "name": "John Doe",
  "email": "john@tastyfruit.com",
  "role": "editor",
  "createdAt": "2024-01-01T00:00:00Z"
}
```

### GET /api/users/:id

Get user by ID

**Response:**

```json
{
  "id": "uuid",
  "name": "John Doe",
  "email": "john@tastyfruit.com",
  "role": "editor",
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z"
}
```

### PATCH /api/users/:id

Update user

**Request Body:**

```json
{
  "name": "John Updated",
  "email": "john.new@tastyfruit.com",
  "password": "NewPassword123",
  "role": "admin"
}
```

All fields are optional.

### DELETE /api/users/:id

Delete user

**Response:**

```json
{
  "message": "User deleted successfully"
}
```

## 🔒 Security Features

### Authentication Required

- All endpoints require valid session
- Unauthorized requests return 401

### Admin-Only Operations

- Only admins can create users
- Only admins can update users
- Only admins can delete users
- Non-admins get 403 Forbidden

### Self-Protection

- Users cannot delete their own account
- Prevents accidental lockout

### Password Security

- Minimum 8 characters required
- Stored securely in Supabase Auth
- Never exposed in API responses

## 🎨 UI Features

### User List

- Responsive table layout
- Search by name/email
- Filter by role
- Pagination support
- Role badges with colors
- Quick edit/delete actions

### Create/Edit Forms

- React Hook Form integration
- Zod validation
- Real-time error messages
- Role descriptions
- Loading states
- Success/error toasts

## 🐛 Error Handling

### Validation Errors

```json
{
  "error": "Validation error",
  "details": [
    {
      "path": ["email"],
      "message": "Email tidak valid"
    }
  ]
}
```

### Permission Errors

```json
{
  "error": "Only admins can create users"
}
```

### Not Found Errors

```json
{
  "error": "User not found"
}
```

## 📊 Database Schema

User table already exists in Prisma schema:

```prisma
model User {
  id        String   @id @default(uuid())
  name      String
  email     String   @unique
  role      String   @default("editor")
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

## 🧪 Testing

### Test Create User

```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@tastyfruit.com",
    "password": "TestPass123",
    "role": "editor"
  }'
```

### Test List Users

```bash
curl http://localhost:3000/api/users?page=1&limit=10
```

### Test Update User

```bash
curl -X PATCH http://localhost:3000/api/users/USER_ID \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Name",
    "role": "admin"
  }'
```

### Test Delete User

```bash
curl -X DELETE http://localhost:3000/api/users/USER_ID
```

## 🎯 Best Practices

### Creating Users

1. Use strong passwords (min 8 chars)
2. Use company email domain
3. Assign appropriate role
4. Verify email is correct

### Managing Roles

1. Start with "viewer" for new users
2. Promote to "editor" when needed
3. Only assign "admin" to trusted users
4. Review roles regularly

### Security

1. Never share admin credentials
2. Use unique passwords
3. Delete inactive users
4. Monitor user activity

## 🚀 Next Steps

### Possible Enhancements

- [ ] Email verification
- [ ] Password reset functionality
- [ ] User activity logs
- [ ] Bulk user import
- [ ] Role-based UI hiding
- [ ] User profile page
- [ ] Avatar upload
- [ ] Last login tracking

## ✅ Success Checklist

- [ ] Can access /users page
- [ ] Can create new user
- [ ] User receives credentials
- [ ] Can login with new user
- [ ] Can edit user info
- [ ] Can change user role
- [ ] Can delete user
- [ ] Search works
- [ ] Filter works
- [ ] Pagination works
- [ ] Only admins can manage users

---

**🎉 User Management is now fully functional!**

**Access**: `https://your-domain.com/users`
**Admin Login**: `admin@tastyfruit.com` / `TastyFruit2024!`
