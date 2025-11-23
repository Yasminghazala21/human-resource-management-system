<h1 align="center">HRMS – Human Resource Management System</h1>

<p align="center">
A complete full-stack HRMS platform to manage employees, teams, authentication, and audit logs.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Backend-Node.js-success?style=flat-square" />
  <img src="https://img.shields.io/badge/Frontend-React-blue?style=flat-square" />
  <img src="https://img.shields.io/badge/Database-MySQL-orange?style=flat-square" />
  <img src="https://img.shields.io/badge/Auth-JWT-yellow?style=flat-square" />
</p>

---

## 📌 Table of Contents
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [API Overview](#-api-overview)
- [Usage](#-usage)
- [Deployment](#-deployment)
- [License](#-license)

---

## ✨ Features

- ✔️ Organisation registration & admin account  
- ✔️ Employee CRUD operations  
- ✔️ Team creation, deletion & member assignment  
- ✔️ JWT-based secure authentication  
- ✔️ Activity logs for all important actions  
- ✔️ Role-based interface (Admin / User)  
- ✔️ Modern & responsive UI  

---

## 🛠 Tech Stack

### **Frontend**
- React.js  
- React Router  
- Axios  

### **Backend**
- Node.js  
- Express.js  
- Sequelize ORM  

### **Database**
- MySQL  

### **Authentication**
- JWT Tokens  

---

## 📁 Project Structure

```
hrms/
 ├── hrms-backend/
 │   ├── src/
 │   ├── config/
 │   ├── controllers/
 │   ├── middleware/
 │   ├── models/
 │   └── routes/
 └── hrms-frontend/
     ├── src/
     ├── components/
     ├── pages/
     ├── context/
     └── utils/
```

---

## 🚀 Getting Started

### **Prerequisites**
Make sure you have installed:

- Node.js  
- npm  
- MySQL  
- Git  

---

### 📥 Clone the Repositories

```bash
git clone https://github.com/Yasminghazala21/hrms-backend.git
git clone https://github.com/Yasminghazala21/hrms-frontend.git
```

---

## 🧩 Backend Setup

```bash
cd hrms-backend
npm install
cp .env.example .env   # Create environment config
npm run dev
```

---

## 🎨 Frontend Setup

```bash
cd hrms-frontend
npm install
npm start
```

---

## ⚙️ Environment Variables

### **Backend `.env`**

```
DB_USER=
DB_PASSWORD=
DB_NAME=
DB_HOST=
DB_PORT=
JWT_SECRET=
```

### **Frontend `.env`**

```
REACT_APP_API_URL=http://localhost:5000
```

---

## 🔗 API Overview

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Register organisation & admin |
| POST | `/auth/login` | Login admin/user |
| GET | `/employees` | Get employee list |
| POST | `/employees` | Add employee |
| PUT | `/employees/:id` | Edit employee |
| DELETE | `/employees/:id` | Remove employee |
| POST | `/teams` | Create a team |
| GET | `/logs` | Get activity logs |

_(You can ask me to generate a full API documentation table.)_

---

## 🖥️ Usage

1. Open frontend → `http://localhost:3000`  
2. Register organization & admin  
3. Login to access dashboard  
4. Manage employees, teams, and logs  
5. Backend → `http://localhost:5000`  

---


## 📄 License

This project is licensed under the **MIT License**.

---

<p align="center">Made with ❤️ for learning and real-world HR management.</p>
