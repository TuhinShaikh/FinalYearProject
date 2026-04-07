# Tottenham Hotspur Travel Planner

Frontend + backend + database project.

## Submitted Directory Structure

```text
Tuhin_Shaikh.Submission/
	Tuhin Shaikh.professional
	Tuhin Shaikh.final
	Tuhin Shaikh.demovideo
	Tuhin_Shaikh.code/
		README.md
		docker-compose.yml
		FinalProject/        # Spring Boot backend
			pom.xml
			src/
		frontend/            # React + Vite frontend
			package.json
			src/
		Documents/
```

## Run Locally (Simple)

From the project root, use two terminals.

Terminal 1 (frontend):

```bash
cd frontend
npm install
npm run dev
```

Terminal 2 (backend):

```bash
cd FinalProject
mvn spring-boot:run
```

Default URLs:
- Frontend: http://localhost:5173
- Backend: http://localhost:8080

## Run With Docker (2 commands)

```bash
docker compose up --build
docker compose down
```