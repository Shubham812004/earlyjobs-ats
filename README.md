# EarlyJobs Mini ATS

A lightweight Applicant Tracking System (ATS) for managing candidates, tracking recruitment stages, and monitoring hiring pipeline metrics. Built with React and Spring Boot, backed by MySQL, and deployed on Openstead.

## Live Demo

- **Frontend:** https://ats-frontend.ostead.tech
- **Backend API:** https://ats-backend.ostead.tech
- **Repository:** https://github.com/Shubham812004/earlyjobs-ats

## Features

### Dashboard
- View total candidates, candidates in interviews, hires, and rejections.
- Visualize candidate distribution across recruitment stages.
- Monitor the hiring pipeline at a glance.

### Candidate Management
- Add new candidates with their contact details, job title, experience, source, and notes.
- View and search candidate records.
- Filter candidates by recruitment stage.
- Edit candidate information and delete records.

### Hiring Pipeline
- Organize candidates across six hiring stages:
  - Applied
  - Screening
  - Interview
  - Offer
  - Hired
  - Rejected
- Update candidate stages and reflect changes in dashboard metrics.

## Technology Stack

| Layer | Technologies |
|---|---|
| Frontend | React, Vite, React Router |
| Styling | CSS |
| HTTP client | Axios |
| Charts | Recharts |
| Icons | Lucide React |
| Backend | Java 21, Spring Boot |
| Persistence | Spring Data JPA, Hibernate |
| Database | MySQL 8.4 |
| Build tools | Maven, npm |
| Deployment | Openstead |

## Project Structure

```text
earlyjobs-ats/
├── ats-backend/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/
│   │   │   └── resources/
│   │   └── test/
│   ├── mvnw
│   └── pom.xml
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   └── pages/
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## Getting Started

### Prerequisites

Install the following before running the application locally:

- Java 21 or later
- Node.js and npm
- MySQL 8.4 or a compatible MySQL server
- Git

### 1. Clone the repository

```bash
git clone https://github.com/Shubham812004/earlyjobs-ats.git
cd earlyjobs-ats
```

### 2. Configure the database

Create a MySQL database:

```sql
CREATE DATABASE earlyjobs_ats;
```

Configure the backend environment variables before starting the application:

```text
DB_URL=jdbc:mysql://localhost:3306/earlyjobs_ats
DB_USERNAME=your_mysql_username
DB_PASSWORD=your_mysql_password
```

The application uses the following environment-variable defaults where configured:

- `DB_URL`: `jdbc:mysql://localhost:3307/earlyjobs_ats`
- `DB_USERNAME`: `root`
- `DB_PASSWORD`: must be supplied through the environment

Use the port matching your local MySQL configuration. Never commit real database credentials to Git.

### 3. Run the backend

Open a terminal in the backend directory:

```bash
cd ats-backend
```

Set the required database environment variables for your operating system, then run:

**Windows PowerShell**

```powershell
$env:DB_URL = "jdbc:mysql://localhost:3306/earlyjobs_ats"
$env:DB_USERNAME = "your_mysql_username"
$env:DB_PASSWORD = "your_mysql_password"

.\mvnw.cmd spring-boot:run
```

The backend runs on:

`http://localhost:8080`

### 4. Run the frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

The Vite development server runs at:

`http://localhost:5173`

The frontend API client is configured to use the deployed backend URL. To run the complete application locally against your local backend, configure the API base URL in `frontend/src/api/api.js` to:

```javascript
baseURL: "http://localhost:8080/api"
```

Restart the frontend development server if necessary.

### 5. Build the frontend

From the `frontend` directory:

```bash
npm run build
```

The production build is generated in the `dist/` directory.

## REST API

Base URL:

`https://ats-backend.ostead.tech/api`

### Candidate endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/candidates` | List candidates; supports optional search and stage filters |
| POST | `/candidates` | Create a candidate |
| GET | `/candidates/{id}` | Retrieve a candidate by ID |
| PUT | `/candidates/{id}` | Update candidate details |
| DELETE | `/candidates/{id}` | Delete a candidate |
| PATCH | `/candidates/{id}/stage` | Update a candidate's hiring stage |

### Dashboard endpoint

| Method | Endpoint | Description |
|---|---|---|
| GET | `/dashboard/metrics` | Retrieve recruitment metrics and stage counts |

Example request:

```bash
curl https://ats-backend.ostead.tech/api/candidates
```

The API accepts and returns JSON for candidate operations. Refer to the backend DTOs and controller mappings for the exact request fields and validation rules.

## Deployment

The application is deployed on Openstead:

- **Frontend:** Static Site
- **Backend:** Java/Spring Boot web service
- **Database:** MySQL

The frontend communicates with the deployed backend over HTTPS. The backend CORS configuration permits the deployed frontend origin and the local Vite development origin.

## Security Notes

- Keep database credentials in environment variables, not source code.
- Validate incoming candidate data on the backend.
- Use parameterized database operations through Spring Data JPA.
- Configure CORS to allow only the required frontend origins.
- This demo does not currently implement authentication or authorization. Do not store real or sensitive candidate information in the public deployment.

## Future Improvements

- Authentication and role-based access control.
- Candidate resume upload and document management.
- Interview scheduling and reminders.
- Advanced filtering and reporting.
- Automated testing and continuous integration.

## License

This project was created as a mini ATS application project. Add a license file if you intend to distribute it under a specific open-source license.
