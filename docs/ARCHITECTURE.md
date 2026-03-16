# Architecture Overview - Gestion de Courriers EST SB

This document describes the high-level architecture of the "Gestion de Courriers EST SB" project, a platform for tracking internal university mail.

## 🏛️ System Architecture

The project follows a classic decoupled **Client-Server** architecture.

### 1. Backend (NestJS)
The backend is built with **NestJS**, a progressive Node.js framework. It provides a modular architecture with:
*   **Modules**: Each feature (Couriers, Auth, Entities, etc.) is encapsulated in its own module.
*   **Controllers**: Handle incoming HTTP requests and map them to service methods.
*   **Services**: Contain the core business logic.
*   **Prisma ORM**: Used for database access and migration management.
*   **Security**: Implements JWT authentication, Role-Based Access Control (RBAC), and rate limiting (Throttler).

### 2. Frontend (Next.js)
The frontend uses **Next.js 15** with the **App Router** for a modern, high-performance user experience.
*   **Protected Routes**: Core business logic is located in `app/(protected)/`.
*   **API Client**: A centralized API client (`lib/api.ts`) manages all communication with the backend.
*   **UI Components**: Built using **Tailwind CSS**, **Shadcn UI**, and **Lucide Icons**.
*   **Themes**: Supports dynamic theme switching (Light/Dark).

## 📂 Directory Structure

```text
root/
├── app/                # Next.js App Router pages and layouts
├── backend/            # NestJS source code
│   ├── prisma/         # Database schema and seeds
│   └── src/            # Application modules, services, and controllers
├── components/         # Reusable UI components
├── lib/                # Shared utilities, types, and API client
├── public/             # Static assets
└── docs/               # Technical documentation
```

## 🔄 Data Flow

1.  **Request**: The frontend sends a request via the `api` client in `lib/api.ts`.
2.  **Auth**: The backend validates the JWT token in `auth/jwt.strategy.ts`.
3.  **Controller**: The request hits a NestJS controller (e.g., `couriers.controller.ts`).
4.  **Logic**: The controller calls the corresponding service.
5.  **Database**: The service uses Prisma to interact with the PostgreSQL database.
6.  **Response**: The result is wrapped in a standard response interceptor and sent back to the client.
