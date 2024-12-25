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


// app.use(

// 	cors({
// 	  origin: (origin, callback) => {
// 		// Allow requests from localhost and Vercel deployments
// 		if (
// 		  !origin || // Allow non-origin requests (e.g., from Postman)
// 		  origin.startsWith("http://localhost") || // Allow all localhost URLs
// 		  origin.endsWith(".vercel.app") // Allow all Vercel deployments
// 		) {
// 		  callback(null, true);
// 		} else {
// 		  callback(new Error("Not allowed by CORS")); // Deny other origins
// 		}
// 	  },
// 	  credentials: true, // Allow cookies
// 	})
//   );

app.use(cors());

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true , limit: "50mb" }));

app.use("/api/user", UserRoutes);
app.use("/api/card", cardRoutes);
app.use("/api/appointment", appointmentRoutes);


app.listen(PORT,()=>{
    console.log(`server is running on ${PORT}`);
})
