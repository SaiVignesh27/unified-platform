import express from 'express';
import Freelancer from '../models/freelancer.model';
import { Application } from '../models/job.model';

const router = express.Router();

// Middleware to check if user is authenticated
const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.status(401).json({ message: 'Not authenticated' });
};

// Get all freelancers (public)
router.get('/', async (req, res) => {
  try {
    const freelancers = await Freelancer.find().select('name bio skills rating location');
    res.status(200).json(freelancers);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Search freelancers
router.get('/search', async (req, res) => {
  try {
    const { query, skills, location } = req.query;
    let searchQuery = {};

    if (query) {
      searchQuery = {
        ...searchQuery,
        $or: [
          { name: { $regex: query, $options: 'i' } },
          { bio: { $regex: query, $options: 'i' } }
        ]
      };
    }

    if (skills) {
      const skillsArray = Array.isArray(skills) ? skills : [skills];
      searchQuery = {
        ...searchQuery,
        skills: { $in: skillsArray }
      };
    }

    if (location) {
      searchQuery = {
        ...searchQuery,
        location: { $regex: location, $options: 'i' }
      };
    }

    const freelancers = await Freelancer.find(searchQuery)
      .select('name bio skills rating location');
      
    res.status(200).json(freelancers);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get freelancer by ID
router.get('/:id', async (req, res) => {
  try {
    const freelancer = await Freelancer.findById(req.params.id)
      .select('-password -__v');
      
    if (!freelancer) {
      return res.status(404).json({ message: 'Freelancer not found' });
    }
    
    res.status(200).json(freelancer);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update freelancer profile (authenticated user only)
router.put('/profile', isAuthenticated, async (req, res) => {
  try {
    if (req.user.role !== 'freelancer') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const { name, bio, location, skills } = req.body;
    
    const updatedFreelancer = await Freelancer.findByIdAndUpdate(
      req.user.id,
      { 
        $set: { 
          name, 
          bio, 
          location, 
          skills
        }
      },
      { new: true }
    ).select('-password -__v');
    
    if (!updatedFreelancer) {
      return res.status(404).json({ message: 'Freelancer not found' });
    }
    
    res.status(200).json(updatedFreelancer);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update project progress
router.put('/projects/:projectId', isAuthenticated, async (req, res) => {
  try {
    if (req.user.role !== 'freelancer') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const { projectId } = req.params;
    const { progress } = req.body;
    
    const freelancer = await Freelancer.findById(req.user.id);
    
    if (!freelancer) {
      return res.status(404).json({ message: 'Freelancer not found' });
    }
    
    // Find the project in active projects
    const projectIndex = freelancer.activeProjects.findIndex(
      project => project.id.toString() === projectId
    );
    
    if (projectIndex === -1) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    // Update the project progress
    freelancer.activeProjects[projectIndex].progress = progress;
    
    // If progress is 100%, update status to Completed
    if (progress === 100) {
      freelancer.activeProjects[projectIndex].status = 'Completed';
    }
    
    await freelancer.save();
    
    res.status(200).json(freelancer.activeProjects);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get freelancer applications
router.get('/applications/my', isAuthenticated, async (req, res) => {
  try {
    if (req.user.role !== 'freelancer') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    const applications = await Application.find({ freelancerId: req.user.id })
      .populate({
        path: 'jobId',
        select: 'title company budget deadline recruiterId'
      });
      
    res.status(200).json(applications);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;
