// Authentication Logic for Starland Water Company System
// Handles login, logout, and role-based routing

document.addEventListener('DOMContentLoaded', function() {
  // Check if we're on the login page
  if (window.location.pathname.includes('index.html') || 
      window.location.pathname.endsWith('/')) {
    setupLoginPage();
  } else {
    // For all other pages, check authentication
    checkAuthentication();
  }
});

// Set up login page functionality
function setupLoginPage() {
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');
  const showRegisterLink = document.getElementById('showRegisterForm');
  const showLoginButton = document.getElementById('showLoginForm');
  
  if (loginForm) {
    loginForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      
      // Authenticate with Supabase
      simulateLogin(email, password);
    });
  }
  
  // Show registration form
  if (showRegisterLink) {
    showRegisterLink.addEventListener('click', function(e) {
      e.preventDefault();
      loginForm.style.display = 'none';
      registerForm.style.display = 'block';
    });
  }
  
  // Show login form
  if (showLoginButton) {
    showLoginButton.addEventListener('click', function(e) {
      e.preventDefault();
      registerForm.style.display = 'none';
      loginForm.style.display = 'block';
    });
  }
  
  // Add troubleshooting modal functionality
  const troubleshootLink = document.createElement('p');
  troubleshootLink.innerHTML = '<a href="#" id="showTroubleshooting">Having trouble logging in?</a>';
  troubleshootLink.style.textAlign = 'center';
  troubleshootLink.style.marginTop = '1rem';
  
  const loginContainer = document.querySelector('.login-form');
  loginContainer.appendChild(troubleshootLink);
  
  document.getElementById('showTroubleshooting').addEventListener('click', function(e) {
    e.preventDefault();
    
    // Populate troubleshooting instructions
    const instructionsDiv = document.getElementById('setupInstructions');
    if (instructionsDiv) {
      instructionsDiv.innerHTML = window.supabaseAuth.getSetupInstructions().replace(/\n/g, '<br>');
    }
    
    // Show modal
    document.getElementById('troubleshootingModal').style.display = 'block';
  });
  
  // Close modal functionality
  document.getElementById('closeModal').addEventListener('click', function() {
    document.getElementById('troubleshootingModal').style.display = 'none';
  });
  
  // Close modal when clicking outside the content
  window.addEventListener('click', function(event) {
    const modal = document.getElementById('troubleshootingModal');
    if (event.target === modal) {
      modal.style.display = 'none';
    }
  });
  
  // Test connection button functionality
  const testConnectionBtn = document.getElementById('testConnection');
  if (testConnectionBtn) {
    testConnectionBtn.addEventListener('click', async function(e) {
      e.preventDefault();
      
      // Check if Supabase client is available
      if (!window.supabaseClient) {
        console.error('Supabase client not available. Check that supabase.js loaded correctly.');
        alert('Application not properly initialized. Please refresh the page and try again.');
        return;
      }
      
      alert('Testing Supabase connection... Please check the browser console for results.');
      
      const result = await window.supabaseAuth.testConnection();
      
      if (result.success) {
        console.log('✅ Supabase connection successful!');
        alert('✅ Supabase connection successful! The client can communicate with your Supabase project.');
      } else {
        console.error('❌ Supabase connection failed!', result.error);
        alert('❌ Supabase connection failed! Please check the console for error details and verify your Supabase configuration.');
      }
    });
  }
  
  // Handle registration form submission
  if (registerForm) {
    registerForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      
      const email = document.getElementById('regEmail').value;
      const password = document.getElementById('regPassword').value;
      const confirmPassword = document.getElementById('regConfirmPassword').value;
      const role = document.getElementById('userRole').value;
      
      // Validate passwords match
      if (password !== confirmPassword) {
        alert('Passwords do not match!');
        return;
      }
      
      // Validate password strength
      if (password.length < 6) {
        alert('Password must be at least 6 characters long!');
        return;
      }
      
      // Register with Supabase
      await registerUser(email, password, role);
    });
  }
}

// Register a new user with Supabase
async function registerUser(email, password, role) {
  // Check if Supabase client is available
  if (!window.supabaseClient) {
    console.error('Supabase client not available. Check that supabase.js loaded correctly.');
    alert('Application not properly initialized. Please refresh the page and try again.');
    return;
  }
  // Show loading state
  const submitButton = document.querySelector('#registerForm button[type="submit"]');
  const originalText = submitButton.textContent;
  submitButton.textContent = 'Creating account...';
  submitButton.disabled = true;
  
  try {
    // Register user with Supabase
    const { data, error } = await window.supabaseClient.auth.signUp({
      email,
      password,
      options: {
        data: {
          role: role
        }
      }
    });
    
    if (error) {
      console.error('Registration error:', error);
      
      // Provide more specific error messages
      let errorMessage = 'Registration failed.';
      if (error.message.includes('User already registered')) {
        errorMessage = 'A user with this email already exists.';
      } else {
        errorMessage += ` ${error.message}`;
      }
      
      alert(errorMessage);
      return;
    }
    
    // Check if user needs email confirmation
    if (data.user && !data.session) {
      alert('Account created! Please check your email for confirmation. Once confirmed, you can log in.');
      
      // Show login form after successful registration
      document.getElementById('registerForm').style.display = 'none';
      document.getElementById('loginForm').style.display = 'block';
    } else if (data.session) {
      // User is automatically logged in (this only happens if email confirmation is disabled)
      const user = data.user;
      
      // Store user in localStorage for UI purposes
      localStorage.setItem('currentUser', JSON.stringify({
        id: user.id,
        email: user.email,
        user_metadata: { role }
      }));
      
      // Redirect to appropriate dashboard based on role
      redirectToDashboard(role);
    }
  } catch (error) {
    console.error('Registration error:', error);
    alert('Registration failed. Please check the console for more details and verify your Supabase configuration.');
  } finally {
    // Reset button state
    submitButton.textContent = originalText;
    submitButton.disabled = false;
  }
}

// Actual login function using Supabase authentication
async function simulateLogin(email, password) {
  // Check if Supabase client is available
  if (!window.supabaseClient) {
    console.error('Supabase client not available. Check that supabase.js loaded correctly.');
    alert('Application not properly initialized. Please refresh the page and try again.');
    return;
  }
  // Show loading state
  const submitButton = document.querySelector('#loginForm button[type="submit"]');
  const originalText = submitButton.textContent;
  submitButton.textContent = 'Logging in...';
  submitButton.disabled = true;
  
  try {
    // Use Supabase to authenticate the user
    const { data, error } = await window.supabaseClient.auth.signInWithPassword({
      email: email,
      password: password
    });
    
    if (error) {
      console.error('Login error:', error);
      
      // Provide more specific error messages
      let errorMessage = 'Login failed.';
      if (error.message.includes('Invalid login credentials')) {
        errorMessage = 'Invalid email or password. Please try again.';
      } else if (error.message.includes('Email not confirmed')) {
        errorMessage = 'Email not confirmed. Please check your email for confirmation instructions.';
      } else {
        errorMessage += ` ${error.message}`;
      }
      
      alert(errorMessage);
      return;
    }
    
    // Get user data from the session
    const user = data.user;
    
    // Determine user role based on email or custom claims
    const role = await window.supabaseAuth.getUserRole();
    
    // Store user in localStorage for UI purposes
    localStorage.setItem('currentUser', JSON.stringify({
      id: user.id,
      email: user.email,
      user_metadata: {
        role: role
      }
    }));
    
    // Redirect to appropriate dashboard based on role
    redirectToDashboard(role);
  } catch (error) {
    console.error('Login error:', error);
    alert('Login failed. Please check the console for more details and verify your Supabase configuration.');
  } finally {
    // Reset button state
    submitButton.textContent = originalText;
    submitButton.disabled = false;
  }
}

// Determine user role based on email
function determineUserRole(email) {
  if (email.includes('admin')) {
    return 'admin';
  } else if (email.includes('manager')) {
    return 'management';
  } else {
    // Default to data entry for other emails
    return 'entry';
  }
}

// Redirect user to appropriate dashboard based on role
// Management users now have admin privileges
function redirectToDashboard(role) {
  if (window.GlobalUtils) {
    // Use the global utility for role-based navigation
    window.GlobalUtils.redirectBasedOnRole();
  } else {
    let redirectUrl;
    
    // Management now has admin privileges, so redirect to management dashboard for both
    if (role === 'admin' || role === 'management') {
      redirectUrl = 'management/dashboard.html';  // Both admin and management go to management dashboard
    } else if (role === 'entry') {
      redirectUrl = 'entry/sales.html';
    } else {
      redirectUrl = 'index.html';
    }
    
    window.location.href = redirectUrl;
  }
}

// Check if user is authenticated on protected pages
async function checkAuthentication() {
  // Check if Supabase client is available
  if (!window.supabaseClient) {
    console.error('Supabase client not available. Check that supabase.js loaded correctly.');
    window.location.href = 'index.html';
    return;
  }
  try {
    // Check if user has a valid Supabase session
    const { data: { session }, error } = await window.supabaseClient.auth.getSession();
    
    if (error) {
      console.error('Session check error:', error.message);
    }
    
    // If no active session, redirect to login
    if (!session) {
      // Redirect to login if not authenticated
      window.location.href = 'index.html';
      return;
    }
    
    // Get current user data
    const user = await window.supabaseAuth.getCurrentUser();
    if (!user) {
      window.location.href = 'index.html';
      return;
    }
    
    // Get user role
    const role = await window.supabaseAuth.getUserRole();
    if (!role) {
      window.location.href = 'index.html';
      return;
    }
    
    // Store user in localStorage for UI purposes (not for auth)
    localStorage.setItem('currentUser', JSON.stringify({
      id: user.id,
      email: user.email,
      user_metadata: { role }
    }));
  } catch (error) {
    console.error('Authentication check error:', error);
    window.location.href = 'index.html';
    return;
  }
  
  // Add logout functionality to user profile elements
  setupLogout();
  
  // Protect routes based on user role
  protectRoutes(await window.supabaseAuth.getUserRole());
}

// Set up logout functionality
function setupLogout() {
  // Look for any element with class 'user-profile' and add click handler
  const userProfileElements = document.querySelectorAll('.user-profile');
  
  userProfileElements.forEach(element => {
    // Create logout button/html if needed
    if (!element.querySelector('.logout-btn')) {
      const logoutHtml = `<br><a href="#" class="logout-btn" style="font-size: 0.8em; color: #94a3b8;">Logout</a>`;
      element.insertAdjacentHTML('beforeend', logoutHtml);
      
      element.querySelector('.logout-btn').addEventListener('click', function(e) {
        e.preventDefault();
        handleLogout();
      });
    }
  });
}

// Handle logout process
async function handleLogout() {
  // Check if Supabase client is available
  if (!window.supabaseClient) {
    console.error('Supabase client not available. Check that supabase.js loaded correctly.');
    // Clear user from localStorage anyway
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
    return;
  }
  try {
    // Clear user from localStorage
    localStorage.removeItem('currentUser');
    
    // Sign out from Supabase
    const { error } = await window.supabaseClient.auth.signOut();
    
    if (error) {
      console.error('Logout error:', error.message);
    }
  } catch (error) {
    console.error('Logout error:', error);
  }
  
  // Redirect to login page
  window.location.href = 'index.html';
}

// Protect routes based on user role
function protectRoutes(userRole) {
  const currentPage = window.location.pathname;
  
  // Define route access rules - management now has full access
  const routeAccess = {
    '/management/': ['management'],
    '/entry/': ['management', 'entry']
  };
  
  // Check if current page requires role validation
  for (const [route, allowedRoles] of Object.entries(routeAccess)) {
    if (currentPage.includes(route)) {
      // Management users have admin privileges, so allow them access to all routes
      if (!allowedRoles.includes(userRole) && userRole !== 'management') {
        // User doesn't have access to this route
        alert('You do not have permission to access this page.');
        
        // Redirect to appropriate dashboard
        redirectToDashboard(userRole);
        return;
      }
      break;
    }
  }
}

// Add role indicator to the UI for demo purposes
function showRoleIndicator() {
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  if (currentUser && !document.querySelector('.role-indicator')) {
    const header = document.querySelector('.page-header');
    if (header) {
      const roleIndicator = document.createElement('div');
      roleIndicator.className = 'role-indicator';
      roleIndicator.style.cssText = `
        position: absolute;
        top: 20px;
        right: 20px;
        padding: 5px 10px;
        background-color: #1e3a8a;
        color: white;
        border-radius: 4px;
        font-size: 12px;
        z-index: 1000;
      `;
      roleIndicator.textContent = `Role: ${currentUser.user_metadata.role}`;
      header.appendChild(roleIndicator);
    }
  }
}

// Call this function after DOM loads if we're on a protected page
if (!window.location.pathname.includes('index.html')) {
  document.addEventListener('DOMContentLoaded', showRoleIndicator);
}