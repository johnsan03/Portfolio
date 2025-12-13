/**
 * Counter API Database Utility
 * Uses Xano backend API for visitor tracking and likes
 */

const API_BASE_URL = 'https://x8ki-letl-twmt.n7.xano.io/api:WpZv-jLF';
const API_KEY = import.meta.env.VITE_API_KEY || ''; // Optional API key if needed

const VISITOR_ID_KEY = 'portfolio_visitor_id';
const VISITOR_DB_ID_KEY = 'portfolio_visitor_db_id'; // Store the database ID from visitor table
const LOCAL_STORAGE_KEY = 'portfolio_database_local';
const COUNTER_STATS_CACHE_KEY = 'counter_api_stats_cache';
const COUNTER_STATS_CACHE_DURATION = 300000; // Cache for 5 minutes (reduced API calls significantly)

// In-memory cache to prevent duplicate simultaneous requests
let pendingRequests = {
  counters: null,
  visitors: null,
  stats: null,
};

// Rate limiting - track last request time
let lastRequestTime = {
  counters: 0,
  visitors: 0,
};
const MIN_REQUEST_INTERVAL = 2000; // Minimum 2 seconds between requests to same endpoint

/**
 * Make API request to Xano backend with rate limiting and 429 handling
 */
const makeApiRequest = async (endpoint, options = {}) => {
  // Rate limiting - prevent too frequent requests
  const endpointType = endpoint.includes('/counter') ? 'counters' : 'visitors';
  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime[endpointType];
  
  if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
    const waitTime = MIN_REQUEST_INTERVAL - timeSinceLastRequest;
    await new Promise(resolve => setTimeout(resolve, waitTime));
  }
  
  lastRequestTime[endpointType] = Date.now();

  const url = `${API_BASE_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...(API_KEY && { 'Authorization': `Bearer ${API_KEY}` }),
    ...(options.headers || {}),
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers,
      mode: 'cors',
      credentials: 'omit',
    });

    // Handle 429 Too Many Requests
    if (response.status === 429) {
      const retryAfter = response.headers.get('Retry-After');
      const waitTime = retryAfter ? parseInt(retryAfter) * 1000 : 10000; // Default 10 seconds
      await new Promise(resolve => setTimeout(resolve, waitTime));
      
      // Retry once after waiting
      const retryResponse = await fetch(url, {
        ...options,
        headers,
        mode: 'cors',
        credentials: 'omit',
      });
      
      if (!retryResponse.ok && retryResponse.status !== 429) {
        const errorText = await retryResponse.text().catch(() => 'Unknown error');
        throw new Error(`API request failed: ${retryResponse.status} ${errorText}`);
      }
      
      return retryResponse;
    }

    if (!response.ok) {
      // Try to get detailed error message from response
      let errorText = 'Unknown error';
      try {
        const errorData = await response.json().catch(() => null);
        if (errorData) {
          errorText = JSON.stringify(errorData);
        } else {
          errorText = await response.text().catch(() => 'Unknown error');
        }
      } catch (e) {
        errorText = await response.text().catch(() => 'Unknown error');
      }
      throw new Error(`API request failed: ${response.status} ${errorText}`);
    }

    return response;
  } catch (error) {
    // If it's a 429 error from fetch (network level), wait and return cached data
    if (error.message.includes('429') || error.message.includes('Too Many Requests')) {
      throw error;
    }
    throw error;
  }
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
 * Fetch counters with caching and request deduplication
 */
const fetchCounters = async () => {
  // Check cache first
  const cacheKey = 'counters_cache';
    try {
      const cached = sessionStorage.getItem(cacheKey);
      if (cached) {
        const cachedData = JSON.parse(cached);
        const now = Date.now();
        if (cachedData.timestamp && (now - cachedData.timestamp) < COUNTER_STATS_CACHE_DURATION) {
          return cachedData.data;
        }
      }
    } catch (e) {
      // Ignore cache errors
    }

    // Deduplicate simultaneous requests
    if (pendingRequests.counters) {
      return pendingRequests.counters;
    }

  try {
    pendingRequests.counters = makeApiRequest('/counter', { method: 'GET' })
      .then(async (response) => {
        if (response.ok) {
          const data = await response.json();
          // Cache the result
          try {
            sessionStorage.setItem(cacheKey, JSON.stringify({
              data,
              timestamp: Date.now(),
            }));
          } catch (e) {
            // Ignore cache errors
          }
          return data;
        }
        return [];
      })
      .catch(async (error) => {
        // If 429 error, return cached data if available
        if (error.message.includes('429') || error.message.includes('Too Many Requests')) {
          try {
            const cached = sessionStorage.getItem(cacheKey);
            if (cached) {
              const cachedData = JSON.parse(cached);
              return cachedData.data || [];
            }
          } catch (e) {
            // Ignore
          }
        }
        throw error;
      })
      .finally(() => {
        pendingRequests.counters = null;
      });

    return await pendingRequests.counters;
  } catch (error) {
    pendingRequests.counters = null;
    
    // Try to return cached data even if expired
    try {
      const cached = sessionStorage.getItem(cacheKey);
      if (cached) {
        const cachedData = JSON.parse(cached);
        return cachedData.data || [];
      }
    } catch (e) {
      // Ignore
    }
    
    return [];
  }
};

/**
 * Fetch visitors with caching and request deduplication
 */
const fetchVisitors = async () => {
  // Check cache first
  const cacheKey = 'visitors_cache';
    try {
      const cached = sessionStorage.getItem(cacheKey);
      if (cached) {
        const cachedData = JSON.parse(cached);
        const now = Date.now();
        if (cachedData.timestamp && (now - cachedData.timestamp) < COUNTER_STATS_CACHE_DURATION) {
          return cachedData.data;
        }
      }
    } catch (e) {
      // Ignore cache errors
    }

    // Deduplicate simultaneous requests
    if (pendingRequests.visitors) {
      return pendingRequests.visitors;
    }

  try {
    pendingRequests.visitors = makeApiRequest('/visitor', { method: 'GET' })
      .then(async (response) => {
        if (response.ok) {
          const data = await response.json();
          // Cache the result
          try {
            sessionStorage.setItem(cacheKey, JSON.stringify({
              data,
              timestamp: Date.now(),
            }));
          } catch (e) {
            // Ignore cache errors
          }
          return data;
        }
        return [];
      })
      .catch(async (error) => {
        // If 429 error, return cached data if available
        if (error.message.includes('429') || error.message.includes('Too Many Requests')) {
          try {
            const cached = sessionStorage.getItem(cacheKey);
            if (cached) {
              const cachedData = JSON.parse(cached);
              return cachedData.data || [];
            }
          } catch (e) {
            // Ignore
          }
        }
        throw error;
      })
      .finally(() => {
        pendingRequests.visitors = null;
      });

    return await pendingRequests.visitors;
  } catch (error) {
    pendingRequests.visitors = null;
    
    // Try to return cached data even if expired
    try {
      const cached = sessionStorage.getItem(cacheKey);
      if (cached) {
        const cachedData = JSON.parse(cached);
        return cachedData.data || [];
      }
    } catch (e) {
      // Ignore
    }
    
    return [];
  }
};

/**
 * Get counter stats from Xano backend (database only, with caching)
 * Fetches all counter records and calculates totals
 * Unique visitors count comes from backend (count of distinct visitor_id records)
 */
const getCounterStats = async () => {
  try {
    // Fetch both in parallel, but reuse cached/deduplicated requests
    const [counters, visitors] = await Promise.all([
      fetchCounters(),
      fetchVisitors(),
    ]);

    let counterValue = 0;
    let uniqueVisits = 0;
    let totalVisits = 0;

    // Process counters (for likes)
    if (Array.isArray(counters)) {
      counterValue = counters.reduce((sum, counter) => {
        return sum + (counter.value || counter.count || 0);
      }, 0);
    } else if (counters && counters.value !== undefined) {
      counterValue = counters.value || counters.count || 0;
    }

    // Process visitors
    // Unique visitors = count of distinct visitor_id records in database
    if (Array.isArray(visitors)) {
      uniqueVisits = visitors.length; // Each record is a unique visitor
      
      // Total visits = sum of all visit_count from all visitors
      totalVisits = visitors.reduce((sum, visitor) => {
        return sum + (visitor.visit_count || 1); // If visit_count exists, use it; otherwise assume 1
      }, 0);
    } else if (visitors && visitors.length !== undefined) {
      uniqueVisits = visitors.length;
    }

    return {
      totalVisits: totalVisits || counterValue, // Use total visits from visitors, fallback to counter value
      uniqueVisits: uniqueVisits,
      counterValue: counterValue,
    };
  } catch (error) {
    return {
      totalVisits: 0,
      uniqueVisits: 0,
      counterValue: 0,
    };
  }
};

/**
 * Get visitor's database ID (from visitor table)
 * This is the primary key ID that links counter table to visitor table
 */
export const getVisitorDbId = async () => {
  const visitorId = getVisitorId();
  
  // Check if we already have the database ID stored
  const storedDbId = localStorage.getItem(VISITOR_DB_ID_KEY);
  if (storedDbId) {
    return storedDbId;
  }
  
  // If not stored, fetch from database by searching for this visitor_id
  try {
    const visitors = await fetchVisitors();
    if (Array.isArray(visitors)) {
      const visitor = visitors.find(v => (v.visitor_id === visitorId) || (v.visitorId === visitorId));
      if (visitor && visitor.id) {
        // Store the database ID for future use
        localStorage.setItem(VISITOR_DB_ID_KEY, visitor.id.toString());
        return visitor.id.toString();
      }
    }
  } catch (error) {
    // Error fetching visitor database ID
  }
  
  return null;
};

/**
 * Record a new visit (POST to /visitor endpoint - database only)
 * Uses sessionStorage to prevent duplicate POSTs in the same session
 * Backend handles unique visitor logic and returns the database ID
 */
export const recordVisit = async () => {
  const visitorId = getVisitorId();
  
  // Check if we've already posted this visit in this session (using sessionStorage)
  // sessionStorage clears when tab closes, so this prevents duplicate POSTs per session
  // Use a more persistent check to prevent counting on page refresh
  const visitPostedKey = `visit_posted_${visitorId}`;
  const visitAlreadyPosted = sessionStorage.getItem(visitPostedKey);
  
  // Also check if we've visited in this browser session (even across page refreshes)
  // This prevents counting multiple times when user refreshes the page
  const sessionVisitKey = `session_visit_${visitorId}`;
  const sessionVisitPosted = sessionStorage.getItem(sessionVisitKey);

  // Only POST if we haven't posted in this session AND haven't posted in this browser session
  if (!visitAlreadyPosted && !sessionVisitPosted) {
    // Mark that we've posted (both keys to prevent refresh counting)
    sessionStorage.setItem(visitPostedKey, 'true');
    sessionStorage.setItem(sessionVisitKey, 'true'); // This persists across page refreshes in same tab
    
    const now = new Date().toISOString();
    
    // POST visitor to database - backend will handle unique visitor logic
    try {
      const response = await makeApiRequest('/visitor', {
        method: 'POST',
        body: JSON.stringify({
          visitor_id: visitorId,
          last_visit_at: now,
        }),
      });
      
      let isNewVisitor = false;
      let visitorDbId = null;
      
      // Check response from backend to get the database ID
      if (response.ok) {
        try {
          const responseData = await response.json();
          // Backend should return { id: 123, is_new_visitor: true/false, visit_count: X }
          // The 'id' is the primary key from visitor table
          visitorDbId = responseData.id || responseData.ID || responseData.db_id;
          isNewVisitor = responseData.is_new_visitor || responseData.isNewVisitor || false;
          
          // Store the database ID for linking to counter table
          if (visitorDbId) {
            localStorage.setItem(VISITOR_DB_ID_KEY, visitorDbId.toString());
          }
        } catch (e) {
          // If response doesn't have JSON, try to get ID from response
          isNewVisitor = true;
        }
      }
      
      // If we didn't get the ID from response, fetch it from database
      if (!visitorDbId) {
        visitorDbId = await getVisitorDbId();
      }
      
      // Clear visitor cache to force refresh (delayed to avoid rate limit)
      setTimeout(() => {
        try {
          sessionStorage.removeItem('visitors_cache');
        } catch (e) {
          // Ignore
        }
      }, 5000);
      
      return {
        isNewVisit: true,
        isNewVisitor: isNewVisitor,
        visitorId,
        visitorDbId, // Return the database ID
      };
    } catch (error) {
      // If rate limited, remove the posted flag so we can retry later
      if (error.message.includes('429') || error.message.includes('Too Many Requests')) {
        sessionStorage.removeItem(visitPostedKey);
        sessionStorage.removeItem(sessionVisitKey);
      }
      return {
        isNewVisit: true,
        isNewVisitor: false,
        visitorId,
        visitorDbId: null,
      };
    }
  }

  // Already posted in this session, but try to get the database ID if we have it
  const visitorDbId = await getVisitorDbId();
  
  return {
    isNewVisit: false,
    isNewVisitor: false,
    visitorId,
    visitorDbId,
  };
};

/**
 * Get visit statistics (from Xano backend database only, optimized)
 */
export const getVisitStats = async () => {
  const visitorId = getVisitorId();
  
  // Fetch both counters and visitors in parallel (reusing cached/deduplicated requests)
  const [counterStats, visitors] = await Promise.all([
    getCounterStats(),
    fetchVisitors(), // Reuses cache/deduplication
  ]);
  
  let latestLastVisit = null;
  let firstVisit = null;
  
  try {
    if (Array.isArray(visitors) && visitors.length > 0) {
      // Find the latest last_visit_at
      const sortedByLastVisit = visitors
        .filter(v => v.last_visit_at)
        .sort((a, b) => new Date(b.last_visit_at) - new Date(a.last_visit_at));
      
      if (sortedByLastVisit.length > 0) {
        latestLastVisit = sortedByLastVisit[0].last_visit_at;
      }
      
      // Find the earliest first visit (or first created visitor)
      const sortedByFirstVisit = visitors
        .filter(v => v.first_visit_at || v.created_at || v.last_visit_at)
        .sort((a, b) => {
          const dateA = new Date(a.first_visit_at || a.created_at || a.last_visit_at);
          const dateB = new Date(b.first_visit_at || b.created_at || b.last_visit_at);
          return dateA - dateB;
        });
      
      if (sortedByFirstVisit.length > 0) {
        firstVisit = sortedByFirstVisit[0].first_visit_at || 
                    sortedByFirstVisit[0].created_at || 
                    sortedByFirstVisit[0].last_visit_at;
      }
    }
  } catch (error) {
    // Error processing visitors data
  }

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

  // Use database stats only
  return {
    totalVisits: counterStats.totalVisits || 0,
    uniqueVisits: counterStats.uniqueVisits || 0,
    lastVisit: latestLastVisit,
    firstVisit: firstVisit,
    visitorId: visitorId,
    formattedLastVisit: formatDate(latestLastVisit),
    formattedFirstVisit: formatDate(firstVisit),
    formattedLastVisitTime: formatTime(latestLastVisit),
  };
};

/**
 * Check if visitor has liked (ALWAYS check database - primary source of truth)
 * Checks if visitor_id (string) exists in counter table via Visitor_1 field
 * Counter table has Visitor_1 field that contains visitor_id string from visitor table
 * This ensures one like per visitor, even after page refresh
 */
export const hasLiked = async (forceFresh = false) => {
  try {
    const visitorId = getVisitorId();
    
    // If forceFresh is true, clear cache to get latest data
    if (forceFresh) {
      try {
        sessionStorage.removeItem('counters_cache');
        pendingRequests.counters = null; // Clear pending request too
      } catch (e) {
        // Ignore
      }
    }
    
    // ALWAYS check database (primary source of truth)
    // Fetch all counter records from database
    const counters = await fetchCounters();
    
    if (Array.isArray(counters) && counters.length > 0) {
      // Check if this visitor_id (string) exists in any counter record via Visitor_1 field
      // Counter table has Visitor_1 field that contains visitor_id string from visitor table
      const hasLikedInDB = counters.some(counter => {
        // Check Visitor_1 field - it should contain the visitor_id string
        const counterVisitorId = counter.Visitor_1 || counter.visitor_1 || counter.Visitor_1_id || 
                                 counter.visitor?.visitor_id || counter.visitor_id;
        // Compare with visitor_id string
        return counterVisitorId === visitorId;
      });
      
      // Update sessionStorage to match database (for quick access, but DB is source of truth)
      const likeSessionKey = `has_liked_${visitorId}`;
      if (hasLikedInDB) {
        sessionStorage.setItem(likeSessionKey, 'true');
      } else {
        sessionStorage.removeItem(likeSessionKey);
      }
      
      return hasLikedInDB;
    }
    
    // If no counters found, check sessionStorage as fallback
    const likeSessionKey = `has_liked_${visitorId}`;
    const cachedLikeStatus = sessionStorage.getItem(likeSessionKey);
    if (cachedLikeStatus === 'true') {
      return true;
    }
    
    return false;
  } catch (error) {
    // Fallback to sessionStorage if database check fails
    const visitorId = getVisitorId();
    const likeSessionKey = `has_liked_${visitorId}`;
    const cachedLikeStatus = sessionStorage.getItem(likeSessionKey);
    return cachedLikeStatus === 'true';
  }
};

/**
 * Get like count (from database only)
 * Sums all counter values from the database
 */
export const getLikeCount = async () => {
  try {
    // Get counter stats from database
    const counterStats = await getCounterStats();
    // Use counter value as likes
    return counterStats.counterValue || counterStats.totalVisits || 0;
  } catch (error) {
    return 0;
  }
};

/**
 * Add a like (POST to /counter endpoint - database only)
 * Sends visitor_id (string) to backend to save in counter table
 * Backend will link counter to visitor table using the visitor_id
 * Ensures one like per visitor, prevents duplicate likes even after refresh
 */
export const addLike = async () => {
  try {
    const visitorId = getVisitorId();

    // Double-check if already liked (check database first)
    const hasLikedAlready = await hasLiked();
    if (hasLikedAlready) {
      const currentTotal = await getLikeCount();
      return {
        success: false,
        message: 'You have already liked this portfolio',
        totalLikes: currentTotal,
      };
    }

    // POST counter to database
    // Use visitor_id (string) from visitor table, not the database ID
    // Counter table has "Visitor_1" field that should contain the visitor_id string
    // Make sure visitor record exists first
    const visitInfo = await recordVisit();
    
    // POST counter to database with Visitor_1 field containing visitor_id string
    // Visitor_1 should be the visitor_id (string) from visitor table, not the database ID
    const requestBody = {
      Visitor_1: visitorId, // Use visitor_id string (unique identifier from visitor table)
    };
    
    const response = await makeApiRequest('/counter', {
      method: 'POST',
      body: JSON.stringify(requestBody),
    });

    if (response && response.ok) {
      // Mark as liked in sessionStorage
      const likeSessionKey = `has_liked_${visitorId}`;
      sessionStorage.setItem(likeSessionKey, 'true');
      
      // Clear counter cache IMMEDIATELY to force fresh data on next check
      try {
        sessionStorage.removeItem('counters_cache');
        // Also clear the pending request if any
        pendingRequests.counters = null;
      } catch (e) {
        // Ignore
      }
      
      // Get updated total from database (will fetch fresh data)
      const totalLikes = await getLikeCount();

      return {
        success: true,
        message: 'Thank you for your like!',
        totalLikes: totalLikes,
      };
    } else {
      // Get detailed error message from response
      let errorData = {};
      let errorMessage = `API returned ${response.status}`;
      
      try {
        const responseText = await response.text();
        
        try {
          errorData = JSON.parse(responseText);
          errorMessage = errorData.message || errorData.error || errorData.msg || responseText;
        } catch (e) {
          errorMessage = responseText || errorMessage;
        }
      } catch (e) {
        // Could not parse error response
      }
      
      // If backend says already liked, update sessionStorage
      if (response.status === 400 || response.status === 409 || 
          errorMessage.includes('already') || errorMessage.includes('duplicate')) {
        const likeSessionKey = `has_liked_${visitorId}`;
        sessionStorage.setItem(likeSessionKey, 'true');
      }
      
      throw new Error(errorMessage);
    }
  } catch (error) {
    // If error says already liked, mark in sessionStorage
    if (error.message.includes('already') || error.message.includes('409') || 
        error.message.includes('duplicate')) {
      const visitorId = getVisitorId();
      const likeSessionKey = `has_liked_${visitorId}`;
      sessionStorage.setItem(likeSessionKey, 'true');
    }
    
    // Try to get current total even on error
    try {
      const currentTotal = await getLikeCount();
      return {
        success: false,
        message: (error.message.includes('already') || error.message.includes('duplicate'))
          ? 'You have already liked this portfolio' 
          : `Error adding like: ${error.message}`,
        totalLikes: currentTotal,
      };
    } catch (e) {
      return {
        success: false,
        message: `Error adding like: ${error.message}`,
        totalLikes: 0,
      };
    }
  }
};

/**
 * Export database as JSON file (downloads data from database)
 */
export const exportDatabase = async () => {
  try {
    // Fetch all data from database
    const [counterResponse, visitorResponse] = await Promise.all([
      makeApiRequest('/counter', { method: 'GET' }),
      makeApiRequest('/visitor', { method: 'GET' }),
    ]);

    const counters = counterResponse.ok ? await counterResponse.json() : [];
    const visitors = visitorResponse.ok ? await visitorResponse.json() : [];

    const exportData = {
      counters: Array.isArray(counters) ? counters : [],
      visitors: Array.isArray(visitors) ? visitors : [],
      exportedAt: new Date().toISOString(),
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
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
    alert('Error exporting database from server.');
  }
};

/**
 * Check if counter API is configured
 */
export const isCounterDevConfigured = () => {
  return !!API_BASE_URL && API_BASE_URL !== '';
};

