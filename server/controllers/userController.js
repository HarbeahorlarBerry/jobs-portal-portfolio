import User from "../models/User.js";
import JobApplication from "../models/JobApplication.js";
import Job from "../models/job.js";
import { v2 } from "cloudinary";
import connectCloudinary from "../config/cloudinary.js";

// ================= GET USER DATA =================
export const getUserData = async (req, res) => {
  try {
    const { userId } = req.auth;

    const user = await User.findOne({ clerkId: userId });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found (webhook not processed yet)",
      });
    }

    return res.status(200).json({ success: true, user });
  } catch (error) {
    console.error("getUserData error:", error);
    return res.status(500).json({ success: false });
  }
};



// ================= APPLY FOR A JOB =================
export const applyForJob = async (req, res) => {
  const { jobId } = req.body;
  const userId = req.auth.userId;

  try {
    const isAlreadyApplied = await JobApplication.findOne({ userId, jobId });
    if (isAlreadyApplied) {
      return res.json({ success: false, message: "Already Applied" });
    }

    const jobData = await Job.findById(jobId);
    if (!jobData) {
      return res.json({ success: false, message: "Job not found" });
    }

    await JobApplication.create({
      companyId: jobData.companyId,
      userId,
      jobId,
      date: Date.now(),
    });

    res.json({ success: true, message: "Application submitted successfully" });
  } catch (error) {
    console.error("applyForJob error:", error);
    res.json({ success: false, message: "Error applying for job" });
  }
};

// ================= GET USER APPLICATIONS =================
export const getUserJobApplications = async (req, res) => {
  try {
    const { userId } = req.auth;

    const applications = await JobApplication.find({ userId })
      .populate("companyId", "name email image")
      .populate("jobId", "title description location category level salary")
      .lean();

    return res.status(200).json({
      success: true,
      applications: applications || [],
    });
  } catch (error) {
    console.error("getUserJobApplications error:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching job applications",
    });
  }
};

// ================= UPDATE USER RESUME =================
export const updateUserResume = async (req, res) => {
  try {
    const userId = req.auth.userId;
    const resumeFile = req.file;

    const userData = await User.findById(userId);

    if (resumeFile) {
      const resumeUpload = await connectCloudinary.uploader.upload(resumeFile.path);
      userData.resume = resumeUpload.secure_url;
    }

    await userData.save();

    res.json({ success: true, message: "Resume updated successfully" });
  } catch (error) {
    console.error("updateUserResume error:", error);
    res.json({ success: false, message: "Error updating resume" });
  }
};
