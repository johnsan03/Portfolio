import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window === 'undefined') return false;
    
    try {
      // First, check if data-theme is already set by the inline script
      const htmlTheme = document.documentElement.getAttribute('data-theme');
      if (htmlTheme === 'dark' || htmlTheme === 'light') {
        return htmlTheme === 'dark';
      }
      
      // Then check localStorage
      const saved = localStorage.getItem('theme');
      if (saved === 'dark' || saved === 'light') {
        return saved === 'dark';
      }
      
      // Finally, check system preference
      if (window.matchMedia) {
        try {
          return window.matchMedia('(prefers-color-scheme: dark)').matches;
        } catch (e) {
          return false;
        }
      }
      
      return false;
    } catch (e) {
      return false;
    }
  });

  // CRITICAL: Apply theme immediately on mount, before any render
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const applyTheme = () => {
      try {
        const theme = isDark ? 'dark' : 'light';
        const html = document.documentElement;
        
        // Update HTML attribute
        html.setAttribute('data-theme', theme);
        
        // Update localStorage
        try {
          localStorage.setItem('theme', theme);
        } catch (e) {
          // localStorage might be disabled
        }
        
        // Update color-scheme for browser UI
        try {
          html.style.colorScheme = theme;
          html.style.setProperty('color-scheme', theme, 'important');
        } catch (e) {
          // Some browsers might not support this
        }
        
        // Force style recalculation
        void html.offsetHeight;
      } catch (e) {
        console.error('Error applying theme:', e);
      }
    };
    
    // Apply immediately
    applyTheme();
  }, [isDark]);

  // Listen for system theme changes (optional - can be enabled if needed)
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    
    try {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = (e) => {
        // Only auto-switch if user hasn't manually set a preference
        const saved = localStorage.getItem('theme');
        if (!saved) {
          setIsDark(e.matches);
        }
      };
      
      // Modern browsers
      if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
      }
      // Legacy browsers
      else if (mediaQuery.addListener) {
        mediaQuery.addListener(handleChange);
        return () => mediaQuery.removeListener(handleChange);
      }
    } catch (e) {
      // Silently fail if matchMedia is not supported
    }
  }, []);

  const toggleTheme = () => {
    setIsDark(prev => {
      const newValue = !prev;
      // Immediately apply theme change synchronously
      try {
        const theme = newValue ? 'dark' : 'light';
        const html = document.documentElement;
        html.setAttribute('data-theme', theme);
        html.style.colorScheme = theme;
        html.style.setProperty('color-scheme', theme, 'important');
        localStorage.setItem('theme', theme);
        void html.offsetHeight; // Force reflow
      } catch (e) {
        console.error('Error toggling theme:', e);
      }
      return newValue;
    });
  };

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

