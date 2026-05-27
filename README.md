<div align="center">

# 🎯 AI Study Planner

### Your Intelligent, Personalized Academic Companion

A full-stack web application that generates **AI-powered, day-by-day study plans** tailored to your goals, skill level, and schedule. Track your daily progress, maintain study streaks, and organize your notes — all in one beautiful, modern dashboard.

---

![React](https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-22-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-5.x-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-Auth-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)

</div>

---

## ✨ Key Features

### 🤖 AI-Powered Study Plans
- Generate personalized, day-by-day study schedules based on your **target area**, **deadline**, **skill level**, and **daily study time commitment**.
- Choose from multiple study areas: **Data Structures & Algorithms**, **University Exams**, or **New Skills** (e.g., React.js).
- Each plan includes actionable tasks with estimated time and category labels (Theory, Practice, Project, Review).

### 🔐 Secure Authentication System
- **Email & Password Registration** with industry-standard **bcrypt** password hashing.
- **6-Digit OTP Email Verification** — users must verify their email via a one-time password sent through Gmail (Nodemailer) before accessing the platform.
- **OTP Resend** functionality with 5-minute expiry windows.
- **JWT (JSON Web Token)** session management with 7-day token expiry.
- Protected routes ensuring only authenticated users can access the dashboard.

### 📊 Interactive Dashboard
- **Today's Plan View** — automatically calculates which day of the plan you're on and shows the relevant tasks.
- **Task Checkboxes** — mark tasks as completed with a single click; changes persist to the database in real-time.
- **Circular Progress Ring** — a visually animated SVG ring that shows your daily completion percentage.
- **Motivational Messages** — dynamic encouragement messages based on your current progress.

### 🔥 Streak Tracking System
- Automatic **daily habit streak counter** that increments when you complete all tasks for the day.
- Intelligent streak logic: maintains your streak if you completed yesterday's tasks, resets to 1 if you missed a day.
- Streak displayed prominently on the dashboard with a fire emoji indicator.

### 📝 Full-Featured Notes System
- **Create, Edit, Save, and Delete** notes with a clean, distraction-free editor.
- **Pin important notes** to the top of your list for quick access.
- **Search functionality** — instantly filter notes by title or content.
- **Real-time sidebar** showing all notes with preview snippets.

### 🎨 Premium UI/UX
- **Dark theme** with glassmorphism design (frosted glass panels, subtle borders).
- **Framer Motion animations** — smooth page transitions, staggered list animations, and micro-interactions.
- **Fully responsive** — works seamlessly on desktop, tablet, and mobile.
- **Lucide React icons** for a consistent, modern icon system.

---

## 🏗️ Tech Stack

| Layer | Technology | Purpose |
|:------|:-----------|:--------|
| **Frontend** | React 19, Vite 8 | Component-based UI with fast HMR dev server |
| **Styling** | Tailwind CSS 3.4 | Utility-first CSS framework |
| **Animations** | Framer Motion | Declarative animations and page transitions |
| **Icons** | Lucide React | Modern, customizable SVG icon library |
| **Routing** | React Router DOM v7 | Client-side navigation with protected routes |
| **HTTP Client** | Fetch API | Native browser API for backend communication |
| **Backend** | Node.js, Express 5 | RESTful API server |
| **Database** | MongoDB, Mongoose 9 | NoSQL document database with schema validation |
| **Authentication** | JWT, bcryptjs | Secure token-based auth with password hashing |
| **Email Service** | Nodemailer | OTP delivery via Gmail SMTP |

---

## 📁 Project Structure

```
AI-study-planner/
├── backend/
│   ├── controllers/
│   │   ├── authController.js       # Register, Login, OTP verify/resend
│   │   ├── planController.js       # Generate plans, update tasks, streaks
│   │   ├── notesController.js      # CRUD operations for notes
│   │   └── progressController.js   # Daily progress stats
│   ├── models/
│   │   ├── User.js                 # User schema (bcrypt, OTP, streak)
│   │   ├── Goal.js                 # Learning goal schema
│   │   ├── StudyPlan.js            # Study plan with nested day/task data
│   │   ├── Note.js                 # Notes schema (pin, timestamps)
│   │   └── Progress.js             # Daily progress tracking
│   ├── routes/
│   │   ├── authRoutes.js           # /api/auth/*
│   │   ├── planRoutes.js           # /api/plans/*
│   │   ├── notesRoutes.js          # /api/notes/*
│   │   ├── progressRoutes.js       # /api/progress/*
│   │   └── authMiddleware.js       # JWT verification middleware
│   ├── .env.example                # Environment variable template
│   ├── server.js                   # Express app entry point
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx     # Hero section & feature showcase
│   │   │   ├── AuthPage.jsx        # Login / Register / OTP verification
│   │   │   ├── DashboardPage.jsx   # Task checklist, progress ring, streaks
│   │   │   ├── GoalsPage.jsx       # Study goal input form
│   │   │   └── NotesPage.jsx       # Notes editor with sidebar
│   │   ├── components/
│   │   │   ├── layout/             # Navbar, Footer, BackgroundAnimation
│   │   │   └── ui/                 # Reusable UI components
│   │   ├── App.jsx                 # Router configuration
│   │   └── main.jsx                # React entry point
│   ├── vite.config.js              # Vite config with API proxy
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed on your machine:

- **Node.js** (v18 or higher) — [Download](https://nodejs.org/)
- **MongoDB** (running locally or a MongoDB Atlas cloud URI) — [Download](https://www.mongodb.com/try/download/community)
- **Git** — [Download](https://git-scm.com/)

### Installation

**1. Clone the repository**

```bash
git clone https://github.com/Priyansu-afk/AI-study-planner.git
cd AI-study-planner
```

**2. Set up the Backend**

```bash
cd backend
npm install
```

Create your environment file by copying the template:

```bash
cp .env.example .env
```

Open the `.env` file and fill in your own credentials:

```env
PORT=7000
MONGODB_URI=mongodb://127.0.0.1:27017/studyplan
JWT_SECRET=your_own_secret_key_here
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_gmail_app_password
```

> **💡 How to get a Gmail App Password:**
> 1. Go to your [Google Account Security Settings](https://myaccount.google.com/security).
> 2. Enable **2-Step Verification** if not already enabled.
> 3. Search for **App Passwords** and generate one for "Mail".
> 4. Copy the 16-character password into `EMAIL_PASS`.

**3. Set up the Frontend**

```bash
cd ../frontend
npm install
```

### Running the Application

You need **two terminal windows** — one for the backend, one for the frontend.

**Terminal 1 — Start the Backend:**

```bash
cd backend
node server.js
```

You should see:
```
Connected to MongoDB
Server running on port 7000
```

**Terminal 2 — Start the Frontend:**

```bash
cd frontend
npm run dev
```

You should see:
```
VITE v8.x.x  ready in XXX ms
➜  Local: http://localhost:5173/
```

**4. Open your browser and visit:** [http://localhost:5173](http://localhost:5173)

---

## 🔌 API Endpoints

### Authentication
| Method | Endpoint | Description |
|:-------|:---------|:------------|
| `POST` | `/api/auth/register` | Register a new user (sends OTP email) |
| `POST` | `/api/auth/verify-otp` | Verify email with 6-digit OTP |
| `POST` | `/api/auth/resend-otp` | Resend OTP to email |
| `POST` | `/api/auth/login` | Login with email & password |

### Study Plans
| Method | Endpoint | Description |
|:-------|:---------|:------------|
| `POST` | `/api/plans/generate` | Generate a new AI study plan |
| `GET` | `/api/plans` | Get all plans for the logged-in user |
| `PUT` | `/api/plans/update-task` | Toggle a task's completion status |

### Notes
| Method | Endpoint | Description |
|:-------|:---------|:------------|
| `GET` | `/api/notes` | Get all notes for the logged-in user |
| `POST` | `/api/notes` | Create a new note |
| `PUT` | `/api/notes/:id` | Update a note (title, content, pin) |
| `DELETE` | `/api/notes/:id` | Delete a note |

### Progress
| Method | Endpoint | Description |
|:-------|:---------|:------------|
| `GET` | `/api/progress/stats` | Get streak and completion stats |

> **Note:** All endpoints except `/auth/*` require a valid JWT token in the `Authorization: Bearer <token>` header.

---

## 🛡️ Security

- **Passwords** are hashed using `bcryptjs` before being stored in the database. Plain-text passwords are never saved.
- **JWT tokens** are used for stateless session management with a 7-day expiry.
- **OTP codes** expire after 5 minutes and are cleared from the database after successful verification.
- **Environment variables** (`.env`) containing sensitive credentials are excluded from version control via `.gitignore`.
- **Auth middleware** protects all API routes, ensuring only verified users can access protected resources.

---

## 🤝 Contributing

Contributions are welcome! If you'd like to contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m 'Add your feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<div align="center">

**Built with ❤️ by [Priyansh](https://github.com/Priyansu-afk)**

</div>