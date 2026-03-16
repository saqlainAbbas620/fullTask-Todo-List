# ✅ fullTask – Todo List App

A full-stack **MERN** (MongoDB, Express.js, React.js, Node.js) task management application that allows users to create, manage, update, and delete tasks with a clean and responsive interface.

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React.js | UI component library |
| Tailwind CSS | Styling & responsive design |
| React Router | Client-side routing |
| Axios | HTTP requests to backend API |

### Backend
| Technology | Purpose |
|---|---|
| Node.js | JavaScript runtime |
| Express.js | RESTful API framework |
| MongoDB | NoSQL database |
| Mongoose | MongoDB object modeling |
| CORS | Cross-origin resource sharing |
| dotenv | Environment variable management |

---

## ✨ Features

- ✅ Add new tasks with a title and description
- 📝 Edit existing tasks
- 🗑️ Delete tasks
- ✔️ Mark tasks as completed / incomplete
- 📱 Fully responsive design (mobile-first)
- 🔗 RESTful API with full CRUD operations
- 💾 Persistent data storage with MongoDB

---

## 📁 Project Structure

```
fullTask-Todo-List/
├── Backend/
│   ├── models/
│   │   └── Task.js          # Mongoose Task model
│   ├── routes/
│   │   └── taskRoutes.js    # API routes
│   ├── .env                 # Environment variables
│   ├── server.js            # Express server entry point
│   └── package.json
│
├── Frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── App.jsx          # Root component
│   │   └── main.jsx         # Entry point
│   ├── index.html
│   └── package.json
│
└── .gitignore
```

---

## ⚙️ Getting Started

### Prerequisites

Make sure you have the following installed:
- [Node.js](https://nodejs.org/) (v18 or above)
- [MongoDB](https://www.mongodb.com/) (local or Atlas)
- [Git](https://git-scm.com/)

---

### 1. Clone the Repository

```bash
git clone https://github.com/saqlainAbbas620/fullTask-Todo-List.git
cd fullTask-Todo-List
```

---

### 2. Setup Backend

```bash
cd Backend
npm install
```

Create a `.env` file inside the `Backend` folder:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
```

Start the backend server:

```bash
npm start
```

The backend will run at `http://localhost:5000`

---

### 3. Setup Frontend

Open a new terminal:

```bash
cd Frontend
npm install
npm run dev
```

The frontend will run at `http://localhost:5173`

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tasks` | Get all tasks |
| POST | `/api/tasks` | Create a new task |
| PUT | `/api/tasks/:id` | Update a task |
| DELETE | `/api/tasks/:id` | Delete a task |

---

## 🌐 Environment Variables

Create a `.env` file in the `Backend` directory with the following:

```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/todolist
```

---

## 📦 Dependencies

### Backend
```json
{
  "express": "^4.x",
  "mongoose": "^7.x",
  "cors": "^2.x",
  "dotenv": "^16.x"
}
```

### Frontend
```json
{
  "react": "^18.x",
  "react-dom": "^18.x",
  "tailwindcss": "^3.x",
  "axios": "^1.x"
}
```

---

## 🤝 Contributing

Contributions, issues and feature requests are welcome!

1. Fork the project
2. Create your feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

---

## 👨‍💻 Author

**Saqlain Abbas**
- GitHub: [@saqlainAbbas620](https://github.com/saqlainAbbas620)
- Email: Saqlain862.ab@gmail.com

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

> ⭐ If you found this project helpful, please give it a star!
