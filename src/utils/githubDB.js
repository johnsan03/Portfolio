/**
 * GitHub Pages Database Utility
 * Uses GitHub API to read/write a JSON file in the repository
 * Falls back to localStorage if GitHub API is unavailable
 */

const GITHUB_REPO = import.meta.env.VITE_GITHUB_REPO || 'your-username/your-repo';
const GITHUB_TOKEN = import.meta.env.VITE_GITHUB_TOKEN || '';
const DB_FILE_PATH = 'database.json';
const DB_BRANCH = 'main'; // or 'master' depending on your default branch

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
 * Read database from GitHub file
 */
const readFromGitHub = async () => {
  if (!GITHUB_TOKEN || !GITHUB_REPO || GITHUB_REPO === 'your-username/your-repo') {
    throw new Error('GitHub configuration not set');
  }

  // Validate token format
  if (!GITHUB_TOKEN.startsWith('ghp_') && !GITHUB_TOKEN.startsWith('github_pat_')) {
    console.warn('GitHub token format may be incorrect. Should start with "ghp_" or "github_pat_"');
  }

  try {
    const url = `https://api.github.com/repos/${GITHUB_REPO}/contents/${DB_FILE_PATH}?ref=${DB_BRANCH}`;
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${GITHUB_TOKEN}`, // Use Bearer instead of token
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'Portfolio-App', // GitHub API requires User-Agent
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        // File doesn't exist yet, return default
        return getDefaultDatabase();
      }
      
      // Handle authentication errors
      if (response.status === 401) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`GitHub authentication failed: ${errorData.message || 'Invalid token or insufficient permissions'}. Please check your VITE_GITHUB_TOKEN in .env file.`);
      }
      
      if (response.status === 403) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`GitHub API forbidden: ${errorData.message || 'Token may not have required permissions (repo scope)'}.`);
      }
      
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`GitHub API error (${response.status}): ${errorData.message || response.statusText}`);
    }

    const data = await response.json();
    const content = atob(data.content.replace(/\s/g, '')); // Decode base64
    return JSON.parse(content);
  } catch (error) {
    console.error('Error reading from GitHub:', error);
    throw error;
  }
};

/**
 * Write database to GitHub file
 */
const writeToGitHub = async (db, sha = null) => {
  if (!GITHUB_TOKEN || !GITHUB_REPO || GITHUB_REPO === 'your-username/your-repo') {
    throw new Error('GitHub configuration not set');
  }

  // Validate token format
  if (!GITHUB_TOKEN.startsWith('ghp_') && !GITHUB_TOKEN.startsWith('github_pat_')) {
    console.warn('GitHub token format may be incorrect. Should start with "ghp_" or "github_pat_"');
  }

  try {
    db.metadata.lastUpdated = new Date().toISOString();
    const content = JSON.stringify(db, null, 2);
    const encodedContent = btoa(unescape(encodeURIComponent(content)));

    const url = `https://api.github.com/repos/${GITHUB_REPO}/contents/${DB_FILE_PATH}`;
    const body = {
      message: `Update database - ${new Date().toISOString()}`,
      content: encodedContent,
      branch: DB_BRANCH,
    };

    if (sha) {
      body.sha = sha; // Required for updates
    }

    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${GITHUB_TOKEN}`, // Use Bearer instead of token
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
        'User-Agent': 'Portfolio-App', // GitHub API requires User-Agent
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      // Handle authentication errors
      if (response.status === 401) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`GitHub authentication failed: ${errorData.message || 'Invalid token or insufficient permissions'}. Please check your VITE_GITHUB_TOKEN in .env file.`);
      }
      
      if (response.status === 403) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`GitHub API forbidden: ${errorData.message || 'Token may not have required permissions (repo scope)'}.`);
      }
      
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`GitHub API error (${response.status}): ${errorData.message || response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error writing to GitHub:', error);
    throw error;
  }
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
 * Read database (try GitHub first, fallback to localStorage)
 */
export const readDatabase = async () => {
  try {
    // Try GitHub first
    const db = await readFromGitHub();
    // Sync to localStorage as backup
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(db));
    return db;
  } catch (error) {
    console.warn('GitHub read failed, using localStorage:', error);
    // Fallback to localStorage
    const local = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (local) {
      return JSON.parse(local);
    }
    return getDefaultDatabase();
  }
};

/**
 * Write database (try GitHub first, fallback to localStorage)
 */
export const writeDatabase = async (db) => {
  try {
    // Try to get existing file SHA for updates
    let sha = null;
    try {
      const url = `https://api.github.com/repos/${GITHUB_REPO}/contents/${DB_FILE_PATH}?ref=${DB_BRANCH}`;
      const response = await fetch(url, {
        headers: {
          'Authorization': `token ${GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github.v3+json',
        },
      });
      if (response.ok) {
        const data = await response.json();
        sha = data.sha;
      }
    } catch (e) {
      // File doesn't exist, will create new
    }

    await writeToGitHub(db, sha);
    // Also save to localStorage as backup
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(db));
    return true;
  } catch (error) {
    console.warn('GitHub write failed, using localStorage:', error);
    // Fallback to localStorage
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(db));
      return true;
    } catch (e) {
      console.error('Failed to save to localStorage:', e);
      return false;
    }
  }
};

/**
 * Record a new visit
 */
export const recordVisit = async () => {
  const visitorId = getVisitorId();
  
  // Check if this is a new session
  const sessionKey = `portfolio_session_${visitorId}`;
  const hasSession = sessionStorage.getItem(sessionKey);

  if (!hasSession) {
    try {
      const db = await readDatabase();
      const now = new Date().toISOString();
      const isNewVisitor = !db.visits.visitors[visitorId];

      // Increment total visits
      db.visits.totalVisits += 1;

      // Handle unique visitors
      if (isNewVisitor) {
        db.visits.uniqueVisits += 1;
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

      await writeDatabase(db);
      sessionStorage.setItem(sessionKey, 'true');

      return {
        isNewVisit: true,
        isNewVisitor: isNewVisitor,
        visitorId,
      };
    } catch (error) {
      console.error('Error recording visit:', error);
      sessionStorage.setItem(sessionKey, 'true');
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
 * Get visit statistics
 */
export const getVisitStats = async () => {
  try {
    const db = await readDatabase();
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

    return {
      totalVisits: db.visits.totalVisits,
      uniqueVisits: db.visits.uniqueVisits,
      lastVisit: db.visits.lastVisit,
      firstVisit: db.visits.firstVisit,
      visitorId: visitorId,
      formattedLastVisit: formatDate(db.visits.lastVisit),
      formattedFirstVisit: formatDate(db.visits.firstVisit),
      formattedLastVisitTime: formatTime(db.visits.lastVisit),
    };
  } catch (error) {
    console.error('Error getting visit stats:', error);
    return {
      totalVisits: 0,
      uniqueVisits: 0,
      lastVisit: null,
      firstVisit: null,
      visitorId: getVisitorId(),
      formattedLastVisit: 'N/A',
      formattedFirstVisit: 'N/A',
      formattedLastVisitTime: 'N/A',
    };
  }
};

/**
 * Check if visitor has liked
 */
export const hasLiked = async () => {
  try {
    const db = await readDatabase();
    const visitorId = getVisitorId();
    return db.likes.likedVisitors[visitorId] || false;
  } catch (error) {
    console.error('Error checking like status:', error);
    return false;
  }
};

/**
 * Get like count
 */
export const getLikeCount = async () => {
  try {
    const db = await readDatabase();
    return db.likes.totalLikes || 0;
  } catch (error) {
    console.error('Error getting like count:', error);
    return 0;
  }
};

/**
 * Add a like (only if visitor hasn't liked before)
 */
export const addLike = async () => {
  try {
    const db = await readDatabase();
    const visitorId = getVisitorId();

    // Check if already liked
    if (db.likes.likedVisitors[visitorId]) {
      return {
        success: false,
        message: 'You have already liked this portfolio',
        totalLikes: db.likes.totalLikes,
      };
    }

    // Add like
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

    const saved = await writeDatabase(db);

    return {
      success: saved,
      message: saved ? 'Thank you for your like!' : 'Error saving like',
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
 * Export database as JSON file (downloads current database)
 */
export const exportDatabase = async () => {
  try {
    const db = await readDatabase();
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
 * Check if GitHub is configured
 */
export const isGitHubConfigured = () => {
  return !!(GITHUB_TOKEN && GITHUB_REPO && GITHUB_REPO !== 'your-username/your-repo');
};

