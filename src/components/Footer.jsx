import { motion } from 'framer-motion';
import { FaHeart } from 'react-icons/fa';
import VisitCounter from './VisitCounter';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        
        <motion.div
          className="footer-content"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p>
            Made with <FaHeart className="heart-icon" /> by Marshal Johnsan
          </p>
          <p>&copy; {currentYear} All rights reserved.</p>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;

