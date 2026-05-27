import { motion } from 'framer-motion';
import { FaTwitter, FaGithub, FaLinkedin, FaInstagram } from 'react-icons/fa';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black/95 border-t border-white/5 pt-12 pb-8 mt-auto relative z-10 w-full">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-10">

          {/* Left: Brand & Description */}
          <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10 text-center md:text-left">
            <div>
              <h3 className="text-2xl font-bold text-white tracking-tighter">
                Study<span className="text-primary">Plan.AI</span>
              </h3>
            </div>
            <div className="hidden md:block w-px h-8 bg-white/10" />
            <p className="text-gray-400 max-w-md leading-relaxed text-sm">
              Empowering students to master their time and crush their goals through intelligent scheduling.
            </p>
          </div>

          {/* Right: Social Icons */}
          <div className="flex items-center gap-5">
            {[
              { icon: <FaTwitter />, label: 'Twitter', color: '#1DA1F2', url: 'https://twitter.com' },
              { icon: <FaInstagram />, label: 'Instagram', color: '#E4405F', url: 'https://instagram.com' },
              { icon: <FaGithub />, label: 'GitHub', color: '#ffffff', url: 'https://github.com' },
              { icon: <FaLinkedin />, label: 'LinkedIn', color: '#0A66C2', url: 'https://linkedin.com' }
            ].map((social, idx) => (
              <motion.a
                key={idx}
                whileHover={{ y: -3, color: social.color }}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 transition-colors text-xl p-2 bg-white/5 rounded-lg hover:bg-white/10"
                aria-label={social.label}
              >
                {social.icon}
              </motion.a>
            ))}
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500">
            &copy; {currentYear}
          </p>
          <div className="flex items-center gap-6 text-xs text-gray-400">
            <a href="#" className="hover:text-white transition-colors"><i style={{ color: 'red' }}>Privacy Policy</i></a>
            <a href="#" className="hover:text-white transition-colors"><i style={{ color: 'red' }}>Terms of Service</i></a>
            <a href="#" className="hover:text-white transition-colors"><i style={{ color: 'red' }}>Cookie Policy</i></a>
            <div className="flex items-center gap-2 text-gray-600 border-l border-white/10 pl-6">
              <span style={{ color: "white" }}>Made with</span>
              <span className="text-primary">&hearts;</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
