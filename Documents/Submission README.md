# Tottenham Hotspur Travel Planner

Frontend + backend + database project.

## Submitted Directory Structure

```text
Tuhin_Shaikh.Submission/
	Documents/
		Tuhin Shaikh.final         (Final report; includes user manual and installation manual)
		Tuhin Shaikh.professional  (Professional issues report)
		Tuhin Shaikh.video     (youtube video link)
		Note: Program screenshots are included in the manual section of the final report.
	PROJECT/    (the code)
	README.md
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

## Run With Docker 

```bash
docker compose up --build
docker compose down
```