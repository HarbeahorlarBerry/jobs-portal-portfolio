import express from "express"
import { getJobById, getJobs } from "../controllers/jobController.js";

const jobRoutes = express.Router()

// Route to get all jobs data
jobRoutes.get("/jobs", getJobs)


// Routes to Get a single job by ID
jobRoutes.get("/:id", getJobById)

export default jobRoutes;