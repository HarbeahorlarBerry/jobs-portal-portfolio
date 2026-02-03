import express from "express";
import {
  applyForJob,
  getUserData,
  getUserJobApplications,
  updateUserResume,// import new controller
} from "../controllers/userController.js";
import upload from "../config/multer.js";
// import { requireAuth } from "@clerk/express";

const userRoutes = express.Router();

// ===================== USER ROUTES (PROTECTED) =====================

// Get user data
userRoutes.get(
  "/",
  //  requireAuth(),
    getUserData
  );

// Apply for a job
userRoutes.post(
  "/apply",
  //  requireAuth(),
    applyForJob
  );

// Get applied jobs
userRoutes.get(
  "/applications",
  //  requireAuth(),
    getUserJobApplications
  );

// Update user resume
userRoutes.post(
  "/update-resume",
  // requireAuth(),
  upload.single("resume"),
  updateUserResume
);

export default userRoutes;
