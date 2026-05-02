import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Brain, Target, TrendingUp, BookOpen } from "lucide-react";
import HeroSection from "../components/ui/HeroSection";
import FeatureCard from "../components/ui/FeatureCard";
import FeatureModal from "../components/ui/FeatureModal";

export default function LandingPage() {
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const features = [
    {
      icon: <Brain />,
      title: "AI Planning",
      description: "Get personalized daily study plans curated by advanced AI algorithms tailored to your goals.",
      details: "Our AI engine creates a dynamic roadmap that adjusts to your pace. It uses spaced repetition algorithms to ensure you don't just finish the syllabus, but actually master it.\n\nEvery day, you'll receive a optimized list of topics and practice problems tailored to your target exam date."
    },
    {
      icon: <TrendingUp />,
      title: "Progress Tracking",
      description: "Visualize your journey with streaks, completion rates, and smart metric dashboards.",
      details: "Don't just study—track your evolution. Our beautiful dashboards provide granular insights into your learning velocity, topic mastery percentages, and consistency streaks.\n\nHeatmaps visualize your focus areas, helping you identify and strengthen your weak spots before they become bottlenecks."
    },
    {
      icon: <Target />,
      title: "Smart Adjustments",
      description: "Fell behind? The AI automatically readjusts your schedule so you never feel overwhelmed.",
      details: "Study schedules shouldn't be rigid. If you miss a task or find a topic harder than expected, StudyPlan.AI automatically recalibrates.\n\nIt redistributes the workload intelligently across your remaining days, ensuring you still hit your goals without feeling the pressure of a 'backlog'."
    },
    {
      icon: <BookOpen />,
      title: "Notes System",
      description: "Organize your DSA problems, save useful links, and access knowledge seamlessly.",
      details: "Keep your knowledge organized in one premium space. Save DSA intuition, code snippets, and useful links directly within your plan.\n\nOur integrated notes system allows you to tag concepts with confidence levels, making revision a breeze when the big day approaches."
    },
  ];

  const handleLearnMore = (feature) => {
    setSelectedFeature(feature);
    setIsModalOpen(true);
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* HERO SECTION */}
      <HeroSection />

      {/* FEATURES SECTION */}
      <section id="features" className="py-24 bg-background relative z-10">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4 text-white">Why StudyPlan.AI?</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">Premium features designed to give you the ultimate edge in your learning journey.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 [perspective:1000px]">
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
              >
                <FeatureCard 
                  icon={React.cloneElement(feature.icon, { className: "w-8 h-8 text-primary" })}
                  title={feature.title}
                  description={feature.description}
                  onClick={() => handleLearnMore(feature)}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Detail Modal */}
      <FeatureModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        feature={selectedFeature} 
      />
    </div>
  );
}

