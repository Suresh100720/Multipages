# 🚀 Candidate Management System (Multipages)

A full-stack **Candidate Management System** built using **React (Vite) + Node.js + MongoDB**, featuring dashboard analytics, AG Grid tables, and a modern UI.

---

## 📌 Project Overview

This application allows users to:

* Manage candidates and job applications
* View analytics through dashboard charts
* Perform CRUD operations with advanced tables
* Handle resumes and candidate details efficiently

---

## 🧩 Features

### 📊 Dashboard

* Stat cards (Total, Active, Inactive, Applied)
* Clickable cards → open filtered candidate data in popup
* Charts visualization (Role-wise / Status-wise)

---

### 📋 Candidate Management

* Add, edit, delete candidates
* Resume upload & preview
* Status tracking (Active / Inactive / New)
* Bulk delete functionality
* Export selected candidates to Excel

---

### 📈 AG Grid Table

* Sorting, filtering, pagination
* Column resize & reorder
* Column visibility panel
* Custom cell renderers:

  * Avatar (candidate initials)
  * Status badge
  * Action menu (edit/delete)

---

### 💼 Jobs Module

* View available job listings
* Apply to jobs using modal forms

---

### ⚙️ Settings

* Theme toggle (Dark/Light mode)
* UI customization

---

### 🎨 UI/UX

* Built with **Ant Design + Bootstrap**
* Responsive layout
* Sidebar navigation + Header bar
* Clean and modern design

---

## 🏗️ Folder Structure

```id="projstruct002"
MULTIPAGES/
│
├── backend/
│   ├── models/
│   │   ├── Candidate.js
│   │   └── Job.js
│   ├── routes/
│   │   ├── candidateRoutes.js
│   │   └── jobRoutes.js
│   ├── uploads/
│   ├── server.js
│   └── .env
│
├── src/
│   ├── components/
│   │   ├── dashboard/
│   │   │   ├── DashboardCharts.jsx
│   │   │   ├── DashboardGrid.jsx
│   │   │   └── StatCards.jsx
│   │   │
│   │   ├── layout/
│   │   │   ├── HeaderBar.jsx
│   │   │   ├── Layout.jsx
│   │   │   └── Sidebar.jsx
│   │   │
│   │   └── ui/
│   │       ├── AgGridTable.jsx
│   │       ├── CandidateForm.jsx
│   │       ├── CandidateFormModal.jsx
│   │       ├── JobFormModal.jsx
│   │       ├── StatusBadge.jsx
│   │       └── LoadingSpinner.jsx
│   │
│   ├── pages/
│   │   ├── Dashboard/
│   │   │   └── Dashboard.jsx
│   │   ├── Candidates/
│   │   │   └── Candidates.jsx
│   │   ├── Jobs/
│   │   │   └── Jobs.jsx
│   │   ├── Settings/
│   │   │   └── Settings.jsx
│   │   └── NotFound.jsx
│   │
│   ├── routes/
│   │   └── AppRoutes.jsx
│   │
│   ├── services/
│   │   └── api.js
│   │
│   ├── utils/
│   │   └── exportExcel.js
│   │
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
│
├── public/
├── package.json
├── tailwind.config.js
└── README.md
```

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the Repository

```bash id="cmd101"
git clone https://github.com/your-username/multipages.git
cd multipages
```

---

### 2️⃣ Backend Setup

```bash id="cmd102"
cd backend
npm install
```

Create `.env` file:

```env id="env101"
PORT=5000
MONGO_URL=mongodb://127.0.0.1:27017/candidateDB
```

Run backend:

```bash id="cmd103"
npm start
```

---

### 3️⃣ Frontend Setup

```bash id="cmd104"
cd ..
npm install
npm run dev
```

---

## 🌐 Environment Variables

### Backend `.env`

```env id="env102"
PORT=5000
MONGO_URL=mongodb://127.0.0.1:27017/candidateDB
```

### Frontend `.env`

```env id="env103"
VITE_API_URL=http://localhost:5000
```

---

## 🔄 Application Flow

* Dashboard displays candidate statistics and charts
* Stat cards open detailed candidate lists in popup
* Users can manage candidates via table actions
* Jobs page allows viewing and applying for jobs

---

## 📦 Tech Stack

* ⚛️ React (Vite)
* 🎨 Ant Design + Bootstrap
* 📊 AG Grid
* 🟢 Node.js + Express
* 🍃 MongoDB

---

## 🚀 Future Enhancements

* Authentication system (Login & Protected Routes)
* Role-based access control
* Advanced search & filters
* Notifications system
* Deployment (Vercel + Render)

---

## 👨‍💻 Author

**Suresh**

---

## 📄 License

This project is intended for learning and development purposes.

---
