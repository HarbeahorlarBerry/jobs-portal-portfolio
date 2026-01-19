import Company from "../models/Company.js";
import Job from "../models/job.js";
import bcrypt from "bcrypt";
import { v2 as cloudinary } from "cloudinary";
import generateToken from '../utils/generateToken.js'
import JobApplication from "../models/JobApplication.js";


// Register a new company
export const registerCompany = async (req, res) => {
  try {
    if (!req.body) {
      return res.status(400).json({
        success: false,
        message: 'Request body is missing'
      })
    }

    const { name, email, password } = req.body
    const imageFile = req.file

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email and password are required'
      })
    }

    if (!imageFile) {
      return res.status(400).json({
        success: false,
        message: 'Company image is required'
      })
    }

    const companyExists = await Company.findOne({ email })
    if (companyExists) {
      return res.status(409).json({
        success: false,
        message: 'Company already registered'
      })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
      folder: 'companies'
    })

    const company = await Company.create({
      name,
      email,
      password: hashedPassword,
      image: imageUpload.secure_url
    })

    return res.status(201).json({
      success: true,
      company: {
        _id: company._id,
        name: company.name,
        email: company.email,
        image: company.image
      },
      token: generateToken(company._id)
    })
  } catch (error) {
    console.error('Register company error:', error)

    return res.status(500).json({
      success: false,
      message: 'Error registering company'
    })
  }
}

// Company login
export const loginCompany = async (req, res) => {
    const { email, password } = req.body

    try {
        const company = await Company.findOne({email})

        if (await bcrypt.compareSync(password, company.password)) {
            return res.status(200).json({
                success: true,
                company: {
                    _id: company._id,
                    name: company.name,
                    email: company.email,
                    image: company.image
                },
                token: generateToken(company._id)
            })
        } else {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            })
        }
    } catch (error) {
        console.error('Login company error:', error)
        return res.status(500).json({
            success: false,
            message: 'Error logging in company'
        })
    }
}

// Get company data
export const getCompanyData = async (req, res) => {

    try {
        const company = req.company
        return res.status(200).json({
            success: true,
            company
        })
    } catch (error) {
        res.json({
            success:false,message:error.message
        })
    }
}

// Post a new job
export const postJob = async (req, res) => {
    
    const { title, description, location, category, level, salary } = req.body

    const companyId = req.company._id
    
    try {
        const newJob = new Job({
            title,
            description,
            location,
            category,
            level,
            salary,
            companyId,
            date: Date.now()
        })

        await newJob.save()

        return res.status(201).json({
            success: true,
             newJob
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error posting job'
        })
    } 

}
// Get Company Job Applicants
export const getCompanyJobApplicants = async (req, res) => {

    try {
        const { id, status } = req.body

        // Find Job application and update status
        await JobApplication.findOneAndUpdate({ _id: id }, { status })

        res.json({ success: true, message: "Status Changed"})
    } catch (error) {
        res.json({success:false, message:error.message})
    }
}

// Get Company Posted Jobs
export const getCompanyPostedJobs = async (req, res) => {

    try {
        const companyId = req.company._id

        const jobs = await Job.find({ companyId })

        //  Adding No. of applicants info in data
        const jobsData = await Promise.all(jobs.map(async (job) => {
            const applicants = await JobApplication.find({ jobId: job._id });
            return {
                ...job.toObject(),
                applicants: applicants.length
            }
        }))

        return res.status(200).json({
            success: true,
            jobsData: jobs
        })
    } catch (error) {
        res.json({ success:false,message:error.message})
    }
}

// Change Job Application Status
export const changeJobApplicationStatus = async (req, res) => {

    try {
        const companyId = req.company._id

        // Find job applications for the user and populate related data
        const applications = await JobApplication.find({company: companyId})
        .populate("userId", "name image resume")
        .populate("jobId", "title location category level salary")
        .exec()

        return res.json({ success:true, applications})
    } catch (error) {
        res.json({success:false, message:error.message})
    }
}

// Change job visibility
export const changeVisibility = async (req, res) => {
  try {
    const { id } = req.body
    const companyId = req.company?._id

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Job ID is required'
      })
    }

    if (!companyId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized'
      })
    }

    const job = await Job.findById(id)

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      })
    }

    // ⚠️ Ensure field name matches schema
    if (job.company.toString() !== companyId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not allowed to modify this job'
      })
    }

    job.visible = !job.visible
    await job.save()

    return res.status(200).json({
      success: true,
      message: 'Job visibility changed successfully',
      visible: job.visible
    })
  } catch (error) {
    console.error('Change visibility error:', error)

    return res.status(500).json({
      success: false,
      message: 'Error changing job visibility'
    })
  }
}