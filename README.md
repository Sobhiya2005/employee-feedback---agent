# 🤖 AI-Powered Employee Feedback Agent for HR Decision Support

[![Live Demo](https://img.shields.io/badge/Demo-Live%20Application-brightgreen?style=for-the-badge&logo=google-cloud)](https://ais-dev-jek376bg4nmoqbuornro34-632349204207.asia-east1.run.app)
[![React 19](https://img.shields.io/badge/Frontend-React%2019-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.2-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-v4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Spring Boot](https://img.shields.io/badge/Backend-Spring%20Boot%203.2-6DB33F?logo=springboot&logoColor=white)](https://spring.io/projects/spring-boot)
[![Java 17](https://img.shields.io/badge/Java-17%2B-ED8B00?logo=openjdk&logoColor=white)](https://www.oracle.com/java/)
[![Google Gemini AI](https://img.shields.io/badge/AI%20Engine-Gemini%202.5-4285F4?logo=google&logoColor=white)](https://ai.google.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

An enterprise-grade, intelligent employee feedback management and organizational pulse platform. Powered by **Google Gemini AI**, this system bridges the gap between workforce sentiments and executive HR decisions by automatically categorizing feedback, analyzing sentiment tone and burnout risks, detecting organizational bottlenecks, and generating actionable HR intervention strategies.

---

## 🌐 Live Application Links

- **🚀 Live Application (Active Preview)**: [https://ais-dev-jek376bg4nmoqbuornro34-632349204207.asia-east1.run.app](https://ais-dev-jek376bg4nmoqbuornro34-632349204207.asia-east1.run.app)
- **🔗 Shared Deployment URL**: [https://ais-pre-jek376bg4nmoqbuornro34-632349204207.asia-east1.run.app](https://ais-pre-jek376bg4nmoqbuornro34-632349204207.asia-east1.run.app) *(Active once shared/published in AI Studio)*
- **💻 GitHub Repository**: [https://github.com/Sobhiya2005/employee-feedback---agent](https://github.com/Sobhiya2005/employee-feedback---agent)

### 🔑 Demo Accounts for Instant Testing:
- **HR Admin Portal**: Email: `hr@company.com` | Password: `password123`
- **Employee Portal**: Email: `sarah.j@company.com` | Password: `password123`
*(You can also sign up with any custom email address to test multi-user isolation!)*

---

## 🌟 Key Highlights

- **🧠 Automated Gemini AI Intelligence**: Instant deep sentiment analysis, risk level classification (Low / Medium / High / Critical), and automated actionable HR recommendations.
- **🛡️ Anonymous & Transparent Submissions**: Employees can submit feedback openly or anonymously with full privacy protection.
- **📊 Real-Time HR Decision Support Dashboard**: Interactive analytics, sentiment trends, category distribution charts, and department benchmarking powered by Recharts.
- **👥 Role-Based Access Control (RBAC)**: Distinct, secure experiences tailored for **Employees** and **HR Administrators**.
- **⚡ Dual-Backend Architecture**: 
  - Complete **Spring Boot 3.2 (Java 17 + Spring Security + Spring Data JPA + H2/PostgreSQL)** microservice backend located in `/backend-springboot`.
  - Unified **Node.js / Express + TypeScript** fullstack runtime for rapid local development and previewing.
- **🎯 Employee Growth & Pulse**: Integrated personal goals tracker, company notification stream, and transparent feedback resolution status tracking.

---

## 🏛️ System Architecture

```text
                     +-----------------------------------+
                     |      Employee & HR Web Client     |
                     |  (React 19 + TypeScript + Vite)   |
                     +-----------------+-----------------+
                                       |
                       HTTPS / RESTful API + JWT Auth
                                       |
          +----------------------------+----------------------------+
          |                                                         |
          v                                                         v
+-----------------------------+                           +-----------------------------+
|    Spring Boot 3 Backend    |                           |     Node / Express Server   |
|   (Java 17 / Maven / JPA)   |                           |    (Fullstack TypeScript)   |
|  - Spring Security & JWT    |                           |  - JWT & Password Hashing   |
|  - H2 / PostgreSQL Support  |                           |  - In-Memory / File Store   |
|  - Gemini AI Client Service |                           |  - @google/genai SDK Proxy  |
+--------------+--------------+                           +--------------+--------------+
               |                                                         |
               +----------------------------+----------------------------+
                                            |
                                            v
                             +-----------------------------+
                             |    Google Gemini 2.5 AI     |
                             |  - Sentiment Scoring        |
                             |  - Category Classification  |
                             |  - Burnout / Attrition Risk |
                             |  - HR Decision Support Recs |
                             +-----------------------------+
```

---

## 👥 User Roles & Features

### 1. 🧑‍💼 Employee Portal
- **Feedback Submission**: Submit multi-category feedback (Workplace Environment, Leadership, Workload & Burnout, Compensation, Team Collaboration, Career Growth) with star ratings and optional anonymity.
- **Live Status Tracker**: Real-time status badges (`SUBMITTED`, `UNDER_REVIEW`, `IN_PROGRESS`, `RESOLVED`, `DISMISSED`) and view HR responses.
- **My Goals & KPIs**: Track quarterly targets, completion percentages, and deadlines.
- **Company Broadcasts**: View announcements and HR circulars.

### 2. 👩‍💼 HR Administrator Dashboard
- **Organizational Sentiment Pulse**: Overall sentiment score, percentage breakdown (Positive, Neutral, Negative, Mixed), and total feedback volume.
- **AI Sentiment & Risk Matrix**: Auto-flags high-risk items (e.g. burnout indicators, toxic leadership, safety flags).
- **Gemini AI Recommendation Generator**: One-click AI synthesis of individual feedback or department trends, generating structured mitigation action plans.
- **Workflow & Resolution Management**: Transition feedback statuses, assign responsible HR owners, and append private/public action notes.
- **Department Benchmarking**: Sentiment and engagement breakdown across Engineering, Marketing, Sales, Operations, and HR.
- **Employee Directory**: Manage employee profiles, roles, and department assignments.

---

## 📂 Project Structure

```text
employee-feedback---agent/
├── backend-springboot/              # Complete Spring Boot 3.2 Java Backend
│   ├── pom.xml                      # Maven dependencies (Spring Boot, Security, JJWT, H2, Lombok)
│   ├── README.md                    # Dedicated Spring Boot setup & API documentation
│   └── src/
│       └── main/
│           ├── java/com/employee/feedback/
│           │   ├── EmployeeFeedbackApplication.java # Spring Boot application entry point
│           │   ├── config/          # SecurityConfig, JwtUtil, DataInitializer
│           │   ├── controller/      # Auth, Feedback, Resource & Health REST Controllers
│           │   ├── dto/             # Auth & Feedback Request/Response DTOs
│           │   ├── model/           # JPA Entities (User, Employee, Feedback, Goal, etc.)
│           │   ├── repository/      # Spring Data JPA interfaces
│           │   └── service/         # GeminiAiService & business logic
│           └── resources/
│               └── application.properties # Server, database, and JWT configs
├── src/                             # React 19 Frontend
│   ├── components/                  # Navbar, Charts, Modals, Forms
│   ├── context/                     # AuthContext, NotificationContext
│   ├── types/                       # TypeScript models & interfaces
│   ├── App.tsx                      # Main application view switcher
│   └── main.tsx                     # Vite React root
├── server/                          # Node.js backend controllers and data stores
├── server.ts                        # Express API & Vite dev server entry point
├── public/                          # Static assets and icons
├── package.json                     # Frontend & Node dependencies
├── vite.config.ts                   # Vite configuration
└── README.md                        # Project documentation (this file)
```

---

## 🔑 Default Test Accounts (Pre-Seeded)

The database automatically seeds test accounts upon startup:

| Role | Email | Password | Access Level |
| :--- | :--- | :--- | :--- |
| **HR Administrator** | `hr@company.com` | `password123` | Full HR Analytics, Feedback Triage & Action Plans |
| **Employee** | `employee@company.com` | `password123` | Personal Feedback Submission, Goals & Tracker |
| **Employee** | `priya@company.com` | `password123` | Employee Portal & History |

> You can also register any new account directly from the **Register** tab in the application.

---

## 🚀 Getting Started

You can run the system using either the **Spring Boot Java Backend** or the **Node.js Fullstack Server**.

### Option A: Running with Spring Boot 3 Java Backend

#### Prerequisites
- **Java 17 or higher** (`java -version`)
- **Maven 3.8+** (`mvn -version`)
- **Node.js 18+** (`node -version`)

#### 1. Start the Spring Boot Backend
```bash
cd backend-springboot
mvn clean spring-boot:run
```
The Spring Boot backend starts at: **`http://localhost:8080`**  
Embedded H2 Database Console: **`http://localhost:8080/h2-console`**  
*(JDBC URL: `jdbc:h2:mem:employeedb`, User: `sa`, Password: `password`)*

#### 2. Start the React Frontend
Open a separate terminal in the root directory:
```bash
npm install
npm run dev
```
Open **`http://localhost:3000`** in your browser.

---

### Option B: Running with Node.js / Express Fullstack

#### Prerequisites
- **Node.js 18+** & **npm**

#### 1. Configure Environment Variables
Copy the example environment file:
```bash
cp .env.example .env
```
Add your Google Gemini API key in `.env`:
```env
GEMINI_API_KEY="your-gemini-api-key-here"
JWT_SECRET="employee_feedback_jwt_secret_key_2026"
PORT=3000
```
> *(Get your free Gemini API key at [Google AI Studio](https://aistudio.google.com/app/apikey))*

#### 2. Install Dependencies & Launch
```bash
npm install
npm run dev
```
Visit **`http://localhost:3000`**. The single command starts both the Express REST API and the React 19 frontend with hot-reload.

---

## 📡 REST API Specification

### 🔐 Authentication (`/api/auth`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/login` | Authenticate user & issue JWT token | Public |
| `POST` | `/api/auth/register` | Register a new user account | Public |
| `GET` | `/api/auth/me` | Fetch authenticated user profile | Authenticated |

### 💬 Feedback & AI Intelligence (`/api/feedback`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/feedback` | Retrieve all organizational feedback | HR Admin |
| `GET` | `/api/feedback/my` | Retrieve feedback submitted by current user | Authenticated |
| `POST` | `/api/feedback` | Submit feedback (triggers Gemini AI sentiment & risk analysis) | Authenticated |
| `PUT` | `/api/feedback/:id` | Update status (`IN_PROGRESS`, `RESOLVED`, etc.) & HR notes | HR Admin |
| `POST` | `/api/feedback/:id/ai-action` | Generate on-demand Gemini AI intervention strategy | HR Admin |
| `DELETE` | `/api/feedback/:id` | Remove feedback record | HR Admin |

### 🏢 Organizational Resources (`/api`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/departments` | List company departments and sentiment stats | Authenticated |
| `GET` | `/api/employees` | List employee roster | HR Admin |
| `GET` | `/api/goals/my` | Get current user's performance goals | Authenticated |
| `GET` | `/api/notifications` | Get system and HR notifications | Authenticated |
| `GET` | `/api/health` | Service health status | Public |

---

## 🤖 Gemini AI Prompt & Analysis Pipeline

When an employee submits feedback, the backend constructs a structured prompt for the Gemini AI model:

```json
{
  "sentiment": "POSITIVE | NEUTRAL | NEGATIVE | MIXED",
  "sentimentScore": 0.85,
  "confidenceScore": 0.94,
  "identifiedThemes": ["Workload", "Recognition"],
  "riskLevel": "LOW | MEDIUM | HIGH | CRITICAL",
  "burnoutIndicator": false,
  "actionableRecommendations": [
    "Acknowledge the team's weekend sprint efforts during the all-hands meeting.",
    "Review Q3 resource allocation to prevent recurring overtime."
  ],
  "summary": "Employee expressed high appreciation for team camaraderie but noted recent strain due to deadline compression."
}
```

The response is parsed and stored alongside the feedback record, immediately updating the HR pulse dashboard without manual review delays.

---

## 🧪 Building for Production

### Frontend & Node Production Build
```bash
npm run build
npm start
```

### Spring Boot Executable JAR
```bash
cd backend-springboot
mvn clean package -DskipTests
java -jar target/employee-feedback-agent-1.0.0.jar
```

---

## 🛠️ GitHub Workflow & Contributions

To push updates to GitHub:

```bash
# 1. Check changed files
git status

# 2. Stage changes
git add .

# 3. Commit with a meaningful message
git commit -m "feat: enhance AI feedback decision agent and documentation"

# 4. Push to main branch
git push origin main
```

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

<p align="center">
  Built with ❤️ for Modern, People-First Organizations powered by <b>Google Gemini AI</b> & <b>Spring Boot</b>.
</p>
