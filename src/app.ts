import express , {Request,Response,Express} from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import UserRoutes from "./routes/userRoutes.js";
import cors from "cors";
import cardRoutes from './routes/cardRoute.js';
import appointmentRoutes from "./routes/appointmentRoute.js"
const app:Express = express();
app.use(cookieParser()); // for parsing cookies
app.use(express.json())


dotenv.config({})
const PORT = process.env.PORT || 3000;
app.use(
  cors({
    origin: ["http://localhost:3000"], // Add allowed origins
    credentials: true, // If using cookies
  })
);

app.use("/api/user", UserRoutes);
app.use("/api/card", cardRoutes);
app.use("/api/appointment", appointmentRoutes);


app.listen(PORT,()=>{
    console.log(`server is running on ${PORT}`);
})
