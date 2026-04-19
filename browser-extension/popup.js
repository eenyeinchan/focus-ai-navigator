// Popup script for Focus AI Navigator extension

const API_BASE_URL = 'http://localhost:3000/api';

document.addEventListener('DOMContentLoaded', function() {
  loadStatus();
  document.getElementById('refresh').addEventListener('click', loadStatus);
});

async function loadStatus() {
  try {
    const response = await fetch(`${API_BASE_URL}/focus-sessions`);
    const sessions = await response.json();

    const activeSession = sessions.find(s => s.status === 'active');

    const statusDiv = document.getElementById('status');
    const sitesSection = document.getElementById('sites-section');
    const sitesList = document.getElementById('sites-list');

    if (activeSession) {
      statusDiv.className = 'status active';
      statusDiv.textContent = `Focus session active: ${activeSession.goal}`;

      sitesSection.style.display = 'block';
      sitesList.innerHTML = '';

      if (activeSession.blockedSites && activeSession.blockedSites.length > 0) {
        activeSession.blockedSites.forEach(site => {
          const siteDiv = document.createElement('div');
          siteDiv.className = 'site-item';
          siteDiv.textContent = site;
          sitesList.appendChild(siteDiv);
        });
      } else {
        sitesList.innerHTML = '<div class="site-item">No sites blocked</div>';
      }
    } else {
      statusDiv.className = 'status inactive';
      statusDiv.textContent = 'No active focus session';
      sitesSection.style.display = 'none';
    }
  } catch (error) {
    document.getElementById('status').textContent = 'Unable to connect to API';
    document.getElementById('status').className = 'status inactive';
    document.getElementById('sites-section').style.display = 'none';
  }
}