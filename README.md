# Teacher-Student API

A simple RESTful API for registering students to teachers, suspending students, retrieving common students, and handling notification recipients.
Built with Node.js, Express, Sequelize ORM, and MySQL (with in-memory SQLite for testing).

---

## Features

- **Register Students:** Assign one or more students to a teacher.
- **Common Students:** Retrieve students registered to one or more teachers.
- **Suspend Student:** Mark a student as suspended (won’t receive notifications).
- **Retrieve Notification Recipients:** Get list of students eligible for a teacher's notification (registered and/or explicitly mentioned, but not suspended).

---

## Getting Started

### 1. **Clone the Repository**

```sh
git clone https://github.com/Delepan/teacher-student-api.git
cd teacher-student-api
```

### 2. **Install Dependencies**

```sh
npm install
```

### 3. **Set Up Environment Variables**

Create a `.env` file in the project root with your MySQL database details:

```ini
DB_HOST=localhost
DB_USER=your_mysql_user
DB_PASSWORD=your_mysql_password
DB_NAME=teacher_student_db
DB_PORT=3306
PORT=3000
```

> ⚠️ **Do not commit your `.env` file to version control!**

### 4. **Set Up MySQL Database**

Create a database in MySQL matching your `.env` settings.

```sql
CREATE DATABASE teacher_student_db;
```

---

## Running the Application

### **Start the Server**

```sh
npm start
```

The API will be available at `http://localhost:3000`.

---

## API Endpoints

### 1. **Register Students**

- **Endpoint:** `POST /api/register`
- **Body:**

  ```json
  {
    "teacher": "teacherken@gmail.com",
    "students": ["studentjon@gmail.com", "studenthon@gmail.com"]
  }
  ```

- **Response:** `204 No Content` on success.

---

### 2. **Get Common Students**

- **Endpoint:** `GET /api/commonstudents?teacher=teacherken@gmail.com&teacher=teacherjoe@gmail.com`
- **Response:**

  ```json
  {
    "students": ["commonstudent1@gmail.com", "commonstudent2@gmail.com"]
  }
  ```

---

### 3. **Suspend a Student**

- **Endpoint:** `POST /api/suspend`
- **Body:**

  ```json
  {
    "student": "studentjon@gmail.com"
  }
  ```

- **Response:** `204 No Content` on success.

---

### 4. **Retrieve Recipients for Notification**

- **Endpoint:** `POST /api/retrievefornotifications`
- **Body:**

  ```json
  {
    "teacher": "teacherken@gmail.com",
    "notification": "Hello students! @studentbob@gmail.com @studenthon@gmail.com"
  }
  ```

- **Response:**

  ```json
  {
    "recipients": ["studenthon@gmail.com", "studentbob@gmail.com"]
  }
  ```

---

## Running Automated Tests

This project uses [Jest](https://jestjs.io/) and [Supertest](https://github.com/visionmedia/supertest) for API testing.

- **To run all tests:**

  ```sh
  npm test
  ```

> **Note:** Tests run against an in-memory SQLite database (data is not persisted after test run).

---

## Project Structure

```
.
├── app.js
├── controllers/
├── models/
├── routes/
├── tests/
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

---

## Design Decisions

- Used Express.js for API routing and middleware.
- Used Sequelize ORM for database abstraction and relationship management.
- MySQL as primary database; SQLite in-memory for fast, isolated testing.
- Models designed to enforce unique constraints on teacher and student emails.
- Used `belongsToMany` relationships to efficiently support many-to-many registration of students and teachers.

---
