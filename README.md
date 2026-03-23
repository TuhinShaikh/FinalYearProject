

# **How to Run the Application**

### ** Project Structure**
- **Backend:** Spring Boot (Java 17) → `FinalProject/`
- **Frontend:** React (Vite) → `frontend/`
- **Both must run at the same time**

---

#  **Prerequisites**
- Java 17 (JDK)  
- Maven  
- Node.js v18+ & npm  
- PostgreSQL (running on **port 5432**)  

---

#  **1. Run the Backend (Spring Boot)**
- Open a terminal  
- Navigate to backend:  
  ```bash
  cd FinalProject
  ```
- Start server:  
  ```bash
  mvn spring-boot:run
  ```
- Backend runs at: **http://localhost:8080**  
- Ensure correct DB credentials in `application.properties`

---

#  **2. Run the Frontend (React + Vite)**
- Open a second terminal  
- Navigate to frontend:  
  ```bash
  cd frontend
  ```
- Install dependencies (first time only):  
  ```bash
  npm install
  ```
- Start dev server:  
  ```bash
  npm run dev
  ```
- Frontend runs at: **http://localhost:5173**

---

# ** Accessing the App**
- Visit **http://localhost:5173**  
- Frontend automatically proxies API requests to **http://localhost:8080**
-

---