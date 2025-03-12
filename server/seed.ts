import mongoose from 'mongoose';
import { hash } from 'bcrypt';
import connectDB from './db';
import Freelancer from './models/freelancer.model';
import Recruiter from './models/recruiter.model';
import { Job, Application } from './models/job.model';

// Function to hash passwords
const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 10;
  return await hash(password, saltRounds);
};

// Sample data for seeding
const seedDatabase = async () => {
  try {
    // Connect to the database
    await connectDB();
    
    // Clear existing data
    await Freelancer.deleteMany({});
    await Recruiter.deleteMany({});
    await Job.deleteMany({});
    await Application.deleteMany({});

    console.log('Database cleared, starting seeding...');

    // Create freelancers
    const freelancers = [
      {
        name: 'John Smith',
        email: 'john@example.com',
        password: await hashPassword('password123'),
        role: 'freelancer',
        location: 'New York, USA',
        bio: 'Full-stack developer with 5 years of experience in React, Node.js, and MongoDB. Specialized in building responsive web applications and RESTful APIs.',
        skills: ['React', 'Node.js', 'MongoDB', 'TypeScript', 'Express'],
        rating: 4.8,
        totalEarnings: '$15,000',
        hoursWorked: 750,
        activeProjects: [
          {
            id: 1,
            title: 'E-commerce Dashboard',
            client: 'TechRetail Inc.',
            dueDate: '2025-04-15',
            status: 'In Progress',
            progress: 65,
          },
        ],
        recommendedJobs: [],
      },
      {
        name: 'Emma Wilson',
        email: 'emma@example.com',
        password: await hashPassword('password123'),
        role: 'freelancer',
        location: 'London, UK',
        bio: 'UI/UX designer with expertise in creating intuitive user interfaces. Proficient in Figma, Adobe XD, and implementing designs with HTML/CSS.',
        skills: ['UI/UX Design', 'Figma', 'Adobe XD', 'HTML', 'CSS', 'Responsive Design'],
        rating: 4.9,
        totalEarnings: '$22,000',
        hoursWorked: 920,
        activeProjects: [],
        recommendedJobs: [],
      },
      {
        name: 'David Chen',
        email: 'david@example.com',
        password: await hashPassword('password123'),
        role: 'freelancer',
        location: 'Remote',
        bio: 'Backend developer specializing in building scalable microservices and database optimizations. Experienced in handling high-traffic applications.',
        skills: ['Node.js', 'Python', 'MongoDB', 'PostgreSQL', 'Docker', 'AWS'],
        rating: 4.7,
        totalEarnings: '$30,000',
        hoursWorked: 1200,
        activeProjects: [],
        recommendedJobs: [],
      },
    ];

    // Create recruiters
    const recruiters = [
      {
        name: 'Sarah Johnson',
        email: 'sarah@techcorp.com',
        password: await hashPassword('password123'),
        role: 'recruiter',
        company: 'TechCorp Inc.',
        location: 'San Francisco, USA',
        totalListings: 0,
        successfulHires: 0,
        experience: '5+ years in tech recruitment',
        bio: 'Talent acquisition specialist focused on connecting companies with top tech talent. Passionate about building diverse teams.',
        activeListings: [],
        topCandidates: [],
      },
      {
        name: 'Michael Roberts',
        email: 'michael@innovatedesign.com',
        password: await hashPassword('password123'),
        role: 'recruiter',
        company: 'Innovate Design Studio',
        location: 'Berlin, Germany',
        totalListings: 0,
        successfulHires: 0,
        experience: '8 years in creative recruitment',
        bio: 'Creative director and recruiter for a design agency. Looking for talented designers and developers to join our team on various projects.',
        activeListings: [],
        topCandidates: [],
      },
    ];

    // Insert freelancers and recruiters
    const createdFreelancers = await Freelancer.insertMany(freelancers);
    const createdRecruiters = await Recruiter.insertMany(recruiters);

    console.log(`Created ${createdFreelancers.length} freelancers`);
    console.log(`Created ${createdRecruiters.length} recruiters`);

    // Create jobs
    const jobs = [
      {
        title: 'Full-Stack Developer for E-commerce Platform',
        company: 'TechCorp Inc.',
        description: 'We are looking for a skilled full-stack developer to help build and maintain our e-commerce platform. The ideal candidate should have experience with React, Node.js, and database management. You will be responsible for implementing new features, optimizing performance, and ensuring the platform runs smoothly.',
        location: 'Remote',
        skillsRequired: ['React', 'Node.js', 'MongoDB', 'Express', 'JavaScript'],
        budget: '$3000-5000',
        deadline: '2025-05-01',
        recruiterId: createdRecruiters[0]._id,
        recruiterName: createdRecruiters[0].name,
        status: 'active',
        applications: [],
      },
      {
        title: 'UI/UX Designer for Mobile App',
        company: 'Innovate Design Studio',
        description: 'Seeking a talented UI/UX designer to create intuitive and engaging user interfaces for our mobile application. You should have a strong portfolio demonstrating your ability to create clean, modern designs that enhance user experience. Knowledge of design tools like Figma or Adobe XD is required.',
        location: 'Berlin, Germany (Remote possible)',
        skillsRequired: ['UI/UX Design', 'Figma', 'Adobe XD', 'Mobile Design', 'Prototyping'],
        budget: '$2500-4000',
        deadline: '2025-04-20',
        recruiterId: createdRecruiters[1]._id,
        recruiterName: createdRecruiters[1].name,
        status: 'active',
        applications: [],
      },
      {
        title: 'Backend Developer for API Development',
        company: 'TechCorp Inc.',
        description: 'We need a backend developer to build and optimize our RESTful APIs. The candidate should have strong experience with Node.js and database design. You will be working on creating efficient, scalable APIs that can handle high traffic and integrate with our existing frontend applications.',
        location: 'Remote',
        skillsRequired: ['Node.js', 'Express', 'MongoDB', 'API Development', 'Database Design'],
        budget: '$4000-6000',
        deadline: '2025-05-15',
        recruiterId: createdRecruiters[0]._id,
        recruiterName: createdRecruiters[0].name,
        status: 'active',
        applications: [],
      },
      {
        title: 'Frontend React Developer',
        company: 'Innovate Design Studio',
        description: 'Looking for a frontend developer with strong React skills to join our team. You will be responsible for building user interfaces for web applications, implementing responsive designs, and ensuring cross-browser compatibility. Experience with modern React practices and state management is essential.',
        location: 'Remote',
        skillsRequired: ['React', 'JavaScript', 'CSS', 'HTML', 'Redux'],
        budget: '$3500-5500',
        deadline: '2025-04-30',
        recruiterId: createdRecruiters[1]._id,
        recruiterName: createdRecruiters[1].name,
        status: 'active',
        applications: [],
      },
    ];

    // Insert jobs
    const createdJobs = await Job.insertMany(jobs);
    console.log(`Created ${createdJobs.length} jobs`);

    // Create some applications
    const applications = [
      {
        jobId: createdJobs[0]._id,
        freelancerId: createdFreelancers[0]._id,
        coverLetter: "I'm very interested in this position as I have extensive experience with all the required technologies. I've recently completed a similar e-commerce project and believe I can bring valuable insights to your team.",
        status: 'pending',
        appliedAt: new Date(),
      },
      {
        jobId: createdJobs[1]._id,
        freelancerId: createdFreelancers[1]._id,
        coverLetter: "As a UI/UX designer with a background in mobile applications, I believe I would be an excellent fit for this position. My portfolio includes several mobile app designs that have received positive user feedback for their intuitive interfaces.",
        status: 'pending',
        appliedAt: new Date(),
      },
      {
        jobId: createdJobs[2]._id,
        freelancerId: createdFreelancers[2]._id,
        coverLetter: "I specialize in backend development and API design with Node.js. I've worked on high-traffic applications and have experience optimizing database queries and scaling services. I'm confident I can help build efficient APIs for your platform.",
        status: 'pending',
        appliedAt: new Date(),
      },
    ];

    // Insert applications
    const createdApplications = await Application.insertMany(applications);
    console.log(`Created ${createdApplications.length} applications`);

    // Update jobs with applications
    for (const application of createdApplications) {
      await Job.findByIdAndUpdate(
        application.jobId,
        { $push: { applications: application._id } }
      );
    }

    // Update recruiters with active listings
    for (const job of createdJobs) {
      const jobObject = {
        id: Math.floor(Math.random() * 1000),
        title: job.title,
        skillsRequired: job.skillsRequired,
        budget: job.budget,
        deadline: job.deadline,
      };

      await Recruiter.findByIdAndUpdate(
        job.recruiterId,
        { 
          $push: { activeListings: jobObject },
          $inc: { totalListings: 1 }
        }
      );
    }

    // Update recommended jobs for freelancers
    for (const freelancer of createdFreelancers) {
      // Find jobs matching freelancer skills
      const matchingJobs = createdJobs.filter(job => 
        job.skillsRequired.some(skill => freelancer.skills.includes(skill))
      );

      const recommendedJobs = matchingJobs.map(job => ({
        id: Math.floor(Math.random() * 1000),
        title: job.title,
        company: job.company,
        salary: job.budget,
        match: `${Math.floor(Math.random() * 30) + 70}%`, // Random match percentage between 70-100%
        skills: job.skillsRequired,
      }));

      if (recommendedJobs.length > 0) {
        await Freelancer.findByIdAndUpdate(
          freelancer._id,
          { recommendedJobs }
        );
      }
    }

    console.log('Database seeded successfully!');
    return { success: true };
  } catch (error) {
    console.error('Error seeding database:', error);
    return { success: false, error };
  } finally {
    // Close the connection when done
    setTimeout(() => {
      mongoose.connection.close();
      console.log('Database connection closed');
    }, 1000);
  }
};

// Run the seed function
seedDatabase();