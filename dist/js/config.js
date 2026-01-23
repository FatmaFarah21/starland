// Global Configuration for Starland Water Company System
// This file contains global settings and connection points for all system components

// Global event bus for cross-component communication
class EventBus {
  constructor() {
    this.events = {};
  }

  emit(event, data) {
    if (this.events[event]) {
      this.events[event].forEach(callback => callback(data));
    }
  }

  on(event, callback) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(callback);
  }

  off(event, callback) {
    if (this.events[event]) {
      this.events[event] = this.events[event].filter(cb => cb !== callback);
    }
  }
}

// Create global event bus
window.globalEventBus = new EventBus();

// Global state management
window.AppState = {
  currentUser: null,
  userRole: null,
  isLoggedIn: false,
  initialized: false,
  
  async initialize() {
    try {
      // Check if user is authenticated
      this.isLoggedIn = await window.supabaseAuth.isAuthenticated();
      
      if (this.isLoggedIn) {
        this.currentUser = await window.supabaseAuth.getCurrentUser();
        this.userRole = await window.supabaseAuth.getUserRole();
      }
      
      this.initialized = true;
      
      // Emit initialization complete event
      window.globalEventBus.emit('appInitialized', {
        isLoggedIn: this.isLoggedIn,
        userRole: this.userRole,
        currentUser: this.currentUser
      });
    } catch (error) {
      console.error('Error initializing app state:', error);
    }
  },
  
  async setCurrentUser(user, role) {
    this.currentUser = user;
    this.userRole = role;
    this.isLoggedIn = !!user;
    
    // Emit user change event
    window.globalEventBus.emit('userChanged', {
      user: this.currentUser,
      role: this.userRole,
      isLoggedIn: this.isLoggedIn
    });
  },
  
  async logout() {
    const success = await window.supabaseAuth.signOut();
    if (success) {
      this.currentUser = null;
      this.userRole = null;
      this.isLoggedIn = false;
      
      // Emit logout event
      window.globalEventBus.emit('userLoggedOut');
    }
    return success;
  }
};

// Global utility functions
window.GlobalUtils = {
  // Navigation with role-based access
  navigateTo(path) {
    const userRole = window.AppState.userRole;
    
    // Define role-based access rules
    const accessRules = {
      '/management/': ['management'],
      '/entry/': ['management', 'entry']
    };
    
    // Check if path requires specific role
    let hasAccess = true;
    for (const [route, allowedRoles] of Object.entries(accessRules)) {
      if (path.startsWith(route) && userRole && !allowedRoles.includes(userRole)) {
        hasAccess = false;
        break;
      }
    }
    
    if (hasAccess) {
      window.location.href = path;
    } else {
      alert('Access denied. You do not have permission to access this page.');
      // Redirect to appropriate dashboard based on role
      this.redirectBasedOnRole();
    }
  },
  
  // Redirect user based on their role
  redirectBasedOnRole() {
    const userRole = window.AppState.userRole;
    
    if (!userRole) {
      // Not logged in, redirect to login
      window.location.href = '../index.html';
      return;
    }
    
    switch (userRole) {
      case 'admin':
        window.location.href = 'admin/dashboard.html';
        break;
      case 'management':
        window.location.href = 'management/dashboard.html';
        break;
      case 'entry':
        window.location.href = 'entry/sales.html';
        break;
      default:
        window.location.href = '../index.html';
    }
  },
  
  // Format currency
  formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'KES', // Kenyan Shilling
      minimumFractionDigits: 2
    }).format(amount);
  },
  
  // Format date
  formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  },
  
  // Show notification
  showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 15px 20px;
      border-radius: 5px;
      color: white;
      font-weight: bold;
      z-index: 10000;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      animation: slideIn 0.3s ease-out;
    `;
    
    // Add type-specific styling
    switch(type) {
      case 'success':
        notification.style.backgroundColor = '#10b981';
        break;
      case 'error':
        notification.style.backgroundColor = '#ef4444';
        break;
      case 'warning':
        notification.style.backgroundColor = '#f59e0b';
        break;
      default:
        notification.style.backgroundColor = '#3b82f6';
    }
    
    document.body.appendChild(notification);
    
    // Remove notification after 5 seconds
    setTimeout(() => {
      if (notification.parentNode) {
        notification.remove();
      }
    }, 5000);
  },
  
  // Debounce function
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
};

// Initialize app state when DOM is ready
document.addEventListener('DOMContentLoaded', async function() {
  await window.AppState.initialize();
  
  // Set up global event listeners
  window.globalEventBus.on('userLoggedOut', () => {
    window.GlobalUtils.showNotification('You have been logged out successfully.', 'success');
    setTimeout(() => {
      window.location.href = '../index.html';
    }, 1000);
  });
  
  window.globalEventBus.on('userChanged', (data) => {
    if (data.isLoggedIn) {
      // Update UI elements based on user role
      const userDisplayElements = document.querySelectorAll('.user-display');
      userDisplayElements.forEach(el => {
        el.textContent = data.user?.email || 'User';
      });
      
      const roleDisplayElements = document.querySelectorAll('.role-display');
      roleDisplayElements.forEach(el => {
        el.textContent = data.role || 'Guest';
      });
    }
  });
});

// Add CSS for notifications
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  .notification {
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 15px 20px;
    border-radius: 5px;
    color: white;
    font-weight: bold;
    z-index: 10000;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    animation: slideIn 0.3s ease-out;
  }
`;
document.head.appendChild(style);

// Export for use in other modules
window.SystemIntegration = {
  eventBus: window.globalEventBus,
  state: window.AppState,
  utils: window.GlobalUtils,
  
  // Initialize the integrated system
  async initialize() {
    console.log('Initializing integrated system...');
    
    // Wait for app state to be initialized
    if (!window.AppState.initialized) {
      await new Promise(resolve => {
        const checkInitialized = () => {
          if (window.AppState.initialized) {
            resolve();
          } else {
            setTimeout(checkInitialized, 100);
          }
        };
        checkInitialized();
      });
    }
    
    console.log('Integrated system initialized successfully');
    return true;
  },
  
  // Check if user has required role
  hasRole(requiredRole) {
    const userRole = window.AppState.userRole;
    if (!userRole) return false;
    
    // Define role hierarchy - management now has admin privileges
    const roleHierarchy = {
      'management': 3,  // Management now has highest privilege
      'admin': 2,     // Admin kept for backward compatibility
      'entry': 1
    };
    
    const requiredLevel = roleHierarchy[requiredRole] || 0;
    const userLevel = roleHierarchy[userRole] || 0;
    
    return userLevel >= requiredLevel;
  },
  
  // Guard navigation based on role
  guardNavigation(requiredRole) {
    if (!this.hasRole(requiredRole)) {
      window.GlobalUtils.showNotification('Access denied. Insufficient permissions.', 'error');
      window.GlobalUtils.redirectBasedOnRole();
      return false;
    }
    return true;
  }
};

// Make sure all necessary scripts are loaded before initializing
window.addEventListener('load', async function() {
  if (window.SystemIntegration) {
    await window.SystemIntegration.initialize();
  }
});