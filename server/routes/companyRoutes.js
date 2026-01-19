import upload from "../config/multer.js";
import express from "express";
import { getCompanyData, loginCompany, registerCompany,  postJob, getCompanyJobApplicants, getCompanyPostedJobs, changeJobApplicationStatus,  changeVisibility } from "../controllers/companyController.js";
import { protectCompany } from "../middleware/authMiddleware.js";


const companyRoutes = express.Router();

// Register a company
companyRoutes.post('/register', upload.single('image'), registerCompany);

// Company login
companyRoutes.post('/login', loginCompany);

// Get company data
companyRoutes.get('/data', protectCompany, getCompanyData);

// Post a new job
companyRoutes.post('/post-job', protectCompany, postJob);

// Get company job applicants
companyRoutes.get('/applicants', protectCompany, getCompanyJobApplicants);

// Get company  Job List
companyRoutes.get('/list-jobs', protectCompany, getCompanyPostedJobs);

// Change  Application status
companyRoutes.post('/changestatus', protectCompany, changeJobApplicationStatus);

// Change Applications visibility
companyRoutes.post('/change-visibility', protectCompany, changeVisibility);

export default companyRoutes;