import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, User, ArrowRight, Key } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { apiUrl } from "../utils/api";

export default function AuthPage() {
  const location = useLocation();
  const [isLogin, setIsLogin] = useState(!location.state?.isSignUp);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState(1);
  const [userEmail, setUserEmail] = useState("");
  const [timer, setTimer] = useState(0);
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    if (location.state?.isSignUp !== undefined) {
      setIsLogin(!location.state.isSignUp);
      setStep(1);
    }
  }, [location.state]);

  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const readResponse = async (response) => {
    const contentType = response.headers.get('content-type') || '';

    if (contentType.includes('application/json')) {
      return response.json();
    }

    const text = await response.text();
    throw new Error(
      `Server returned non-JSON (status ${response.status}): ${text.slice(0, 200)}`
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg("");
    setSuccessMsg("");
    
    const formData = new FormData(e.target);
    const email = formData.get('email');
    const password = formData.get('password');
    const name = formData.get('fullname') || "";

    try {
      const endpoint = isLogin ? apiUrl('/api/auth/login') : apiUrl('/api/auth/register');
      const payload = isLogin ? { email, password } : { name, email, password };
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await readResponse(response);
      
      if (!response.ok) throw new Error(data.detail || data.message || 'Something went wrong');
      
      if (isLogin) {
        // Successful login
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        navigate("/dashboard");
      } else {
        // Successful registration step 1
        setUserEmail(email);
        setStep(2);
        setTimer(30);
        setSuccessMsg(data.message || "OTP sent to your email!");
      }
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg("");
    setSuccessMsg("");

    const formData = new FormData(e.target);
    const otp = formData.get('otp');

    try {
      const response = await fetch(apiUrl('/api/auth/verify-otp'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userEmail, otp })
      });

      const data = await readResponse(response);
      
      if (!response.ok) throw new Error(data.detail || data.message || 'Invalid OTP');
      
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/dashboard");
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendOTP = async () => {
    setErrorMsg("");
    setSuccessMsg("");
    try {
      const response = await fetch(apiUrl('/api/auth/resend-otp'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userEmail })
      });

      const data = await readResponse(response);
      if (!response.ok) throw new Error(data.detail || data.message || 'Failed to resend OTP');
      
      setTimer(30);
      setSuccessMsg("A new OTP has been sent to your email.");
    } catch (err) {
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
            {isSubmitting && isLogin && (
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
              {step === 2 ? "Verify Email" : isLogin ? "Welcome Back" : "Create Account"}
            </h2>
            <p className="text-gray-400 text-sm">
              {step === 2 
                ? `Enter the 6-digit OTP sent to ${userEmail}` 
                : isLogin 
                  ? "Enter your details to access your plans." 
                  : "Start your AI powered study journey."}
            </p>
            {errorMsg && <p className="text-red-500 text-sm mt-3">{errorMsg}</p>}
            {successMsg && <p className="text-green-500 text-sm mt-3">{successMsg}</p>}
          </div>

          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.form 
                key="step1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                onSubmit={handleSubmit} 
                className="relative z-10 space-y-4"
              >
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
                  className="w-full py-3 bg-primary text-white rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors shadow-[0_0_15px_rgba(225,29,72,0.4)] disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Processing..." : isLogin ? "Sign In" : "Send OTP"}
                  {!isSubmitting && <ArrowRight className="w-4 h-4" />}
                </motion.button>
              </motion.form>
            ) : (
              <motion.form 
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onSubmit={handleVerifyOTP} 
                className="relative z-10 space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">6-Digit OTP</label>
                  <div className="relative">
                    <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input
                      type="text"
                      name="otp"
                      required
                      maxLength={6}
                      placeholder="123456"
                      className="w-full bg-black/50 border border-white/10 rounded-lg py-2.5 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-center tracking-[0.5em] font-mono text-lg"
                    />
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 bg-primary text-white rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors shadow-[0_0_15px_rgba(225,29,72,0.4)] disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Verifying..." : "Verify & Create Account"}
                </motion.button>

                <div className="text-center mt-4">
                  <button
                    type="button"
                    onClick={handleResendOTP}
                    disabled={timer > 0 || isSubmitting}
                    className="text-sm text-gray-400 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {timer > 0 ? `Resend OTP in ${timer}s` : "Didn't receive OTP? Resend"}
                  </button>
                </div>
                
                <div className="text-center mt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setStep(1);
                      setErrorMsg("");
                      setSuccessMsg("");
                    }}
                    className="text-sm text-primary hover:text-primary/80 transition-colors"
                  >
                    Back to Sign Up
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>

          {step === 1 && (
            <div className="relative z-10 mt-6 text-center">
              <button
                onClick={() => {
                  setIsLogin(!isLogin);
                  setErrorMsg("");
                  setSuccessMsg("");
                }}
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
