import express from "express"
import cors from "cors"
import 'dotenv/config'
import { connectDB } from "./config/db.js"
import userRouter from "./routes/userRoute.js"
import taskRouter from "./routes/taskRoute.js"

const app = express();
const port = process.env.PORT || 4000;

app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'https://student-task-manager-cvey646m2-shalinishanbhags-projects.vercel.app'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true
}));

app.use(express.json());

// Connect to MySQL
connectDB();

app.use("/api/user", userRouter);
app.use("/api/task", taskRouter);

app.get("/", (req, res) => {
    res.send("API is running");
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
