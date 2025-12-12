/**
 * Counter.dev Database Utility
 * Uses counter.dev API for visitor tracking (read-only)
 * Uses localStorage for likes (no server writes needed)
 */

const COUNTER_DEV_USERNAME = import.meta.env.VITE_COUNTER_DEV_USERNAME || 'johnsan03';
const COUNTER_DEV_API = 'https://api.counter.dev/api/v1';

const VISITOR_ID_KEY = 'portfolio_visitor_id';
const LOCAL_STORAGE_KEY = 'portfolio_database_local';

/**
 * Get or create visitor ID (stored in localStorage for persistence)
 */
export const getVisitorId = () => {
  let visitorId = localStorage.getItem(VISITOR_ID_KEY);
  if (!visitorId) {
    visitorId = `visitor_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem(VISITOR_ID_KEY, visitorId);
  }
  return visitorId;
};

/**
 * Get default database structure
 */
const getDefaultDatabase = () => {
  return {
    visits: {
      totalVisits: 0,
      uniqueVisits: 0,
      lastVisit: null,
      firstVisit: null,
      visitors: {},
    },
    likes: {
      totalLikes: 0,
      likedVisitors: {},
      likeHistory: [],
    },
    metadata: {
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
    },
  };
};

/**
 * Get stats from counter.dev using username
 * Counter.dev tracks visits automatically via the script tag
 * We'll try to fetch stats from their API
 */
const getCounterDevStats = async () => {
  if (!COUNTER_DEV_USERNAME || COUNTER_DEV_USERNAME === 'YOUR_USERNAME') {
    // If not configured, return defaults (script still tracks)
    return {
      totalVisits: 0,
      uniqueVisits: 0,
    };
  }

  try {
    // Try to fetch stats from Counter.dev
    // Counter.dev may expose stats via their API or dashboard
    // Try multiple possible endpoints
    
    // Option 1: Try Counter.dev stats API
    const endpoints = [
      `https://api.counter.dev/api/v1/stats/${COUNTER_DEV_USERNAME}`,
      `https://counter.dev/api/v1/stats/${COUNTER_DEV_USERNAME}`,
      `https://api.counter.dev/stats/${COUNTER_DEV_USERNAME}`,
    ];

    for (const apiUrl of endpoints) {
      try {
        const response = await fetch(apiUrl, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          // Extract stats from response (structure may vary)
          return {
            totalVisits: data.total || data.visits || data.count || data.views || 0,
            uniqueVisits: data.unique || data.uniqueVisitors || data.uniques || 0,
          };
        }
      } catch (e) {
        // Try next endpoint
        continue;
      }
    }

    // If all API calls fail, return defaults
    // Counter.dev script still tracks in background
    console.info('Counter.dev API not available, but tracking still works via script tag');
    return {
      totalVisits: 0, // Will be tracked by counter.dev script
      uniqueVisits: 0, // Will be tracked by counter.dev script
    };
  } catch (error) {
    // If API fails, counter.dev script still tracks in background
    // Return defaults - the script will handle tracking
    console.warn('Counter.dev API error (tracking still works):', error);
    return {
      totalVisits: 0,
      uniqueVisits: 0,
    };
  }
};

/**
 * Record a new visit (track locally for display, counter.dev handles server-side tracking)
 */
export const recordVisit = async () => {
  const visitorId = getVisitorId();
  
  // Check if this is a new session
  const sessionKey = `portfolio_session_${visitorId}`;
  const hasSession = sessionStorage.getItem(sessionKey);

  if (!hasSession) {
    // Mark session
    sessionStorage.setItem(sessionKey, 'true');
    
    // Update local database for display
    try {
      const local = localStorage.getItem(LOCAL_STORAGE_KEY);
      const db = local ? JSON.parse(local) : getDefaultDatabase();
      const now = new Date().toISOString();
      
      const isNewVisitor = !db.visits.visitors[visitorId];
      
      // Increment total visits
      db.visits.totalVisits = (db.visits.totalVisits || 0) + 1;
      
      if (isNewVisitor) {
        // Increment unique visits
        db.visits.uniqueVisits = (db.visits.uniqueVisits || 0) + 1;
        db.visits.visitors[visitorId] = {
          firstVisit: now,
          lastVisit: now,
          visitCount: 1,
        };
        if (!db.visits.firstVisit) {
          db.visits.firstVisit = now;
        }
      } else {
        db.visits.visitors[visitorId].lastVisit = now;
        db.visits.visitors[visitorId].visitCount += 1;
      }

      db.visits.lastVisit = now;
      db.metadata.lastUpdated = now;
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(db));
      
      return {
        isNewVisit: true,
        isNewVisitor: isNewVisitor,
        visitorId,
      };
    } catch (error) {
      console.error('Error updating local visit data:', error);
      return {
        isNewVisit: true,
        isNewVisitor: false,
        visitorId,
      };
    }
  }

  return {
    isNewVisit: false,
    isNewVisitor: false,
    visitorId,
  };
};

/**
 * Get visit statistics (from local storage - Counter.dev tracks separately)
 */
export const getVisitStats = async () => {
  // Get local data for display
  // Counter.dev tracks server-side but doesn't provide public API
  // So we use local tracking for frontend display
  const local = localStorage.getItem(LOCAL_STORAGE_KEY);
  const localDb = local ? JSON.parse(local) : getDefaultDatabase();
  const visitorId = getVisitorId();

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

  // Use local tracking for display
  // Counter.dev tracks separately on their servers
  return {
    totalVisits: localDb.visits.totalVisits || 0,
    uniqueVisits: localDb.visits.uniqueVisits || 0,
    lastVisit: localDb.visits.lastVisit,
    firstVisit: localDb.visits.firstVisit,
    visitorId: visitorId,
    formattedLastVisit: formatDate(localDb.visits.lastVisit),
    formattedFirstVisit: formatDate(localDb.visits.firstVisit),
    formattedLastVisitTime: formatTime(localDb.visits.lastVisit),
  };
};

/**
 * Check if visitor has liked (localStorage only)
 */
export const hasLiked = async () => {
  try {
    const local = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!local) return false;
    
    const db = JSON.parse(local);
    const visitorId = getVisitorId();
    return db.likes?.likedVisitors?.[visitorId] || false;
  } catch (error) {
    console.error('Error checking like status:', error);
    return false;
  }
};

/**
 * Get like count (localStorage only)
 */
export const getLikeCount = async () => {
  try {
    const local = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!local) return 0;
    
    const db = JSON.parse(local);
    return db.likes?.totalLikes || 0;
  } catch (error) {
    console.error('Error getting like count:', error);
    return 0;
  }
};

/**
 * Add a like (localStorage only - no server writes)
 */
export const addLike = async () => {
  try {
    const local = localStorage.getItem(LOCAL_STORAGE_KEY);
    const db = local ? JSON.parse(local) : getDefaultDatabase();
    const visitorId = getVisitorId();

    // Check if already liked
    if (db.likes?.likedVisitors?.[visitorId]) {
      return {
        success: false,
        message: 'You have already liked this portfolio',
        totalLikes: db.likes.totalLikes || 0,
      };
    }

    // Add like
    if (!db.likes) {
      db.likes = {
        totalLikes: 0,
        likedVisitors: {},
        likeHistory: [],
      };
    }

    db.likes.totalLikes = (db.likes.totalLikes || 0) + 1;
    db.likes.likedVisitors[visitorId] = true;
    db.likes.likeHistory = db.likes.likeHistory || [];
    db.likes.likeHistory.push({
      visitorId,
      timestamp: new Date().toISOString(),
    });

    // Keep only last 1000 likes in history
    if (db.likes.likeHistory.length > 1000) {
      db.likes.likeHistory = db.likes.likeHistory.slice(-1000);
    }

    db.metadata = db.metadata || {};
    db.metadata.lastUpdated = new Date().toISOString();

    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(db));

    return {
      success: true,
      message: 'Thank you for your like!',
      totalLikes: db.likes.totalLikes,
    };
  } catch (error) {
    console.error('Error adding like:', error);
    return {
      success: false,
      message: 'Error adding like. Please try again.',
      totalLikes: 0,
    };
  }
};

/**
 * Export database as JSON file (downloads local data)
 */
export const exportDatabase = async () => {
  try {
    const local = localStorage.getItem(LOCAL_STORAGE_KEY);
    const db = local ? JSON.parse(local) : getDefaultDatabase();
    
    const dataStr = JSON.stringify(db, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `portfolio_database_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error exporting database:', error);
    alert('Error exporting database.');
  }
};

/**
 * Check if counter.dev is configured
 */
export const isCounterDevConfigured = () => {
  return !!COUNTER_DEV_USERNAME && COUNTER_DEV_USERNAME !== 'YOUR_USERNAME' && COUNTER_DEV_USERNAME !== '';
};

