# Employee Feedback Agent - Spring Boot Backend

Production-ready **Spring Boot 3.2.x (Java 17)** backend for the **AI-Powered Employee Feedback Management System**.

---

## 🚀 Tech Stack
- **Framework**: Spring Boot 3.2.4 (Java 17)
- **Security**: Spring Security + JJWT (JSON Web Token)
- **Database / ORM**: Spring Data JPA + Hibernate + H2 Database (In-Memory for zero setup, easily switches to PostgreSQL)
- **AI Integration**: Gemini AI Analysis & NLP classification engine
- **Build Tool**: Apache Maven (`pom.xml`)

---

## 📂 Project Structure
```text
backend-springboot/
├── pom.xml
└── src/
    └── main/
        ├── java/com/employee/feedback/
        │   ├── EmployeeFeedbackApplication.java   # Spring Boot Main Entry Point
        │   ├── config/
        │   │   ├── SecurityConfig.java            # CORS & Spring Security Filters
        │   │   ├── JwtUtil.java                   # JWT Token generation & verification
        │   │   └── DataInitializer.java           # DB seeding with mock HR & employee data
        │   ├── controller/
        │   │   ├── AuthController.java            # Login, register, /me
        │   │   ├── FeedbackController.java        # Submit, get, list & analyze feedback
        │   │   └── AppResourceController.java     # Employees, departments, goals, notifications
        │   ├── dto/
        │   │   └── AuthDto.java                   # Login & Register Request/Response DTOs
        │   ├── model/
        │   │   ├── User.java                      # JPA Entity for authentication
        │   │   ├── Employee.java                  # JPA Entity for employees
        │   │   ├── Department.java                # JPA Entity for departments
        │   │   ├── Feedback.java                  # JPA Entity for submitted feedback
        │   │   ├── FeedbackAnalysis.java          # JPA Entity for AI analysis results
        │   │   ├── Goal.java                      # JPA Entity for employee goals
        │   │   └── Notification.java              # JPA Entity for company notifications
        │   ├── repository/                        # Spring Data JPA Repositories
        │   └── service/
        │       └── GeminiAiService.java           # AI sentiment & issue detection engine
        └── resources/
            └── application.properties             # Database, JWT & server configuration
```

---

## 🏃 Quick Start

### 1. Prerequisites
- **Java 17+** (`java -version`)
- **Maven 3.8+** (`mvn -version`)

### 2. Run the Application
Open a terminal in this `backend-springboot` directory and run:

```bash
mvn spring-boot:run
```

Or package into an executable JAR:
```bash
mvn clean package -DskipTests
java -jar target/employee-feedback-agent-1.0.0.jar
```

The server will start on **`http://localhost:8080`**.

---

## 🔑 Default Accounts (Auto-Seeded on Startup)

| Role | Email | Password |
| :--- | :--- | :--- |
| **HR Administrator** | `hr@company.com` | `password123` |
| **Employee** | `employee@company.com` | `password123` |
| **Employee** | `priya@company.com` | `password123` |

---

## 📡 API Endpoints

### 🔐 Authentication
- `POST /api/auth/login` - User login (returns JWT token)
- `POST /api/auth/register` - Create new user account
- `GET /api/auth/me` - Get profile of authenticated user

### 💬 Feedback & AI Sentiment
- `GET /api/feedback` - List all feedback (HR Admin)
- `GET /api/feedback/my` - List current employee's feedback
- `POST /api/feedback` - Submit new feedback (triggers AI sentiment & severity analysis)
- `PUT /api/feedback/{id}` - Update feedback status & HR action notes
- `DELETE /api/feedback/{id}` - Delete feedback

### 🏢 Organization Resources
- `GET /api/departments` - List all departments
- `POST /api/departments` - Create new department
- `GET /api/employees` - List all employees
- `POST /api/employees` - Register employee record
- `GET /api/goals/my` - List active employee goals
- `GET /api/notifications` - Retrieve notification stream
- `GET /api/health` - Health check status

### 🗄️ H2 Database Web Console
Access the in-memory database UI at:
- **URL**: `http://localhost:8080/h2-console`
- **JDBC URL**: `jdbc:h2:mem:employeedb`
- **Username**: `sa`
- **Password**: `password`
