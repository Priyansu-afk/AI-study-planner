import React, { useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

const FeatureCard = ({ icon, title, description, onClick }) => {
  const cardRef = useRef(null);
  
  // Mouse position within the card for tilt
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Smooth springs for rotation
  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  // Transform mouse position to rotation values
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["17.5deg", "-17.5deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-17.5deg", "17.5deg"]);

  // Mouse position for the dynamic glow effect
  const [glowPos, setGlowPos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    // Relative position (0 to 1)
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    // Convert to -0.5 to 0.5 range for tilt
    x.set(mouseX / width - 0.5);
    y.set(mouseY / height - 0.5);
    
    // Update glow position
    setGlowPos({ x: mouseX, y: mouseY });
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      whileHover={{ scale: 1.02 }}
      className="relative group h-full rounded-2xl border border-white/10 bg-black/40 backdrop-blur-xl p-8 transition-colors duration-500 hover:border-primary/50 overflow-hidden cursor-pointer"
      onClick={onClick}
    >
      {/* Background Glow (Behind Card) */}
      <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-primary to-rose-600 opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-20" />

      {/* Dynamic Cursor Glow Effect */}
      <div 
        className="absolute inset-0 pointer-events-none transition-opacity duration-300 opacity-0 group-hover:opacity-100"
        style={{
          background: `radial-gradient(600px circle at ${glowPos.x}px ${glowPos.y}px, rgba(225,29,72,0.15), transparent 40%)`
        }}
      />

      {/* Content Layers with Depth */}
      <div style={{ transform: "translateZ(50px)" }} className="relative z-10">
        <div className="mb-6 w-12 h-12 flex items-center justify-center bg-primary/10 rounded-xl border border-primary/20 group-hover:bg-primary/20 transition-colors duration-300">
          {icon}
        </div>
        
        <h3 className="text-xl font-bold mb-3 text-white tracking-tight">
          {title}
        </h3>
        
        <p className="text-sm text-gray-400 leading-relaxed mb-6 block">
          {description}
        </p>
        
        <div 
          className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80 transition-all group/btn"
        >
          Learn more 
          <ChevronRight className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
        </div>
      </div>

      {/* Perspective Border Glow */}
      <div className="absolute inset-0 border border-white/5 group-hover:border-primary/20 rounded-2xl transition-colors duration-300" />
    </motion.div>
  );
};

export default FeatureCard;
