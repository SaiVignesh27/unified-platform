import mongoose, { Schema, Document } from 'mongoose';

// Active project interface
interface IActiveProject {
  id: mongoose.Schema.Types.ObjectId | string;
  title: string;
  client: string;
  dueDate: string;
  status: string;
  progress: number;
}

// Recommended job interface
interface IRecommendedJob {
  id: mongoose.Schema.Types.ObjectId | string;
  title: string;
  company: string;
  salary: string;
  match: string;
  skills: string[];
}

// Freelancer interface
export interface IFreelancer extends Document {
  name: string;
  email: string;
  password: string;
  role: string;
  location: string;
  bio: string;
  skills: string[];
  rating: number;
  totalEarnings: string;
  hoursWorked: number;
  activeProjects: IActiveProject[];
  recommendedJobs: IRecommendedJob[];
}

// Freelancer schema
const FreelancerSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true, default: 'freelancer' },
  location: { type: String },
  bio: { type: String },
  skills: [{ type: String }],
  rating: { type: Number, default: 0 },
  totalEarnings: { type: String, default: '0 USD' },
  hoursWorked: { type: Number, default: 0 },
  activeProjects: [
    {
      id: { type: Schema.Types.ObjectId, ref: 'Job' },
      title: String,
      client: String,
      dueDate: String,
      status: String,
      progress: Number,
    },
  ],
  recommendedJobs: [
    {
      id: { type: Schema.Types.ObjectId, ref: 'Job' },
      title: String,
      company: String,
      salary: String,
      match: String,
      skills: [String],
    },
  ],
}, { timestamps: true });

// Export the Freelancer model
export default mongoose.model<IFreelancer>('Freelancer', FreelancerSchema);
