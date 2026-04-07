# Tottenham Hotspur Travel Planner

Matchday travel and parking app with:
- Frontend (React + Vite + Nginx)
- Backend (Spring Boot)
- Database (PostgreSQL)

## Project Structure

- `FinalProject` -> Spring Boot backend
- `frontend` -> React frontend
- `docker-compose.yml` -> Runs frontend + backend + db together

## Run With Docker (Step by Step)

Use WSL terminal from the project root:

```bash
cd ~/PROJECT
```

### 1. Build and start all services

```bash
sudo docker compose up --build -d
```

### 2. Check status

```bash
sudo docker compose ps
```

You should see:
- `finalproject-frontend` up
- `finalproject-backend` up
- `finalproject-db` up

### 3. Open the app

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:8080`

### 4. View logs

```bash
sudo docker compose logs -f
```

### 5. Stop services

```bash
sudo docker compose down
```

### 6. Full reset (containers + network + volumes)

```bash
sudo docker compose down -v
```

## Docker Commands

Rebuild only backend:

```bash
sudo docker compose build --no-cache backend
```

Rebuild only frontend:

```bash
sudo docker compose build --no-cache frontend
```

Restart one service:

```bash
sudo docker compose restart backend
```

Check running containers quickly:

```bash
sudo docker ps
```

## Run Backend Locally (Without Docker)

From the backend folder:

```bash
cd ~/PROJECT/FinalProject
```

Run Spring Boot on port 8081:

```bash
mvn spring-boot:run -Dspring-boot.run.arguments=--server.port=8081
```