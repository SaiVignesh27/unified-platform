import { Link } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";

export default function CTASection() {
  const { user } = useAuth();

  return (
    <section className="bg-gradient-to-r from-primary to-secondary py-12 md:py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.h2 
          className="text-3xl font-bold text-white"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          Ready to start your journey?
        </motion.h2>
        <motion.p 
          className="mt-4 text-lg text-white opacity-90 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Join thousands of freelancers and businesses already using FreelanceHub to connect, collaborate, and create amazing projects.
        </motion.p>
        
        <motion.div 
          className="mt-8 flex flex-col sm:flex-row justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {user ? (
            <>
              {user.role === 'freelancer' ? (
                <>
                  <Link href="/jobs">
                    <Button className="bg-white text-primary hover:bg-gray-100 px-6 py-3 h-auto">
                      Find Projects
                    </Button>
                  </Link>
                  <Link href="/freelancer/dashboard">
                    <Button className="bg-transparent border-2 border-white text-white hover:bg-white/10 px-6 py-3 h-auto">
                      Go to Dashboard
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/post-job">
                    <Button className="bg-white text-primary hover:bg-gray-100 px-6 py-3 h-auto">
                      Post a Job
                    </Button>
                  </Link>
                  <Link href="/freelancers">
                    <Button className="bg-transparent border-2 border-white text-white hover:bg-white/10 px-6 py-3 h-auto">
                      Find Freelancers
                    </Button>
                  </Link>
                </>
              )}
            </>
          ) : (
            <>
              <Link href="/auth?tab=signup&role=freelancer">
                <Button className="bg-white text-primary hover:bg-gray-100 px-6 py-3 h-auto">
                  Sign Up as a Freelancer
                </Button>
              </Link>
              <Link href="/auth?tab=signup&role=recruiter">
                <Button className="bg-transparent border-2 border-white text-white hover:bg-white/10 px-6 py-3 h-auto">
                  Sign Up as a Recruiter
                </Button>
              </Link>
            </>
          )}
        </motion.div>
      </div>
    </section>
  );
}
