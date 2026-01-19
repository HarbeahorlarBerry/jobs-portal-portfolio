import express from "express"
import { applyForJob, getUserData,getUserJobApplications, updateUserResume } from "../controllers/userController.js"
import upload from "../config/multer.js"

const userRoutes = express.Router()

// Get user Data
userRoutes.get("/user", getUserData)

// Apply for a job
userRoutes.post("/apply", applyForJob)

//Get applied jobs data
userRoutes.get("/applications", getUserJobApplications)

// Update user profile (resume)
userRoutes.post("/update-resume", upload.single("resume"), updateUserResume)

export default userRoutes;