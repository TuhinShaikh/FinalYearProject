Development Diary

***** 01/10/2025 ***** Project Initialization & Scope Definition
I defined the main scope for the "Stadium Transport & Parking Planner" and identified congestion at Tottenham Hotspur Stadium as the core problem. I wrote the first set of functional requirements so I had a clear baseline before building anything.

***** 02/10/2025 ***** Requirements Gathering
I wrote detailed user stories for the three core areas: Authentication, Real-Time Parking, and Payments. I also set non-functional targets, including WCAG 2.1 AA compliance and sub-2-second response time.

***** 03/10/2025 ***** Technology Stack Selection
I chose an N-Tier architecture. I selected Spring Boot for the backend and React/Vite for the frontend after comparing trade-offs around reliability, speed, and developer workflow.

***** 06/10/2025 ***** Database Design (ERD)
I designed the ERD and defined User, Booking, and ParkingSpot with their One-to-Many relationships.

***** 07/10/2025 ***** Database Environment Setup
I installed PostgreSQL locally and created the initial database instance. I configured user roles and permissions to prepare for the Spring Boot connection, ensuring a robust environment for the data layer.

***** 08/10/2025 ***** Backend Project Init
I initialized the Spring Boot project with Maven and set up pom.xml with Spring Web, Spring Data JPA, and PostgreSQL dependencies.

***** 09/10/2025 ***** Entity Implementation
I implemented the Java entity classes (User.java, ParkingSpot.java) and added standard JPA annotations (@Entity, @Table) to define column constraints, ensuring strict data modeling.

***** 10/10/2025 ***** Booking Entity Logic
I implemented the Booking.java entity, focusing on defining foreign keys and timestamp fields (startTime, endTime) required for the reservation logic.

***** 13/10/2025 ***** Repository Layer
I created UserRepository and BookingRepository with JpaRepository so I could use a clean data access layer without writing manual SQL.

***** 14/10/2025 ***** Service Layer Skeleton
I created UserService and BookingService and defined clear service contracts before implementing business methods.

***** 15/10/2025 ***** Database Connection Testing
I configured application.properties and ran the application to verify the connection to PostgreSQL. I successfully auto-generated the database schema using Hibernate ddl-auto.

***** 16/10/2025 ***** Basic CRUD Testing
I wrote a simple CommandLineRunner to seed dummy parking spots and verified that CRUD persistence worked end-to-end.

***** 17/10/2025 ***** Security Architecture Planning
I researched Spring Security options and chose a stateless JWT approach instead of server-side sessions.

***** 20/10/2025 ***** Security Dependencies
I added spring-boot-starter-security and jjwt dependencies and began implementing the SecurityConfig class to define the filter chain.

***** 21/10/2025 ***** JWT Utility Implementation
I implemented JwtUtil.java, writing methods to generate signed tokens upon login and validate tokens on incoming API requests using a secret key.

***** 22/10/2025 ***** Registration Logic
I implemented registration in AuthService and integrated BCryptPasswordEncoder so passwords are always stored as hashes.

***** 23/10/2025 ***** Login Endpoint
I built the /auth/login endpoint in the AuthController. It now accepts credentials, authenticates via the AuthenticationManager, and returns a Bearer Token.

***** 24/10/2025 ***** Postman API Testing
I tested the auth endpoints with Postman and confirmed protected routes returned 403 without a token and 200 with a valid token.

***** 27/10/2025 ***** Frontend Initialization
I initialized the React project using Vite, cleaned up boilerplate code, and established the folder structure (components, pages, context) to ensure a maintainable codebase.

***** 28/10/2025 ***** React Routing
I installed react-router-dom and configured the main Router.jsx file to handle navigation between the Landing Page, Login, and Dashboard.

***** 29/10/2025 ***** Login UI Implementation
I created the Login form component, utilizing React useState to handle form inputs and axios to send the POST request to the backend.

***** 30/10/2025 ***** Auth Context Setup
I implemented a React Context to store the JWT token in localStorage upon successful login, keeping the user logged in across page refreshes.

***** 31/10/2025 ***** Registration UI
I built the Registration page, connected it to the backend /auth/register endpoint, and added basic form validation (e.g., password matching).

***** 03/11/2025 ***** Real-Time SSE Research
I compared Server-Sent Events and WebSockets, then chose SSE because my use case mostly pushes data one way from server to client.

***** 04/11/2025 ***** SSE Backend Controller
I implemented the ParkingStreamController and configured it to return an SseEmitter object, keeping the HTTP connection open for updates.

***** 05/11/2025 ***** Frontend SSE Service
I wrote the frontend logic to consume the SSE stream using the EventSource API and verified that the browser receives data packets from the server.

***** 06/11/2025 ***** Parking Grid Layout
I created the ParkingSlotGrid.jsx component, using CSS Grid to create a responsive layout that renders 250 individual parking slots.

***** 07/11/2025 ***** Connecting Grid to Stream
I connected the React Grid component to the backend SSE stream. The grid now updates its state (Red/Green) dynamically based on the incoming event data.

***** 10/11/2025 ***** Payment Integration Setup
I registered for a Square Developer account, generated Sandbox API credentials, and configured them in the Spring Boot application.properties.

***** 11/11/2025 ***** Payment Backend Service
I implemented the PaymentService in Java, using the Square SDK to build the CreatePaymentRequest object.

***** 12/11/2025 ***** Payment Controller
I exposed the /api/payment/process endpoint. I used it as a secure proxy that receives the token from the frontend and sends the request to Square.

***** 13/11/2025 ***** Frontend Payment Form
I created the CheckoutForm with the Square Web Payments SDK and used the iframe flow so card data stayed in the secure provider widget.

***** 14/11/2025 ***** End-to-End Payment Test
I successfully performed a full test transaction in the Sandbox environment and verified the database updates the booking status to "PAID".

***** 17/11/2025 ***** CORS Troubleshooting
I encountered CORS errors when the frontend (port 5173) tried to talk to the backend (port 8080) with the Authorization header.

***** 18/11/2025 ***** Security Configuration Fix
I refactored SecurityConfig to allow the exact headers and origins needed for JWT and payment flows.

***** 19/11/2025 ***** JWT Filter Debugging
I fixed a bug in the JWT filter chain where the Bearer string wasn't being correctly parsed, causing 401 errors on valid requests.

***** 20/11/2025 ***** Stubbing Transport Data
I implemented TravelPlannerService with stubbed TfL and Greater Anglia data so frontend work could continue while advanced routing was still in progress.

***** 21/11/2025 ***** Transport UI Implementation
I built the "Transport Status" page in React and connected it to the stubbed backend endpoints to display line status (Good Service/Delays).

***** 24/11/2025 ***** Dashboard Integration
I integrated the Parking Grid, Transport Status, and Navigation into a unified Dashboard layout.

***** 25/11/2025 ***** Accessibility Audit
I ran Google Lighthouse and found low-contrast issues on occupied slots and missing labels on form inputs.

***** 26/11/2025 ***** Accessibility Refactoring
I updated CSS colors for better contrast and added aria-label attributes across interactive elements.

***** 27/11/2025 ***** Mobile Responsiveness
I adjusted CSS Grid media queries and verified the parking grid reflowed from 20 columns on desktop to 5 columns on mobile.

***** 28/11/2025 ***** Optimistic Locking
I added @Version to ParkingSpot to enable optimistic locking and reduce overwrite issues during concurrent updates.

***** 01/12/2025 ***** Backend Unit Testing
I wrote JUnit tests for BookingService and PaymentService, and I used Mockito to mock database and Square API dependencies.

***** 02/12/2025 ***** Frontend Component Testing
I wrote basic tests for the ParkingSlotGrid component to ensure it renders the correct number of slots based on the state array.

***** 03/12/2025 ***** Integration Testing
I ran full integration testing for the happy path: Login -> View Grid -> Select Spot -> Pay -> Confirmation.

***** 04/12/2025 ***** Concurrency Testing
I manually tested concurrency with two browsers and confirmed that when User A booked a spot, User B saw it change to red within 500ms through SSE.

***** 05/12/2025 ***** Code Cleanup
I refactored backend code, removed System.out.println debug statements, and replaced them with proper SLF4J logging.

***** 08/12/2025 ***** Documentation Drafting
I started drafting the Interim Report and wrote the Introduction and Technical Background chapters to explain why I chose Spring Boot and React.

***** 09/12/2025 ***** Diagram Generation
I created the System Architecture Diagram, ERD, and Payment Sequence Diagram for the report and exported them as high-resolution PNGs.

***** 10/12/2025 ***** Retrospective & Gantt
I wrote the retrospective report and generated the final Gantt chart to show the Term 1 timeline and delays clearly.

***** 11/12/2025 ***** Video & Final Polish
I recorded the demo video, proofread the report, and finalized the bibliography.

***** 12/12/2025 ***** Final Submission
I packaged the code, reports, and video link and submitted the final deliverables for the Term 1 Interim Deadline, ensuring all 'Completion requirements' were met.

***** 05/01/2026 ***** Term 2 Re-Planning
I resumed development for Term 2, reviewed backlog items, and split work into algorithmic routing, transport integration, quality assurance, and test coverage objectives for March delivery.

***** 07/01/2026 ***** Travel Graph Prototype
I implemented a graph model and shortest-path prototype for travel routing to replace static-only logic, establishing the base for deterministic route recommendations.

***** 10/01/2026 ***** Dijkstra Route Endpoint
I finalized the Dijkstra route flow exposed through the travel controller and verified route + cost payload structure for frontend consumption.

***** 13/01/2026 ***** Parking Pathfinding (A*)
I implemented A* path search for parking navigation and validated Manhattan-heuristic behavior for grid-based slot traversal.

***** 16/01/2026 ***** Journey Aggregation Logic
I built journey orchestration logic that combines route output with live train-style service payloads and computes a recommended onward service.

***** 20/01/2026 ***** Ride Data Normalization
I improved ride-hailing normalization to handle upstream payload inconsistency (missing keys, type mismatches, sorting and limiting), improving robustness of live options.

***** 23/01/2026 ***** Payment Workflow Hardening
I reviewed the payment flow end-to-end, including create payment and refund operations, and tightened error handling so client responses are predictable.

***** 27/01/2026 ***** Security Refactor Pass
I revisited authentication and token flows, cleaned edge-case handling in auth service, and aligned login/register outcomes with current frontend expectations.

***** 31/01/2026 ***** Controller Coverage Sprint
I added and refined controller-level tests (auth, booking, payment, travel, train, journey, parking stream/path) to improve confidence in endpoint behavior.

***** 03/02/2026 ***** Service Coverage Sprint
I expanded service tests for auth, booking, user, parking spot, user-details, payment, ride and publisher components, with Mockito-based dependency isolation.

***** 06/02/2026 ***** Model & DTO Validation Tests
I added model/DTO tests for constructors, getters/setters, and serialization-aligned field behavior to reduce regressions from simple data-layer changes.

***** 10/02/2026 ***** Repository Contract Tests
I created repository contract tests to confirm expected JPA generic type bindings and interface wiring for booking, user, and parking repositories.

***** 14/02/2026 ***** Concurrency and SSE Reliability
I validated emitter lifecycle behavior and publisher cleanup paths, including error-path removal logic for disconnected or broken server-sent event streams.

***** 18/02/2026 ***** JaCoCo Baseline Setup
I standardized coverage generation workflow with Maven + JaCoCo and resolved test execution issues caused by skipped surefire configuration.

***** 22/02/2026 ***** Failing Test Triage
I diagnosed and fixed wildcard/generic Mockito stubbing issues (especially ResponseEntity<?> scenarios) that were preventing successful test compilation.

***** 25/02/2026 ***** Route Assertion Corrections
I corrected outdated route test expectations to match actual shortest-path results from updated graph weights and route computation logic.

***** 28/02/2026 ***** Targeted Branch Coverage
I added focused branch tests for payment configuration, token generation/validation, fallback handling, null-shape payloads, and exception branches.


===== March Daily Expansion (Chronological 01/03 to 25/03) =====

***** 01/03/2026 ***** Planning Reset
I reviewed the previous two months of progress and mapped what was done vs what still needed strengthening for the final mark scheme.

***** 02/03/2026 ***** Workstream Split
I split the work into backend hardening, frontend quality, accessibility, test depth, and report evidence so each day had a clear target.

***** 03/03/2026 ***** Coverage Gap Review I used JaCoCo method/branch reports to identify persistent weak spots and iteratively wrote tests to cover untested branches rather than only line counts.

***** 04/03/2026 ***** Architecture Cleanup Pass I reviewed controller/service boundaries and noted where business logic should be extracted out of controllers for cleaner design and easier testing.

***** 05/03/2026 ***** Route and Edge-Case Validation I manually tested route outputs against tricky inputs and verified path and cost behavior before final refactoring.

***** 06/03/2026 ***** Error Handling Consistency I standardized API error responses so frontend pages receive predictable messages in both expected and failure scenarios.

***** 07/03/2026 ***** API Naming Cleanup I refactored train/live transport naming to be provider-neutral and updated dependent controllers/tests accordingly to avoid brittle provider-coupled assumptions.

***** 08/03/2026 ***** Auth Quality Review I revisited login/register flow behavior, validation paths, and token handling to align backend outcomes with frontend expectations.

***** 09/03/2026 ***** Service-Layer Refactor Notes I prepared and applied smaller refactors to keep business logic in services and reduce coupling between components.

***** 10/03/2026 ***** Legacy Provider Removal I removed all remaining Greater Anglia references from main code, tests, and configuration to keep the service layer consistent with current project scope.

***** 11/03/2026 ***** Security Configuration Review I reviewed current security defaults and marked risks around permissive local settings and secret management.

***** 12/03/2026 ***** Environment Hardening I shifted sensitive config toward environment variables and documented safer local/dev setup patterns.

***** 13/03/2026 ***** Test Suite Stabilization I fixed flaky unit assertions (notably async/completion semantics) and replaced non-deterministic checks with deterministic equivalents.

***** 14/03/2026 ***** Controller Test Reliability I removed brittle assumptions in endpoint tests and updated assertions to reflect actual service behavior.

***** 15/03/2026 ***** Regression Focus Day I ran repeated backend test cycles and fixed regressions one by one. The goal was stability, not feature expansion.

***** 16/03/2026 ***** Frontend HTTPS Integration I configured Vite HTTPS using local cert/key files and removed hardcoded insecure backend URLs from payment and API helper flows.

***** 17/03/2026 ***** Frontend Test Flake Fixes I addressed timing and cleanup issues in frontend tests to keep the suite deterministic and repeatable.

***** 18/03/2026 ***** Mixed-Content and Proxy Fixes I routed frontend requests through same-origin dev proxy for payments/bookings to eliminate insecure-call paths and browser autofill security warnings.

***** 19/03/2026 ***** Accessibility Consistency Pass I reviewed form labels and interaction controls across pages to keep accessibility behavior consistent.

***** 20/03/2026 ***** Dev Environment Recovery I resolved local dev server instability from duplicate Vite processes/port collisions and standardized frontend startup on a single secure localhost endpoint.

***** 21/03/2026 ***** Full Test Loop Day I ran backend + frontend tests repeatedly and fixed regressions quickly to keep momentum before final submission week.

***** 22/03/2026 ***** Final QA and Diary Update I completed a final pass of backend/frontend verification, regression testing, and coverage review, then documented the full Term 2 development trajectory in this diary in reflective chronological format.

***** 23/03/2026 ***** Frontend Test Framework Setup I set up Vitest + Testing Library (jsdom, setup file, coverage reporting) and integrated scripts for run/watch/coverage so frontend quality checks are now first-class like backend JUnit workflows.

***** 24/03/2026 ***** Report Writing and Evidence I focused on writing final report sections (architecture, testing, security, and evaluation) and preparing evidence tables/figures to support each claim.

***** 25/03/2026 ***** Demonstration Planning I completed final report polish and structured the demonstration flow so it follows the implemented feature order clearly.


***** 26/03/2026 ***** Accessibility/Status/Transport Test Expansion
I expanded tests across additional pages (accessibility controls, TfL status map toggle, travel planner actions, transport journey flow) with mocked external dependencies to keep tests fast and repeatable.

***** 27/03/2026 ***** Test Folder Restructure
I reorganized frontend tests under a dedicated src/test hierarchy and removed test files from src/pages to keep production page folders clean and maintainable. I updated imports/mocks accordingly and revalidated the full suite.

***** 28/03/2026 ***** Comment Quality Pass
I reviewed source and test comments for readability and intent. I refined comments to be human, contextual, and concise (explaining why a block exists rather than narrating obvious syntax), improving maintainability and submission presentation.

***** 29/03/2026 ***** Register UI Consistency
I aligned register-page styling with login card conventions (rounded auth card behavior, consistent spacing and button treatment) so auth flows look coherent and polished across desktop/mobile.

***** 30/03/2026 ***** Dependency and Tooling Hygiene
I fixed frontend dependency drift (including local package alignment for test/runtime imports), reran lint/build/tests, and confirmed the toolchain remains stable after structural and test coverage changes.

***** 31/03/2026 ***** Submission-Oriented Code Review
I ran a strict coding review focused on risks and regressions (security posture, auth bypass risk, config hardcoding, validation strategy, and test completeness). I captured findings by severity for final hardening priorities.

***** 01/04/2026 ***** Final Regression and Coverage Confirmation
I re-executed frontend and backend test flows, confirmed green runs, and validated that the frontend test suite now covers key user journeys instead of only isolated helpers/components.

***** 02/04/2026 ***** Pre-Submission Freeze and Evidence Pack
I finalized diary updates, confirmed project structure cleanliness (production pages separate from tests), and prepared a final evidence snapshot of lint/build/tests/review outcomes for submission confidence.

***** 03/04/2026 ***** Docker Build Failure Recovery
I resolved a backend container build blocker by tracing Maven packaging failures and adjusting configuration so Docker builds matched local Maven runs. I documented the root cause and corrective actions in the report evidence notes.

***** 04/04/2026 ***** Environment and Port Conflict Resolution
I fixed deployment friction caused by service startup conflicts, including host-port contention and compose startup ordering issues. I updated report notes with a reproducible startup/teardown sequence and rationale for the final compose configuration.

***** 05/04/2026 ***** Quality and Security Hardening Pass
I addressed high-priority code issues identified during review, focusing on fragile behavior, security posture, and API error-path consistency. I linked each improvement to quality, structure, stability, and testing evidence in the report.

***** 06/04/2026 ***** Full-System Verification and Documentation
I fixed remaining integration issues discovered during full-system checks, especially backend/frontend contract alignment and predictable runtime behavior. I completed a final report editing pass to refine technical wording and improve evidence traceability.

***** 07/04/2026 ***** Final Consolidation and Submission Readiness
I completed and finalized the demo video for submission, ensuring the walkthrough covers the full implemented feature flow clearly and in the correct order.

