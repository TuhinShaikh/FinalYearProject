
# Tottenham Hotspur Travel Assistant

Final-year project web application for matchday travel and parking support.

The system includes:
- Backend API built with Spring Boot (Java 17)
- Frontend web app built with React and Vite
- Authentication, journey planning, ride suggestions, accessibility settings, and payment integration

## Project Structure

- Backend: FinalProject
- Frontend: frontend

Both services must run at the same time during development.

## Technology Stack

### Backend
- Java 17
- Spring Boot
- Spring Security
- Spring Data JPA
- PostgreSQL
- JWT
- JUnit and Mockito
- JaCoCo

### Frontend
- React
- Vite
- React Router
- Axios
- Vitest and Testing Library

## Prerequisites

- Java 17 JDK
- Maven
- Node.js 18+ and npm
- PostgreSQL (default local port 5432)

## Configuration

The backend reads sensitive values from environment variables.

Required variables:
- JWT_SECRET
- SQUARE_ACCESS_TOKEN
- DB_USERNAME
- DB_PASSWORD

Example values are provided in:
- FinalProject/.env.example

### Set Variables (Linux/macOS/WSL)

```bash
export JWT_SECRET="replace-with-32-byte-secret"
export SQUARE_ACCESS_TOKEN="replace-with-square-token"
export DB_USERNAME="postgres"
export DB_PASSWORD="postgres"
```

### Set Variables (PowerShell)

```powershell
$env:JWT_SECRET = "replace-with-32-byte-secret"
$env:SQUARE_ACCESS_TOKEN = "replace-with-square-token"
$env:DB_USERNAME = "postgres"
$env:DB_PASSWORD = "postgres"
```

## Run the Backend

```bash
cd FinalProject
mvn spring-boot:run
```

Backend default URL:
- http://localhost:8080

## Run the Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend default URL:
- http://localhost:5173

The frontend development server proxies API calls to the backend.

## Testing

### Backend Tests

```bash
cd FinalProject
mvn test
```

### Frontend Tests

```bash
cd frontend
npm test
```

### Frontend Coverage

```bash
cd frontend
npm run test:coverage
```

## Notes for Assessment

- Code is documented with Javadocs and focused inline comments.
- Unit and integration tests are included for both backend and frontend.
- Security-sensitive values are externalized via environment variables.

## Troubleshooting

- If backend startup fails, verify Java version is 17 and PostgreSQL is running.
- If frontend cannot call APIs, confirm backend is running on port 8080.
- If tests fail in Windows shell, run commands through WSL where project tooling is configured.