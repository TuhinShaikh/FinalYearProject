# Project Diary
This file tracks project progress and reflections.

01/10/2025
Project officially begins. Reviewed project specification and requirements for Advanced Web Development module. Identified Tottenham Hotspur Stadium parking and transport management as project focus. Started preliminary research on similar applications.

02/10/2025
Researched React vs Angular vs Vue.js for frontend framework selection. Examined community support, performance benchmarks, and learning curves. Leaning towards React due to strong ecosystem and WebSocket support.

03/10/2025
Investigated backend technologies: Node.js/Express vs Django vs Ruby on Rails. Compared async capabilities, API development ease, and scalability. Node.js appears most suitable for real-time features required in this project.

04/10/2025
Studied TfL Unified API documentation. Reviewed available endpoints for journey planning, service disruptions, and station information. Noted rate limiting considerations (500 requests/minute). Registered for API key.

05/10/2025
Researched Square Payment API integration. Examined tokenization workflow and PCI compliance requirements. Reviewed sandbox environment setup procedures. Downloaded sample code for payment processing.

06/10/2025
Deep dive into WCAG 2.1 accessibility guidelines. Focused on Level AA compliance requirements: color contrast ratios, keyboard navigation, ARIA labels, and screen reader compatibility. Installed WAVE and axe DevTools for testing.

07/10/2025
Drafted project plan document. Wrote abstract outlining project goals, main/secondary objectives, and advanced features. Completed timeline breakdown for Term 1 with weekly milestones. Identified risks and mitigation strategies. Submitted project plan at 14:00.

08/10/2025
Finalized technology comparison matrix. Created detailed comparison table evaluating React, Angular, Vue.js against criteria: performance, learning curve, community support, WebSocket integration, and ecosystem maturity. React selected with justification.

09/10/2025
Initialized project repository structure. Set up Git repository and pushed initial commit to GitHub. Created .gitignore file and README with project overview. Configured Node.js project with package.json. Installed initial dependencies: Express, PostgreSQL driver, bcrypt, jsonwebtoken.

10/10/2025
Started database design. Created initial ER diagram for core entities: Users, ParkingSpots, Bookings, Payments, and TransportRoutes. Identified relationships and cardinality. Began normalization analysis to ensure 3NF compliance.

11/10/2025
Continued database design work. Refined ER diagram with additional entities for accessibility preferences and user profiles. Defined primary keys, foreign keys, and constraints. Documented data dictionary with field types and descriptions.

12/10/2025
Researched design patterns applicable to project. Studied MVC pattern for overall architecture, Repository pattern for data access abstraction, Observer pattern for WebSocket real-time updates, and Factory pattern for object creation. Documented pattern selection rationale.

13/10/2025
Drafted N-tier architecture diagram showing clear separation: Presentation Layer (React), Application Layer (Node.js/Express API), and Data Layer (PostgreSQL + Redis). Documented responsibilities and communication protocols between layers.

14/10/2025
Completed technology stack comparison report (Week 2 deliverable). Wrote software engineering justification for selected technologies: React for reactive UI, Node.js for async operations, PostgreSQL for ACID compliance, Redis for caching. Included performance benchmarks and scalability considerations. Committed all documentation to GitHub.

15/10/2025
Installed PostgreSQL locally and configured development environment. Created initial database named stadium_parking_db. Set up connection pooling configuration. Tested database connectivity from Node.js application.

16/10/2025
Began implementing database schema. Created Users table with fields: user_id (UUID primary key), email (unique), hashed_password, first_name, last_name, is_disabled (boolean), created_at timestamp. Applied NOT NULL constraints where appropriate.

17/10/2025
Created ParkingSpots table with fields: spot_id (UUID), spot_number (unique), type (ENUM: standard/accessible/premium), is_available (boolean), price_per_hour (DECIMAL), created_at. Added check constraints for price validation (must be positive).

18/10/2025
Implemented Bookings table with proper foreign key relationships to Users and ParkingSpots. Fields include: booking_id (UUID), user_id (FK), spot_id (FK), booking_date, start_time, end_time, total_amount, status (ENUM: pending/confirmed/cancelled), version_number (for optimistic locking). Created indexes on user_id, spot_id, and booking_date for query optimization.

19/10/2025
Created Payments table linked to Bookings: payment_id (UUID), booking_id (FK), amount, square_token, payment_status (ENUM: pending/completed/failed/refunded), processed_at timestamp. Ensured one-to-one relationship with Bookings table.

20/10/2025
Implemented AccessibilityPreferences table: user_id (FK to Users), needs_step_free (boolean), has_blue_badge (boolean), needs_audio_navigation (boolean), high_contrast_mode (boolean), preferred_text_size (ENUM). Created one-to-one relationship with Users.

21/10/2025
Started user authentication system. Installed bcrypt for password hashing. Implemented user registration endpoint (POST /api/auth/register) with validation: email format check, password strength requirements (min 8 chars, uppercase, lowercase, number), duplicate email prevention. Successfully tested registration with Postman.