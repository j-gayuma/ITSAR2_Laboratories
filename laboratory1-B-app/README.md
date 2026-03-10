# Laboratory 1-B — Student Information System (Microservices)

A Student Information System built with a **microservices architecture**, featuring an API Gateway that communicates with three independent backend services.

---

## Tech Stack

### API Gateway (Main App)

| Layer | Technology | Version |
|-------|-----------|---------|
| Language | PHP | ^8.2 |
| Framework | Laravel | ^12.0 |
| Authentication | Laravel Fortify | ^1.30 |
| SPA Bridge | Inertia.js (Laravel) | ^2.0 |
| Route Typing | Laravel Wayfinder | ^0.1.9 |

### Frontend

| Layer | Technology | Version |
|-------|-----------|---------|
| UI Library | React | ^19.0 |
| Language | TypeScript | ^5.7 |
| Styling | Tailwind CSS | ^4.0 |
| Component Library | Radix UI | various |
| Icons | Lucide React | ^0.475 |
| Build Tool | Vite | ^7.0 |
| HTTP / SPA | Inertia.js (React) | ^2.3 |

### Microservices

| Service | Language | Runtime | Port |
|---------|----------|---------|------|
| Student Service | PHP (no framework) | PHP built-in server | 8001 |
| Course Service | PHP (no framework) | PHP built-in server | 8002 |
| Enrollment Service | PHP (no framework) | PHP built-in server | 8003 |

### Database

Each service has its **own isolated SQLite database**:

| Service | Database file |
|---------|-------------|
| Student Service | `services/student-service/database/student_service.sqlite` |
| Course Service | `services/course-service/database/course_service.sqlite` |
| Enrollment Service | `services/enrollment-service/database/enrollment_service.sqlite` |
| API Gateway | `database/database.sqlite` |

### Dev Tooling

- **ESLint** — JavaScript/TypeScript linting
- **Prettier** — Code formatting
- **Pest PHP** — PHP testing framework
- **Concurrently** — Run multiple processes in parallel

---

## Architecture

```
CLIENT (Browser) → http://localhost:8000
        │
        ▼
API GATEWAY (Laravel + Inertia)  :8000
        │
        ├──► Student Service    :8001   (SQLite)
        ├──► Course Service     :8002   (SQLite)
        └──► Enrollment Service :8003   (SQLite)
```

Services communicate over plain HTTP using the `ServiceClient` class (`app/Services/ServiceClient.php`).

---

## Getting Started

### Prerequisites

- PHP >= 8.2
- Composer
- Node.js >= 18 & npm

### Installation

```bash
# Install PHP dependencies
composer install

# Install JS dependencies
npm install

# Build frontend assets
npm run build

# Copy environment file
cp .env.example .env

# Generate application key
php artisan key:generate
```

### Running the App

**Step 1 — Start all microservices (opens separate terminal windows):**

```bat
start-services.bat
```

**Step 2 — Start the API Gateway:**

```bat
start-gateway.bat
```

Or manually:

```bash
php artisan serve --port=8000
```

The app is now accessible at **http://localhost:8000**.

### Stopping Services

```bat
stop-services.bat
```

---

## Project Structure

```
laboratory1-B-app/
├── app/                  # Laravel application (API Gateway)
│   ├── Http/Controllers/ # Request handlers
│   ├── Models/           # Eloquent models
│   └── Services/         # ServiceClient (HTTP inter-service calls)
├── resources/js/         # React + TypeScript frontend
├── routes/               # Laravel routes
├── services/
│   ├── student-service/  # Student microservice (plain PHP)
│   ├── course-service/   # Course microservice (plain PHP)
│   └── enrollment-service/ # Enrollment microservice (plain PHP)
└── database/             # Gateway migrations & seeders
```

---

## Running Tests

```bash
php artisan test
# or
./vendor/bin/pest
```
