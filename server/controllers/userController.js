import User from "../models/User.js";
import JobApplication from "../models/JobApplication.js";
import Job from "../models/job.js";
import connectCloudinary from "../config/cloudinary.js";

// ================= GET USER DATA =================
export const getUserData = async (req, res) => {
  try {
    const { userId } = req.auth;

    // Find user by Clerk ID
    let user = await User.findOne({ clerkId: userId });

    // Optional fallback: create user if not found (first login)
    if (!user) {
      user = await User.create({
        clerkId: userId,
        name: req.auth.fullName || "Clerk User",
        email: req.auth.primaryEmailAddress?.emailAddress || `user-${userId}@clerk.local`,
        image: req.auth.imageUrl || "https://via.placeholder.com/150",
        resume: "",
        password: "CLERK",
      });
    }

    return res.status(200).json({ success: true, user });
  } catch (error) {
    console.error("getUserData error:", error);
    return res.status(500).json({ success: false, message: "Error fetching user data" });
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
    const { userId } = req.auth;
    const resumeFile = req.file;

    // Find user by Clerk ID
    const userData = await User.findOne({ clerkId: userId });
    if (!userData) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (resumeFile) {
      const resumeUpload = await connectCloudinary.uploader.upload(resumeFile.path, {
        resource_type: "auto",
      });
      userData.resume = resumeUpload.secure_url;
    }

    await userData.save();

    res.json({ success: true, message: "Resume updated successfully", resume: userData.resume });
  } catch (error) {
    console.error("updateUserResume error:", error);
    res.status(500).json({ success: false, message: "Error updating resume" });
  }
};
