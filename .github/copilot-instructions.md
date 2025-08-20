# Da Hub - Gaming Portal
Da Hub is a static web application gaming portal hosting 100+ browser games including Flash games (via Ruffle), HTML5 games, retro console games through emulators, and web-based games. The application uses HTML, CSS, and JavaScript with no build process.

Always reference these instructions first and fallback to search or bash commands only when you encounter unexpected information that does not match the info here.

## Working Effectively
- **Setup and run the application:**
  - `npm install` -- takes 3 seconds. NEVER CANCEL.
  - `npx http-server -p 8080` -- starts immediately (under 1 second)
  - Navigate to `http://127.0.0.1:8080/home.html` to access the main application directly (recommended for testing)
  - The server runs indefinitely until stopped with Ctrl+C

- **No build process required** -- this is a static website served via HTTP server
- **All operations are very fast** -- installation, server startup, and testing take seconds, not minutes

## Validation
- **ALWAYS manually validate any changes by:**
  - Starting the HTTP server: `npx http-server -p 8080`
  - Loading `http://127.0.0.1:8080/home.html` in browser
  - Testing core functionality: clicking games, using search, favoriting games
  - Verifying games load correctly in iframes
  - Testing search functionality with terms like "mario" or "puzzle"
  - Testing the settings panel functionality

- **Complete validation scenarios to test after making changes:**
  - Load the main page and verify all game tiles appear
  - Click on a game (e.g., "2048") and confirm it loads in an iframe
  - Use the search box to filter games and verify results
  - Click a favorite star to add/remove favorites
  - Open settings panel and verify all options work
  - Test the "Back" button when in a game

## Code Structure and Key Files
- **Main entry points:**
  - `index.html` -- serves as a 'cloak' that redirects the current tab to Google.com and opens the actual application in a new about:blank window with an iframe to home.html (leaves minimal browser history trace)
  - `home.html` -- main application interface (use this directly for testing as about:blank pages cannot be reloaded)
  - `home-new.html` -- alternative interface

- **JavaScript modules (all in `/js/` directory):**
  - `apps.js` -- contains the games database array with all game metadata
  - `appHandler.js` -- handles game loading, favorites, search functionality
  - `home.js` -- main application logic and UI management
  - `search.js` -- search and filtering functionality
  - `settings.js` -- settings panel and user preferences
  - `utils.js` -- utility functions for HTTP requests and window management
  - `locales.js` -- internationalization and language support

- **Static assets:**
  - `/css/` -- stylesheets for the application
  - `/img/` -- images, icons, and visual assets
  - `/apps/` -- individual game directories (each game is self-contained)
  - `/resources/` -- shared resources including Ruffle Flash player

- **Key directories developers work with:**
  - `/js/apps.js` -- add new games to the games array
  - `/apps/[GameName]/` -- game files and assets
  - `/css/home.css` -- main application styling
  - `/img/` -- game thumbnails and icons

## Adding New Games
- Edit `/js/apps.js` and add a new object to the `apps` array
- Create a directory in `/apps/[GameName]/` with the game files
- Add thumbnail image to the game directory
- Required game object properties: `Name`, `Thumbnail`, optional: `Mobile`, `Genres`, `Added`, `Updated`

## Common Tasks and Development Workflow
- **No linting, testing, or build tools configured** -- this is intentional as it's a simple static site
- **No package.json scripts** -- only dependency is `http-server` for local development
- **No CI/CD pipeline** -- changes are deployed by serving static files
- **No automated tests** -- validation is done manually through browser testing

- **When making JavaScript changes:**
  - Edit the relevant JS file in `/js/` directory
  - Refresh the browser to see changes (no compilation needed)
  - Test functionality manually in the browser

- **When adding CSS changes:**
  - Edit `/css/home.css` or other relevant CSS files
  - Changes are immediately visible on browser refresh

- **When adding games:**
  - Add game files to `/apps/[GameName]/` directory
  - Update `/js/apps.js` with game metadata
  - Test that the game loads correctly

## Common Command Output Reference
### Repository root structure
```
ls -la /
.git/
.gitignore
.vscode/
404.html
LICENSE_APACHE
README.md
apps/           # 100+ game directories
css/            # Stylesheets
favicon.ico
home-new.html   # Alternative interface
home.html       # Main application
img/            # Images and icons
index.html      # Cloaking page that redirects to Google.com and opens app in about:blank
js/             # JavaScript modules
package-lock.json
package.json    # Only has http-server dependency
requests.html   # Request form page
resources/      # Shared resources (Ruffle, emulators)
ruffle.js       # Flash player
ruffle.js.map
```

### npm install output
```
npm install
added 48 packages, and audited 49 packages in 3s
15 packages are looking for funding
found 0 vulnerabilities
```

### Server startup output
```
npx http-server -p 8080
Starting up http-server, serving ./
http-server version: 14.1.1
Available on:
  http://127.0.0.1:8080
  http://10.1.0.207:8080
Hit CTRL-C to stop the server
```

## Browser Game Categories
- **Flash Games:** Use Ruffle player (automatic)
- **HTML5 Games:** Run directly in browser
- **Retro Console Games:** Use JavaScript emulators (NES, GBA, etc.)
- **Web Games:** Hosted externally, loaded in iframes
- **Puzzle Games:** 2048, Tetris, Minesweeper, etc.
- **Action Games:** Geometry Dash, Happy Wheels, etc.
- **Sports Games:** Retro Bowl, Soccer Random, etc.

## Important Notes
- **Performance:** All games run in iframes for isolation
- **No server-side code** -- everything runs client-side in the browser
- **LocalStorage used** for saving favorites and settings
- **Mobile support** varies by game (marked in games database)
- **No user accounts** -- everything is stored locally in browser
- **External dependencies** are minimal and loaded from CDNs
- **Cloaking mechanism:** index.html provides stealth access by redirecting to Google.com while opening the app in about:blank (for testing, use home.html directly as about:blank cannot be reloaded)

## Troubleshooting
- **Games not loading:** Check console for errors, verify game files exist
- **Search not working:** Check `/js/search.js` and `/js/appHandler.js`
- **Favorites not saving:** Check browser localStorage functionality
- **Styling issues:** Check `/css/home.css` and browser developer tools
- **Server issues:** Restart with `npx http-server -p 8080` on a different port if needed

Fixes #30.