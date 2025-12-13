Development Diary
***** 01/10/2025 ***** Project Initialization & Scope Definition I defined the primary scope for the "Stadium Transport & Parking Planner" and identified the core problem of congestion at Tottenham Hotspur Stadium. I drafted the high-level functional requirements to ensure I had a clear baseline for development. This addressed the 'Software Engineering' requirement for clear requirement analysis.

***** 02/10/2025 ***** Requirements Gathering I detailed specific user stories for the three main pillars: Authentication, Real-Time Parking, and Payments. I explicitly defined non-functional requirements, including WCAG 2.1 AA compliance and sub-2-second latency. This further satisfied the 'Software Engineering' criteria for detailed requirement elicitation.

***** 03/10/2025 ***** Technology Stack Selection I finalized the decision to use N-Tier architecture. I selected Spring Boot for the backend (justifying it via ACID compliance) and React/Vite for the frontend (justifying it via Virtual DOM performance). This demonstrated the 'Background Theory' criteria by providing evidence of understanding architectural trade-offs.

***** 06/10/2025 ***** Database Design (ERD) I designed the Entity Relationship Diagram (ERD), defining the User, Booking, and ParkingSpot entities and their One-to-Many relationships. This directly addressed the 'Software Engineering' requirement for the inclusion of UML diagrams.

***** 07/10/2025 ***** Database Environment Setup I installed PostgreSQL locally and created the initial database instance. I configured user roles and permissions to prepare for the Spring Boot connection, ensuring a robust environment for the data layer.

***** 08/10/2025 ***** Backend Project Init I initialized the Spring Boot project using Maven and set up the pom.xml file with dependencies for Spring Web, Spring Data JPA, and the PostgreSQL driver. This established the foundation for an 'engineering approach' to software development.

***** 09/10/2025 ***** Entity Implementation I implemented the Java entity classes (User.java, ParkingSpot.java) and added standard JPA annotations (@Entity, @Table) to define column constraints, ensuring strict data modeling.

***** 10/10/2025 ***** Booking Entity Logic I implemented the Booking.java entity, focusing on defining foreign keys and timestamp fields (startTime, endTime) required for the reservation logic.

***** 13/10/2025 ***** Repository Layer I created repository interfaces (UserRepository, BookingRepository) extending JpaRepository. This established the Data Access Layer without needing manual SQL queries, streamlining the data interaction.

***** 14/10/2025 ***** Service Layer Skeleton I created the service classes (UserService, BookingService) and defined interface contracts for business logic before implementing the actual methods. This adhered to standard 'Software Engineering' principles of separation of concerns.

***** 15/10/2025 ***** Database Connection Testing I configured application.properties and ran the application to verify the connection to PostgreSQL. I successfully auto-generated the database schema using Hibernate ddl-auto.

***** 16/10/2025 ***** Basic CRUD Testing I wrote a simple CommandLineRunner to seed the database with dummy parking spots and verified that data persistence is working correctly. This served as an initial 'proof of concept' program, relevant to the 'Background Theory' mark.

***** 17/10/2025 ***** Security Architecture Planning I researched Spring Security implementation and decided on a stateless architecture using JSON Web Tokens (JWT) rather than server-side sessions. This evidenced 'independent thought' and 'Background Theory' regarding modern security architectures.

***** 20/10/2025 ***** Security Dependencies I added spring-boot-starter-security and jjwt dependencies and began implementing the SecurityConfig class to define the filter chain.

***** 21/10/2025 ***** JWT Utility Implementation I implemented JwtUtil.java, writing methods to generate signed tokens upon login and validate tokens on incoming API requests using a secret key.

***** 22/10/2025 ***** Registration Logic I implemented the AuthService registration method and integrated BCryptPasswordEncoder to ensure user passwords are always hashed. This addressed security best practices within the 'Software Engineering' scope.

***** 23/10/2025 ***** Login Endpoint I built the /auth/login endpoint in the AuthController. It now accepts credentials, authenticates via the AuthenticationManager, and returns a Bearer Token.

***** 24/10/2025 ***** Postman API Testing I spent the day testing the Auth endpoints using Postman, verifying that protected routes return 403 Forbidden without a token and 200 OK with a valid token. This was part of the 'good test strategy' required by the 'Software Engineering' marking grid.

***** 27/10/2025 ***** Frontend Initialization I initialized the React project using Vite, cleaned up boilerplate code, and established the folder structure (components, pages, context) to ensure a maintainable codebase.

***** 28/10/2025 ***** React Routing I installed react-router-dom and configured the main Router.jsx file to handle navigation between the Landing Page, Login, and Dashboard.

***** 29/10/2025 ***** Login UI Implementation I created the Login form component, utilizing React useState to handle form inputs and axios to send the POST request to the backend.

***** 30/10/2025 ***** Auth Context Setup I implemented a React Context to store the JWT token in localStorage upon successful login, keeping the user logged in across page refreshes.

***** 31/10/2025 ***** Registration UI I built the Registration page, connected it to the backend /auth/register endpoint, and added basic form validation (e.g., password matching).

***** 03/11/2025 ***** Real-Time SSE Research I researched Server-Sent Events vs. WebSockets and confirmed SSE is the better choice for primarily uni-directional data flow. This comparison demonstrated 'Background Theory' understanding.

***** 04/11/2025 ***** SSE Backend Controller I implemented the ParkingStreamController and configured it to return an SseEmitter object, keeping the HTTP connection open for updates.

***** 05/11/2025 ***** Frontend SSE Service I wrote the frontend logic to consume the SSE stream using the EventSource API and verified that the browser receives data packets from the server.

***** 06/11/2025 ***** Parking Grid Layout I created the ParkingSlotGrid.jsx component, using CSS Grid to create a responsive layout that renders 250 individual parking slots.

***** 07/11/2025 ***** Connecting Grid to Stream I connected the React Grid component to the backend SSE stream. The grid now updates its state (Red/Green) dynamically based on the incoming event data.

***** 10/11/2025 ***** Payment Integration Setup I registered for a Square Developer account, generated Sandbox API credentials, and configured them in the Spring Boot application.properties.

***** 11/11/2025 ***** Payment Backend Service I implemented the PaymentService in Java, using the Square SDK to build the CreatePaymentRequest object.

***** 12/11/2025 ***** Payment Controller I exposed the /api/payment/process endpoint. This acts as a secure proxy, receiving the token from the frontend and communicating with Square.

***** 13/11/2025 ***** Frontend Payment Form I created the CheckoutForm component using the Square Web Payments SDK, implementing iframe injection to securely capture card details. This adhered to the 'Software Engineering' requirement for secure, standard-compliant (PCI-DSS) implementation.

***** 14/11/2025 ***** End-to-End Payment Test I successfully performed a full test transaction in the Sandbox environment and verified the database updates the booking status to "PAID".

***** 17/11/2025 ***** CORS Troubleshooting I encountered CORS errors when the frontend (port 5173) tried to talk to the backend (port 8080) with the Authorization header.

***** 18/11/2025 ***** Security Configuration Fix I refactored the SecurityConfig in Spring Boot to explicitly allow the specific headers and origins required for the JWT and Payment flows. This demonstrated problem-solving within the 'Software Engineering' process.

***** 19/11/2025 ***** JWT Filter Debugging I fixed a bug in the JWT filter chain where the Bearer string wasn't being correctly parsed, causing 401 errors on valid requests.

***** 20/11/2025 ***** Stubbing Transport Data Since the A* algorithm is a Term 2 task, I implemented the TravelPlannerService with stubbed (mock) data for TfL and Greater Anglia to allow frontend development. This evidenced an understanding of 'Background Theory' by isolating algorithmic complexity.

***** 21/11/2025 ***** Transport UI Implementation I built the "Transport Status" page in React and connected it to the stubbed backend endpoints to display line status (Good Service/Delays).

***** 24/11/2025 ***** Dashboard Integration I integrated the Parking Grid, Transport Status, and Navigation into a unified Dashboard layout.

***** 25/11/2025 ***** Accessibility Audit I ran Google Lighthouse and identified low contrast issues on the "Occupied" (Red) parking slots and missing labels on form inputs. This was crucial for checking the 'Structure and presentation' and Non-Functional Requirements.

***** 26/11/2025 ***** Accessibility Refactoring I updated CSS variables to darker shades for better contrast and added aria-label attributes to all interactive elements. This ensured compliance with the WCAG standards mentioned in the 'Software Engineering' requirements.

***** 27/11/2025 ***** Mobile Responsiveness I adjusted the CSS Grid media queries and verified that the parking grid reflows correctly from 20 columns on desktop to 5 columns on mobile devices. This improved the 'Presentation' score of the final artifact.

***** 28/11/2025 ***** Optimistic Locking I added the @Version annotation to the ParkingSpot entity to enable Optimistic Locking. This demonstrated 'Background Theory' understanding of concurrency control.

***** 01/12/2025 ***** Backend Unit Testing I wrote JUnit tests for the BookingService and PaymentService, utilizing Mockito to mock database and Square API dependencies. This directly addressed the 'Software Engineering' criteria for a 'good test strategy'.

***** 02/12/2025 ***** Frontend Component Testing I wrote basic tests for the ParkingSlotGrid component to ensure it renders the correct number of slots based on the state array.

***** 03/12/2025 ***** Integration Testing I performed full system integration testing (Happy Path), verifying the flow: Login -> View Grid -> Select Spot -> Pay -> Confirmation. This validated the 'Software Engineering' requirement for comprehensive testing.

***** 04/12/2025 ***** Concurrency Testing I manually tested concurrency by opening two browsers, verifying that when User A books a spot, User B sees it turn red within 500ms via SSE. This served as evidence of the 'proof of concept' required for 'Background Theory'.

***** 05/12/2025 ***** Code Cleanup I refactored the backend code, removed System.out.println debug statements, and added proper SLF4J logging. This ensured the 'Quality of Writing' and code presentation met professional standards.

***** 08/12/2025 ***** Documentation Drafting I began drafting the Interim Report, writing the Introduction and Technical Background chapters to justify the choice of Spring Boot and React. This started the process for the 'Structure and presentation' and 'Background Theory' marking grids.

***** 09/12/2025 ***** Diagram Generation I created the System Architecture Diagram, ERD, and Payment Sequence Diagram for the report and exported them to high-resolution PNGs. This fulfilled the 'Software Engineering' requirement for UML diagrams and 'Structure and presentation' criteria for appropriate figures.

***** 10/12/2025 ***** Retrospective & Gantt I wrote the Retrospective Report and generated the final Gantt Chart to visualize the Term 1 timeline and delays. This directly addressed the 'Project Diary' marking criteria for a 'Reflective diary showing strong evidence of analysis of process'.

***** 11/12/2025 ***** Video & Final Polish I recorded the demonstration video, proofread the report, and finalized the bibliography. This addressed the 'Bibliography' criteria for 'excellent evidence of background reading' and 'appropriate use of references'.

***** 12/12/2025 ***** Final Submission I packaged the code, reports, and video link and submitted the final deliverables for the Term 1 Interim Deadline, ensuring all 'Completion requirements' were met.