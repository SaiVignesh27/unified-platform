import mongoose, { Schema, Document } from 'mongoose';

// Job interface
export interface IJob extends Document {
  title: string;
  company: string;
  description: string;
  location: string;
  skillsRequired: string[];
  budget: string;
  deadline: string;
  recruiterId: mongoose.Schema.Types.ObjectId;
  recruiterName: string;
  status: string;
  applications: mongoose.Schema.Types.ObjectId[];
}

// Application interface
export interface IApplication extends Document {
  jobId: mongoose.Schema.Types.ObjectId;
  freelancerId: mongoose.Schema.Types.ObjectId;
  coverLetter: string;
  status: string; // pending, accepted, rejected
  appliedAt: Date;
}

// Job schema
const JobSchema: Schema = new Schema({
  title: { type: String, required: true },
  company: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String },
  skillsRequired: [{ type: String }],
  budget: { type: String, required: true },
  deadline: { type: String, required: true },
  recruiterId: { type: mongoose.Schema.Types.ObjectId, ref: 'Recruiter', required: true },
  recruiterName: { type: String },
  status: { type: String, default: 'active' }, // active, completed, cancelled
  applications: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Application' }]
}, { timestamps: true });

// Application schema
const ApplicationSchema: Schema = new Schema({
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  freelancerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Freelancer', required: true },
  coverLetter: { type: String },
  status: { type: String, default: 'pending' }, // pending, accepted, rejected
  appliedAt: { type: Date, default: Date.now }
});

// Export the Job and Application models
export const Job = mongoose.model<IJob>('Job', JobSchema);
export const Application = mongoose.model<IApplication>('Application', ApplicationSchema);
