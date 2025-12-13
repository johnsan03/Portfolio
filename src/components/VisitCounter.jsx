import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaEye, FaUsers, FaCalendarAlt, FaClock, FaHeart, FaDownload, FaUpload } from 'react-icons/fa';
import {
  recordVisit,
  getVisitStats,
  hasLiked,
  getLikeCount,
  addLike,
  exportDatabase,
  isCounterDevConfigured,
} from '../utils/counterDB';

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
  const [isProcessing, setIsProcessing] = useState(false);
  const [configError, setConfigError] = useState(false);

  useEffect(() => {
    // Record visit and get stats (async)
    const loadData = async () => {
      try {
        // Record visit (updates local storage)
        const visitInfo = await recordVisit();
        
        // Get stats from local storage
        const stats = await getVisitStats();

        setVisitData({
          ...stats,
          isNewVisit: visitInfo.isNewVisit,
        });

        // Load like data - ALWAYS check database for like status
        // This ensures the like button state is correct even after refresh
        // Force fresh check on initial load to ensure accurate state
        const [likeCount, liked] = await Promise.all([
          getLikeCount(),
          hasLiked(true), // Force fresh check from database (bypass cache)
        ]);

        setLikeData({
          totalLikes: likeCount,
          hasLiked: liked, // This should be true if visitor already liked
        });
        setConfigError(false);
      } catch (error) {
        setConfigError(true);
        
        // Set default values on error
        setVisitData({
          totalVisits: 0,
          uniqueVisits: 0,
          lastVisit: null,
          firstVisit: null,
          visitorId: null,
          formattedLastVisit: 'N/A',
          formattedFirstVisit: 'N/A',
          formattedLastVisitTime: 'N/A',
          isNewVisit: false,
        });
        setLikeData({
          totalLikes: 0,
          hasLiked: false,
        });
      }
    };

    // Load data immediately on mount (including like status from database)
    loadData();
    
    // Refresh stats periodically to show updates (increased interval significantly to reduce API calls)
    const interval = setInterval(() => {
      loadData();
    }, 120000); // Refresh every 2 minutes (reduced API calls significantly)

    return () => clearInterval(interval);
  }, []);

  const handleLike = async () => {
    // Double-check if already liked (in case state is out of sync)
    if (likeData.hasLiked || isProcessing) {
      // Re-check from database to ensure state is correct
      const likedStatus = await hasLiked();
      if (likedStatus) {
        setLikeData(prev => ({ ...prev, hasLiked: true }));
      }
      return;
    }

    setIsProcessing(true);
    try {
      // Check one more time before posting (defensive check)
      const alreadyLiked = await hasLiked();
      if (alreadyLiked) {
        setLikeData(prev => ({ ...prev, hasLiked: true }));
        setIsProcessing(false);
        return;
      }

      const result = await addLike();

      if (result.success) {
        setLikeData({
          totalLikes: result.totalLikes,
          hasLiked: true, // Set to true after successful like
        });
        setConfigError(false);
      } else {
        // If backend says already liked, update state
        if (result.message && result.message.includes('already')) {
          setLikeData(prev => ({ ...prev, hasLiked: true }));
        }
        alert(result.message || 'Failed to add like');
      }
    } catch (error) {
      setConfigError(true);
      alert('Error adding like. Please check your GitHub configuration.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleExport = () => {
    try {
      exportDatabase();
    } catch (error) {
      alert('Error exporting database. Please try again.');
    }
  };

  const handleImport = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsProcessing(true);
    try {
      // Read file and send to server
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const imported = JSON.parse(e.target.result);
          
          // Send to server to merge (you might want to add an import endpoint)
          // For now, we'll just show a message
          alert('Import functionality: Please use the server API directly or contact admin.');
          
          // Reload data after import
          const stats = await getVisitStats();
          setVisitData({
            ...stats,
            isNewVisit: false,
          });
          
          const [likeCount, liked] = await Promise.all([
            getLikeCount(),
            hasLiked(),
          ]);
          
          setLikeData({
            totalLikes: likeCount,
            hasLiked: liked,
          });
        } catch (error) {
          alert('Error importing database. Please check the file format.');
        } finally {
          setIsProcessing(false);
          event.target.value = '';
        }
      };
      reader.readAsText(file);
    } catch (error) {
      alert('Error importing database. Please check the file format.');
      setIsProcessing(false);
      event.target.value = '';
    }
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
          className={`like-button ${likeData.hasLiked ? 'liked' : ''} ${isProcessing ? 'processing' : ''}`}
          onClick={handleLike}
          disabled={likeData.hasLiked || isProcessing}
          whileHover={!likeData.hasLiked && !isProcessing ? { scale: 1.05 } : {}}
          whileTap={!likeData.hasLiked && !isProcessing ? { scale: 0.95 } : {}}
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
              <span>{isProcessing ? 'Processing...' : 'Like'}</span>
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
      {/* <div className="db-actions">
        <motion.button
          className="db-action-btn export-btn"
          onClick={handleExport}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          title="Export database as JSON"
        >
          <FaDownload />
          <span>Export Data</span>
        </motion.button>
        <label className="db-action-btn import-btn">
          <input
            type="file"
            accept=".json"
            onChange={handleImport}
            disabled={isProcessing}
            style={{ display: 'none' }}
          />
          <FaUpload />
          <span>Import Data</span>
        </label>
      </div> */}
    </motion.div>
  );
};

export default VisitCounter;

