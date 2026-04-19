# Focus AI Navigator Browser Extension

This browser extension blocks distracting websites during active focus sessions managed by the Focus AI Navigator web app.

## Installation

1. Open Chrome/Edge and go to `chrome://extensions/`
2. Enable "Developer mode" in the top right
3. Click "Load unpacked" and select this `browser-extension` folder
4. The extension should now be installed

## Setup

1. Make sure the Focus AI Navigator API server is running on `http://localhost:3000`
2. Start a focus session through the web app with blocked sites configured
3. The extension will automatically detect active sessions and block configured sites

## How it works

- The extension polls the API every 5 seconds for active focus sessions
- When a session is active, it blocks any URLs matching the configured patterns
- Blocked requests are redirected to a focus reminder page
- The extension popup shows current status and blocked sites

## Configuration

Update `API_BASE_URL` in `background.js` and `popup.js` if your API server runs on a different URL.

## Blocked Sites Patterns

Currently supports simple string matching and basic wildcards (*). For example:
- `youtube.com` - blocks youtube.com
- `*.youtube.com` - blocks all youtube subdomains
- `facebook.com` - blocks facebook.com

## Development

To modify the extension:
1. Make changes to the files
2. Go to `chrome://extensions/`
3. Click the refresh button on the Focus AI Navigator extension
4. Test the changes

## Troubleshooting

- Make sure the API server is running and accessible
- Check the browser console for errors (F12 > Console)
- Verify focus sessions are created with blocked sites
- The extension requires `webRequest` and `webRequestBlocking` permissions