
# LMS Backend (MongoDB + Express)

Backend API for a simple LMS (Learning Management System) built with **Node.js**, **Express**, and **MongoDB**.  
This project was migrated from JSON-based storage to MongoDB as part of Assignment 3.

MongoDB is hosted on a private home server and accessed securely via **Tailscale VPN**.

---

## Tech Stack

- Node.js
- Express.js
- MongoDB (Docker)
- Mongoose
- Swagger (OpenAPI 3.0)
- Tailscale (secure VPN)
- dotenv

---

## Project Structure

```

.
├── docs/
│   └── swagger.js
├── models/
│   └── Course.js
├── routes/
│   ├── courses.routes.js
│   └── demo.routes.js
├── screenshots/
├── .env
├── .gitignore
├── package.json
├── server.js
└── README.md

````

---

## Data Model (Course)

Each course contains:

- `title` (String, required)
- `description` (String, required)
- `level` (String, required)
- `published` (Boolean)
- `createdAt` (Date, auto)
- `updatedAt` (Date, auto)

---

## Database & Security

- MongoDB runs inside **Docker** on a home PC
- Database is **NOT exposed to the public internet**
- Remote access is provided via **Tailscale VPN**
- Authentication is enabled using MongoDB username/password

---

## Environment Variables

Create a `.env` file in the project root:

```env
PORT=3000
MONGO_URI=mongodb://admin:YOUR_PASSWORD@100.104.150.22:27017/assignment3?authSource=admin
````

> Replace `YOUR_PASSWORD` with your MongoDB password.

---

## Running the Project

### 1. Install dependencies

```bash
npm install
```

### 2. Start the server

```bash
node server.js
```

Server will run at:

```
http://localhost:3000
```

---

## API Documentation (Swagger)

Swagger UI is available at:

```
http://localhost:3000/docs
```

All CRUD endpoints for `courses` are documented and testable via Swagger.

---

## API Endpoints

| Method | Endpoint     | Description         |
| ------ | ------------ | ------------------- |
| GET    | /courses     | Get all courses     |
| GET    | /courses/:id | Get course by ID    |
| POST   | /courses     | Create a new course |
| PUT    | /courses/:id | Update a course     |
| DELETE | /courses/:id | Delete a course     |

---

## Testing

All endpoints were tested using:

* Swagger UI
* Postman

---

## Assignment Notes

* JSON file storage was fully replaced with MongoDB
* Proper validation and HTTP status codes are implemented
* The project is directly related to the Final Project topic (LMS)
* Secure remote database access is implemented via VPN
* Code is modular and well-structured

---

## Author

**Adilzhan Kadyrov**

