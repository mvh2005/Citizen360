# 🏙️ Citizen360 — Smart Civic Complaint Portal

<div align="center">
  <h3>Making Cities Better, One Complaint at a Time</h3>
  <p>
    A full-stack civic engagement platform that empowers citizens to report urban issues and track their resolution in real-time — powered by <strong>React 19</strong>, <strong>Spring Boot 3</strong>, and <strong>MySQL</strong>.
  </p>

  ![Java](https://img.shields.io/badge/Java-17-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)
  ![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.4.2-6DB33F?style=for-the-badge&logo=springboot&logoColor=white)
  ![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)
  ![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=for-the-badge&logo=vite&logoColor=white)
  ![MySQL](https://img.shields.io/badge/MySQL-8-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
  ![TailwindCSS](https://img.shields.io/badge/Tailwind%20CSS-v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
</div>

---

## 📋 Table of Contents

- [What is Citizen360?](#-what-is-citizen360)
- [Features](#-features)
- [Architecture Overview](#%EF%B8%8F-architecture-overview)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Prerequisites](#-prerequisites)
- [Getting Started](#-getting-started)
  - [1. Clone the Repository](#1-clone-the-repository)
  - [2. Start the Backend](#2-start-the-backend)
  - [3. Start the Frontend](#3-start-the-frontend)
- [Environment & Configuration](#-environment--configuration)
- [API Endpoints](#-api-endpoints)
- [Authentication Flow (JWT)](#-authentication-flow-jwt)
- [Database Schema](#-database-schema)
- [Default Seed Users](#-default-seed-users)
- [Roles & Permissions](#-roles--permissions)
- [Departments Supported](#-departments-supported)
- [Complaint Lifecycle](#-complaint-lifecycle)
- [File Uploads](#-file-uploads)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🌆 What is Citizen360?

**Citizen360** is a **Smart City Initiative** that makes civic engagement simple, transparent, and effective. Citizens can instantly report problems like potholes, broken street lights, garbage overflows, or water leaks directly from their browser — complete with photo evidence and GPS coordinates.

Municipal officers are then notified, assigned the task, and can update the resolution status in real-time. The citizen can track every step, from submission to resolution, just like tracking a food delivery.

---

## 🌟 Features

| Feature | Description |
|---|---|
| 📍 **GPS Location Detection** | Automatically pins the exact location of any civic issue using browser Geolocation API |
| 📸 **Multi-Image Uploads** | Attach photo evidence with live preview before submission |
| 🏢 **Auto Department Assignment** | Complaints are routed to the correct department based on the category |
| 📊 **Live Complaint Tracking** | Citizens can follow every stage: `PENDING → ASSIGNED → IN_PROGRESS → RESOLVED` |
| 🔐 **JWT Authentication** | Secure login/register with role-based access control |
| 🗺️ **Interactive Map View** | See live civic issues on a neighborhood map |
| 👮 **Officer Dashboard** | Officers can view, filter, assign, and close complaints |
| ✨ **AI Category Detection** *(Planned)* | AI reads your photo and suggests the right complaint category |
| 🔔 **SMS & Email Alerts** *(Planned)* | Real-time notifications on status updates |

---

## 🏗️ Architecture Overview

```
┌──────────────────────────────────────────────────────────────┐
│                       USER'S BROWSER                         │
│                                                              │
│   React 19 Frontend (Vite dev server on port 5173)           │
│   ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐     │
│   │ Home     │  │ Auth     │  │ Report   │  │ Track    │     │
│   │ Page     │  │ (Login/  │  │ Complaint│  │ Status   │     │
│   │          │  │ Register)│  │          │  │          │     │
│   └──────────┘  └──────────┘  └──────────┘  └──────────┘     │
│                                                              │
│         All /api/* requests → Vite Proxy → port 8080         │
└───────────────────────────┬──────────────────────────────────┘
                            │ HTTP / JSON (REST API)
┌───────────────────────────▼──────────────────────────────────┐
│                    SPRING BOOT BACKEND                       │
│                     (port 8080)                              │
│                                                              │
│   ┌─────────────┐  ┌─────────────┐  ┌────────────────────┐   │
│   │ Auth        │  │ Complaint   │  │ Dashboard /        │   │
│   │ Controller  │  │ Controller  │  │ File Controller    │   │
│   └──────┬──────┘  └──────┬──────┘  └─────────┬──────────┘   │
│          │                │                   │              │
│   ┌──────▼────────────────────────────────────▼────────────┐ │
│   │                JWT Security Filter                     │ │
│   │          (validates every protected request)           │ │
│   └────────────────────────────────────────────────────────┘ │
│                                                              │
│   ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│   │ Auth        │  │ Complaint   │  │ File Storage        │  │
│   │ Service     │  │ Service     │  │ Service             │  │
│   └──────┬──────┘  └──────┬──────┘  └───────┬─────────────┘  │
│          │                │                 │                │
│   ┌──────▼────────────────▼─────────────────▼─────────────┐  │
│   │              Spring Data JPA Repositories             │  │
│   └─────────────────────────┬─────────────────────────────┘  │
└─────────────────────────────┼────────────────────────────────┘
                              │ JDBC (MySQL Connector)
┌─────────────────────────────▼────────────────────────────────┐
│                    MYSQL DATABASE                            │
│              citizen360_db @ localhost:3306                  │
│                                                              │
│   [ users ]  [ complaints ]  [ complaint_images ]            │
│   [ complaint_timeline ]                                     │
└──────────────────────────────────────────────────────────────┘
```

---

## 🛠️ Tech Stack

### Frontend
| Tool | Version | Purpose |
|---|---|---|
| **React** | 19 | UI component framework |
| **Vite** | 8 | Fast development bundler & HMR |
| **Tailwind CSS** | v4 | Utility-first styling |
| **TanStack Router** | 1.x | File-based client-side routing |
| **TanStack React Query** | 5.x | Async data fetching & caching |
| **Radix UI** | Latest | Accessible, unstyled UI primitives |
| **Lucide React** | Latest | Clean icon library |
| **Recharts** | 3.x | Responsive charting/data visualization |
| **Framer Motion** | 12.x | Smooth animations & transitions |

### Backend
| Tool | Version | Purpose |
|---|---|---|
| **Java** | 17 | Core language |
| **Spring Boot** | 3.4.2 | Application framework |
| **Spring Security** | 6.x | Authentication & authorization |
| **Spring Data JPA** | 3.x | ORM and database abstraction |
| **Hibernate** | 6.x | JPA implementation |
| **JJWT** | 0.12.6 | JSON Web Token generation & validation |
| **MySQL Connector** | Latest | JDBC driver for MySQL |
| **Maven** | 3.x | Build tool & dependency manager |

### Database
| Tool | Purpose |
|---|---|
| **MySQL 8** | Primary relational database |

---

## 📁 Project Structure

```
Citizen360/
├── 📄 .gitignore
├── 📄 eslint.config.js              # Code quality rules
├── 📄 index.html                    # Entry HTML, single-page app shell
├── 📄 LICENSE
├── 📄 package-lock.json
├── 📄 package.json                  # Frontend dependencies & npm scripts
├── 📄 README.md
├── 📄 tsconfig.json                 # TypeScript configuration
├── 📄 tsconfig.node.json
├── 📄 vite.config.js                # Vite build config
│
├── 📂 .project/                     # Lovable project metadata
│   └── 📄 project.json
│
├── 📂 backend/                      # ─── BACKEND SOURCE ──────────────────
│   ├── 📄 .gitignore
│   ├── 📄 DbFix.class
│   ├── 📄 DbFix.java
│   ├── 📄 pom.xml                   # Maven dependencies & build config
│   └── 📂 src/main/
│       ├── 📂 java/com/citizen360/
│       │   ├── 📄 Citizen360Application.java   # @SpringBootApplication entry
│       │   ├── 📂 controller/               # REST API endpoints
│       │   │   ├── 📄 AdminController.java
│       │   │   ├── 📄 AuthController.java
│       │   │   ├── 📄 ComplaintController.java
│       │   │   ├── 📄 DashboardController.java
│       │   │   └── 📄 FileController.java
│       │   ├── 📂 dto/                      # Data Transfer Objects (request/response shapes)
│       │   │   ├── 📄 AuthRequest.java
│       │   │   ├── 📄 AuthResponse.java
│       │   │   ├── 📄 ComplaintRequest.java
│       │   │   ├── 📄 ComplaintResponse.java
│       │   │   └── 📄 DashboardResponse.java
│       │   ├── 📂 model/                    # JPA Entity classes (DB tables)
│       │   │   ├── 📄 Complaint.java
│       │   │   ├── 📄 ComplaintImage.java
│       │   │   ├── 📄 ComplaintTimeline.java
│       │   │   ├── 📄 User.java
│       │   │   └── 📂 enums/
│       │   │       ├── 📄 ComplaintStatus.java
│       │   │       ├── 📄 Priority.java
│       │   │       └── 📄 Role.java
│       │   ├── 📂 repository/               # Spring Data JPA interfaces (DB queries)
│       │   │   ├── 📄 ComplaintImageRepository.java
│       │   │   ├── 📄 ComplaintRepository.java
│       │   │   ├── 📄 ComplaintTimelineRepository.java
│       │   │   └── 📄 UserRepository.java
│       │   ├── 📂 security/                 # JWT & Spring Security config
│       │   │   ├── 📄 JwtAuthFilter.java
│       │   │   ├── 📄 JwtUtil.java
│       │   │   └── 📄 SecurityConfig.java
│       │   └── 📂 service/                  # Business logic layer
│       │       ├── 📄 AuthService.java
│       │       ├── 📄 ComplaintService.java
│       │       ├── 📄 DashboardService.java
│       │       └── 📄 FileStorageService.java
│       └── 📂 resources/
│           ├── 📄 application.properties  # DB URL, JWT config, server port
│           └── 📄 data.sql                # Seed data (demo users & complaints)
│
├── 📂 public/
│   ├── 📄 favicon.svg
│   └── 📄 icons.svg
│
└── 📂 src/                          # ─── FRONTEND SOURCE ─────────────────
    ├── 📄 App.css                   # Global styles & Tailwind imports
    ├── 📄 App.jsx                   # Root App component
    ├── 📄 main.jsx                  # App entry point, mounts React into DOM
    ├── 📄 routeTree.gen.ts          # Auto-generated route tree (do not edit)
    ├── 📄 router.jsx                # TanStack Router configuration
    ├── 📄 start.tsx
    ├── 📄 styles.css                # Global styles
    │
    ├── 📂 assets/                   # Static assets & images
    │   ├── 📄 download.jpg
    │   └── 📄 smart-city-hero.jpg.ts
    │
    ├── 📂 components/
    │   └── 📂 ui/                   # Shared Radix UI + Tailwind components
    │       ├── 📄 accordation.jsx
    │       ├── 📄 alert-dialog.jsx
    │       ├── 📄 alert.jsx
    │       ├── 📄 aspect-ratio.jsx
    │       ├── 📄 avatar.jsx
    │       ├── 📄 badge.jsx
    │       ├── 📄 breadcrumd.jsx
    │       ├── 📄 button.jsx
    │       ├── 📄 calender.jsx
    │       ├── 📄 card.jsx
    │       ├── 📄 carousel.jsx
    │       ├── 📄 chart.jsx
    │       ├── 📄 checkbox.jsx
    │       ├── 📄 collapsible.jsx
    │       ├── 📄 command.jsx
    │       ├── 📄 context-menu.jsx
    │       ├── 📄 dialog.jsx
    │       ├── 📄 drawer.jsx
    │       ├── 📄 drepdown-menu.jsx
    │       ├── 📄 form.jsx
    │       ├── 📄 hover-card.jsx
    │       ├── 📄 input-otp.jsx
    │       ├── 📄 input.jsx
    │       ├── 📄 label.jsx
    │       ├── 📄 menu-bar.jsx
    │       ├── 📄 navigation-menu.jsx
    │       ├── 📄 pagination.jsx
    │       ├── 📄 poopover.jsx
    │       ├── 📄 progress.jsx
    │       ├── 📄 radio-group.jsx
    │       ├── 📄 resizable.jsx
    │       ├── 📄 scroll-area.jsx
    │       ├── 📄 select.jsx
    │       ├── 📄 seperator.jsx
    │       ├── 📄 sheet.jsx
    │       ├── 📄 sidebar.jsx
    │       ├── 📄 skeleton.jsx
    │       ├── 📄 slider.jsx
    │       ├── 📄 sonner.jsx
    │       ├── 📄 switch.jsx
    │       ├── 📄 table.jsx
    │       ├── 📄 tabs.jsx
    │       ├── 📄 textarea.jsx
    │       ├── 📄 toggle-group.jsx
    │       ├── 📄 toggle.jsx
    │       └── 📄 tooltip.jsx
    │
    ├── 📂 hooks/                    # Custom React hooks
    │   ├── 📄 use-mobile.jsx        # Detects mobile viewport
    │   └── 📄 useAuth.jsx           # Auth state context
    │
    ├── 📂 lib/                      # Utilities & API clients
    │   ├── 📄 api.js                # Fetch() calls to /api/* endpoints
    │   ├── 📄 lovable-error-reporting.ts
    │   └── 📄 utils.js
    │
    └── 📂 routes/                   # Pages (each file = one URL route)
        ├── 📄 __root.jsx            # Root layout
        ├── 📄 auth.jsx              # /auth — Login & Register page
        ├── 📄 dashboard.jsx         # /dashboard — Officer control panel
        ├── 📄 index.jsx             # / — Landing home page
        ├── 📄 report.jsx            # /report — Submit a new complaint
        └── 📄 track.jsx             # /track — Track complaint status

```

---

## ✅ Prerequisites

Before running the project, make sure you have the following installed:

| Tool | Version | Download |
|---|---|---|
| **Node.js** | v18 or higher | https://nodejs.org |
| **Java JDK** | 17 or higher | https://adoptium.net |
| **Apache Maven** | 3.8+ | https://maven.apache.org |
| **MySQL Server** | 8.0+ | https://dev.mysql.com/downloads |
| **Git** | Latest | https://git-scm.com |

> **Tip:** You can verify installations with `node -v`, `java -version`, `mvn -version`, and `mysql --version`.

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/mvh2005/Citizen360.git
cd Citizen360
```

### 2. Start the Backend

> Make sure **MySQL is running** on `localhost:3306` with username `root` and password `root`.

```bash
# Navigate into the backend folder
cd backend

# Build and download all Java dependencies
mvn clean install

# Run the Spring Boot server (starts on port 8080)
mvn spring-boot:run
```

The backend will:
- ✅ Auto-create the `citizen360_db` database if it doesn't exist
- ✅ Auto-create all tables via Hibernate
- ✅ Seed demo users from `data.sql`

### 3. Start the Frontend

> Open a **second terminal** at the root of the project:

```bash
# Install all Node.js dependencies (only needed once)
npm install

# Start the Vite dev server (starts on port 5173)
npm run dev
```

Now open your browser and go to **http://localhost:5173** 🎉

> **Note:** The Vite dev server automatically proxies all `/api/*` requests to `http://localhost:8080`, so you don't need to worry about CORS issues during development.

---

## ⚙️ Environment & Configuration

All backend configuration is in [`backend/src/main/resources/application.properties`](backend/src/main/resources/application.properties):

```properties
# Server
server.port=8080

# MySQL Database
spring.datasource.url=jdbc:mysql://localhost:3306/citizen360_db?createDatabaseIfNotExist=true
spring.datasource.username=root
spring.datasource.password=root

# JPA / Hibernate — auto-updates schema on startup
spring.jpa.hibernate.ddl-auto=update

# JWT Secret & Expiry (24 hours)
app.jwt.secret=Citizen360SuperSecretKey...
app.jwt.expiration-ms=86400000

# File Upload Limits
spring.servlet.multipart.max-file-size=10MB
spring.servlet.multipart.max-request-size=60MB
app.upload.dir=uploads
```

> ⚠️ **Security Note:** For production, move secrets like `jwt.secret` and DB credentials to environment variables or a secrets manager. **Never commit real credentials** to version control.

---

## 📡 API Endpoints

### Auth
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | Public | Register a new user |
| `POST` | `/api/auth/login` | Public | Login and get a JWT token |

### Complaints
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/complaints` | Citizen | Submit a new complaint |
| `GET` | `/api/complaints` | Officer/Admin | Get all complaints |
| `GET` | `/api/complaints/my` | Citizen | Get complaints by logged-in user |
| `GET` | `/api/complaints/{id}` | Authenticated | Get a single complaint |
| `PATCH` | `/api/complaints/{id}/status` | Officer/Admin | Update complaint status |
| `PATCH` | `/api/complaints/{id}/assign` | Officer/Admin | Assign complaint to officer |

### Dashboard
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/dashboard/stats` | Officer/Admin | Get summary statistics |

### Files
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/files/{filename}` | Public | Serve uploaded complaint images |

---

## 🔐 Authentication Flow (JWT)

```
  User                    Frontend                  Backend
   │                         │                          │
   │── Login (email/pass) ──►│                          │
   │                         │── POST /api/auth/login ──►│
   │                         │                          │ Validate credentials
   │                         │                          │ Generate JWT token
   │                         │◄── { token, role, ... } ─│
   │                         │ Store token in           │
   │                         │ localStorage             │
   │                         │                          │
   │── Navigate to /report ─►│                          │
   │                         │── GET /api/complaints ──►│
   │                         │   (Authorization: Bearer │
   │                         │    <token>)              │ JwtAuthFilter validates
   │                         │                          │ token, extracts user
   │                         │◄── complaint data ───────│
   │◄── rendered page ────── │                          │
```

The JWT token:
- Is stored in `localStorage` and sent as `Authorization: Bearer <token>` with every API call
- Expires after **24 hours**
- Encodes the user's **role** to enforce access control on the backend

---

## 🗄️ Database Schema

The database lives on `MySQL @ localhost:3306/citizen360_db`

```sql
-- Users table
users (id, full_name, email, password [BCrypt], role, created_at)

-- Complaints table
complaints (complaint_id, title, description, category, priority,
            status, location, latitude, longitude,
            user_id [FK→users], assigned_officer_id [FK→users],
            created_at, updated_at)

-- Complaint images (multiple images per complaint)
complaint_images (id, complaint_id [FK→complaints], image_url)

-- Complaint timeline (audit trail of status changes)
complaint_timeline (id, complaint_id [FK→complaints], status,
                    note, updated_by [FK→users], updated_at)
```

---

## 👤 Default Seed Users

These users are automatically inserted on first startup (password for all: `password123`):

| Name | Email | Role |
|---|---|---|
| Priya Sharma | `priya@citizen360.com` | CITIZEN |
| Rajeev Menon | `rajeev@citizen360.com` | OFFICER |
| Admin User | `admin@citizen360.com` | ADMIN |

---

## 🔑 Roles & Permissions

| Role | Permissions |
|---|---|
| **CITIZEN** | Register, login, submit complaints, view own complaints, track status |
| **OFFICER** | Login, view all complaints, update status, view dashboard stats |
| **ADMIN** | All Officer permissions + user management |

---

## 🏢 Departments Supported

| Icon | Department | Issues Handled |
|---|---|---|
| 🚧 | **Roads** | Potholes, road damage, missing signage |
| 🗑️ | **Sanitation** | Garbage overflow, waste collection |
| 💧 | **Water Supply** | Leakage, shortage, water quality |
| ⚡ | **Electricity** | Broken street lights, power outages |
| 🌊 | **Drainage** | Blocked drains, flooding |
| 🌳 | **Parks & Gardens** | Maintenance, broken equipment |

---

## 🔄 Complaint Lifecycle

```
                 ┌─────────┐
   Submitted ──► │ PENDING │
                 └────┬────┘
                      │ Officer assigns
                 ┌────▼──────┐
                 │ ASSIGNED  │
                 └────┬──────┘
                      │ Officer starts work
                 ┌────▼───────────┐
                 │  IN_PROGRESS   │
                 └────┬───────────┘
                      │ Work complete
              ┌───────┴────────┐
         ┌────▼─────┐      ┌───▼──────┐
         │ RESOLVED │      │ REJECTED │
         └──────────┘      └──────────┘
```

---

## 📎 File Uploads

Uploaded complaint images are stored on the **server's local filesystem** at:

```
backend/uploads/<uuid>_<original-filename>.<ext>
```

They are served back publicly via:
```
GET /api/files/{filename}
```

> **Production Note:** For scalability, consider migrating to cloud storage like **AWS S3**, **Google Cloud Storage**, or **Azure Blob Storage**.

---

## 🤝 Contributing

Contributions are welcome!

1. Fork the repository
2. Create a new branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m 'feat: add your feature'`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Open a **Pull Request**

---

## 📄 License

MIT License

---

<div align="center">
  <p>Built with ❤️ for smarter, more responsive cities.</p>
</div>
