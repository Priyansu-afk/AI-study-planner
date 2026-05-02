import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, User, ArrowRight } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

export default function AuthPage() {
  const location = useLocation();
  const [isLogin, setIsLogin] = useState(!location.state?.isSignUp);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (location.state?.isSignUp !== undefined) {
      setIsLogin(!location.state.isSignUp);
    }
  }, [location.state]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg("");
    
    const formData = new FormData(e.target);
    const email = formData.get('email');
    const password = formData.get('password');
    const name = formData.get('fullname') || "";

    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
      const payload = isLogin ? { email, password } : { name, email, password };
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      const data = await response.json();
      
      if (!response.ok) throw new Error(data.detail || data.message || 'Something went wrong');
      
      // Save session details
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      
      setIsSubmitting(false);
      navigate("/dashboard");
    } catch (err) {
      setIsSubmitting(false);
      setErrorMsg(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-background py-20 px-4">
      {/* Background Ornaments */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-rose-600/10 rounded-full blur-[100px] pointer-events-none" />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="glass-panel p-8 relative overflow-hidden">
          {/* Form expand animation on submit */}
          <AnimatePresence>
            {isSubmitting && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 15, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ duration: 0.8, ease: "easeIn" }}
                className="absolute inset-0 bg-primary z-50 rounded-full origin-center"
              />
            )}
          </AnimatePresence>

          <div className="relative z-10 text-center mb-6">
            <h2 className="text-3xl font-bold text-white mb-2">
              {isLogin ? "Welcome Back" : "Create Account"}
            </h2>
            <p className="text-gray-400 text-sm">
              {isLogin ? "Enter your details to access your plans." : "Start your AI powered study journey."}
            </p>
            {errorMsg && <p className="text-red-500 text-sm mt-3">{errorMsg}</p>}
          </div>

          <form onSubmit={handleSubmit} className="relative z-10 space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="text"
                    name="fullname"
                    required
                    placeholder="John Doe"
                    className="w-full bg-black/50 border border-white/10 rounded-lg py-2.5 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                  />
                </div>
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="you@example.com"
                  className="w-full bg-black/50 border border-white/10 rounded-lg py-2.5 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="password"
                  name="password"
                  required
                  placeholder="••••••••"
                  className="w-full bg-black/50 border border-white/10 rounded-lg py-2.5 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                />
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-primary text-white rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors shadow-[0_0_15px_rgba(225,29,72,0.4)]"
            >
              {isLogin ? "Sign In" : "Sign Up"}
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </form>

          <div className="relative z-10 mt-6 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
