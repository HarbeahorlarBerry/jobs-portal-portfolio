import Job from "../models/job.js"



// Get all visible jobs
export const getJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ visible: true })
      .populate({ path: 'company', select: '-password' })

    return res.status(200).json({
      success: true,
      jobs
    })
  } catch (error) {
    console.error('Get jobs error:', error)

    return res.status(500).json({
      success: false,
      message: 'Error fetching jobs'
    })
  }
}

// Get a single job by ID
export const getJobById = async (req, res) => {
  try {
    const { id } = req.params

    const job = await Job.findById(id)
      .populate({ path: 'company', select: '-password' })

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      })
    }

    return res.status(200).json({
      success: true,
      job
    })
  } catch (error) {
    console.error('Get job by ID error:', error)

    return res.status(500).json({
      success: false,
      message: 'Error fetching job'
    })
  }
}