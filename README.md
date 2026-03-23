
# Tottenham Hotspur Travel Assistant

Simple web app for matchday travel and parking.

## Project Folders

- Backend: `FinalProject`
- Frontend: `frontend`

Run both for full local development.

## Requirements

- Java 17
- Maven
- Node.js 18+ and npm
- PostgreSQL (default: `5432`)

## Run Locally

Backend:

```bash
cd FinalProject
mvn spring-boot:run
```

Frontend:

```bash
cd frontend
npm install
npm run dev
```

- Backend URL: `http://localhost:8080`
- Frontend URL: `http://localhost:5173`

## Quick Fixes

- Backend not starting: check Java is 17 and PostgreSQL is running.
- Frontend API issues: make sure backend is running on port 8080.
- Windows shell test issues: run commands in WSL.