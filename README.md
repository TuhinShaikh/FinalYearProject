# Final Year Project
How to Run the Application

This project is a mono-repo containing two distinct parts:

Backend: Spring Boot (Java 17) located in the FinalProject/ folder.

Frontend: React (Vite) located in the frontend/ folder.

You must run both terminals simultaneously for the application to work.

 Prerequisites
Ensure you have the following installed:

Java 17 (JDK)

Maven (Apache Maven)

Node.js (v18 or higher) & npm

PostgreSQL (Running on port 5432)

1. Run the Backend (Spring Boot)
Open a terminal.

Navigate to the backend directory:

Bash

cd FinalProject
Install dependencies and run the server:

Bash

mvn spring-boot:run
The server will start on: http://localhost:8080

(Note: Ensure your application.properties file has the correct PostgreSQL username/password).

2. Run the Frontend (React + Vite)
Open a second terminal.

Navigate to the frontend directory:

Bash

cd frontend
Install the JavaScript dependencies (first time only):

Bash

npm install
Start the development server:

Bash

npm run dev
The application will run on: http://localhost:5173

🌍 Accessing the App
Once both servers are running:

Open your browser and go to http://localhost:5173 to use the application.

The frontend will automatically proxy requests to the backend at port 8080.