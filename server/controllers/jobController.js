import Job from "../models/job.js"
import mongoose from "mongoose"



// ================= GET ALL VISIBLE JOBS =================
export const getJobs = async (req, res) => {
  try {
    // Fetch all visible jobs, populate company, exclude password
    const jobs = await Job.find({ visible: true })
      .populate({ path: "companyId", select: "-password -__v" });

    // Optional: filter out jobs with deleted companies
    const filteredJobs = jobs.filter(job => job.companyId !== null);

    return res.status(200).json({
      success: true,
      jobs: filteredJobs,
    });
  } catch (error) {
    console.error("Get jobs error:", error.message, error.stack);
    return res.status(500).json({
      success: false,
      message: "Error fetching jobs",
      // remove error.message in production if you want
    });
  }
};

// ================= GET JOB BY ID =================
export const getJobById = async (req, res) => {
  try {
    const { id } = req.params;

    // Prevent invalid ObjectId crashes
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid job ID",
      });
    }

    const job = await Job.findById(id)
      .populate({ path: "company", select: "-password", strictPopulate: false });

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    return res.status(200).json({
      success: true,
      job,
    });
  } catch (error) {
    console.error("Get job by ID error:", error.message, error.stack);
    return res.status(500).json({
      success: false,
      message: "Error fetching job",
      error: error.message, // optional, helps debug in dev
    });
  }
};