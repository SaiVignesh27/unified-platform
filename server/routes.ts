import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import connectDB from './db';
import { setupAuth } from './auth';
import jobRoutes from './routes/job.routes';
import freelancerRoutes from './routes/freelancer.routes';
import recruiterRoutes from './routes/recruiter.routes';
import authRoutes from './routes/auth.routes';

export async function registerRoutes(app: Express): Promise<Server> {
  // Connect to MongoDB
  await connectDB();

  // Setup authentication
  setupAuth(app);

  // Register API routes
  app.use('/api/jobs', jobRoutes);
  app.use('/api/freelancers', freelancerRoutes);
  app.use('/api/recruiters', recruiterRoutes);
  app.use('/api/auth', authRoutes);

  const httpServer = createServer(app);

  return httpServer;
}
