# LMS Backend API (Express)

Backend API for a simple Learning Management System (LMS), built with **Node.js** and **Express**.  
At the current stage, data is stored in a local JSON file (`data.json`).  
The project is designed so it can be easily extended later (database, authentication, frontend).

## Project Goals
- Learn how to build a REST API with Express
- Implement basic CRUD operations
- Work with file-based JSON storage
- Document API using Swagger
- Prepare backend that can be reused for a future frontend

---

## Features
- Express server setup
- Demo routes for testing server status
- Courses CRUD (Create, Read, Update, Delete)
- Persistent storage using `data.json`
- Swagger UI documentation available at `/docs`

---

## Tech Stack
- **Node.js**
- **Express**
- **swagger-ui-express**
- **swagger-jsdoc**
- File storage: JSON

---

## Project Structure
```

express-backend/
server.js
data.json
package.json
README.md
routes/
demo.routes.js
courses.routes.js
utils/
storage.js
docs/
swagger.js

````

---

## Installation
Install dependencies:
```bash
npm install
````

---

## Run the Server

```bash
node server.js
```

Server will start at:

```
http://localhost:3000
```

Swagger documentation:

```
http://localhost:3000/docs
```

---

## API Routes

### Demo Routes

| Method | Endpoint  | Description         |
| ------ | --------- | ------------------- |
| GET    | `/`       | Server health check |
| GET    | `/hello`  | Test message        |
| GET    | `/time`   | Current server time |
| GET    | `/status` | Server status       |

---

### Courses API

#### Get all courses

```
GET /courses
```

#### Get course by ID

```
GET /courses/:id
```

#### Create a course

```
POST /courses
```

Body (JSON example):

```json
{
  "title": "Intro to JavaScript",
  "description": "Basics of JS and DOM",
  "level": "beginner",
  "published": false
}
```

#### Update a course

```
PUT /courses/:id
```

Example body:

```json
{
  "published": true
}
```

#### Delete a course

```
DELETE /courses/:id
```

Response:

```json
{
  "success": true
}
```

---

## Data Storage

All data is stored in a local file:

```
data.json
```

Example structure:

```json
{
  "courses": []
}
```

---

## Notes

* This project does not use a database yet
* Authentication is not implemented
* Designed to be extended with:

  * users / students
  * lessons
  * database (MongoDB / PostgreSQL)
  * frontend (React / Next.js)

---

