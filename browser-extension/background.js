// Background script for Focus AI Navigator browser extension
// This script handles website blocking during active focus sessions

const API_BASE_URL = 'http://localhost:3000/api'; // Adjust to your API server URL

let blockedSites = [];
let isFocusActive = false;

// Fetch blocked sites from active focus session
async function updateBlockedSites() {
  try {
    // Get active focus sessions
    const response = await fetch(`${API_BASE_URL}/focus-sessions`);
    const sessions = await response.json();

    const activeSession = sessions.find(s => s.status === 'active');
    if (activeSession && activeSession.blockedSites) {
      blockedSites = activeSession.blockedSites;
      isFocusActive = true;
      console.log('Focus session active, blocking sites:', blockedSites);
    } else {
      blockedSites = [];
      isFocusActive = false;
      console.log('No active focus session');
    }
  } catch (error) {
    console.error('Failed to fetch blocked sites:', error);
    blockedSites = [];
    isFocusActive = false;
  }
}

// Check if URL should be blocked
function shouldBlockUrl(url) {
  if (!isFocusActive) return false;

  return blockedSites.some(pattern => {
    // Simple pattern matching - you can enhance this with wildcards, regex, etc.
    return url.includes(pattern) || url.match(new RegExp(pattern.replace(/\*/g, '.*')));
  });
}

// Block web requests
chrome.webRequest.onBeforeRequest.addListener(
  function(details) {
    if (shouldBlockUrl(details.url)) {
      // Redirect to a focus reminder page or block the request
      return {
        redirectUrl: chrome.runtime.getURL('blocked.html')
      };
    }
  },
  { urls: ["<all_urls>"] },
  ["blocking"]
);

// Update blocked sites periodically
setInterval(updateBlockedSites, 5000); // Check every 5 seconds

// Initial update
updateBlockedSites();

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'updateBlockedSites') {
    updateBlockedSites();
    sendResponse({ success: true });
  }
});