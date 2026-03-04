import express from "express";
import cors from 'cors'


const app = express();
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}
))
app.use(express.json());

import authRouter from "./routes/auth.routes.js";
import todoRouter from "./routes/todo.routes.js";


app.use("/api/auth", authRouter);
app.use("/api/todos", todoRouter);

export { app };