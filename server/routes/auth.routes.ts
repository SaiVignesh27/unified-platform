import express from 'express';
import passport from 'passport';
import Freelancer from '../models/freelancer.model';
import Recruiter from '../models/recruiter.model';

const router = express.Router();

// Get user details for profile page
router.get('/profile', async (req, res) => {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const { id, role } = req.user;
    let userDetails;

    if (role === 'freelancer') {
      userDetails = await Freelancer.findById(id).select('-password');
    } else if (role === 'recruiter') {
      userDetails = await Recruiter.findById(id).select('-password');
    }

    if (!userDetails) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(userDetails);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update user profile
router.put('/profile', async (req, res) => {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const { id, role } = req.user;
    let user;

    const updateData = {
      name: req.body.name,
      bio: req.body.bio,
      location: req.body.location
    };

    if (role === 'freelancer') {
      // Add freelancer-specific fields
      if (req.body.skills) updateData['skills'] = req.body.skills;
      
      user = await Freelancer.findByIdAndUpdate(
        id,
        { $set: updateData },
        { new: true }
      ).select('-password');
    } else if (role === 'recruiter') {
      // Add recruiter-specific fields
      if (req.body.company) updateData['company'] = req.body.company;
      if (req.body.experience) updateData['experience'] = req.body.experience;
      
      user = await Recruiter.findByIdAndUpdate(
        id,
        { $set: updateData },
        { new: true }
      ).select('-password');
    }

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;
