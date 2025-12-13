/**
 * Counter API Database Utility
 * Uses counterapi.dev API for visitor tracking and likes
 */

const COUNTER_API_BASE = 'https://api.counterapi.dev/v2/johns-team-1-2099/first-counter-2099';
const COUNTER_API_KEY = import.meta.env.VITE_COUNTER_API_KEY || ''; // Will be provided later

// CORS proxy options (fallback if direct API fails)
const CORS_PROXIES = [
  'https://api.allorigins.win/raw?url=',
  'https://corsproxy.io/?',
  'https://api.codetabs.com/v1/proxy?quest=',
];

const VISITOR_ID_KEY = 'portfolio_visitor_id';
const LOCAL_STORAGE_KEY = 'portfolio_database_local';
const COUNTER_STATS_CACHE_KEY = 'counter_api_stats_cache';
const COUNTER_STATS_CACHE_DURATION = 30000; // Cache for 30 seconds

/**
 * Make API request with CORS proxy fallback
 */
const makeApiRequest = async (url, options = {}) => {
  // Try direct request first
  try {
    const response = await fetch(url, {
      ...options,
      mode: 'cors',
      credentials: 'omit',
    });
    
    // Check if response is valid (not CORS blocked)
    if (response.ok || (response.status >= 200 && response.status < 600)) {
      return response;
    }
  } catch (error) {
    // If CORS error or network error, try with proxy
    const isCorsError = error.name === 'TypeError' || 
                       error.message.includes('CORS') || 
                       error.message.includes('Failed to fetch') ||
                       error.message.includes('NetworkError') ||
                       error.message.includes('network');
    
    if (isCorsError) {
      console.warn('CORS/Network error detected, trying with proxy...');
      
      // Try each CORS proxy
      for (const proxy of CORS_PROXIES) {
        try {
          let proxyUrl;
          let proxyOptions = {
            method: options.method || 'GET',
            headers: {
              'Accept': 'application/json',
            },
            mode: 'cors',
            credentials: 'omit',
          };
          
          // Handle different proxy formats
          if (proxy.includes('allorigins.win')) {
            // allorigins.win format
            proxyUrl = `${proxy}${encodeURIComponent(url)}`;
            // For POST, we need to send data differently
            if (options.method === 'POST' && options.headers) {
              // allorigins doesn't forward headers well, so we'll encode them in URL or body
              proxyOptions.headers = {
                'Content-Type': 'application/json',
              };
            }
          } else if (proxy.includes('corsproxy.io')) {
            // corsproxy.io format
            proxyUrl = `${proxy}${encodeURIComponent(url)}`;
            if (options.headers) {
              // Try to preserve headers
              proxyOptions.headers = {
                ...options.headers,
                'Accept': 'application/json',
              };
            }
          } else {
            // codetabs format
            proxyUrl = `${proxy}${encodeURIComponent(url)}`;
            if (options.headers) {
              proxyOptions.headers = {
                ...options.headers,
                'Accept': 'application/json',
              };
            }
          }
          
          const response = await fetch(proxyUrl, proxyOptions);
          
          if (response.ok) {
            return response;
          }
        } catch (proxyError) {
          // Try next proxy
          console.warn(`Proxy ${proxy} failed, trying next...`);
          continue;
        }
      }
      
      // If all proxies failed, throw original error
      console.error('All CORS proxies failed, falling back to cached data');
    }
    
    throw error;
  }
  
  // If we get here, direct request might have failed but wasn't CORS
  throw new Error('Request failed');
};

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
 * Get counter stats from counterapi.dev
 * Fetches the current counter value and statistics
 */
const getCounterStats = async () => {
  // Check cache first
  try {
    const cached = localStorage.getItem(COUNTER_STATS_CACHE_KEY);
    if (cached) {
      const cachedData = JSON.parse(cached);
      const now = Date.now();
      if (cachedData.timestamp && (now - cachedData.timestamp) < COUNTER_STATS_CACHE_DURATION) {
        return {
          totalVisits: cachedData.totalVisits || 0,
          uniqueVisits: cachedData.uniqueVisits || 0,
          counterValue: cachedData.counterValue || 0,
        };
      }
    }
  } catch (e) {
    // Ignore cache errors
  }

  // If no API key, return cached or default
  if (!COUNTER_API_KEY) {
    console.warn('⚠️ Counter API key not configured. Please set VITE_COUNTER_API_KEY in your .env file');
    try {
      const cached = localStorage.getItem(COUNTER_STATS_CACHE_KEY);
      if (cached) {
        const cachedData = JSON.parse(cached);
        return {
          totalVisits: cachedData.totalVisits || 0,
          uniqueVisits: cachedData.uniqueVisits || 0,
          counterValue: cachedData.counterValue || 0,
        };
      }
    } catch (e) {
      // Ignore
    }
    return {
      totalVisits: 0,
      uniqueVisits: 0,
      counterValue: 0,
    };
  }

  try {
    // Fetch counter value with CORS proxy fallback
    let valueResponse;
    let statsResponse;
    
    try {
      valueResponse = await makeApiRequest(COUNTER_API_BASE, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${COUNTER_API_KEY}`,
          'Accept': 'application/json',
        },
      });

      // Fetch stats with CORS proxy fallback
      statsResponse = await makeApiRequest(`${COUNTER_API_BASE}/stats`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${COUNTER_API_KEY}`,
          'Accept': 'application/json',
        },
      });
    } catch (requestError) {
      console.error('Error making API requests:', requestError);
      // Fall through to use cached data
      throw requestError;
    }

    let counterValue = 0;
    let stats = {};

    if (valueResponse && valueResponse.ok) {
      try {
        const valueData = await valueResponse.json();
        counterValue = valueData.value || valueData.count || valueData.counter || 0;
      } catch (parseError) {
        console.warn('Error parsing counter value response:', parseError);
      }
    }

    if (statsResponse && statsResponse.ok) {
      try {
        stats = await statsResponse.json();
      } catch (parseError) {
        console.warn('Error parsing stats response:', parseError);
      }
    }

    const result = {
      totalVisits: counterValue || stats.total || stats.visits || stats.count || 0,
      uniqueVisits: stats.unique || stats.uniqueVisitors || stats.uniques || 0,
      counterValue: counterValue,
    };

    // Cache the result
    try {
      localStorage.setItem(COUNTER_STATS_CACHE_KEY, JSON.stringify({
        ...result,
        timestamp: Date.now(),
      }));
    } catch (e) {
      // Ignore cache errors
    }

    return result;
  } catch (error) {
    console.error('Error fetching counter stats:', error);
    // Return cached data if available
    try {
      const cached = localStorage.getItem(COUNTER_STATS_CACHE_KEY);
      if (cached) {
        const cachedData = JSON.parse(cached);
        return {
          totalVisits: cachedData.totalVisits || 0,
          uniqueVisits: cachedData.uniqueVisits || 0,
          counterValue: cachedData.counterValue || 0,
        };
      }
    } catch (e) {
      // Ignore
    }
    return {
      totalVisits: 0,
      uniqueVisits: 0,
      counterValue: 0,
    };
  }
};

/**
 * Record a new visit (increment counter via API and track locally)
 */
export const recordVisit = async () => {
  const visitorId = getVisitorId();
  
  // Check if this is a new session
  const sessionKey = `portfolio_session_${visitorId}`;
  const hasSession = sessionStorage.getItem(sessionKey);

  if (!hasSession) {
    // Mark session
    sessionStorage.setItem(sessionKey, 'true');
    
    // Increment counter via API if API key is configured
    if (COUNTER_API_KEY) {
      try {
        await makeApiRequest(`${COUNTER_API_BASE}/up`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${COUNTER_API_KEY}`,
            'Accept': 'application/json',
          },
        });
        // Clear cache to force refresh
        localStorage.removeItem(COUNTER_STATS_CACHE_KEY);
      } catch (error) {
        console.error('Error incrementing counter:', error);
        // Continue even if API call fails - local tracking still works
      }
    }
    
    // Update local database for display
    try {
      const local = localStorage.getItem(LOCAL_STORAGE_KEY);
      const db = local ? JSON.parse(local) : getDefaultDatabase();
      const now = new Date().toISOString();
      
      const isNewVisitor = !db.visits.visitors[visitorId];
      
      // Increment total visits locally
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
 * Get visit statistics (from counterapi.dev API + local data for dates)
 */
export const getVisitStats = async () => {
  const visitorId = getVisitorId();
  
  // Try to get stats from counterapi.dev API
  const counterStats = await getCounterStats();
  
  // Get local data for dates and visitor info
  const local = localStorage.getItem(LOCAL_STORAGE_KEY);
  const localDb = local ? JSON.parse(local) : getDefaultDatabase();

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

  // Use counter API stats for visit counts (if available), otherwise fallback to local
  const totalVisits = counterStats.totalVisits > 0 
    ? counterStats.totalVisits 
    : (localDb.visits.totalVisits || 0);
  
  const uniqueVisits = counterStats.uniqueVisits > 0 
    ? counterStats.uniqueVisits 
    : (localDb.visits.uniqueVisits || 0);

  return {
    totalVisits: totalVisits,
    uniqueVisits: uniqueVisits,
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
 * Get like count (from counterapi.dev counter value)
 * The counter value represents the total likes/visits
 */
export const getLikeCount = async () => {
  try {
    // Get counter stats from API
    const counterStats = await getCounterStats();
    // Use counter value as likes (or totalVisits as fallback)
    return counterStats.counterValue || counterStats.totalVisits || 0;
  } catch (error) {
    console.error('Error getting like count:', error);
    // Fallback to local storage if API fails
    try {
      const cached = localStorage.getItem(COUNTER_STATS_CACHE_KEY);
      if (cached) {
        const cachedData = JSON.parse(cached);
        return cachedData.counterValue || cachedData.totalVisits || 0;
      }
    } catch (e) {
      // Ignore
    }
    return 0;
  }
};

/**
 * Add a like (increment counter via API)
 * Uses counterapi.dev API to increment the counter
 */
export const addLike = async () => {
  try {
    const visitorId = getVisitorId();
    const local = localStorage.getItem(LOCAL_STORAGE_KEY);
    const db = local ? JSON.parse(local) : getDefaultDatabase();

    // Check if already liked (local check)
    if (db.likes?.likedVisitors?.[visitorId]) {
      const currentTotal = await getLikeCount();
      return {
        success: false,
        message: 'You have already liked this portfolio',
        totalLikes: currentTotal,
      };
    }

    // If no API key, just track locally
    if (!COUNTER_API_KEY) {
      console.warn('⚠️ Counter API key not configured. Like will only be tracked locally.');
      // Track locally
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
      db.metadata = db.metadata || {};
      db.metadata.lastUpdated = new Date().toISOString();
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(db));
      
      const totalLikes = await getLikeCount();
      return {
        success: true,
        message: 'Thank you for your like! (Local only - API key needed for server sync)',
        totalLikes: totalLikes,
      };
    }

    // Increment counter via API with CORS proxy fallback
    try {
      const response = await makeApiRequest(`${COUNTER_API_BASE}/up`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${COUNTER_API_KEY}`,
          'Accept': 'application/json',
        },
      });

      if (response && response.ok) {
        // Clear cache to force refresh
        localStorage.removeItem(COUNTER_STATS_CACHE_KEY);
        
        // Track locally that this user has liked
        if (!db.likes) {
          db.likes = {
            totalLikes: 0,
            likedVisitors: {},
            likeHistory: [],
          };
        }
        db.likes.likedVisitors[visitorId] = true;
        db.likes.likeHistory = db.likes.likeHistory || [];
        db.likes.likeHistory.push({
          visitorId,
          timestamp: new Date().toISOString(),
        });
        db.metadata = db.metadata || {};
        db.metadata.lastUpdated = new Date().toISOString();
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(db));

        // Get updated total
        const totalLikes = await getLikeCount();

        return {
          success: true,
          message: 'Thank you for your like!',
          totalLikes: totalLikes,
        };
      } else {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `API returned ${response.status}`);
      }
    } catch (apiError) {
      console.error('Error incrementing counter via API:', apiError);
      throw apiError;
    }
  } catch (error) {
    console.error('Error adding like:', error);
    // Try to get current total even on error
    try {
      const currentTotal = await getLikeCount();
      return {
        success: false,
        message: 'Error adding like. Please try again.',
        totalLikes: currentTotal,
      };
    } catch (e) {
      return {
        success: false,
        message: 'Error adding like. Please try again.',
        totalLikes: 0,
      };
    }
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
 * Check if counter API is configured
 */
export const isCounterDevConfigured = () => {
  return !!COUNTER_API_KEY && COUNTER_API_KEY !== '';
};

