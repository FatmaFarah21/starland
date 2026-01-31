import { requireAuth, signOut, getCurrentRole } from './auth.js';

async function init() {
  const user = await requireAuth();
  if (!user) return;

  const role = await getCurrentRole();
  const isManagement = role === 'Admin' || role === 'Manager';
  if (!isManagement) {
    document.querySelectorAll('[data-role="management-only"]').forEach((el) => {
      el.style.display = 'none';
    });
    window.location.href = './dashboard.html';
    return;
  }

  const emailEl = document.getElementById('userEmail');
  if (emailEl) emailEl.textContent = user.email || 'Signed in';
  const sidebarEmailEl = document.getElementById('sidebarUserEmail');
  if (sidebarEmailEl) sidebarEmailEl.textContent = user.email || '';

  const settingsEmail = document.getElementById('settingsEmail');
  if (settingsEmail) settingsEmail.textContent = user.email || '';

  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
      await signOut();
      window.location.href = '../index.html';
    });
  }
}

init();
