import express from "express"
import cors from "cors"
import 'dotenv/config'
import { connectDB } from "./config/db.js"
import userRouter from "./routes/userRoute.js"
import taskRouter from "./routes/taskRoute.js"
import analyticsRouter from "./routes/analyticsRoute.js"
import aiRouter from "./routes/aiRoute.js"
import { initCronJobs } from "./services/cronService.js"

const app = express();
const port = process.env.PORT || 4000;

app.use(cors({
  origin: function (origin, callback) {
    // Allow all origins dynamically to support all Vercel generated aliases
    callback(null, true);
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true
}));

app.use(express.json());

// Connect to MySQL
connectDB();

// Initialize scheduled jobs (runs after DB is connected)
initCronJobs();

app.use("/api/user", userRouter);
app.use("/api/task", taskRouter);
app.use("/api/analytics", analyticsRouter);
app.use("/api/ai", aiRouter);

app.get("/", (req, res) => {
    res.send("API is running");
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
