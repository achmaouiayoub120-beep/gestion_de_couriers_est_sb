# UML Diagrams: Internal Mail Management System - EST Sidi Bennour

This document contains professional UML diagrams for the final year engineering project (PFE) detailing the architecture and workflow of the Internal Mail Management System.

## 1. Use Case Diagram

This diagram shows the main actors and their interactions with the system.

```mermaid
usecaseDiagram
    actor "SUPER_ADMIN" as sa
    actor "ADMIN" as ad
    actor "CHEF" as ch
    actor "AGENT" as ag
    actor "AUDITOR" as au

    rectangle "Internal Mail Management System" {
        usecase "Login / Authenticate" as UC1
        usecase "Manage Users & Entities" as UC2
        usecase "Create New Courier" as UC3
        usecase "Consult Couriers" as UC4
        usecase "Process / Change Courier State" as UC5
        usecase "Upload/Download Attachments" as UC6
        usecase "View Audit Logs & Stats" as UC7
    }

    sa --> UC1
    sa --> UC2
    sa --> UC4
    sa --> UC7

    ad --> UC1
    ad --> UC4
    ad --> UC7

    ch --> UC1
    ch --> UC3
    ch --> UC4
    ch --> UC5

    ag --> UC1
    ag --> UC3
    ag --> UC4
    ag --> UC5
    ag --> UC6

    au --> UC1
    au --> UC4
    au --> UC7
```

*Note: Use case diagrams in Mermaid are experimental, here is a flowchart representation of the Use Case diagram instead for better compatibility:*

```mermaid
flowchart LR
    subgraph Actors
        SA((SUPER_ADMIN))
        AD((ADMIN))
        CH((CHEF))
        AG((AGENT))
        AU((AUDITOR))
    end

    subgraph System["Internal Mail Management System"]
        UC1([Login / Authenticate])
        UC2([Manage Users & Entities])
        UC3([Create New Courier])
        UC4([Consult Couriers])
        UC5([Process / Change Courier State])
        UC6([Manage Attachments])
        UC7([View Audit Logs & History])
    end

    SA --> UC1 & UC2 & UC4 & UC7
    AD --> UC1 & UC4 & UC7
    CH --> UC1 & UC3 & UC4 & UC5
    AG --> UC1 & UC3 & UC4 & UC5 & UC6
    AU --> UC1 & UC4 & UC7
```

## 2. Class Diagram

Defines the core domain entities (User, Entity, Courier, Category, CourierType, Attachment, StateHistory) and their relationships based on the Prisma schema.

```mermaid
classDiagram
    class User {
        +String id
        +String email
        +String name
        +String password
        +Role role
        +Boolean isActive
        +DateTime createdAt
        +login()
        +updateProfile()
    }

    class Entity {
        +String id
        +String label
        +String code
        +String description
        +String email
        +Boolean isActive
    }

    class Category {
        +String id
        +String label
        +String description
        +Boolean isActive
    }

    class CourierType {
        +String id
        +String label
        +String description
        +Boolean isActive
    }

    class Courier {
        +String id
        +String reference
        +String subject
        +String description
        +Priority priority
        +CourierState state
        +DateTime createdAt
        +changeState()
        +addAttachment()
    }

    class Attachment {
        +String id
        +String name
        +String fileUrl
        +String fileType
        +Int fileSize
        +DateTime uploadedAt
    }

    class StateHistory {
        +String id
        +CourierState state
        +String notes
        +DateTime changedAt
    }

    %% Relationships
    Entity "1" *-- "many" Entity : subEntities (hierarchy)
    User "many" -- "1" Entity : belongsTo
    Entity "1" -- "1" User : hasChef
    
    Courier "many" -- "1" Entity : fromEntity
    Courier "many" -- "1" Entity : toEntity
    Courier "many" -- "A" Category : belongsToCategory
    Courier "many" -- "1" CourierType : hasType
    Courier "many" -- "1" User : createdBy
    
    Courier "1" *-- "many" Attachment : containsFiles
    Courier "1" *-- "many" StateHistory : tracksHistory
    
    StateHistory "many" -- "1" User : changedBy
```

## 3. Sequence Diagram

Illustrates the dynamic behavior for core processes (Login, Create Courier, Change Courier State).

### 3.1. Login Process
```mermaid
sequenceDiagram
    actor User
    participant Frontend as Next.js Client
    participant AuthGuard as AuthGuard (NestJS)
    participant AuthController as AuthController
    participant AuthService as AuthService
    participant Prisma as PostgreSQL (DB)

    User->>Frontend: Enter credentials (email, password)
    Frontend->>AuthController: POST /auth/login {email, password}
    AuthController->>AuthService: validateUser(email, password)
    AuthService->>Prisma: findUnique({ email })
    Prisma-->>AuthService: User Data (Hashed Password)
    AuthService->>AuthService: bcrypt.compare(password, hash)
    AuthService->>AuthController: generateToken(User)
    AuthController-->>Frontend: JWT Token & User Info
    Frontend-->>User: Redirect to Dashboard
```

### 3.2. Create Courier & Upload Attachment
```mermaid
sequenceDiagram
    actor Agent
    participant Frontend as Next.js Client
    participant UploadThing as UploadThing (Cloudinary alternative)
    participant API as CouriersController
    participant Service as CouriersService
    participant Prisma as PostgreSQL

    Agent->>Frontend: Fill Courier Form & Attach File
    Frontend->>UploadThing: Direct Upload File
    UploadThing-->>Frontend: File URL & Public ID
    Frontend->>API: POST /couriers {subject, toEntityId, ..., attachments} (Requires JWT)
    API->>Service: createCourier(data)
    Service->>Prisma: prisma.courier.create({...})
    Prisma-->>Service: Courier Record Created
    Service->>Prisma: prisma.attachment.createMany({...})
    Prisma-->>Service: Attachments Linked
    Service-->>API: Full Courier Detail
    API-->>Frontend: 201 Created
    Frontend-->>Agent: Show Success Notification
```

### 3.3. Change Courier State
```mermaid
sequenceDiagram
    actor Chef
    participant Frontend as Next.js Client
    participant API as CouriersController
    participant Service as CouriersService
    participant Prisma as PostgreSQL

    Chef->>Frontend: Click "Approve" (Change state to TREATED)
    Frontend->>API: PATCH /couriers/:id/state {newState: TREATED, note}
    API->>Service: updateState(id, TREATED, note, userId)
    Service->>Prisma: prisma.courier.update({ state: TREATED })
    Prisma-->>Service: Courier Updated
    Service->>Prisma: prisma.stateHistory.create({...})
    Prisma-->>Service: History Logged
    Service-->>API: Updated Courier
    API-->>Frontend: 200 OK
    Frontend-->>Chef: Update UI State
```

## 4. Activity Diagram

Shows the workflow pipeline of a Courier moving through various states in the system.

```mermaid
stateDiagram-v2
    [*] --> NEW : Courier Created
    NEW --> IN_PROGRESS : Assigned/Opened by Recipient
    
    IN_PROGRESS --> TREATED : Approved / Processed Successfully
    IN_PROGRESS --> REJECTED : Missing Info / Invalid
    
    REJECTED --> IN_PROGRESS : Corrections Made (Resubmitted)
    
    TREATED --> ARCHIVED : Retention Period Reached / Closed
    REJECTED --> ARCHIVED : Final Rejection / Closed
    
    ARCHIVED --> [*]
```

## 5. Component Diagram

Visualizes the structural components of the full-stack architecture.

```mermaid
flowchart TD
    subgraph "Frontend Layer (Next.js)"
        UI[UI Components & Pages]
        AuthCtx[Auth Context]
        APIClient[Axios / Fetch Client]
        UI --> AuthCtx
        UI --> APIClient
    end

    subgraph "Backend API Layer (NestJS)"
        Controllers[REST Controllers]
        Guards[JWT Auth Guards & Throttler]
        Services[Business Logic Services]
        Controllers --> Guards
        Controllers --> Services
    end

    subgraph "Data Access Layer (Prisma ORM)"
        PrismaClient[Prisma Client]
        Services --> PrismaClient
    end

    subgraph "External Services"
        DB[(PostgreSQL Database)]
        Storage[(UploadThing / Cloudinary)]
    end

    APIClient -- "HTTP/JSON" --> Controllers
    PrismaClient -- "TCP/IP" --> DB
    Frontend Layer (Next.js) -- "HTTPS Upload" --> Storage
    Backend API Layer (NestJS) -- "HTTPS API" --> Storage
```

## 6. Deployment Diagram

Displays how the system will be deployed to servers in a production environment.

```mermaid
flowchart TD
    node1["User Browser / Client Device"]
    
    subgraph "Vercel Hosting"
        node2["Next.js Application\n(Static Files + Serverless Functions)"]
    end
    
    subgraph "Render / Railway / VPS"
        node3["NestJS Backend Application\n(Node.js Runtime)"]
    end
    
    subgraph "Managed Database Hosting (e.g., Supabase / AWS RDS)"
        node4[("PostgreSQL 15 Database")]
    end
    
    subgraph "Cloud Storage"
        node5[("UploadThing / Cloudinary\n(File Storage)")]
    end
    
    node1 -- "HTTPS" --> node2
    node2 -- "REST API (HTTPS)" --> node3
    node1 -- "Direct Upload (HTTPS)" --> node5
    node3 -- "TCP (Port 5432)" --> node4
    node3 -- "API calls" --> node5
```
