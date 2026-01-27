import express from "express";
import {
  applyForJob,
  getUserData,
  getUserJobApplications,
  updateUserResume,
  syncUser, // import new controller
} from "../controllers/userController.js";
import upload from "../config/multer.js";
import { requireAuth } from "@clerk/express";

const userRoutes = express.Router();

// ===================== USER ROUTES (PROTECTED) =====================

// Sync user first time login
userRoutes.post("/sync", requireAuth(), syncUser);

// Get user data
userRoutes.get("/user", requireAuth(), getUserData);

// Apply for a job
userRoutes.post("/apply", requireAuth(), applyForJob);

// Get applied jobs
userRoutes.get("/applications", requireAuth(), getUserJobApplications);

// Update user resume
userRoutes.post(
  "/update-resume",
  requireAuth(),
  upload.single("resume"),
  updateUserResume
);

export default userRoutes;
