# API Reference - Gestion de Courriers EST SB

This document outlines how the frontend communicates with the NestJS API.

## 🔐 Authentication

All protected requests must include a Bearer Token in the `Authorization` header.

*   **Token Storage**: JSON Web Tokens (JWT) are stored in `localStorage` as `access_token`.
*   **Login**: `POST /auth/login` - Returns `{ access_token, user }`.

## 📡 Core Endpoints

### Couriers
*   `GET /couriers`: List couriers with pagination and search.
*   `GET /couriers/:id`: Get detailed information about a specific courier.
*   `POST /couriers`: Create a new courier tracking entry.
*   `PATCH /couriers/:id/state`: Update the state of a courier with optional notes.

### Entities & Users
*   `GET /entities`: List all university units.
*   `GET /users`: List all registered users.
*   `POST /users`: Admin only - Create new users.

### Referentials
*   `GET /categories`: Manage mail categories.
*   `GET /courier-types`: Manage types (e.g., Invoice, Official Letter).

## 📄 Response Format

The backend uses a standard response interceptor to wrap all data:

```json
{
  "success": true,
  "data": { ... },
  "timestamp": "2024-03-14T..."
}
```

The frontend API client (`lib/api.ts`) automatically unwraps the `data` field for easier usage in components.

## 📁 File Uploads
*   **Integration**: Uses **UploadThing**.
*   **Endpoint**: `POST /attachments/upload` - Handles file multipart data and associates it with a `courierId`.
