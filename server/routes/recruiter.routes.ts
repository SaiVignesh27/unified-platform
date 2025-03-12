import express from 'express';
import Recruiter from '../models/recruiter.model';
import { Job, Application } from '../models/job.model';

const router = express.Router();

// Middleware to check if user is authenticated
const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.status(401).json({ message: 'Not authenticated' });
};

// Get all recruiters (public)
router.get('/', async (req, res) => {
  try {
    const recruiters = await Recruiter.find()
      .select('name company location bio totalListings successfulHires');
      
    res.status(200).json(recruiters);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get recruiter by ID
router.get('/:id', async (req, res) => {
  try {
    const recruiter = await Recruiter.findById(req.params.id)
      .select('-password -__v');
      
    if (!recruiter) {
      return res.status(404).json({ message: 'Recruiter not found' });
    }
    
    res.status(200).json(recruiter);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update recruiter profile (authenticated user only)
router.put('/profile', isAuthenticated, async (req, res) => {
  try {
    if (req.user.role !== 'recruiter') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const { name, company, bio, location, experience } = req.body;
    
    const updatedRecruiter = await Recruiter.findByIdAndUpdate(
      req.user.id,
      { 
        $set: { 
          name, 
          company, 
          bio, 
          location, 
          experience
        }
      },
      { new: true }
    ).select('-password -__v');
    
    if (!updatedRecruiter) {
      return res.status(404).json({ message: 'Recruiter not found' });
    }
    
    res.status(200).json(updatedRecruiter);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get recruiter's job listings
router.get('/jobs/my', isAuthenticated, async (req, res) => {
  try {
    if (req.user.role !== 'recruiter') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    const jobs = await Job.find({ recruiterId: req.user.id });
    
    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get statistics for recruiter dashboard
router.get('/dashboard/stats', isAuthenticated, async (req, res) => {
  try {
    if (req.user.role !== 'recruiter') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    const recruiter = await Recruiter.findById(req.user.id);
    
    if (!recruiter) {
      return res.status(404).json({ message: 'Recruiter not found' });
    }
    
    // Get total applications across all jobs
    const jobs = await Job.find({ recruiterId: req.user.id });
    const jobIds = jobs.map(job => job._id);
    
    const totalApplications = await Application.countDocuments({
      jobId: { $in: jobIds }
    });
    
    const pendingApplications = await Application.countDocuments({
      jobId: { $in: jobIds },
      status: 'pending'
    });
    
    const acceptedApplications = await Application.countDocuments({
      jobId: { $in: jobIds },
      status: 'accepted'
    });
    
    // Get active vs completed jobs
    const activeJobs = await Job.countDocuments({
      recruiterId: req.user.id,
      status: 'active'
    });
    
    const completedJobs = await Job.countDocuments({
      recruiterId: req.user.id,
      status: 'completed'
    });
    
    const stats = {
      totalListings: recruiter.totalListings,
      successfulHires: recruiter.successfulHires,
      totalApplications,
      pendingApplications,
      acceptedApplications,
      activeJobs,
      completedJobs
    };
    
    res.status(200).json(stats);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;
