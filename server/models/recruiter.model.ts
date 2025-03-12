import mongoose, { Schema, Document } from 'mongoose';

// Active listing interface
interface IActiveListing {
  id: mongoose.Schema.Types.ObjectId | string;
  title: string;
  skillsRequired: string[];
  budget: string;
  deadline: string;
}

// Recruiter interface
export interface IRecruiter extends Document {
  name: string;
  email: string;
  password: string;
  role: string;
  company: string;
  location: string;
  totalListings: number;
  successfulHires: number;
  experience: string;
  bio: string;
  activeListings: IActiveListing[];
  topCandidates: any[];
}

// Recruiter schema
const RecruiterSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true, default: 'recruiter' },
  company: { type: String },
  location: { type: String },
  totalListings: { type: Number, default: 0 },
  successfulHires: { type: Number, default: 0 },
  experience: { type: String },
  bio: { type: String },
  activeListings: [
    {
      id: { type: Schema.Types.ObjectId, ref: 'Job' },
      title: String,
      skillsRequired: [String],
      budget: String,
      deadline: String,
    },
  ],
  topCandidates: { type: Array, default: [] },
}, { timestamps: true });

// Export the Recruiter model
export default mongoose.model<IRecruiter>('Recruiter', RecruiterSchema);
