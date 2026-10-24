# Task Manager Frontend

A responsive Task Management application built with **React, Vite, and Axios**. It provides a simple interface for managing tasks, tracking progress, and organizing work by status and priority.

## Features

- User registration and login
- JWT-based authentication
- Protected dashboard
- Create, view, update, and delete tasks
- Task status management:
  - Pending
  - In Progress
  - Completed
- Task priority management:
  - Low
  - Medium
  - High
- Search and filter tasks, if implemented
- Due date management
- Dashboard statistics
- Responsive user interface
- Integration with the Node.js and Express backend

## Tech Stack

- React
- Vite
- JavaScript
- Axios
- React Router
- Lucide React
- CSS
- Node.js and Express backend API

## Prerequisites

Install the following before running the project:

- [Node.js](https://nodejs.org/) — preferably an active LTS version
- npm
- Git
- The [Task Manager Backend](https://github.com/YOUR_USERNAME/task-manager-backend) running locally

Replace `YOUR_USERNAME` with the GitHub username that owns the backend repository.

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/task-manager-frontend.git
```

Replace `YOUR_USERNAME` with your GitHub username.

### 2. Navigate to the project directory

```bash
cd task-manager-frontend
```

### 3. Install dependencies

```bash
npm install
```

### 4. Configure environment variables

Create a `.env` file in the frontend root directory:

```env
VITE_API_URL=http://localhost:3000/api
```

This URL should point to your running backend API.

**Important:** Vite exposes variables prefixed with `VITE_` to browser-side code. Never store passwords, JWT secrets, or other private credentials in frontend environment variables.

### 5. Start the development server

```bash
npm run dev
```

Vite will display the local development URL in the terminal. By default, it is:

```text
http://localhost:5173
```

Open that address in your browser.

## Backend Configuration

Ensure the backend is running at:

```text
http://localhost:3000
```

The frontend uses the following API base URL:

```text
http://localhost:3000/api
```

The backend must allow requests from the frontend origin through its CORS configuration.

See the [Task Manager Backend Repository](https://github.com/YOUR_USERNAME/task-manager-backend) for backend installation and setup instructions.

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Starts the Vite development server |
| `npm run build` | Creates a production build |
| `npm run preview` | Previews the production build locally |
| `npm run lint` | Runs ESLint, if configured |

## Project Structure

```text
task-manager-frontend/
├── public/
├── src/
│   ├── api/
│   │   └── axios.js
│   ├── components/
│   │   └── ProtectedRoute.jsx
│   ├── pages/
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   └── Dashboard.jsx
│   ├── services/
│   │   ├── authService.js
│   │   └── taskService.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── .env.example
├── .gitignore
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

The exact structure may vary depending on your implementation.

## Authentication Flow

1. A new user registers an account.
2. The user signs in with their email and password.
3. The backend returns a JWT token.
4. The frontend stores the token and sends it with protected API requests.
5. The user accesses the task dashboard.
6. The user can log out to end the current frontend session.

## Task Management

Users can manage their own tasks through the dashboard.

Each task supports:

- Title
- Description
- Status
- Priority
- Due date

Task creation, updates, and deletion are handled through the backend API.

## Troubleshooting

- **Blank page:** Check the browser console for JavaScript errors and verify your component imports and routes.
- **CORS error:** Confirm that the backend allows requests from `http://localhost:5173`.
- **API connection error:** Verify the backend is running and `VITE_API_URL` is correct.
- **Authentication error:** Sign in again if your token is missing, invalid, or expired.
- **Environment variable changes not applied:** Restart the Vite development server.
- **Missing dependencies:** Run `npm install`.

## Production Build

Create an optimized production build:

```bash
npm run build
```

The generated files will be placed in the `dist/` directory. Deploy this directory using a suitable static hosting provider, and configure `VITE_API_URL` to point to your deployed backend API.

## Security Notes

- Never commit `.env` files.
- Do not store backend secrets in frontend code.
- Validate and authorize all operations on the backend.
- Use HTTPS in production.
- For production applications, consider a more secure authentication storage strategy than local storage, depending on your security requirements.

## License

Add your preferred license before distributing or reusing this project.
