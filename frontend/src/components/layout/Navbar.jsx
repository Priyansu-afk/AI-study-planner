import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { BrainCircuit, Menu, X } from "lucide-react";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, [location]); // Re-run when location changes to catch login/logout events

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Features", path: "/#features" },
    { name: "Dashboard", path: "/dashboard" },
    { name: "Notes", path: "/notes" },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      style={{ perspective: "1000px" }}
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? "nav-scrolled py-3" : "bg-transparent py-5"
      }`}
    >
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <motion.div whileHover={{ rotateZ: 15, scale: 1.1 }}>
              <BrainCircuit className="w-8 h-8 text-primary" />
            </motion.div>
            <span className="text-xl font-bold tracking-tight text-white group-hover:text-primary transition-colors">
              Study<span className="text-primary">Plan.AI</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <div className="flex items-center gap-6">
              {navLinks.map((link) => (
                link.path.startsWith('/#') ? (
                  <a
                    key={link.name}
                    href={link.path}
                    className="relative group text-sm font-medium text-gray-300 hover:text-white transition-colors"
                  >
                    {link.name}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full rounded-full glow-effect"></span>
                  </a>
                ) : (
                  <Link
                    key={link.name}
                    to={link.path}
                    className="relative group text-sm font-medium text-gray-300 hover:text-white transition-colors"
                  >
                    {link.name}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full rounded-full glow-effect"></span>
                  </Link>
                )
              ))}
            </div>
            
            <div className="flex items-center gap-4">
              {user ? (
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium text-gray-300">
                    Hi, <span className="text-white">{user.name?.split(' ')[0] || "Student"}</span>
                  </span>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleLogout}
                    className="px-4 py-1.5 text-xs font-medium text-white border border-white/10 rounded-full hover:bg-white/5 transition-all"
                  >
                    Log out
                  </motion.button>
                </div>
              ) : (
                <>
                  <Link to="/auth" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
                    Log in
                  </Link>
                  <Link to="/auth" state={{ isSignUp: true }}>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-5 py-2 text-sm font-medium text-white bg-primary rounded-full hover:bg-primary/90 shadow-[0_0_15px_rgba(225,29,72,0.5)] transition-all"
                    >
                      Sign Up
                    </motion.button>
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-300 hover:text-white">
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden bg-black/95 backdrop-blur-xl border-b border-white/10"
        >
          <div className="flex flex-col px-6 py-4 gap-4">
            {navLinks.map((link) => (
              link.path.startsWith('/#') ? (
                <a
                  key={link.name}
                  href={link.path}
                  onClick={() => setIsOpen(false)}
                  className="text-base font-medium text-gray-300 hover:text-primary transition-colors"
                >
                  {link.name}
                </a>
              ) : (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className="text-base font-medium text-gray-300 hover:text-primary transition-colors"
                >
                  {link.name}
                </Link>
              )
            ))}
            <hr className="border-white/10 my-2" />
            {user ? (
              <div className="flex flex-col gap-4">
                <span className="text-base font-medium text-white px-1">
                  Hi, {user.name || "Student"}
                </span>
                <button 
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }} 
                  className="text-base font-medium text-gray-300 text-left"
                >
                  Log out
                </button>
              </div>
            ) : (
              <>
                <Link to="/auth" onClick={() => setIsOpen(false)} className="text-base font-medium text-gray-300">
                  Log in
                </Link>
                <Link to="/auth" state={{ isSignUp: true }} onClick={() => setIsOpen(false)}>
                  <div className="inline-block px-5 py-2 text-center text-white bg-primary rounded-full w-full">
                    Sign Up
                  </div>
                </Link>
              </>
            )}
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
}
