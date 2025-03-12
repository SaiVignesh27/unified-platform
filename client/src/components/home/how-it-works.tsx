import { Link } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function HowItWorks() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  const recruiterSteps = [
    {
      number: 1,
      title: "Create an account",
      description: "Sign up as a recruiter and complete your company profile"
    },
    {
      number: 2,
      title: "Post a job",
      description: "Describe your project, set a budget and deadline"
    },
    {
      number: 3,
      title: "Review applications",
      description: "Browse candidates and hire the best match for your project"
    }
  ];

  const freelancerSteps = [
    {
      number: 1,
      title: "Create your profile",
      description: "Showcase your skills, experience and portfolio"
    },
    {
      number: 2,
      title: "Browse opportunities",
      description: "Find projects that match your skills and interests"
    },
    {
      number: 3,
      title: "Apply and get hired",
      description: "Submit compelling proposals and start earning"
    }
  ];

  return (
    <section id="how-it-works" className="bg-gray-50 py-12 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold text-gray-900">How FreelanceHub Works</h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Simple steps to start hiring or working as a freelancer
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <motion.div 
            className="bg-white p-8 rounded-xl shadow-sm"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <h3 className="text-xl font-bold text-primary flex items-center mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
                <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z" />
              </svg> 
              For Recruiters
            </h3>
            <ul className="space-y-6">
              {recruiterSteps.map((step) => (
                <motion.li key={step.number} className="flex" variants={itemVariants}>
                  <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 text-primary font-bold text-lg">
                    {step.number}
                  </div>
                  <div className="ml-4">
                    <h4 className="text-lg font-medium text-gray-900">{step.title}</h4>
                    <p className="mt-1 text-gray-600">{step.description}</p>
                  </div>
                </motion.li>
              ))}
            </ul>
            <Link href="/auth?tab=signup&role=recruiter">
              <Button className="mt-8 w-full bg-primary hover:bg-blue-600 text-white">
                Sign Up as a Recruiter
              </Button>
            </Link>
          </motion.div>

          <motion.div 
            className="bg-white p-8 rounded-xl shadow-sm"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <h3 className="text-xl font-bold text-secondary flex items-center mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 1.944A11.954 11.954 0 012.166 5C2.056 5.649 2 6.319 2 7c0 5.225 3.34 9.67 8 11.317C14.66 16.67 18 12.225 18 7c0-.682-.057-1.35-.166-2.001A11.954 11.954 0 0110 1.944zM11 14a1 1 0 11-2 0 1 1 0 012 0zm0-7a1 1 0 10-2 0v3a1 1 0 102 0V7z" clipRule="evenodd" />
              </svg>
              For Freelancers
            </h3>
            <ul className="space-y-6">
              {freelancerSteps.map((step) => (
                <motion.li key={step.number} className="flex" variants={itemVariants}>
                  <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-indigo-100 text-secondary font-bold text-lg">
                    {step.number}
                  </div>
                  <div className="ml-4">
                    <h4 className="text-lg font-medium text-gray-900">{step.title}</h4>
                    <p className="mt-1 text-gray-600">{step.description}</p>
                  </div>
                </motion.li>
              ))}
            </ul>
            <Link href="/auth?tab=signup&role=freelancer">
              <Button className="mt-8 w-full bg-secondary hover:bg-indigo-600 text-white">
                Sign Up as a Freelancer
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
