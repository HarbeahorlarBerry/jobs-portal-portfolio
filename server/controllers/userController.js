import User from "../models/User.js";
import JobApplication from "../models/JobApplication.js";
import Job from "../models/job.js";
import { v2 } from "cloudinary";
import connectCloudinary from "../config/cloudinary.js";

// ================= GET USER DATA =================

export const getUserData = async (req, res) => {
  try {
    console.log("AUTH OBJECT:", req.auth);

    const { userId } = req.auth || {};

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    let user = await User.findOne({ clerkId: userId });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found in database",
      });
    }

    res.json({ success: true, user });
  } catch (error) {
    console.error("getUserData error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};






// export const getUserData = async (req, res) => {
//   try {
//     const clerkId = req.auth?.userId;

//     if (!clerkId) {
//       return res.status(401).json({ success: false, message: "Unauthorized" });
//     }

//     // Query by clerkId
//     let user = await User.findOne({ clerkId });

//     // If user does not exist, create a new user (first-time login)
//     if (!user) {
//       const clerkUser = req.auth.user; // if you have additional Clerk info
//       // You can get name, email, image from Clerk via req.auth.user or fetch from Clerk API
//       const name = req.auth?.user?.firstName || "Clerk User";
//       const email = req.auth?.user?.emailAddresses?.[0]?.emailAddress || `user-${clerkId}@clerk.local`;
//       const image = req.auth?.user?.profileImageUrl || "https://via.placeholder.com/150";

//       user = await User.create({
//         clerkId,
//         name,
//         email,
//         image,
//         password: "CLERK", // placeholder, not used
//       });
//     }

//     return res.status(200).json({ success: true, user });
//   } catch (error) {
//     console.error("Error fetching user data:", error);
//     return res.status(500).json({ success: false, message: "Error fetching user data" });
//   }
// };


// Apply for a job
export const applyForJob = async (req, res) => {

    const { jobId } = req.body

    const userId = req.auth.userId

    try {
        const isAlreadyApplied = await JobApplication.findOne({ userId, jobId });

        if (isAlreadyApplied) {
            return res.json({success:false, message:"Already Apllied"});
        }

        const jobData = await Job.findById(jobId);

        if (!jobData) {
            return res.json({success:false, message:"Job not found"});
        }

        await JobApplication.create({
            companyId: jobData.companyId,
            userId,
            jobId,
            date: Date.now()
        });

        res.json({success:true, message:"Application submitted successfully"});
    } catch (error) {
        res.json({ success: false, message: "Error applying for job" });
    }
}

// Get user applied application
export const getUserJobApplications = async (req, res) => {
  try {
    const { userId } = req.auth; // ✅ safe & clean

    const applications = await JobApplication.find({ userId })
      .populate("companyId", "name email image")
      .populate("jobId", "title description location category level salary")
      .lean(); // ✅ prevents weird mongoose mutation bugs

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


// Update user profile (resume)
export const updateUserResume = async (req, res) => {
    try {
        
        const userId = req.auth.userId

        const resumeFile = req.file

        const userData = await User.findById(userId);

        if (resumeFile) {
            const resumeUpload = await connectCloudinary.uploader.upload(resumeFile.path)
            userData.resume = resumeUpload.secure_url;
        }

        await userData.save();

        res.json({ success: true, message: "Resume updated successfully" });
    } catch (error) {
        res.json({ success: false, message: "Error updating resume" });
    }
}