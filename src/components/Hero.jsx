import { motion, AnimatePresence } from 'framer-motion';
import { FaGithub, FaLinkedin, FaEnvelope, FaDownload } from 'react-icons/fa';
import { useTheme } from '../context/ThemeContext';
import resumePdf from '../assets/Marshal-Johnsan_Resume (1).pdf';
import profileImageLight from '../assets/Light.png';
import profileImageDark from '../assets/Dark.png';

const Hero = () => {
  const { isDark } = useTheme();
  const profileImage = isDark ? profileImageDark : profileImageLight;
  
  // Animation variants for theme transition
  const imageVariants = {
    initial: { 
      opacity: 0, 
      scale: 0.8, 
      rotateY: -90,
      filter: 'blur(10px)'
    },
    animate: { 
      opacity: 1, 
      scale: 1, 
      rotateY: 0,
      filter: 'blur(0px)'
    },
    exit: { 
      opacity: 0, 
      scale: 0.8, 
      rotateY: 90,
      filter: 'blur(10px)'
    }
  };
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <section id="home" className="hero">
      <motion.div
        className="hero-content"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div className="hero-text" variants={itemVariants}>
          <motion.h1
            className="hero-title"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Hi, I'm <span className="highlight">Marshal Johnsan</span>
          </motion.h1>
          <motion.h2
            className="hero-subtitle"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Full Stack Engineer
          </motion.h2>
          <motion.p
            className="hero-description"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            I build exceptional digital experiences with clean code and modern technologies.
            Passionate about creating scalable solutions and beautiful user interfaces.
          </motion.p>
          <motion.div
            className="hero-buttons"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <motion.a
              href="#contact"
              className="btn btn-primary"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Get In Touch
            </motion.a>
            <motion.a
              href={resumePdf}
              className="btn btn-secondary"
              download="Marshal-Johnsan_Resume.pdf"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaDownload /> Download Resume
            </motion.a>
          </motion.div>
        </motion.div>

        <motion.div
          className="hero-image"
          initial={{ opacity: 0, scale: 0.3, rotate: -180 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{
            type: "spring",
            stiffness: 100,
            damping: 15,
            mass: 1,
            delay: 0.5,
            duration: 1.2
          }}
        >
            <motion.div
      className="profile-image"
      whileHover={{ 
        scale: 1.05,
        rotateY: 10,
        rotateX: 5,
        z: 30
      }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <motion.div
        className="image-placeholder"
        whileHover={{ 
          scale: 1.05,
          transition: { duration: 0.3 }
        }}
        style={{ perspective: '1000px' }}
      >
        <AnimatePresence mode="wait">
          <motion.img
            key={isDark ? 'dark' : 'light'}
            src={profileImage}
            alt="Profile"
            className="profile-photo"
            variants={imageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{
              duration: 0.5,
              ease: [0.4, 0, 0.2, 1],
              opacity: { duration: 0.3 },
              scale: { duration: 0.4 },
              rotateY: { duration: 0.5 },
              filter: { duration: 0.3 }
            }}
          />
        </AnimatePresence>
      </motion.div>
    </motion.div>

        </motion.div>
      </motion.div>

      <motion.div
        className="social-links"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <motion.a
          href="https://github.com/johnsan03"
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.2, y: -5 }}
          whileTap={{ scale: 0.9 }}
        >
          <FaGithub />
        </motion.a>
        <motion.a
          href="https://www.linkedin.com/in/johnsan-marshal-a1307535a/"
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.2, y: -5 }}
          whileTap={{ scale: 0.9 }}
        >
          <FaLinkedin />
        </motion.a>
        <motion.a
          href="mailto:john10mar28@gmail.com"
          whileHover={{ scale: 1.2, y: -5 }}
          whileTap={{ scale: 0.9 }}
        >
          <FaEnvelope />
        </motion.a>
      </motion.div>

      <motion.div
        className="scroll-indicator"
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        <div className="mouse">
          <div className="wheel"></div>
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;

