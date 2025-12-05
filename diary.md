# Development Diary

# 01/10/2025:  
Defined system scope and drafted initial requirements for stadium parking management.

# 02/10/2025:  
Outlined ER diagram with User, Booking, ParkingSpot, and Payment entities.

# 03/10/2025:  
Sketched N-tier architecture and backend module boundaries.

# 04/10/2025:  
Set up Spring Boot project structure and base packages.

# 05/10/2025:  
Initialized Git repo with atomic commit workflow and README.

# 07/10/2025:  
Created User.java, Booking.java, ParkingSpot.java with UUIDs and JPA annotations.

# 08/10/2025:  
Added validation annotations and timestamp fields to entities.

# 09/10/2025:  
Implemented UserRepository, BookingRepository, ParkingSpotRepository.

# 10/10/2025:  
Configured PostgreSQL connection pooling and application.yml.

# 11/10/2025:  
Verified schema generation and UUID mapping in database.

# 13/10/2025:  
Started AuthController and AuthService scaffolding.

# 14/10/2025:  
Implemented register/login endpoints with DTOs and validation.

# 15/10/2025:  
Integrated BCrypt password hashing and email format checks.

# 16/10/2025:  
Built JwtUtil.java for token generation and parsing.

# 17/10/2025:  
Added SecurityConfig.java with JWT filter and protected route setup.

# 19/10/2025:  
Created UserDetailsServiceImpl to bridge Spring Security and User entity.

# 20/10/2025:  
Refactored User.java to expose getPassword() for Spring Security.

# 21/10/2025:  
Fixed pom.xml with Spring Security, JJWT, and BCrypt dependencies.

# 22/10/2025:  
Cleaned build path, resolved Booking.java and ParkingSpotRepository errors.

# 23/10/2025:  
Verified authentication flow with Postman and JWT headers.

# 25/10/2025:  
Added exception handling for invalid credentials and missing users.

# 26/10/2025:  
Prepared SQL migration script for initial schema (V1__init.sql).

# 27/10/2025:  
Wrote integration test stubs for AuthController and BookingController.

# 28/10/2025:  
Started frontend scaffolding with React and Vite.

# 29/10/2025:  
Created NavigationBar.js and App.js with routing.

# 31/10/2025:  
Designed CarParkMap.js layout and placeholder for real-time updates.

# 01/11/2025:  
Integrated Square payment sandbox keys in backend.

# 02/11/2025:  
Created PaymentController.java and PaymentService.java.

# 03/11/2025:  
Built React payment form and connected to backend endpoint.

# 04/11/2025:  
Added payment success/failure handling and transaction logging.

# 05/11/2025:  
Verified end-to-end payment flow with test card.

# 07/11/2025:  
Started JourneyController and JourneyService for TfL API integration.

# 08/11/2025:  
Parsed TfL journey results and mapped to DTOs.

# 09/11/2025:  
Extended JourneyService with Greater Anglia disruption alerts.

# 10/11/2025:  
Added WCAG 2.1 accessibility features to React components.

# 11/11/2025:  
Created RideController and RideService for Uber API integration.

# 12/11/2025:  
Built React ride-booking UI and connected to backend.

# 13/11/2025:  
Added error handling middleware for all backend routes.

# 14/11/2025:  
Wrote integration tests for UserController and ParkingSpotController.

# 15/11/2025:  
Finalized all controller/service layers for Week 4 deliverables.

# 16/11/2025:  
Cleaned up commit history and tagged milestone v0.4.

# 17/11/2025:  
Prepared interim report and presentation outline.
Here’s the continuation of your **Development Diary** entries in the same format, carrying on from **17/11/2025** up to **05/12/2025 (presentation submission)**:



#**18/11/2025:**  
Drafted slides covering aims, background, algorithms, and implementation progress.  

#*19/11/2025:**  
Added system overview diagram showing integration of controllers, APIs, database, and frontend.  

*#*20/11/2025:**  
Expanded theory slides to include architectural trade‑offs (JWT vs OAuth, PostgreSQL vs MySQL, Square vs Stripe).  

**21/11/2025:**  
Created design decisions slide to justify technology choices for security, scalability, and usability.  

**22/11/2025:**  
Refined algorithm slides with clearer rationale for Dijkstra (transport reliability) and A* (grid efficiency).  

**23/11/2025:**  
Cleaned placeholder slides and standardized monochrome theme across all presentation pages.  

**24/11/2025:**  
Added future steps slide: push notifications, season ticket management, admin dashboard with analytics.  

**25/11/2025:**  
Drafted summary slide highlighting workflow hygiene, UI polish, and integration achievements.  

**26/11/2025:**  
Prepared assessment criteria alignment slide to map presentation content to marking scheme.  

**27/11/2025:**  
Rehearsed presentation delivery, ensuring clear explanations and timing within allowed limits.  

**28/11/2025:**  
Finalized spoken script for each slide, focusing on clarity and defence of decisions.  

**29/11/2025:**  
Conducted mock Q&A session to practice defending architectural and algorithmic choices.  

**30/11/2025:**  
Reviewed accessibility compliance in slides and ensured diagrams were readable for all audiences.  

**01/12/2025:**  
Polished visuals, added subtle animations for transitions, and checked consistency of fonts and layout.  

**02/12/2025:**  
Integrated closing slide with impact statement and invitation for questions.  

**03/12/2025:**  
Ran through full presentation with stopwatch to confirm delivery within time limit.  

**04/12/2025:**  
Made final edits to slides based on supervisor feedback; ensured all criteria explicitly addressed.  

**05/12/2025:**  
Submitted completed presentation deck and development diary for assessment.  
