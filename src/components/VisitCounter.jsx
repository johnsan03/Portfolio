import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaEye, FaUsers, FaCalendarAlt, FaClock, FaHeart } from 'react-icons/fa';

const VisitCounter = () => {
  const [visitData, setVisitData] = useState({
    totalVisits: 0,
    uniqueVisits: 0,
    lastVisit: null,
    firstVisit: null,
    visitorId: null,
    isNewVisit: false,
  });
  const [likeData, setLikeData] = useState({
    totalLikes: 0,
    hasLiked: false,
  });

  useEffect(() => {
    // Generate or retrieve visitor ID
    let visitorId = localStorage.getItem('portfolio_visitor_id');
    if (!visitorId) {
      visitorId = `visitor_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('portfolio_visitor_id', visitorId);
    }

    // Get existing visit data
    const storedData = localStorage.getItem('portfolio_visit_data');
    let visitData = storedData ? JSON.parse(storedData) : {
      totalVisits: 0,
      uniqueVisits: 0,
      lastVisit: null,
      firstVisit: null,
      visitors: {},
    };

    // Check if this is a new session
    const sessionKey = `portfolio_session_${visitorId}`;
    const hasSession = sessionStorage.getItem(sessionKey);
    const now = new Date().toISOString();

    let isNewVisit = false;
    if (!hasSession) {
      // New visit in this session
      isNewVisit = true;
      visitData.totalVisits += 1;
      sessionStorage.setItem(sessionKey, 'true');

      // Check if this is a unique visitor
      if (!visitData.visitors[visitorId]) {
        visitData.uniqueVisits += 1;
        visitData.visitors[visitorId] = {
          firstVisit: now,
          lastVisit: now,
          visitCount: 1,
        };
        if (!visitData.firstVisit) {
          visitData.firstVisit = now;
        }
      } else {
        visitData.visitors[visitorId].lastVisit = now;
        visitData.visitors[visitorId].visitCount += 1;
      }

      visitData.lastVisit = now;

      // Save updated data
      localStorage.setItem('portfolio_visit_data', JSON.stringify(visitData));
    }

    // Format dates for display
    const formatDate = (dateString) => {
      if (!dateString) return 'N/A';
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    };

    const formatTime = (dateString) => {
      if (!dateString) return 'N/A';
      const date = new Date(dateString);
      return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      });
    };

    setVisitData({
      totalVisits: visitData.totalVisits,
      uniqueVisits: visitData.uniqueVisits,
      lastVisit: visitData.lastVisit,
      firstVisit: visitData.firstVisit,
      visitorId: visitorId,
      formattedLastVisit: formatDate(visitData.lastVisit),
      formattedFirstVisit: formatDate(visitData.firstVisit),
      formattedLastVisitTime: formatTime(visitData.lastVisit),
      isNewVisit: isNewVisit,
    });

    // Load like data
    const likeStorage = localStorage.getItem('portfolio_likes');
    const likesData = likeStorage ? JSON.parse(likeStorage) : {
      totalLikes: 0,
      likedVisitors: {},
    };

    const hasLiked = likesData.likedVisitors[visitorId] || false;

    setLikeData({
      totalLikes: likesData.totalLikes || 0,
      hasLiked: hasLiked,
    });
  }, []);

  const handleLike = () => {
    if (likeData.hasLiked) return;

    const visitorId = visitData.visitorId || localStorage.getItem('portfolio_visitor_id');
    if (!visitorId) return;

    const likeStorage = localStorage.getItem('portfolio_likes');
    const likesData = likeStorage ? JSON.parse(likeStorage) : {
      totalLikes: 0,
      likedVisitors: {},
    };

    // Check if already liked
    if (likesData.likedVisitors[visitorId]) return;

    // Add like
    likesData.totalLikes += 1;
    likesData.likedVisitors[visitorId] = true;
    likesData.likedVisitors[visitorId + '_timestamp'] = new Date().toISOString();

    localStorage.setItem('portfolio_likes', JSON.stringify(likesData));

    setLikeData({
      totalLikes: likesData.totalLikes,
      hasLiked: true,
    });
  };

  return (
    <motion.div
      className="visit-counter"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="visit-counter-header">
        <motion.div
          className="header-icon-wrapper"
          initial={{ rotate: -180, scale: 0 }}
          animate={{ rotate: 0, scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
        >
          <FaEye className="visit-icon" />
          <div className="icon-glow"></div>
        </motion.div>
        <div className="header-text">
          <h3>Visit Statistics</h3>
          <p className="header-subtitle">Track your journey</p>
        </div>
        {visitData.isNewVisit && (
          <motion.span
            className="new-visit-badge"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
          >
            <motion.span
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              ✨
            </motion.span>
            New Visit!
          </motion.span>
        )}
      </div>
      <div className="visit-stats-grid">
        <motion.div
          className="visit-stat-card stat-card-1"
          initial={{ opacity: 0, y: 30, rotateX: -15 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ delay: 0.1, type: "spring", stiffness: 100 }}
          whileHover={{ y: -5 }}
        >
          <div className="stat-card-bg"></div>
          <div className="stat-icon-wrapper">
            <div className="stat-icon-glow"></div>
            <FaUsers className="stat-icon" />
          </div>
          <div className="stat-content">
            <motion.div
              className="stat-value"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
            >
              {visitData.totalVisits.toLocaleString()}
            </motion.div>
            <div className="stat-label">Total Visits</div>
            <div className="stat-decoration"></div>
          </div>
        </motion.div>

        <motion.div
          className="visit-stat-card stat-card-2"
          initial={{ opacity: 0, y: 30, rotateX: -15 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
          whileHover={{ y: -5 }}
        >
          <div className="stat-card-bg"></div>
          <div className="stat-icon-wrapper">
            <div className="stat-icon-glow"></div>
            <FaEye className="stat-icon" />
          </div>
          <div className="stat-content">
            <motion.div
              className="stat-value"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
            >
              {visitData.uniqueVisits.toLocaleString()}
            </motion.div>
            <div className="stat-label">Unique Visitors</div>
            <div className="stat-decoration"></div>
          </div>
        </motion.div>

        <motion.div
          className="visit-stat-card stat-card-3"
          initial={{ opacity: 0, y: 30, rotateX: -15 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 100 }}
          whileHover={{ y: -5 }}
        >
          <div className="stat-card-bg"></div>
          <div className="stat-icon-wrapper">
            <div className="stat-icon-glow"></div>
            <FaCalendarAlt className="stat-icon" />
          </div>
          <div className="stat-content">
            <motion.div
              className="stat-value"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
            >
              {visitData.formattedLastVisit}
            </motion.div>
            <div className="stat-label">Last Visit</div>
            <div className="stat-time">{visitData.formattedLastVisitTime}</div>
            <div className="stat-decoration"></div>
          </div>
        </motion.div>

        <motion.div
          className="visit-stat-card stat-card-4"
          initial={{ opacity: 0, y: 30, rotateX: -15 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ delay: 0.4, type: "spring", stiffness: 100 }}
          whileHover={{ y: -5 }}
        >
          <div className="stat-card-bg"></div>
          <div className="stat-icon-wrapper">
            <div className="stat-icon-glow"></div>
            <FaClock className="stat-icon" />
          </div>
          <div className="stat-content">
            <motion.div
              className="stat-value"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.6, type: "spring", stiffness: 200 }}
            >
              {visitData.formattedFirstVisit}
            </motion.div>
            <div className="stat-label">First Visit</div>
            <div className="stat-decoration"></div>
          </div>
        </motion.div>
      </div>
      <div className="like-section">
        <motion.button
          className={`like-button ${likeData.hasLiked ? 'liked' : ''}`}
          onClick={handleLike}
          disabled={likeData.hasLiked}
          whileHover={!likeData.hasLiked ? { scale: 1.05 } : {}}
          whileTap={!likeData.hasLiked ? { scale: 0.95 } : {}}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          {likeData.hasLiked ? (
            <>
              <FaHeart className="like-icon liked-icon" />
              <span>Liked</span>
            </>
          ) : (
            <>
              <FaHeart className="like-icon" />
              <span>Like</span>
            </>
          )}
        </motion.button>
        <motion.div
          className="like-count"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <FaHeart className="count-icon" />
          <span className="count-number">{likeData.totalLikes.toLocaleString()}</span>
          <span className="count-label">Likes</span>
        </motion.div>
      </div>
     
    </motion.div>
  );
};

export default VisitCounter;

