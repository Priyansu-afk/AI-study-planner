import React from 'react';
import { motion } from 'framer-motion';

const BackgroundAnimation = () => {
  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden bg-[#050000] pointer-events-none">
      {/* Cinematic Animated Image (Ken Burns Effect) */}
      <motion.div
        animate={{
          scale: [1, 1.15, 1],
          x: [0, -30, 0],
          y: [0, -20, 0],
          rotate: [0, 1, 0]
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute inset-0 w-full h-full"
      >
        <img
          src="https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?q=80&w=2000&auto=format&fit=crop"
          alt="Abstract Background"
          className="w-full h-full object-cover opacity-60"
        />
      </motion.div>

      {/* Decorative Light Streaks */}
      <motion.div 
        animate={{ opacity: [0.2, 0.4, 0.2], x: [-100, 100, -100] }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        className="absolute top-1/3 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent blur-sm" 
      />
      
      {/* Dark Overlay for Readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black/90" />
      
      {/* Digital Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e11d4808_1px,transparent_1px),linear-gradient(to_bottom,#e11d4808_1px,transparent_1px)] bg-[size:60px_60px] opacity-30" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:20px_20px] opacity-15" />
      
      {/* Noise Texture for Film Grain look */}
      <div className="absolute inset-0 bg-noise opacity-[0.03] mix-blend-overlay" />
      
      {/* Edge Vignette */}
      <div className="absolute inset-0 shadow-[inset_0_0_200px_rgba(0,0,0,0.95)]" />
    </div>
  );
};

export default BackgroundAnimation;
