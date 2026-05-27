import { useState } from "react";
import { motion } from "framer-motion";
import { Target, Calendar as CalendarIcon, Clock, ChevronRight, Brain } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function GoalsPage() {
  const [formData, setFormData] = useState({
    targetArea: "dsa",
    deadline: "",
    skillLevel: "beginner",
    dailyStudyTime: "2.5"
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      navigate("/auth");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/plans/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        navigate("/dashboard");
      } else {
        const data = await response.json();
        alert("Failed to generate plan: " + (data.message || "Unknown error"));
      }
    } catch (err) {
      console.error("Error generating plan:", err);
      alert("Connection error. Is the backend running?");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pt-24 pb-12">
      <div className="container mx-auto px-6 max-w-2xl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center justify-center p-4 bg-primary/10 rounded-full mb-4">
            <Target className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Set Your Next Goal</h1>
          <p className="text-gray-400">Tell us what you want to achieve, and our AI will build custom daily plans.</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-panel p-8 relative overflow-hidden"
        >
          {isSubmitting && (
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center gap-4">
               <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }}>
                 <Brain className="w-12 h-12 text-primary" />
               </motion.div>
               <motion.h3 
                 initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ repeat: Infinity, duration: 1.5, repeatType: "reverse" }}
                 className="text-xl font-bold text-white"
               >
                 Generating your AI plan...
               </motion.h3>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Target Area</label>
              <select 
                value={formData.targetArea}
                onChange={(e) => setFormData({...formData, targetArea: e.target.value})}
                className="w-full bg-black/50 border border-white/10 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all appearance-none"
              >
                <option value="dsa">Data Structures & Algorithms</option>
                <option value="exams">University Exams</option>
                <option value="skills">New Skill (e.g. React.js)</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Deadline</label>
                <div className="relative">
                  <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input 
                    type="date" 
                    required
                    value={formData.deadline}
                    onChange={(e) => setFormData({...formData, deadline: e.target.value})}
                    className="w-full bg-black/50 border border-white/10 rounded-lg py-2.5 pl-10 pr-4 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all color-scheme-dark" 
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Skill Level</label>
                <select 
                  value={formData.skillLevel}
                  onChange={(e) => setFormData({...formData, skillLevel: e.target.value})}
                  className="w-full bg-black/50 border border-white/10 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all appearance-none"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
            </div>

            <div>
              <label className="flex items-center justify-between text-sm font-medium text-gray-300 mb-2">
                <span>Daily Study Time</span>
                <span className="text-primary">{formData.dailyStudyTime} Hours</span>
              </label>
              <div className="flex items-center gap-4">
                <Clock className="w-5 h-5 text-gray-500" />
                <input 
                  type="range" min="1" max="8" step="0.5" 
                  value={formData.dailyStudyTime}
                  onChange={(e) => setFormData({...formData, dailyStudyTime: e.target.value})}
                  className="w-full accent-primary h-2 bg-white/10 rounded-lg appearance-none cursor-pointer" 
                />
              </div>
            </div>

            <button type="submit" disabled={isSubmitting} className="w-full mt-4 py-4 bg-primary text-white rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors shadow-[0_0_15px_rgba(225,29,72,0.4)] hover:shadow-[0_0_30px_rgba(225,29,72,0.6)] disabled:opacity-50">
              {isSubmitting ? "Generating..." : "Generate AI Plan"} <ChevronRight className="w-5 h-5" />
            </button>
          </form>
        </motion.div>
      </div>
    </div>

  );
}
