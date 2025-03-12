import { pgTable, text, serial, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Base user schema with common fields
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  role: text("role").notNull(), // 'freelancer' or 'recruiter'
  location: text("location"),
  bio: text("bio"),
  createdAt: text("created_at"), // ISO String
});

// Freelancer specific fields
export const freelancers = pgTable("freelancers", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  skills: text("skills").array(),
  rating: text("rating"),
  totalEarnings: text("total_earnings"),
  hoursWorked: integer("hours_worked"),
  activeProjects: jsonb("active_projects").array(),
});

// Recruiter specific fields
export const recruiters = pgTable("recruiters", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  company: text("company"),
  totalListings: integer("total_listings"),
  successfulHires: integer("successful_hires"),
  experience: text("experience"),
});

// Job posting schema
export const jobs = pgTable("jobs", {
  id: serial("id").primaryKey(),
  recruiterId: integer("recruiter_id").notNull().references(() => recruiters.id),
  title: text("title").notNull(),
  description: text("description").notNull(),
  company: text("company"),
  location: text("location"),
  skillsRequired: text("skills_required").array(),
  budget: text("budget").notNull(),
  deadline: text("deadline").notNull(),
  status: text("status").notNull(), // 'active', 'completed', 'cancelled'
  createdAt: text("created_at"), // ISO String
});

// Job application schema
export const applications = pgTable("applications", {
  id: serial("id").primaryKey(),
  jobId: integer("job_id").notNull().references(() => jobs.id),
  freelancerId: integer("freelancer_id").notNull().references(() => freelancers.id),
  coverLetter: text("cover_letter"),
  status: text("status").notNull(), // 'pending', 'accepted', 'rejected'
  appliedAt: text("applied_at"), // ISO String
});

// Insert schemas using drizzle-zod
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertFreelancerSchema = createInsertSchema(freelancers).omit({
  id: true,
});

export const insertRecruiterSchema = createInsertSchema(recruiters).omit({
  id: true,
});

export const insertJobSchema = createInsertSchema(jobs).omit({
  id: true,
  createdAt: true,
});

export const insertApplicationSchema = createInsertSchema(applications).omit({
  id: true,
  appliedAt: true,
});

// Extension of user schema for login
export const loginSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

// Type declarations
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type LoginUser = z.infer<typeof loginSchema>;

export type Freelancer = typeof freelancers.$inferSelect;
export type InsertFreelancer = z.infer<typeof insertFreelancerSchema>;

export type Recruiter = typeof recruiters.$inferSelect;
export type InsertRecruiter = z.infer<typeof insertRecruiterSchema>;

export type Job = typeof jobs.$inferSelect;
export type InsertJob = z.infer<typeof insertJobSchema>;

export type Application = typeof applications.$inferSelect;
export type InsertApplication = z.infer<typeof insertApplicationSchema>;
