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
Designed and coded SVG-based UML class diagram to visualize system architecture. Diagram includes core entities (User, Booking, Payment, TransportRoute, ParkingSpot) and relationships (composition, association, inheritance). Saved diagram as architecture.svg and added to project repository. Validated rendering in browser and documented design rationale.

17/10/2025
Refactored backend modules to align with Observer pattern. Integrated ObserverManager.notify() into booking confirmation logic. Added unit tests for observer registration and message dispatch. Committed changes to add-svg branch and pushed with upstream tracking. Updated README with architectural diagram and design pattern explanation.


