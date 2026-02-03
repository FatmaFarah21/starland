import { requireAuth, signOut, getCurrentRole } from './auth.js';

// Frontend-only settings module - no backend

async function init() {
  try {
    const user = await requireAuth();
    if (!user) return;

    const role = await getCurrentRole();
    const isManagement = role === 'admin' || role === 'manager';

    // Show management-only elements based on role
    document.querySelectorAll('[data-role="management-only"]').forEach((el) => {
      el.style.display = isManagement ? 'block' : 'none';
    });

    // Set user info
    const emailEl = document.getElementById('userEmail');
    if (emailEl) emailEl.textContent = 'user@example.com';

    const sidebarEmailEl = document.getElementById('sidebarUserEmail');
    if (sidebarEmailEl) sidebarEmailEl.textContent = 'user@example.com';

    const settingsEmail = document.getElementById('settingsEmail');
    if (settingsEmail) settingsEmail.textContent = 'user@example.com';

    // Logout button
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', async () => {
        await signOut();
        window.location.href = '../index.html';
      });
    }

    // Save settings form
    const settingsForm = document.getElementById('settingsForm');
    if (settingsForm) {
      settingsForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(settingsForm);
        console.log('Frontend skeleton: Settings saved', {
          appName: formData.get('appName'),
          currency: formData.get('currency'),
          dateFormat: formData.get('dateFormat')
        });
        alert('Settings saved (frontend skeleton - no persistence)');
      });
    }

    // System backup button
    const backupBtn = document.getElementById('backupBtn');
    if (backupBtn) {
      backupBtn.addEventListener('click', () => {
        console.log('Frontend skeleton: Backup requested');
        alert('Backup feature not available in frontend skeleton');
      });
    }

  } catch (error) {
    console.error('Settings initialization error:', error);
  }
}

document.addEventListener('DOMContentLoaded', init);
