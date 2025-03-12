import { motion } from "framer-motion";

export default function Testimonials() {
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
      transition: { duration: 0.5 }
    }
  };

  return (
    <section id="testimonials" className="bg-white py-12 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold text-gray-900">Success Stories</h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Hear from freelancers and recruiters who found success on our platform
          </p>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.div 
            className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-8 shadow-sm"
            variants={itemVariants}
          >
            <div className="flex items-center mb-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-primary font-bold text-xl">
                DS
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">David Smith</h3>
                <p className="text-primary">Freelance Developer</p>
              </div>
            </div>
            <blockquote className="text-gray-700 italic">
              "FreelanceHub completely transformed my career. I was able to find consistent, high-quality projects that matched my skills. The platform is intuitive and makes it easy to showcase my portfolio. Within 3 months, I had more work than I could handle!"
            </blockquote>
            <div className="mt-6 flex items-center">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="ml-2 text-gray-600">5.0 rating</span>
            </div>
          </motion.div>

          <motion.div 
            className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-xl p-8 shadow-sm"
            variants={itemVariants}
          >
            <div className="flex items-center mb-6">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center text-accent font-bold text-xl">
                JW
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">James Wilson</h3>
                <p className="text-accent">Recruiter at TechCorp</p>
              </div>
            </div>
            <blockquote className="text-gray-700 italic">
              "As a hiring manager, I've tried several platforms but FreelanceHub stands out. The quality of freelancers is exceptional, and the filtering system helps us find the perfect match for our projects. We've built an amazing remote team through this platform."
            </blockquote>
            <div className="mt-6 flex items-center">
              <div className="flex items-center">
                {[...Array(4)].map((_, i) => (
                  <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
              <span className="ml-2 text-gray-600">4.8 rating</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
