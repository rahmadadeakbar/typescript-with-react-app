Setup Tailwind (front-end)

1. Install Tailwind and PostCSS dependencies in the React app:

```powershell
cd c:\typscript-project\crud-app
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

2. Ensure `tailwind.config.js` `content` includes `./src/**/*.{js,jsx,ts,tsx}` (the file created for you already does).
3. `src/index.css` already contains the Tailwind directives. Start the dev server:

```powershell
npm start
```

If you use Create React App, it will pick up PostCSS automatically if `postcss.config.js` is present.


Setup API (backend)

1. Enter the api folder and install dependencies:

```powershell
cd c:\typscript-project\crud-app\api
npm install
```

2. Copy `.env.example` to `.env` and set your MySQL credentials. Example values are suitable for local MySQL.

3. Start the API server:

```powershell
npm run dev
# or
npm start
```

4. By default the front-end expects the API at `http://localhost:4000`. If you run it elsewhere, set `REACT_APP_API_BASE` in the front-end environment (create a `.env` in the front-end root with `REACT_APP_API_BASE=http://yourhost:port`).


Database

- You can run `api/db.sql` on your MySQL server to create the `crud_app` database and the `students` table, or let the server create it automatically (server creates table on start if missing).


Notes

- I added a small Express server in `api/server.js` using `mysql2/promise` with prepared statements.
- The front-end `src/App.tsx` was updated to call the API for CRUD operations. Ensure both front-end and API are running.
- If you want, I can also add Docker Compose for MySQL + API for easy local setup.
