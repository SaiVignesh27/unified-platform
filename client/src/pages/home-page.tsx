import Navbar from "@/components/layout/navbar";
import HeroSection from "@/components/home/hero-section";
import HowItWorks from "@/components/home/how-it-works";
import LatestJobs from "@/components/home/latest-jobs";
import TopFreelancers from "@/components/home/top-freelancers";
import Testimonials from "@/components/home/testimonials";
import CTASection from "@/components/home/cta-section";
import Footer from "@/components/common/footer";
import { motion } from "framer-motion";

export default function HomePage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Navbar />
      <HeroSection />
      <HowItWorks />
      <LatestJobs />
      <TopFreelancers />
      <Testimonials />
      <CTASection />
      <Footer />
    </motion.div>
  );
}
