import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaStar } from 'react-icons/fa';

const HolidayGreeting = () => {
  const [showGreeting, setShowGreeting] = useState(false);
  const [hasSeenGreeting, setHasSeenGreeting] = useState(false);
  const canvasRef = useRef(null);

  useEffect(() => {
    // Check if we're in the holiday period (Dec 25, 2025 - Jan 7, 2026)
    const now = new Date();
    const startDate = new Date(2025, 11, 24); // Dec 24, 2025 (month is 0-indexed)
    const endDate = new Date(2026, 0, 7); // Jan 7, 2026
    
    const isHolidayPeriod = now >= startDate && now <= endDate;
    
    // Check if user has already dismissed the greeting in this session
    const dismissed = sessionStorage.getItem('holidayGreetingDismissed');
    
    if (isHolidayPeriod && !dismissed && !hasSeenGreeting) {
      setShowGreeting(true);
    }
  }, [hasSeenGreeting]);

  useEffect(() => {
    if (!showGreeting || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let snowflakes = [];
    let stars = [];

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Snowflake class
    class Snowflake {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 4 + 2;
        this.speed = Math.random() * 2 + 1;
        this.opacity = Math.random() * 0.5 + 0.5;
        this.wobble = Math.random() * Math.PI * 2;
        this.wobbleSpeed = Math.random() * 0.02 + 0.01;
      }

      update() {
        this.y += this.speed;
        this.x += Math.sin(this.wobble) * 0.5;
        this.wobble += this.wobbleSpeed;

        if (this.y > canvas.height) {
          this.y = -10;
          this.x = Math.random() * canvas.width;
        }
        if (this.x < -10) this.x = canvas.width + 10;
        if (this.x > canvas.width + 10) this.x = -10;
      }

      draw() {
        ctx.save();
        ctx.globalAlpha = this.opacity * 0.6; // More subtle
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    // Star class (sparkles)
    class Star {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 3 + 1;
        this.opacity = Math.random() * 0.8 + 0.2;
        this.twinkle = Math.random() * Math.PI * 2;
        this.twinkleSpeed = Math.random() * 0.03 + 0.02;
      }

      update() {
        this.twinkle += this.twinkleSpeed;
        this.opacity = 0.2 + Math.sin(this.twinkle) * 0.6;
      }

      draw() {
        ctx.save();
        ctx.globalAlpha = this.opacity * 0.5; // More subtle
        ctx.fillStyle = 'rgba(251, 191, 36, 0.7)';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    // Initialize particles - more subtle and professional
    for (let i = 0; i < 40; i++) {
      snowflakes.push(new Snowflake());
    }
    for (let i = 0; i < 30; i++) {
      stars.push(new Star());
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      snowflakes.forEach(snowflake => {
        snowflake.update();
        snowflake.draw();
      });
      
      stars.forEach(star => {
        star.update();
        star.draw();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, [showGreeting]);

  const handleEnter = () => {
    setShowGreeting(false);
    setHasSeenGreeting(true);
    sessionStorage.setItem('holidayGreetingDismissed', 'true');
  };

  if (!showGreeting) return null;

  return (
    <AnimatePresence>
      {showGreeting && (
        <motion.div
          className="holiday-greeting"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <canvas ref={canvasRef} className="holiday-canvas" />
          
          <motion.div
            className="holiday-content"
            initial={{ scale: 0.8, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.8, y: 50 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          >
            <motion.div
              className="holiday-icon-wrapper"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <div className="holiday-icon">
                <FaStar />
              </div>
            </motion.div>

            <motion.h1
              className="holiday-title"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <span className="holiday-title-line">Merry Christmas</span>
              <span className="holiday-title-line">Happy New Year</span>
            </motion.h1>

            <motion.p
              className="holiday-subtitle"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              Because nothing screams "holiday spirit" like a developer who codes even during Christmas 🎄
              <br />
              <span style={{ fontSize: '0.9em', opacity: 0.85, display: 'block', marginTop: '0.5rem', fontStyle: 'italic' }}>
                (Yes, I know it's Christmas. No, I'm not taking a break. Yes, I have a problem. Happy New Year! 🚀)
              </span>
            </motion.p>

            <motion.button
              className="holiday-enter-btn"
              onClick={handleEnter}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Enter Site
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default HolidayGreeting;

