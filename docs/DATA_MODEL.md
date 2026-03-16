# Data Model - Gestion de Courriers EST SB

The database is managed via **Prisma ORM** and hosted on **PostgreSQL**.

## 📊 Entity Relationship Summary

The system is centered around the tracking of mail (`Courier`) between different organizational units (`Entity`).

### Core Models

#### 1. Courier
*   Represents a physical or digital mail item.
*   Tracked by a unique `reference` and a `subject`.
*   Has a `Priority` (NORMAL, URGENT, VERY_URGENT).
*   Has a `CourierState` (NEW, IN_PROGRESS, TREATED, REJECTED, ARCHIVED).

#### 2. Entity
*   Represents a department, office, or university unit.
*   Hierarchy is supported via `parentEntityId`.
*   Connects to Couriers via `sentCouriers` and `receivedCouriers`.

#### 3. User & Role
*   Users belong to an `Entity`.
*   Roles: `SUPER_ADMIN`, `ADMIN`, `CHEF`, `AGENT`, `AUDITOR`.

#### 4. StateHistory
*   Maintains a detailed log of every state change for a courier.
*   Includes notes and the user who made the change.

## 🛠️ Enums

The following enums are synchronized across the entire stack:

*   **Role**: Defines access levels.
*   **CourierState**: Defines the workflow steps.
*   **Priority**: Defines the urgency of the mail.

## 🛡️ Data Integrity
*   Cascading deletes are implemented where appropriate (e.g., `StateHistory` and `Attachments` are deleted if their `Courier` is removed).
*   Unique constraints are enforced on `email`, `reference`, and `code`.
