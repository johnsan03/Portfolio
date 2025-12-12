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
        <FaEye className="visit-icon" />
        <h3>Visit Statistics</h3>
        {visitData.isNewVisit && (
          <motion.span
            className="new-visit-badge"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
          >
            New Visit!
          </motion.span>
        )}
      </div>
      <div className="visit-stats-grid">
        <motion.div
          className="visit-stat-card"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          whileHover={{ scale: 1.02 }}
        >
          <div className="stat-icon">
            <FaUsers />
          </div>
          <div className="stat-content">
            <div className="stat-value">{visitData.totalVisits.toLocaleString()}</div>
            <div className="stat-label">Total Visits</div>
          </div>
        </motion.div>

        <motion.div
          className="visit-stat-card"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          whileHover={{ scale: 1.02 }}
        >
          <div className="stat-icon">
            <FaEye />
          </div>
          <div className="stat-content">
            <div className="stat-value">{visitData.uniqueVisits.toLocaleString()}</div>
            <div className="stat-label">Unique Visitors</div>
          </div>
        </motion.div>

        <motion.div
          className="visit-stat-card"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          whileHover={{ scale: 1.02 }}
        >
          <div className="stat-icon">
            <FaCalendarAlt />
          </div>
          <div className="stat-content">
            <div className="stat-value">{visitData.formattedLastVisit}</div>
            <div className="stat-label">Last Visit</div>
            <div className="stat-time">{visitData.formattedLastVisitTime}</div>
          </div>
        </motion.div>

        <motion.div
          className="visit-stat-card"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          whileHover={{ scale: 1.02 }}
        >
          <div className="stat-icon">
            <FaClock />
          </div>
          <div className="stat-content">
            <div className="stat-value">{visitData.formattedFirstVisit}</div>
            <div className="stat-label">First Visit</div>
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
      <div className="visit-counter-note">
        <p>Statistics are stored locally in your browser</p>
      </div>
    </motion.div>
  );
};

export default VisitCounter;

