import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Express } from "express";
import session from "express-session";
import { storage } from "./storage";
import createMemoryStore from "memorystore";
import mongoose from 'mongoose';
import Freelancer from './models/freelancer.model';
import Recruiter from './models/recruiter.model';

const MemoryStore = createMemoryStore(session);

declare global {
  namespace Express {
    interface User {
      id: string;
      email: string;
      name: string;
      role: string;
    }
  }
}

export function setupAuth(app: Express) {
  const sessionSettings: session.SessionOptions = {
    secret: process.env.SESSION_SECRET || 'freelance-hub-secret',
    resave: false,
    saveUninitialized: false,
    store: new MemoryStore({
      checkPeriod: 86400000 // prune expired entries every 24h
    }),
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
  };

  app.set("trust proxy", 1);
  app.use(session(sessionSettings));
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        // Try to find user in freelancers collection
        let user = await Freelancer.findOne({ email: username });
        
        // If not found, try recruiters collection
        if (!user) {
          user = await Recruiter.findOne({ email: username });
        }

        // If user not found or password doesn't match
        if (!user || user.password !== password) {
          return done(null, false);
        }

        return done(null, {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          role: user.role
        });
      } catch (error) {
        return done(error);
      }
    }),
  );

  passport.serializeUser((user, done) => {
    done(null, { id: user.id, role: user.role });
  });
  
  passport.deserializeUser(async (data: { id: string, role: string }, done) => {
    try {
      const { id, role } = data;
      let user;
      
      if (role === 'freelancer') {
        user = await Freelancer.findById(id);
      } else if (role === 'recruiter') {
        user = await Recruiter.findById(id);
      }
      
      if (!user) {
        return done(null, false);
      }
      
      done(null, {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        role: user.role
      });
    } catch (error) {
      done(error);
    }
  });

  app.post("/api/register", async (req, res, next) => {
    try {
      const { name, email, password, role } = req.body;
      
      // Check if user already exists in either collection
      const existingFreelancer = await Freelancer.findOne({ email });
      const existingRecruiter = await Recruiter.findOne({ email });
      
      if (existingFreelancer || existingRecruiter) {
        return res.status(400).json({ message: "Email already exists" });
      }
      
      let user;
      
      // Create user based on role
      if (role === 'freelancer') {
        user = new Freelancer({
          name,
          email,
          password, // Using plain text as specified in requirements
          role
        });
      } else if (role === 'recruiter') {
        user = new Recruiter({
          name,
          email,
          password, // Using plain text as specified in requirements
          role,
          company: req.body.company || ''
        });
      } else {
        return res.status(400).json({ message: "Invalid role specified" });
      }
      
      // Save the user
      await user.save();
      
      // Log in the user
      req.login({
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        role: user.role
      }, (err) => {
        if (err) return next(err);
        res.status(201).json({
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        });
      });
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/login", passport.authenticate("local"), (req, res) => {
    res.status(200).json(req.user);
  });

  app.post("/api/logout", (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      res.sendStatus(200);
    });
  });

  app.get("/api/user", (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    res.json(req.user);
  });
}
