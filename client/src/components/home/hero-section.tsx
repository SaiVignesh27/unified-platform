import { Link } from "wouter";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";

export default function HeroSection() {
  const { user } = useAuth();
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <section className="bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants}>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
              Find Top <span className="text-primary">Freelancers</span> & <span className="text-secondary">Projects</span>
            </h1>
            <p className="mt-4 text-lg text-gray-600 max-w-lg">
              Connect with skilled freelancers and exciting projects. 
              Whether you need to hire talent or find work, FreelanceHub makes it simple.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
              {user?.role === 'recruiter' ? (
                <Link href="/freelancers">
                  <Button
                    className="bg-primary hover:bg-blue-600 text-white px-6 py-3 h-auto text-base"
                  >
                    Find Freelancers
                  </Button>
                </Link>
              ) : user?.role === 'freelancer' ? (
                <Link href="/jobs">
                  <Button
                    className="bg-primary hover:bg-blue-600 text-white px-6 py-3 h-auto text-base"
                  >
                    Find Projects
                  </Button>
                </Link>
              ) : (
                <>
                  <Link href="/freelancers">
                    <Button
                      className="bg-primary hover:bg-blue-600 text-white px-6 py-3 h-auto text-base"
                    >
                      Find Freelancers
                    </Button>
                  </Link>
                  <Link href="/jobs">
                    <Button
                      variant="outline"
                      className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-6 py-3 h-auto text-base"
                    >
                      Find Projects
                    </Button>
                  </Link>
                </>
              )}
            </div>
            <div className="mt-6 flex items-center text-sm text-gray-500">
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Verified Professionals</span>
              </div>
              <div className="flex items-center ml-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Secure Payments</span>
              </div>
              <div className="flex items-center ml-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
                <span>24/7 Support</span>
              </div>
            </div>
          </motion.div>
          <motion.div className="relative" variants={itemVariants}>
            <div className="bg-gradient-to-r from-blue-100 to-indigo-100 rounded-xl overflow-hidden shadow-lg p-6">
              <img 
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&h=400&q=80" 
                alt="People collaborating" 
                className="w-full h-auto rounded-lg shadow-md" 
              />
              <motion.div 
                className="absolute -bottom-5 -left-5 bg-white p-3 rounded-lg shadow-md"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.5 }}
              >
                <div className="bg-blue-50 p-2 rounded-md flex items-center space-x-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
                    <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
                  </svg>
                  <span className="text-sm font-medium">10K+ Active Projects</span>
                </div>
              </motion.div>
              <motion.div 
                className="absolute -top-4 -right-4 bg-white p-3 rounded-lg shadow-md"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.5 }}
              >
                <div className="bg-indigo-50 p-2 rounded-md flex items-center space-x-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-secondary" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                  </svg>
                  <span className="text-sm font-medium">5K+ Freelancers</span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
