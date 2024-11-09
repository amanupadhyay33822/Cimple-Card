import express , {Request,Response,Express} from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import UserRoutes from "./routes/userRoutes.js";
import cors from "cors";
const app:Express = express();
app.use(cookieParser()); // for parsing cookies
app.use(express.json())


dotenv.config({})
const PORT = process.env.PORT || 3000;
app.use(
	cors({
		origin: "*",
		credentials: true,
	})
);
app.use("/api/user", UserRoutes);


app.listen(PORT,()=>{
    console.log(`server is running on ${PORT}`);
})