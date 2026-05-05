# 📚 EduShare — Project Files Overview

All other files (like `node_modules`, `package-lock.json`, etc.) are automatically generated dependencies.
---

## 🖥️ Backend Files (Node.js + Express)
*These files handle the database, authentication, API routes, and logic.*

### 1. Main Entry & Config
- **`backend/server.js`**
  - The main entry point of your application.
  - It sets up the Express server, connects middleware (CORS, file upload), and registers all the API routes.
- **`backend/config/db.js`**
  - Connects to the Neon PostgreSQL database using the `pg` pool.
  - Contains retry logic to ensure stable connections.
- **`backend/config/cloudinary.js`**
  - Configures the Cloudinary SDK using your API keys so users can upload PDFs/PPTs.
- **`backend/schema.sql`**
  - The SQL commands you used to create the `users`, `resources`, and `downloads` tables in the database.

### 2. Models (Database Interaction)
- **`backend/models/userModel.js`**
  - Contains functions to create new users, find users by email, and get a list of all users.
- **`backend/models/resourceModel.js`**
  - Contains functions to save new resources, fetch all resources (with search filtering), and delete resources.

### 3. Controllers (Business Logic)
- **`backend/controllers/authController.js`**
  - Handles the `register` and `login` logic.
  - Hashes passwords with `bcryptjs` and generates JWT tokens.
- **`backend/controllers/resourceController.js`**
  - Handles uploading files to Cloudinary and saving their URLs to the database.
  - Fetches resources to display on the frontend.
- **`backend/controllers/adminController.js`**
  - Contains admin-specific actions like fetching the user list and deleting a resource.

### 4. Routes (API Endpoints)
- **`backend/routes/authRoutes.js`**
  - Defines the `/api/auth/register` and `/api/auth/login` URLs.
- **`backend/routes/resourceRoutes.js`**
  - Defines the `/api/resources` URLs.
- **`backend/routes/adminRoutes.js`**
  - Defines the `/api/admin` URLs.

### 5. Middleware (Security)
- **`backend/middleware/authMiddleware.js`**
  - Protects routes by verifying the JWT token.
  - Checks if the user has the `teacher` or `admin` role before allowing uploads or deletions.

---

## 🎨 Frontend Files (React.js)
*These files make up the user interface that runs in the browser.*

### 1. Core Setup & Global Styles
- **`frontend/src/App.js`**
  - The main React component that manages "State" (whether the user is logged in).
  - Handles routing between different pages (Login, Register, Resources, etc.).
- **`frontend/src/index.js`**
  - The starting point that renders the `App` component into the HTML file.
- **`frontend/src/index.css`**
  - Contains all the custom CSS you wrote. Clean, modern styles without relying on heavy frameworks like Bootstrap or Tailwind.
- **`frontend/src/api.js`**
  - A central file containing all the `axios` functions to communicate with your backend API. It automatically attaches the JWT token to requests.

### 2. Components
- **`frontend/src/components/Navbar.js`**
  - The top navigation bar. It dynamically changes its buttons based on whether the logged-in user is a Student, Teacher, or Admin.

### 3. Pages
- **`frontend/src/pages/LoginPage.js`**
  - The UI for the login form. Takes email and password.
- **`frontend/src/pages/RegisterPage.js`**
  - The UI for creating a new account. Allows selecting "Student" or "Teacher" roles.
- **`frontend/src/pages/ResourcesPage.js`**
  - The main dashboard where all users can search for resources and click the "Download" button to view the PDFs/PPTs.
- **`frontend/src/pages/UploadPage.js`**
  - A form only visible to Teachers/Admins to upload new files via Cloudinary.
- **`frontend/src/pages/AdminPage.js`**
  - A secure dashboard only visible to Admins. Features a tabbed interface to view all registered users and delete resources.

