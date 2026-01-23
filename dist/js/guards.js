// Route Guards for Starland Water Company System
// Provides role-based access control and route protection

class RouteGuards {
  constructor() {
    this.currentUser = null;
    this.initialize();
  }

  initialize() {
    // Load current user from storage
    this.loadCurrentUser();
    
    // Add beforeunload listener to maintain session
    window.addEventListener('beforeunload', () => {
      this.saveCurrentUser();
    });
  }

  loadCurrentUser() {
    const userStr = localStorage.getItem('currentUser');
    if (userStr) {
      this.currentUser = JSON.parse(userStr);
    }
  }

  saveCurrentUser() {
    if (this.currentUser) {
      localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
    }
  }

  // Check if user is authenticated
  isAuthenticated() {
    return this.currentUser !== null;
  }

  // Get current user role
  getUserRole() {
    return this.currentUser?.user_metadata?.role || null;
  }

  // Get current user info
  getCurrentUser() {
    return this.currentUser;
  }

  // Set current user
  setCurrentUser(user) {
    this.currentUser = user;
    this.saveCurrentUser();
  }

  // Clear current user
  clearCurrentUser() {
    this.currentUser = null;
    localStorage.removeItem('currentUser');
  }

  // Role-based access control
  hasRole(requiredRole) {
    const userRole = this.getUserRole();
    if (!userRole) return false;

    // Define role hierarchy - management now has admin privileges
    const roleHierarchy = {
      'entry': 1,
      'management': 3,  // Management now has highest privilege
      'admin': 2        // Admin role kept for backward compatibility but with lower priority
    };

    // Management can now access everything (they have admin privileges)
    if (userRole === 'management') return true;
    
    // Admin can access everything too (maintaining backward compatibility)
    if (userRole === 'admin') return true;

    // Check if user's role meets or exceeds required role
    return roleHierarchy[userRole] >= roleHierarchy[requiredRole];
  }

  // Route protection based on roles
  protectRoute(route) {
    const userRole = this.getUserRole();
    
    if (!userRole) {
      // Not authenticated
      this.redirectToLogin();
      return false;
    }

    // Define route access rules - management has full access to all areas
    const routeRules = {
      '/entry/': ['management', 'entry']
    };

    // Check against route rules
    for (const [routePattern, allowedRoles] of Object.entries(routeRules)) {
      if (route.includes(routePattern)) {
        // Management users have admin privileges, so allow them access to all routes
        if (!allowedRoles.includes(userRole) && userRole !== 'management') {
          // Access denied
          this.handleAccessDenied();
          return false;
        }
        break;
      }
    }

    return true;
  }

  // Navigation guard for links
  protectNavigation(linkElement) {
    linkElement.addEventListener('click', (e) => {
      const href = linkElement.getAttribute('href');
      
      if (!this.protectRoute(href)) {
        e.preventDefault();
        return false;
      }
    });
  }

  // Protect all navigation links on page
  protectAllNavigation() {
    const navLinks = document.querySelectorAll('a[href]');
    navLinks.forEach(link => {
      this.protectNavigation(link);
    });
  }

  // Handle access denied
  handleAccessDenied() {
    alert('Access denied. You do not have permission to access this page.');
    this.redirectToDashboard();
  }

  // Redirect to login
  redirectToLogin() {
    window.location.href = 'index.html';
  }

  // Redirect to appropriate dashboard
  redirectToDashboard() {
    const userRole = this.getUserRole();
    
    if (!userRole) {
      this.redirectToLogin();
      return;
    }

    let redirectUrl;
    switch (userRole) {
      case 'admin':
      case 'management':
        // Both admin and management roles now go to management dashboard
        redirectUrl = 'management/dashboard.html';
        break;
      case 'entry':
      default:
        redirectUrl = 'entry/sales.html';
        break;
    }

    window.location.href = redirectUrl;
  }

  // Validate form submissions based on role
  validateFormAccess(formId) {
    const userRole = this.getUserRole();
    if (!userRole) return false;

    // For demo purposes, allow all roles to submit forms
    // In a real app, you might have more granular controls
    return true;
  }

  // Check if user can perform CRUD operations
  canCreate(resource) {
    return this.hasPermission('create', resource);
  }

  canRead(resource) {
    return this.hasPermission('read', resource);
  }

  canUpdate(resource) {
    return this.hasPermission('update', resource);
  }

  canDelete(resource) {
    return this.hasPermission('delete', resource);
  }

  hasPermission(action, resource) {
    const userRole = this.getUserRole();
    if (!userRole) return false;

    // Define permissions matrix - management now has admin privileges
    const permissions = {
      'management': {
        'sales': ['create', 'read', 'update', 'delete'],
        'expenses': ['create', 'read', 'update', 'delete'],
        'diesel': ['create', 'read', 'update', 'delete'],
        'repairs': ['create', 'read', 'update', 'delete'],
        'damages': ['create', 'read', 'update', 'delete'],
        'users': ['create', 'read', 'update', 'delete'],
        'reports': ['create', 'read', 'update', 'delete']
      },
      'admin': {
        'sales': ['create', 'read', 'update', 'delete'],
        'expenses': ['create', 'read', 'update', 'delete'],
        'diesel': ['create', 'read', 'update', 'delete'],
        'repairs': ['create', 'read', 'update', 'delete'],
        'damages': ['create', 'read', 'update', 'delete'],
        'users': ['create', 'read', 'update', 'delete'],
        'reports': ['create', 'read', 'update', 'delete']
      },
      'entry': {
        'sales': ['create', 'read'],
        'expenses': ['create', 'read'],
        'diesel': ['create', 'read'],
        'repairs': ['create', 'read'],
        'damages': ['create', 'read'],
        'users': [],
        'reports': []
      }
    };

    const rolePermissions = permissions[userRole];
    if (!rolePermissions) return false;

    const resourcePermissions = rolePermissions[resource];
    if (!resourcePermissions) return false;

    return resourcePermissions.includes(action);
  }

  // Initialize guards for the current page
  initPageGuards() {
    // Check if global system integration is available
    if (window.SystemIntegration) {
      // Use the integrated system for initialization
      window.SystemIntegration.initialize()
        .then(() => {
          // Protect routes
          const currentPath = window.location.pathname;
          if (!this.protectRoute(currentPath)) {
            return;
          }

          // Protect navigation
          this.protectAllNavigation();

          // Add role indicator to UI
          this.addRoleIndicator();
        })
        .catch(error => {
          console.error('Error initializing integrated system:', error);
          // Fallback to original behavior
          this.initPageGuardsFallback();
        });
    } else {
      // Fallback to original behavior
      this.initPageGuardsFallback();
    }
  }

  // Fallback initialization method
  initPageGuardsFallback() {
    // Protect routes
    const currentPath = window.location.pathname;
    if (!this.protectRoute(currentPath)) {
      return;
    }

    // Protect navigation
    this.protectAllNavigation();

    // Add role indicator to UI
    this.addRoleIndicator();
  }

  // Add role indicator to the UI
  addRoleIndicator() {
    if (!this.isAuthenticated()) return;

    const role = this.getUserRole();
    const roleElement = document.createElement('div');
    roleElement.className = 'role-badge';
    roleElement.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 5px 10px;
      border-radius: 15px;
      font-size: 12px;
      font-weight: bold;
      z-index: 10000;
      text-transform: uppercase;
    `;

    // Style based on role
    switch (role) {
      case 'admin':
        roleElement.style.backgroundColor = '#7c3aed';
        roleElement.style.color = 'white';
        roleElement.textContent = 'ADMIN';
        break;
      case 'management':
        roleElement.style.backgroundColor = '#2563eb';
        roleElement.style.color = 'white';
        roleElement.textContent = 'MANAGEMENT';
        break;
      case 'entry':
        roleElement.style.backgroundColor = '#059669';
        roleElement.style.color = 'white';
        roleElement.textContent = 'ENTRY';
        break;
      default:
        roleElement.style.backgroundColor = '#6b7280';
        roleElement.style.color = 'white';
        roleElement.textContent = 'GUEST';
    }

    document.body.appendChild(roleElement);
  }
}

// Create a global instance
const guards = new RouteGuards();

// Initialize guards when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  guards.initPageGuards();
});

// Export for use in other modules
window.RouteGuards = RouteGuards;
window.guards = guards;