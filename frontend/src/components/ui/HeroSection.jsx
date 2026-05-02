import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Play } from 'lucide-react';
import StudyPlanPreviewCard from './StudyPlanPreviewCard';

export default function HeroSection() {
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
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
    }
  };

  return (
    <section className="relative w-full h-screen min-h-[700px] flex items-center overflow-hidden bg-black">
      {/* Background Video */}
      <div className="absolute inset-0 z-0">
        <video 
          autoPlay 
          muted 
          loop 
          playsInline 
          className="w-full h-full object-cover opacity-60"
        >
          {/* Fallback to a placeholder tech video, if it fails, the black background + dark gradient remains */}
          <source src="https://cdn.pixabay.com/video/2020/05/25/40141-426743958_large.mp4" type="video/mp4" />
        </video>
        {/* Dark overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-background/90" />
        
        {/* Subtle radial glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent opacity-50" />
      </div>

      <div className="relative z-10 container mx-auto px-6 lg:px-12 h-full flex flex-col lg:flex-row items-center justify-between gap-12 pt-20">
        
        {/* Left Side: Text Content */}
        <motion.div 
          className="w-full lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left mt-10 lg:mt-0"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants} className="mb-4">
            <span className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-primary text-sm font-medium tracking-wide uppercase shadow-[0_0_15px_rgba(225,29,72,0.15)]">
              Study Smarter, Not Harder
            </span>
          </motion.div>

          <motion.h1 
            variants={itemVariants}
            className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 text-white text-balance"
          >
            Master Your Study Plan with <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-rose-400 drop-shadow-[0_0_15px_rgba(225,29,72,0.5)]">AI</span>
          </motion.h1>

          <motion.p 
            variants={itemVariants}
            className="text-lg md:text-xl text-gray-300 mb-10 max-w-2xl text-balance font-light leading-relaxed"
          >
            Generate smart daily plans, track progress, and stay consistent with AI-powered guidance tailored to your specific goals.
          </motion.p>

          <motion.div 
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center lg:justify-start"
          >
            {/* Get Started Button */}
            <Link to="/auth" className="w-full sm:w-auto">
              <button className="relative w-full group overflow-hidden bg-primary text-white font-semibold py-4 px-8 rounded-full shadow-[0_0_30px_rgba(225,29,72,0.4)] hover:shadow-[0_0_45px_rgba(225,29,72,0.8)] transition-all duration-300">
                <span className="absolute inset-0 w-0 bg-white/20 transition-all duration-500 ease-out group-hover:w-full rounded-full" />
                <span className="relative flex items-center justify-center gap-2">
                  Get Started Free
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </button>
            </Link>

            {/* View Demo Button */}
            <a href="#features" className="w-full sm:w-auto">
              <button className="relative w-full group flex items-center justify-center gap-2 py-4 px-8 rounded-full bg-white/5 border border-white/10 text-white font-medium hover:bg-white/10 transition-all duration-300 backdrop-blur-sm">
                <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Play className="w-3 h-3 text-white group-hover:text-primary transition-colors fill-current" />
                </div>
                View Demo
              </button>
            </a>
          </motion.div>
        </motion.div>

        {/* Right Side: Floating Card */}
        <div className="w-full lg:w-1/2 flex justify-center lg:justify-end perspective-[1000px] mt-10 lg:mt-0 hidden md:flex">
          <StudyPlanPreviewCard />
        </div>

      </div>
      
      {/* Scroll Indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-gray-500 text-xs font-medium uppercase tracking-widest">Scroll to explore</span>
        <motion.div 
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="w-1 h-8 rounded-full bg-gradient-to-b from-primary/50 to-transparent"
        />
      </motion.div>

    </section>
  );
}
