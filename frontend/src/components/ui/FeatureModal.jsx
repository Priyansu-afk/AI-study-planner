import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const FeatureModal = ({ isOpen, onClose, feature }) => {
  if (!feature) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-white/10 bg-zinc-900 shadow-2xl"
          >
            {/* Background Glow */}
            <div className="absolute -top-24 -left-24 h-64 w-64 rounded-full bg-primary/20 blur-3xl" />
            <div className="absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-rose-600/10 blur-3xl" />

            <div className="relative z-10 p-8 md:p-12">
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-6 right-6 p-2 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Icon */}
              <div className="mb-8 w-16 h-16 flex items-center justify-center bg-primary/10 rounded-2xl border border-primary/20 text-primary">
                {React.cloneElement(feature.icon, { className: "w-8 h-8" })}
              </div>

              {/* Header */}
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 tracking-tight">
                {feature.title}
              </h2>

              {/* Description */}
              <div className="space-y-4 text-gray-300 text-lg leading-relaxed mb-10">
                {feature.details.split('\n').map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <Link to="/auth" className="w-full sm:w-auto">
                  <button className="w-full group relative overflow-hidden bg-primary text-white font-semibold py-4 px-8 rounded-full shadow-lg hover:shadow-primary/25 transition-all duration-300">
                    <span className="relative flex items-center justify-center gap-2">
                      Get Started Now
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </button>
                </Link>
                <button
                  onClick={onClose}
                  className="w-full sm:w-auto py-4 px-8 rounded-full border border-white/10 text-white font-semibold hover:bg-white/5 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default FeatureModal;
