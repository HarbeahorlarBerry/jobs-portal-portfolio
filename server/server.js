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

// Initialize Express app
const app = express();

// ====== IMPORTANT FIX ======
let isInitialized = false;

async function init() {
  if (!isInitialized) {
    await connectDB();
    await connectCloudinary();
    isInitialized = true;
    console.log("Backend initialized");
  }
}

// Middleware
app.use(async (req, res, next) => {
  try {
    await init();
    next();
  } catch (err) {
    next(err);
  }
});

app.use(cors({
  origin: "http://localhost:5173", // your frontend URL
  credentials: true,               // if using cookies/auth headers
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(clerkMiddleware());

// Routes
app.get("/", (req, res) => res.send("API is Working"));

app.get("/debug-sentry", (req, res) => {
  throw new Error("My first Sentry Debug Error");
});

app.post("/webhooks", clerkWebhooks);
app.use("/api/company", companyRoutes);
app.use("/api/job", jobRoutes);
app.use("/api/users", userRoutes);

// //Port
const PORT = process.env.PORT || 5000

// Sentry Error Handler (must be last)
Sentry.setupExpressErrorHandler(app);

app.listen(PORT, () =>{
     console.log(`Server running on port ${PORT}`);
})

// ✅ Export for Vercel
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