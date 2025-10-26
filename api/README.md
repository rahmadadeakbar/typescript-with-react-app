# CRUD App API (Express + MySQL)

This small API provides CRUD endpoints for `students` used by the React front-end.

## Setup

1. Install dependencies

```bash
cd api
npm install
```

2. Create or prepare MySQL database

- You can run the SQL in `db.sql` or let the server create the table automatically.
- Create a `.env` file from `.env.example` and set your DB credentials.

3. Start the server

```bash
# development with auto-reload
npm run dev
# or production
npm start
```

The API will run by default on `http://localhost:4000` and exposes:

- GET /students
- POST /students { name, nim, major }
- PUT /students/:id { name, nim, major }
- DELETE /students/:id

CORS is enabled for local development. If you run the front-end on a different port or host, set `REACT_APP_API_BASE` in your front-end env to point to the API base URL.
