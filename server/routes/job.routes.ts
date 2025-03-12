import express from 'express';
import { Job, Application } from '../models/job.model';
import Freelancer from '../models/freelancer.model';
import Recruiter from '../models/recruiter.model';
import mongoose from 'mongoose';

const router = express.Router();

// Middleware to check if user is authenticated
const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.status(401).json({ message: 'Not authenticated' });
};

// Middleware to check if user is a recruiter
const isRecruiter = (req, res, next) => {
  if (req.user && req.user.role === 'recruiter') {
    return next();
  }
  return res.status(403).json({ message: 'Access denied: Recruiter only' });
};

// Middleware to check if user is a freelancer
const isFreelancer = (req, res, next) => {
  if (req.user && req.user.role === 'freelancer') {
    return next();
  }
  return res.status(403).json({ message: 'Access denied: Freelancer only' });
};

// Get all jobs
router.get('/', async (req, res) => {
  try {
    const jobs = await Job.find({ status: 'active' }).sort({ createdAt: -1 });
    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Search and filter jobs
// Get all applications (recruiters only - returns all applications for jobs posted by the recruiter)
router.get('/all-applications', isAuthenticated, isRecruiter, async (req, res) => {
  try {
    // Find all jobs posted by this recruiter
    const recruiterJobs = await Job.find({ recruiterId: req.user.id });
    const jobIds = recruiterJobs.map(job => job._id);
    
    // Get all applications for these jobs
    const applications = await Application.find({ jobId: { $in: jobIds } })
      .populate({
        path: 'freelancerId',
        select: 'name email skills rating bio location'
      });

    res.status(200).json(applications);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.get('/search', async (req, res) => {
  try {
    const { query, skills, location, budget, experience } = req.query;
    let searchQuery = { status: 'active' };

    // Add search criteria based on query parameters
    if (query) {
      searchQuery = {
        ...searchQuery,
        $or: [
          { title: { $regex: query, $options: 'i' } },
          { description: { $regex: query, $options: 'i' } }
        ]
      };
    }

    if (skills) {
      const skillsArray = Array.isArray(skills) ? skills : [skills];
      searchQuery = {
        ...searchQuery,
        skillsRequired: { $in: skillsArray }
      };
    }

    if (location) {
      searchQuery = {
        ...searchQuery,
        location: { $regex: location, $options: 'i' }
      };
    }

    // Execute the search
    const jobs = await Job.find(searchQuery).sort({ createdAt: -1 });
    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get job by ID
router.get('/:id', async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    res.status(200).json(job);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create a new job (recruiters only)
router.post('/', isAuthenticated, isRecruiter, async (req, res) => {
  try {
    const { title, description, skillsRequired, budget, deadline, location } = req.body;
    
    // Get recruiter details
    const recruiter = await Recruiter.findById(req.user.id);
    if (!recruiter) {
      return res.status(404).json({ message: 'Recruiter not found' });
    }

    const newJob = new Job({
      title,
      description,
      company: recruiter.company || 'Company',
      location,
      skillsRequired: skillsRequired || [],
      budget,
      deadline,
      recruiterId: recruiter._id,
      recruiterName: recruiter.name,
      status: 'active'
    });

    const savedJob = await newJob.save();
    
    // Update recruiter's activeListings and totalListings
    recruiter.activeListings.push({
      id: savedJob._id,
      title: savedJob.title,
      skillsRequired: savedJob.skillsRequired,
      budget: savedJob.budget,
      deadline: savedJob.deadline
    });
    recruiter.totalListings += 1;
    await recruiter.save();

    res.status(201).json(savedJob);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update a job (recruiters only)
router.put('/:id', isAuthenticated, isRecruiter, async (req, res) => {
  try {
    const jobId = req.params.id;
    const { title, description, skillsRequired, budget, deadline, location, status } = req.body;
    
    // Find the job
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    
    // Check if the recruiter owns this job
    if (job.recruiterId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this job' });
    }

    // Update the job
    const updatedJob = await Job.findByIdAndUpdate(
      jobId,
      { 
        title, 
        description, 
        skillsRequired, 
        budget, 
        deadline, 
        location, 
        status
      },
      { new: true }
    );

    // Update the corresponding job in recruiter's activeListings
    const recruiter = await Recruiter.findById(req.user.id);
    const listingIndex = recruiter.activeListings.findIndex(
      listing => listing.id.toString() === jobId
    );
    
    if (listingIndex !== -1) {
      recruiter.activeListings[listingIndex] = {
        id: updatedJob._id,
        title: updatedJob.title,
        skillsRequired: updatedJob.skillsRequired,
        budget: updatedJob.budget,
        deadline: updatedJob.deadline
      };
      await recruiter.save();
    }

    res.status(200).json(updatedJob);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete a job (recruiters only)
router.delete('/:id', isAuthenticated, isRecruiter, async (req, res) => {
  try {
    const jobId = req.params.id;
    
    // Find the job
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    
    // Check if the recruiter owns this job
    if (job.recruiterId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this job' });
    }

    // Delete the job
    await Job.findByIdAndDelete(jobId);
    
    // Update recruiter's activeListings
    const recruiter = await Recruiter.findById(req.user.id);
    recruiter.activeListings = recruiter.activeListings.filter(
      listing => listing.id.toString() !== jobId
    );
    await recruiter.save();

    res.status(200).json({ message: 'Job deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Apply for a job (freelancers only)
router.post('/:id/apply', isAuthenticated, isFreelancer, async (req, res) => {
  try {
    const jobId = req.params.id;
    const { coverLetter } = req.body;
    
    // Find the job
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    
    // Check if already applied
    const existingApplication = await Application.findOne({
      jobId,
      freelancerId: req.user.id
    });
    
    if (existingApplication) {
      return res.status(400).json({ message: 'You have already applied for this job' });
    }

    // Create application
    const application = new Application({
      jobId,
      freelancerId: req.user.id,
      coverLetter,
      status: 'pending'
    });
    
    const savedApplication = await application.save();
    
    // Add application to job
    job.applications.push(savedApplication._id);
    await job.save();

    res.status(201).json(savedApplication);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});



// Get applications for a job (recruiters only)
router.get('/:id/applications', isAuthenticated, isRecruiter, async (req, res) => {
  try {
    const jobId = req.params.id;
    
    // Find the job
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    
    // Check if the recruiter owns this job
    if (job.recruiterId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to view these applications' });
    }

    // Get applications
    const applications = await Application.find({ jobId })
      .populate({
        path: 'freelancerId',
        select: 'name email skills rating bio location'
      });

    res.status(200).json(applications);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update application status (recruiters only)
router.put('/applications/:id', isAuthenticated, isRecruiter, async (req, res) => {
  try {
    const applicationId = req.params.id;
    const { status } = req.body;
    
    // Find the application
    const application = await Application.findById(applicationId);
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }
    
    // Find the job
    const job = await Job.findById(application.jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    
    // Check if the recruiter owns this job
    if (job.recruiterId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this application' });
    }

    // Update application status
    application.status = status;
    const updatedApplication = await application.save();
    
    // If accepted, update recruiter's successfulHires
    if (status === 'accepted') {
      const recruiter = await Recruiter.findById(req.user.id);
      recruiter.successfulHires += 1;
      await recruiter.save();
      
      // Add to freelancer's active projects
      const freelancer = await Freelancer.findById(application.freelancerId);
      freelancer.activeProjects.push({
        id: job._id,
        title: job.title,
        client: job.company,
        dueDate: job.deadline,
        status: 'In Progress',
        progress: 0
      });
      await freelancer.save();
    }

    res.status(200).json(updatedApplication);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get jobs for the current user's dashboard
router.get('/dashboard/myjobs', isAuthenticated, async (req, res) => {
  try {
    if (req.user.role === 'recruiter') {
      // For recruiters: get jobs they posted
      const jobs = await Job.find({ recruiterId: req.user.id }).sort({ createdAt: -1 });
      res.status(200).json(jobs);
    } else if (req.user.role === 'freelancer') {
      // For freelancers: get jobs they applied to
      const applications = await Application.find({ freelancerId: req.user.id });
      const jobIds = applications.map(app => app.jobId);
      
      const jobs = await Job.find({ _id: { $in: jobIds } }).sort({ createdAt: -1 });
      
      // Combine job data with application status
      const jobsWithStatus = await Promise.all(jobs.map(async (job) => {
        const application = await Application.findOne({
          jobId: job._id,
          freelancerId: req.user.id
        });
        
        return {
          ...job.toObject(),
          applicationStatus: application ? application.status : null,
          applicationId: application ? application._id : null
        };
      }));
      
      res.status(200).json(jobsWithStatus);
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;
