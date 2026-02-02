import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/db.js";
import * as Sentry from "@sentry/node";
import { clerkWebhooks } from "./controllers/webhooks.js";
import companyRoutes from "./routes/companyRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import connectCloudinary from "./config/cloudinary.js";
import { clerkMiddleware } from "@clerk/express";

const app = express();

// 🔹 Init ONCE (not per request)
await connectDB();
await connectCloudinary();
console.log("Backend initialized"); 

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 🔹 Clerk middleware MUST be clean and uninterrupted
app.use(clerkMiddleware());

// Routes
app.get("/", (req, res) => res.send("API is Working"));
app.post("/webhooks", clerkWebhooks);
app.use("/api/company", companyRoutes);
app.use("/api/job", jobRoutes);
app.use("/api/users", userRoutes);

// Sentry (last)
Sentry.setupExpressErrorHandler(app);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;




// import "./config/instrument.js";
// import express from "express";
// import cors from "cors";
// import "dotenv/config";
// import connectDB from "./config/db.js";
// import * as Sentry from "@sentry/node";
// import { clerkWebhooks } from "./controllers/webhooks.js";
// import companyRoutes from "./routes/companyRoutes.js";
// import jobRoutes from "./routes/jobRoutes.js";
// import userRoutes from "./routes/userRoutes.js";
// import connectCloudinary from "./config/cloudinary.js";
// import {clerkMiddleware} from "@clerk/express"


// //Initialize Express app
// const app = express();

// //Connect to database
// await connectDB();
// await connectCloudinary();

// //Middleware
// app.use(cors());
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(clerkMiddleware());

// //Routes
// app.get("/", (req, res) => res.send("API Working"));
// app.get("/debug-sentry", function mainHandle(req, res) {
//     throw new Error("My first Sentry Debug Error");
// });
// app.post("/webhooks", clerkWebhooks);
// app.use("/api/company", companyRoutes);
// app.use("/api/job", jobRoutes);
// app.use("/api/users", userRoutes);

// //Port
// const PORT = process.env.PORT || 5000

// Sentry.setupExpressErrorHandler(app);

// app.listen(PORT, () =>{
//      console.log(`Server running on port ${PORT}`);
// })