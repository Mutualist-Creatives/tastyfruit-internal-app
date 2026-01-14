# API Documentation - Product CMS

## Overview

This document provides comprehensive documentation for all API endpoints in the Product CMS system. The API follows RESTful conventions and returns JSON responses.

**Base URL:** `/api`

**Authentication:** All endpoints require authentication via Supabase Auth (except where noted).

**Content Type:** `application/json`

---

## Products API

### GET /api/products

Retrieve a paginated list of products with optional filtering and search.

**Query Parameters:**

| Parameter  | Type    | Required | Default | Description                                |
| ---------- | ------- | -------- | ------- | ------------------------------------------ |
| `page`     | number  | No       | 1       | Page number for pagination                 |
| `limit`    | number  | No       | 10      | Number of items per page                   |
| `search`   | string  | No       | ""      | Search term for name and description       |
| `category` | string  | No       | ""      | Filter by category (e.g., "Apel", "Jeruk") |
| `isActive` | boolean | No       | -       | Filter by active status                    |

**Response (200 OK):**

```json
{
  "products": [
    {
      "id": "uuid",
      "name": "Apel Fuji",
      "category": "Apel",
      "description": "Apel manis dengan tekstur renyah",
      "imageUrl": "https://example.com/image.jpg",
      "isActive": true,
      "order": 0,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z",
      "fruitTypes": [
        {
          "id": "uuid",
          "productId": "uuid",
          "name": "Fuji Jepang",
          "slug": "fuji-jepang",
          "description": "Apel Fuji dari Jepang",
          "image": "https://example.com/fuji.jpg",
          "order": 0,
          "createdAt": "2024-01-01T00:00:00.000Z",
          "updatedAt": "2024-01-01T00:00:00.000Z"
        }
      ]
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "totalCount": 25,
    "totalPages": 3,
    "hasNext": true,
    "hasPrev": false
  }
}
```

**Error Responses:**

- `500 Internal Server Error`: Failed to fetch products

---

### POST /api/products

Create a new product.

**Request Body:**

```json
{
  "name": "Apel Fuji",
  "category": "Apel",
  "description": "Apel manis dengan tekstur renyah",
  "imageUrl": "https://example.com/image.jpg",
  "isActive": true
}
```

**Field Validation:**

| Field         | Type    | Required | Constraints               |
| ------------- | ------- | -------- | ------------------------- |
| `name`        | string  | Yes      | 1-100 characters          |
| `category`    | string  | Yes      | Must be non-empty         |
| `description` | string  | No       | -                         |
| `imageUrl`    | string  | No       | Valid URL or empty string |
| `isActive`    | boolean | No       | Default: true             |

**Response (201 Created):**

```json
{
  "id": "uuid",
  "name": "Apel Fuji",
  "category": "Apel",
  "description": "Apel manis dengan tekstur renyah",
  "imageUrl": "https://example.com/image.jpg",
  "isActive": true,
  "order": 0,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

**Error Responses:**

- `400 Bad Request`: Validation failed
  ```json
  {
    "error": "Validation failed",
    "details": [
      {
        "field": "name",
        "message": "Nama produk harus diisi"
      }
    ]
  }
  ```
- `500 Internal Server Error`: Failed to create product

---

### GET /api/products/:id

Retrieve a single product by ID.

**URL Parameters:**

| Parameter | Type   | Description  |
| --------- | ------ | ------------ |
| `id`      | string | Product UUID |

**Response (200 OK):**

```json
{
  "id": "uuid",
  "name": "Apel Fuji",
  "category": "Apel",
  "description": "Apel manis dengan tekstur renyah",
  "imageUrl": "https://example.com/image.jpg",
  "isActive": true,
  "order": 0,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

**Error Responses:**

- `404 Not Found`: Product not found
- `500 Internal Server Error`: Failed to fetch product

---

### PUT /api/products/:id

Update an existing product.

**URL Parameters:**

| Parameter | Type   | Description  |
| --------- | ------ | ------------ |
| `id`      | string | Product UUID |

**Request Body:**

All fields are optional. Only include fields you want to update.

```json
{
  "name": "Apel Fuji Premium",
  "category": "Apel",
  "description": "Updated description",
  "imageUrl": "https://example.com/new-image.jpg",
  "isActive": false
}
```

**Response (200 OK):**

```json
{
  "id": "uuid",
  "name": "Apel Fuji Premium",
  "category": "Apel",
  "description": "Updated description",
  "imageUrl": "https://example.com/new-image.jpg",
  "isActive": false,
  "order": 0,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-02T00:00:00.000Z"
}
```

**Error Responses:**

- `400 Bad Request`: Validation failed
- `500 Internal Server Error`: Failed to update product

---

### DELETE /api/products/:id

Delete a product and all associated fruit types (cascade delete).

**URL Parameters:**

| Parameter | Type   | Description  |
| --------- | ------ | ------------ |
| `id`      | string | Product UUID |

**Response (200 OK):**

```json
{
  "message": "Product deleted successfully"
}
```

**Error Responses:**

- `500 Internal Server Error`: Failed to delete product

**Note:** This operation will cascade delete all fruit types associated with this product.

---

### PATCH /api/products/:id/status

Toggle the active status of a product.

**URL Parameters:**

| Parameter | Type   | Description  |
| --------- | ------ | ------------ |
| `id`      | string | Product UUID |

**Request Body:**

```json
{
  "isActive": false
}
```

**Field Validation:**

| Field      | Type    | Required | Description       |
| ---------- | ------- | -------- | ----------------- |
| `isActive` | boolean | Yes      | New active status |

**Response (200 OK):**

```json
{
  "id": "uuid",
  "name": "Apel Fuji",
  "category": "Apel",
  "description": "Apel manis dengan tekstur renyah",
  "imageUrl": "https://example.com/image.jpg",
  "isActive": false,
  "order": 0,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-02T00:00:00.000Z"
}
```

**Error Responses:**

- `400 Bad Request`: isActive must be a boolean
- `500 Internal Server Error`: Failed to update product status

---

### PATCH /api/products/:id/order

Update the display order of a product (for drag-and-drop reordering).

**URL Parameters:**

| Parameter | Type   | Description  |
| --------- | ------ | ------------ |
| `id`      | string | Product UUID |

**Request Body:**

```json
{
  "newOrder": 5
}
```

**Field Validation:**

| Field      | Type   | Required | Description                        |
| ---------- | ------ | -------- | ---------------------------------- |
| `newOrder` | number | Yes      | New order position (0-based index) |

**Response (200 OK):**

```json
{
  "id": "uuid",
  "name": "Apel Fuji",
  "category": "Apel",
  "description": "Apel manis dengan tekstur renyah",
  "imageUrl": "https://example.com/image.jpg",
  "isActive": true,
  "order": 5,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-02T00:00:00.000Z"
}
```

**Error Responses:**

- `400 Bad Request`: newOrder must be a number
- `500 Internal Server Error`: Failed to update product order

---

## Fruit Types API

### GET /api/fruit-types

Retrieve a list of fruit types with optional filtering by product.

**Query Parameters:**

| Parameter   | Type   | Required | Description            |
| ----------- | ------ | -------- | ---------------------- |
| `productId` | string | No       | Filter by product UUID |

**Response (200 OK):**

```json
{
  "fruitTypes": [
    {
      "id": "uuid",
      "productId": "uuid",
      "name": "Fuji Jepang",
      "slug": "fuji-jepang",
      "description": "Apel Fuji dari Jepang dengan rasa manis",
      "image": "https://example.com/fuji.jpg",
      "order": 0,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z",
      "product": {
        "id": "uuid",
        "name": "Apel Fuji",
        "slug": "apel-fuji"
      }
    }
  ]
}
```

**Error Responses:**

- `401 Unauthorized`: User not authenticated
- `500 Internal Server Error`: Failed to fetch fruit types

---

### POST /api/fruit-types

Create a new fruit type.

**Request Body:**

```json
{
  "productId": "uuid",
  "name": "Fuji Jepang",
  "slug": "fuji-jepang",
  "description": "Apel Fuji dari Jepang dengan rasa manis",
  "image": "https://example.com/fuji.jpg"
}
```

**Field Validation:**

| Field         | Type   | Required | Constraints                     |
| ------------- | ------ | -------- | ------------------------------- |
| `productId`   | string | Yes      | Valid product UUID              |
| `name`        | string | Yes      | Must be non-empty               |
| `slug`        | string | Yes      | Must be non-empty, URL-friendly |
| `description` | string | No       | -                               |
| `image`       | string | No       | Valid URL or null               |

**Response (201 Created):**

```json
{
  "id": "uuid",
  "productId": "uuid",
  "name": "Fuji Jepang",
  "slug": "fuji-jepang",
  "description": "Apel Fuji dari Jepang dengan rasa manis",
  "image": "https://example.com/fuji.jpg",
  "order": 0,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z",
  "product": {
    "id": "uuid",
    "name": "Apel Fuji",
    "slug": "apel-fuji"
  }
}
```

**Error Responses:**

- `400 Bad Request`: Validation error
  ```json
  {
    "error": "Validation error",
    "details": [
      {
        "path": ["name"],
        "message": "Nama wajib diisi"
      }
    ]
  }
  ```
- `401 Unauthorized`: User not authenticated
- `500 Internal Server Error`: Failed to create fruit type

---

### GET /api/fruit-types/:id

Retrieve a single fruit type by ID.

**URL Parameters:**

| Parameter | Type   | Description     |
| --------- | ------ | --------------- |
| `id`      | string | Fruit type UUID |

**Response (200 OK):**

```json
{
  "id": "uuid",
  "productId": "uuid",
  "name": "Fuji Jepang",
  "slug": "fuji-jepang",
  "description": "Apel Fuji dari Jepang dengan rasa manis",
  "image": "https://example.com/fuji.jpg",
  "order": 0,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z",
  "product": {
    "id": "uuid",
    "name": "Apel Fuji",
    "slug": "apel-fuji"
  }
}
```

**Error Responses:**

- `401 Unauthorized`: User not authenticated
- `404 Not Found`: Fruit type not found
- `500 Internal Server Error`: Failed to fetch fruit type

---

### PATCH /api/fruit-types/:id

Update an existing fruit type.

**URL Parameters:**

| Parameter | Type   | Description     |
| --------- | ------ | --------------- |
| `id`      | string | Fruit type UUID |

**Request Body:**

All fields are optional. Only include fields you want to update.

```json
{
  "name": "Fuji Jepang Premium",
  "slug": "fuji-jepang-premium",
  "description": "Updated description",
  "image": "https://example.com/new-fuji.jpg"
}
```

**Response (200 OK):**

```json
{
  "id": "uuid",
  "productId": "uuid",
  "name": "Fuji Jepang Premium",
  "slug": "fuji-jepang-premium",
  "description": "Updated description",
  "image": "https://example.com/new-fuji.jpg",
  "order": 0,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-02T00:00:00.000Z",
  "product": {
    "id": "uuid",
    "name": "Apel Fuji",
    "slug": "apel-fuji"
  }
}
```

**Error Responses:**

- `400 Bad Request`: Validation error
- `401 Unauthorized`: User not authenticated
- `500 Internal Server Error`: Failed to update fruit type

---

### DELETE /api/fruit-types/:id

Delete a fruit type.

**URL Parameters:**

| Parameter | Type   | Description     |
| --------- | ------ | --------------- |
| `id`      | string | Fruit type UUID |

**Response (200 OK):**

```json
{
  "message": "Fruit type deleted successfully"
}
```

**Error Responses:**

- `401 Unauthorized`: User not authenticated
- `500 Internal Server Error`: Failed to delete fruit type

---

### PATCH /api/fruit-types/:id/order

Update the display order of a fruit type (for drag-and-drop reordering).

**URL Parameters:**

| Parameter | Type   | Description     |
| --------- | ------ | --------------- |
| `id`      | string | Fruit type UUID |

**Request Body:**

```json
{
  "newOrder": 3
}
```

**Field Validation:**

| Field      | Type   | Required | Description                        |
| ---------- | ------ | -------- | ---------------------------------- |
| `newOrder` | number | Yes      | New order position (0-based index) |

**Response (200 OK):**

```json
{
  "id": "uuid",
  "productId": "uuid",
  "name": "Fuji Jepang",
  "slug": "fuji-jepang",
  "description": "Apel Fuji dari Jepang dengan rasa manis",
  "image": "https://example.com/fuji.jpg",
  "order": 3,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-02T00:00:00.000Z"
}
```

**Error Responses:**

- `400 Bad Request`: newOrder must be a number
- `500 Internal Server Error`: Failed to update fruit type order

---

## Data Models

### Product

```typescript
interface Product {
  id: string; // UUID
  name: string; // Product name (1-100 chars)
  category: string; // Category (e.g., "Apel", "Jeruk")
  description?: string; // Optional rich text description
  imageUrl?: string; // Optional image URL
  isActive: boolean; // Active/inactive status
  order: number; // Display order (for drag-and-drop)
  createdAt: string; // ISO 8601 timestamp
  updatedAt: string; // ISO 8601 timestamp
  fruitTypes?: FruitType[]; // Related fruit types (when included)
}
```

### FruitType

```typescript
interface FruitType {
  id: string; // UUID
  productId: string; // Foreign key to Product
  name: string; // Fruit type name
  slug: string; // URL-friendly identifier
  description?: string; // Optional rich text description
  image?: string; // Optional image URL
  order: number; // Display order (for drag-and-drop)
  createdAt: string; // ISO 8601 timestamp
  updatedAt: string; // ISO 8601 timestamp
  product?: {
    // Related product (when included)
    id: string;
    name: string;
    slug: string;
  };
}
```

---

## Removed Fields

The following fields have been **removed** from the Product model as this is a CMS for content management, not an e-commerce system:

- ~~`price`~~ - No longer used (removed)
- ~~`stock`~~ - No longer used (removed)
- ~~`sku`~~ - No longer used (removed)

These fields should not be included in any API requests or responses.

---

## Common Error Responses

### 400 Bad Request

Returned when request validation fails.

```json
{
  "error": "Validation failed",
  "details": [
    {
      "field": "name",
      "message": "Nama produk harus diisi"
    }
  ]
}
```

### 401 Unauthorized

Returned when authentication is required but not provided.

```json
{
  "error": "Unauthorized"
}
```

### 404 Not Found

Returned when a requested resource doesn't exist.

```json
{
  "error": "Product not found"
}
```

### 500 Internal Server Error

Returned when an unexpected server error occurs.

```json
{
  "error": "Failed to fetch products"
}
```

---

## Notes

1. **Authentication**: All endpoints require Supabase authentication. Include the auth token in your requests.

2. **Pagination**: The products list endpoint supports pagination. Use `page` and `limit` query parameters to control pagination.

3. **Cascade Delete**: Deleting a product will automatically delete all associated fruit types.

4. **Ordering**: The `order` field is used for drag-and-drop functionality. Lower numbers appear first.

5. **Slug Generation**: When creating fruit types, slugs should be URL-friendly (lowercase, hyphenated).

6. **Image URLs**: Image URLs can be either external URLs or Supabase Storage URLs.

7. **Rich Text**: Description fields support rich text formatting (HTML).

---

## Example Usage

### Creating a Product with Fruit Types

```javascript
// 1. Create a product
const productResponse = await fetch("/api/products", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    name: "Apel Fuji",
    category: "Apel",
    description: "Apel manis dengan tekstur renyah",
    imageUrl: "https://example.com/apel.jpg",
    isActive: true,
  }),
});
const product = await productResponse.json();

// 2. Create fruit types for the product
const fruitTypeResponse = await fetch("/api/fruit-types", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    productId: product.id,
    name: "Fuji Jepang",
    slug: "fuji-jepang",
    description: "Apel Fuji dari Jepang",
    image: "https://example.com/fuji.jpg",
  }),
});
```

### Searching and Filtering Products

```javascript
// Search for products with "apel" in name or description
const response = await fetch("/api/products?search=apel&page=1&limit=10");
const data = await response.json();

// Filter by category and status
const filtered = await fetch("/api/products?category=Apel&isActive=true");
```

### Reordering Products

```javascript
// Update product order after drag-and-drop
await fetch(`/api/products/${productId}/order`, {
  method: "PATCH",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ newOrder: 3 }),
});
```
