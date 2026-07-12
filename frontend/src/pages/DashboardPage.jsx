import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Circle, Flame, TrendingUp, Calendar as CalendarIcon, Clock, Loader2, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { apiUrl } from "../utils/api";

export default function DashboardPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [plans, setPlans] = useState([]);
  const [stats, setStats] = useState({ streak: 0, totalCompleted: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/auth");
      return;
    }

    // Get user info
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));

    fetchData();
  }, [token]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [plansRes, statsRes] = await Promise.all([
        fetch(apiUrl("/api/plans"), { headers: { Authorization: `Bearer ${token}` } }),
        fetch(apiUrl("/api/progress/stats"), { headers: { Authorization: `Bearer ${token}` } })
      ]);
      
      const plansData = await plansRes.json();
      const statsData = await statsRes.json();
      
      if (plansRes.ok) setPlans(plansData);
      if (statsRes.ok) setStats(statsData);
      
      setIsLoading(false);
    } catch (err) {
      console.error("Error fetching data:", err);
      setIsLoading(false);
    }
  };

  const fetchPlans = async () => {
    // Keep this for backward compatibility or individual updates
    try {
      const response = await fetch(apiUrl("/api/plans"), {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      if (response.ok) {
        setPlans(data);
      }
    } catch (err) {
      console.error("Error fetching plans:", err);
    }
  };

  const handleToggleTask = async (planId, dayIndex, taskIndex, currentStatus) => {
    try {
      const response = await fetch(apiUrl("/api/plans/update-task"), {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({
          planId,
          dayIndex,
          taskIndex,
          completed: !currentStatus
        })
      });

      if (response.ok) {
        const data = await response.json();
        // Update stats from response if available
        if (data.streak !== undefined) {
          setStats(prev => ({ ...prev, streak: data.streak }));
        }
        // Re-fetch plans to update UI
        fetchPlans();
      }
    } catch (err) {
      console.error("Error updating task:", err);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // Use the most recent plan
  const activePlan = plans.length > 0 ? plans[plans.length - 1] : null;
  
  // Calculate which day of the plan we are on
  const getTodayInfo = () => {
    if (!activePlan || !activePlan.planData || !activePlan.planData.days) return { tasks: [], dayIndex: 0 };
    
    const startDate = new Date(activePlan.createdAt);
    startDate.setHours(0, 0, 0, 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const diffTime = today - startDate;
    const diffDays = Math.max(0, Math.floor(diffTime / (1000 * 60 * 60 * 24)));
    
    const dayIndex = diffDays < activePlan.planData.days.length ? diffDays : 0;
    return { tasks: activePlan.planData.days[dayIndex].tasks || [], dayIndex };
  };

  const { tasks: todayTasks, dayIndex: currentDayIndex } = getTodayInfo();
  
  const completedCount = todayTasks.filter(t => t.completed).length;
  const totalCount = todayTasks.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="min-h-screen bg-background pt-24 pb-12">
      <div className="container mx-auto px-6 max-w-7xl">
        
        {/* Dashboard Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <h1 className="text-3xl font-bold text-white mb-2">
              Welcome back, {user?.name?.split(' ')[0] || "Student"}!
            </h1>
            <p className="text-gray-400">
              {activePlan ? "Here's your AI-generated plan for today." : "You don't have an active study plan yet."}
            </p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 20 }} 
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3 glass-panel px-5 py-3"
          >
            <Flame className="w-6 h-6 text-orange-500" />
            <div>
              <div className="text-sm text-gray-400 font-medium">Current Streak</div>
              <div className="text-xl font-bold text-white tracking-wide">{stats.streak || 0} Days 🔥</div>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - Tasks */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2 space-y-6"
          >
            <div className="glass-panel p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <CalendarIcon className="w-5 h-5 text-primary" /> Today's Plan
                </h2>
                {activePlan && (
                  <span className="text-xs font-semibold px-3 py-1 bg-primary/20 text-primary rounded-full">
                    Day {currentDayIndex + 1}: AI Adjusted
                  </span>
                )}
              </div>

              <div className="space-y-4">
                {todayTasks.length > 0 ? (
                  todayTasks.map((task, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                        task.completed 
                        ? 'bg-primary/5 border-primary/20 opacity-70' 
                        : 'bg-black/40 border-white/10 hover:border-primary/50'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <button 
                          onClick={() => handleToggleTask(activePlan._id, currentDayIndex, i, task.completed)}
                          className={`transition-colors ${task.completed ? 'text-primary' : 'text-gray-500 hover:text-primary'}`}
                        >
                          {task.completed ? <CheckCircle2 className="w-6 h-6" /> : <Circle className="w-6 h-6" />}
                        </button>
                        <div>
                          <div className={`font-medium transition-all ${task.completed ? 'text-gray-400 line-through' : 'text-white'}`}>
                            {task.title}
                          </div>
                          <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                            <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {task.time || "30 min"}</span>
                            <span className="bg-white/10 px-2 py-0.5 rounded text-gray-400">{task.type || "DSA"}</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-12 border-2 border-dashed border-white/5 rounded-xl">
                    <p className="text-gray-500 mb-6">No tasks found for today.</p>
                    <button 
                      onClick={() => navigate("/goals")}
                      className="px-6 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors inline-flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" /> Create Study Goal
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Sidebar - Progress Widget */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            <div className="glass-panel p-6 flex flex-col items-center text-center">
              <h3 className="text-lg font-bold text-white w-full text-left mb-6 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" /> Daily Progress
              </h3>
              
              <div className="relative w-40 h-40 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="80" cy="80" r="70" className="stroke-white/10" strokeWidth="12" fill="none" />
                  <circle 
                    cx="80" cy="80" r="70" 
                    className="stroke-primary" 
                    strokeWidth="12" 
                    fill="none" 
                    strokeDasharray="440"
                    strokeDashoffset={440 - (440 * progressPercent) / 100}
                    strokeLinecap="round"
                    style={{ transition: "stroke-dashoffset 0.8s ease-in-out" }}
                  />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-3xl font-bold text-white transition-all">{progressPercent}%</span>
                  <span className="text-xs text-gray-400">Completed</span>
                </div>
              </div>

              <div className="w-full mt-8 bg-primary/10 border border-primary/20 rounded-lg p-4 text-sm text-primary">
                {progressPercent === 100 
                  ? "Amazing! You've crushed all your goals for today! 🎯"
                  : progressPercent > 0 
                  ? "Great progress! Keep that momentum going! 🚀"
                  : "Start your first task to see your progress update! ✨"}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
