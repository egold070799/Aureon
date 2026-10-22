# Graph Report - Aureon  (2026-10-22)

## Corpus Check
- 95 files · ~226,952 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 8 file(s) not represented in the graph (top: .woff2 5, (none) 1, .bmp 1)

## Summary
- 682 nodes · 1475 edges · 53 communities (44 shown, 9 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 39 edges (avg confidence: 0.87)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- Core UI Components
- Project Metadata
- Cross Platform Packaging
- Download and Search UI
- Settings and Subtitle API
- Media Provider Integrations
- Renderer Pages
- Navigation Icon Library
- Gamepad Navigation
- Discord Presence
- Frontend Architecture
- Electron Main Process
- Download Manager
- Secure Preload Bridge
- Storage and Keychain
- Subtitle Processing
- Ad Block Statistics
- Update Delivery
- Popout Window Controls
- Home Layout Preferences
- UI Error Boundaries
- Backup and Restore
- Support Materials
- Release Notes UI
- Anime Skip Timings
- Brand Icon Construction
- TMDB Setup Guide
- Wyzie API Setup
- Movie Details and Playback
- Subtitle Download Screens
- Contribution Workflow
- macOS Build Pipeline
- Aureon Icon Artwork
- Aureon Icon Artwork
- Aureon Icon Artwork
- Tracker Blocking Flow
- TV Episode Viewing
- TMDB Application Setup
- Wyzie Key Onboarding
- Home Layout Customization
- Appearance Preferences
- Wyzie Verification Quota
- TMDB Usage Choice
- Wyzie Key Redemption
- First Run Setup
- Feature Request Template
- CodeQL Workflow
- Brand Logo and App Icon
- TMDB Signup Tutorial
- 16px App Icon
- 256px App Icon
- 48px App Icon
- Brand Mascot Artwork

## God Nodes (most connected - your core abstractions)
1. `TVPage()` - 47 edges
2. `MoviePage()` - 38 edges
3. `App()` - 31 edges
4. `react` - 28 edges
5. `imgUrl()` - 22 edges
6. `SettingsPage()` - 21 edges
7. `tmdbFetch()` - 19 edges
8. `Sidebar()` - 16 edges
9. `storage` - 16 edges
10. `build` - 15 edges

## Surprising Connections (you probably didn't know these)
- `TMDB API Settings Screenshot` --references--> `TMDB Read Access Token`  [EXTRACTED]
  screenshots/api-settings_tmdb.png → tmdb-tutorial.md
- `Wyzie API Key Copy Screenshot` --references--> `Wyzie Subs API Key`  [EXTRACTED]
  screenshots/copy_wyzie.png → wyzie-tutorial.md
- `Renderer HTML Shell` --conceptually_related_to--> `Electron Desktop App`  [INFERRED]
  index.html → README.md
- `Aureon App Icon (64×64)` --semantically_similar_to--> `Aureon Brand Logo`  [INFERRED] [semantically similar]
  public/sized/64x64.png → public/logo.svg
- `App()` --calls--> `ErrorBoundary`  [EXTRACTED]
  src/App.jsx → src/components/ErrorBoundary.jsx

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Aureon Application Architecture** — readme_electron_main_process, readme_secure_renderer_bridge, readme_renderer_entry_point, readme_shared_ui_components, readme_electron_ipc_handlers, readme_app_pages, readme_app_styles_and_fonts, readme_app_utility_modules [EXTRACTED 1.00]

## Communities (53 total, 9 thin omitted)

### Community 0 - "Core UI Components"
Cohesion: 0.06
Nodes (105): TV Series Detail Screenshot, Trending Home Carousel Screenshot, checkNewEpisodes(), BlockedStatsModal(), BackIcon(), BookmarkFillIcon(), BookmarkIcon(), ChevronLeftIcon() (+97 more)

### Community 1 - "Project Metadata"
Cohesion: 0.05
Nodes (43): allowScripts, electron@40.10.6, electron-winstaller@5.4.0, esbuild@0.28.1, author, email, name, dependencies (+35 more)

### Community 2 - "Cross Platform Packaging"
Cohesion: 0.05
Nodes (43): build, appId, asar, asarUnpack, compression, directories, dmg, electronLanguages (+35 more)

### Community 3 - "Download and Search UI"
Cohesion: 0.11
Nodes (32): react, Download Modal Screenshot, DownloadModal(), SubtitleBrowser(), FolderIcon(), SearchIcon(), SubtitlesIcon(), TrashIcon() (+24 more)

### Community 4 - "Settings and Subtitle API"
Cohesion: 0.13
Nodes (32): Subtitle API Settings Screenshot, WarningIcon(), DEFAULT_INVIDIOUS_BASE, AGE_LIMIT_OPTIONS, AppearanceSection(), CleanRow(), ConfirmDialog(), DiscordRpcSection() (+24 more)

### Community 5 - "Media Provider Integrations"
Cohesion: 0.11
Nodes (27): ALLANIME_HEX_MAP, ALLANIME_KEY, allanimeGQL(), allanimeGQLEpisode(), anilistSeasonTitle(), buildPlayerHtml(), crypto, decodeAllanimeUrl() (+19 more)

### Community 6 - "Renderer Pages"
Cohesion: 0.15
Nodes (21): react-dom, App(), DownloadsPage, HomePage, LibraryPage, MoviePage, SettingsPage, TVPage (+13 more)

### Community 7 - "Navigation Icon Library"
Cohesion: 0.13
Nodes (20): DownloadsQueueIcon(), FilmIcon(), HelpIcon(), HistoryIcon(), HomeIcon(), QuitIcon(), SettingsIcon(), AureonLogo() (+12 more)

### Community 8 - "Gamepad Navigation"
Cohesion: 0.18
Nodes (23): BTN, readFirstPad(), startGamepadLoop(), useGamepadLoop(), isPlayerGamepadActive(), clearGamepadFocus(), clearHighlight(), CLICKABLE_CURSORS (+15 more)

### Community 9 - "Discord Presence"
Cohesion: 0.17
Nodes (23): candidatePipePaths(), clearFlushTimer(), clearReconnectTimer(), connect(), doSend(), encodeFrame(), flush(), fs (+15 more)

### Community 10 - "Frontend Architecture"
Cohesion: 0.09
Nodes (23): Renderer HTML Shell, AllManga Media Source, AniList Metadata Service, Application Pages, Application Styles and Fonts, Application Utility Modules, Contributing Guidelines, Cross-Platform Release Build (+15 more)

### Community 11 - "Electron Main Process"
Cohesion: 0.11
Nodes (18): allmangaIpc, {
  app,
  BrowserWindow,
  ipcMain,
  session,
  webContents,
  Notification,
}, _bench(), BLOCKED_HOSTS, blockStats, createWindow(), discordRpc, downloadsIpc (+10 more)

### Community 12 - "Download Manager"
Cohesion: 0.15
Nodes (19): activeProcs, { app, ipcMain, shell, dialog, session }, cleanupTempFiles(), downloads, downloadsFile(), downloadSubtitleFile(), fs, _getMainWindow() (+11 more)

### Community 13 - "Secure Preload Bridge"
Cohesion: 0.13
Nodes (13): { contextBridge, ipcRenderer, webFrame }, electron, findTrustedUpdateSource(), fs, http, https, { ipcMain, shell, app }, os (+5 more)

### Community 14 - "Storage and Keychain"
Cohesion: 0.21
Nodes (15): { app, ipcMain, safeStorage }, applySecretMigrationIfNeeded(), fs, loadScheduledBackupSettings(), migrationFile(), path, readSecureStore(), register() (+7 more)

### Community 15 - "Subtitle Processing"
Cohesion: 0.15
Nodes (14): extractFirstSubtitleFromZip(), fetchWithTimeout(), fs, http, https, { ipcMain }, os, path (+6 more)

### Community 16 - "Ad Block Statistics"
Cohesion: 0.21
Nodes (9): allBlockStats, { app }, blockStatsFile(), fs, _getMainWindow(), loadBlockStats(), path, recordBlockedRequest() (+1 more)

### Community 17 - "Update Delivery"
Cohesion: 0.29
Nodes (9): checkForUpdates(), checkForUpdatesWithFallback(), CODEBERG_REPO, DEFAULT_UPDATE_SOURCE, getCurrentVersion(), GITHUB_REPO, normaliseVersion(), semverGt() (+1 more)

### Community 18 - "Popout Window Controls"
Cohesion: 0.33
Nodes (7): { contextBridge, ipcRenderer }, css(), injectTitlebar(), makeTitlebarBtn(), _onNav(), _origPush, _origReplace

### Community 19 - "Home Layout Preferences"
Cohesion: 0.25
Nodes (5): HomeLayoutSection(), DEFAULT_ROW_ORDER, DEFAULT_ROW_VISIBLE, HOME_ROWS, saveHomeViewMode()

### Community 21 - "Backup and Restore"
Cohesion: 0.40
Nodes (5): BackupRestoreSection(), ScheduledBackupSection(), BACKUP_KEYS, collectBackupData(), restoreBackupData()

### Community 22 - "Support Materials"
Cohesion: 0.40
Nodes (5): Bug Report Template, Installation Method, Issue Tracker, Aureon Release, Support Channels

### Community 23 - "Release Notes UI"
Cohesion: 0.80
Nodes (4): inlineFormat(), ReleaseImage(), renderChangelog(), UpdateModal()

### Community 24 - "Anime Skip Timings"
Cohesion: 0.60
Nodes (3): fetchAniSkipTimings(), getCache(), setCache()

### Community 25 - "Brand Icon Construction"
Cohesion: 0.50
Nodes (4): Film clapperboard, Magnifying glass, Mustache mascot, Aureon application icon

### Community 26 - "TMDB Setup Guide"
Cohesion: 0.50
Nodes (4): TMDB API Settings Screenshot, Aureon Setup Screen, TMDB Account, TMDB Read Access Token

### Community 27 - "Wyzie API Setup"
Cohesion: 0.50
Nodes (4): Wyzie API Key Copy Screenshot, Email Verification, Wyzie Subtitle Provider, Wyzie Subs API Key

### Community 28 - "Movie Details and Playback"
Cohesion: 0.50
Nodes (4): Movie Detail Page, Movie Metadata Hero, Playback and Watch Controls, Related Franchise Collection

### Community 29 - "Subtitle Download Screens"
Cohesion: 0.50
Nodes (4): Downloaded Subtitle List, Language Filter and Batch Download, Subtitle Downloader Modal, Subtitle Provider Search

### Community 30 - "Contribution Workflow"
Cohesion: 0.67
Nodes (3): AI Assistance Disclosure, Contribution Workflow, Pull Request Review

### Community 31 - "macOS Build Pipeline"
Cohesion: 0.67
Nodes (3): Electron Builder, macOS Release Artifact, macOS Build Workflow

### Community 32 - "Aureon Icon Artwork"
Cohesion: 0.67
Nodes (3): Filmstrip Frame, Monocle and Moustache Motif, Aureon App Icon

### Community 33 - "Aureon Icon Artwork"
Cohesion: 0.67
Nodes (3): Filmstrip Frame, Monocle and Moustache Motif, Aureon App Icon

### Community 34 - "Aureon Icon Artwork"
Cohesion: 0.67
Nodes (3): Filmstrip Frame, Monocle and Moustache Motif, Aureon App Icon

### Community 35 - "Tracker Blocking Flow"
Cohesion: 0.67
Nodes (3): Ad and Tracker Blocking, Blocked Request Statistics, Blocked Traffic Summary Modal

### Community 36 - "TV Episode Viewing"
Cohesion: 0.67
Nodes (3): Anime Playback Screen, Episode Progress Tracking, Media Sidebar Navigation

### Community 37 - "TMDB Application Setup"
Cohesion: 0.67
Nodes (3): Aureon Desktop Application, TMDB Developer Application Form, TMDB Metadata API Use

### Community 38 - "Wyzie Key Onboarding"
Cohesion: 0.67
Nodes (3): API Key Onboarding, Email Verification Step, Wyzie Verification Code Entry

### Community 39 - "Home Layout Customization"
Cohesion: 0.67
Nodes (3): Draggable Home Row Order, Home Layout Settings Screen, Home Page Row Visibility

### Community 40 - "Appearance Preferences"
Cohesion: 0.67
Nodes (3): Accent Color Presets, Motion and Density Options, Appearance Settings Panel

### Community 41 - "Wyzie Verification Quota"
Cohesion: 0.67
Nodes (3): API Key Request Quota, Email Code Verification, Wyzie Email Verification Form

### Community 42 - "TMDB Usage Choice"
Cohesion: 0.67
Nodes (3): Commercial Application Selection, Personal Use Confirmation, TMDB API Usage Choice

### Community 43 - "Wyzie Key Redemption"
Cohesion: 0.67
Nodes (3): Captcha Security Check, Email Verification Step, Wyzie Key Redeem Screen

### Community 44 - "First Run Setup"
Cohesion: 0.67
Nodes (3): First Run Onboarding, Aureon Setup Screen, TMDB Read Access Token

## Knowledge Gaps
- **86 isolated node(s):** `approve`, `scripts`, `cross-env`, `electron-builder`, `terser` (+81 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 267 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **9 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `Download and Search UI` to `Core UI Components`, `Project Metadata`, `Settings and Subtitle API`, `Renderer Pages`, `Navigation Icon Library`, `Gamepad Navigation`, `UI Error Boundaries`, `Release Notes UI`?**
  _High betweenness centrality (0.384) - this node is a cross-community bridge._
- **What connects `approve`, `scripts`, `cross-env` to the rest of the system?**
  _86 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Core UI Components` be split into smaller, more focused modules?**
  _Cohesion score 0.05676737569435036 - nodes in this community are weakly interconnected._
- **Why does `electron` connect `Secure Preload Bridge` to `Project Metadata`, `Media Provider Integrations`, `Electron Main Process`, `Download Manager`, `Storage and Keychain`, `Subtitle Processing`, `Ad Block Statistics`, `Popout Window Controls`?**
  _High betweenness centrality (0.312) - this node is a cross-community bridge._
- **Should `Project Metadata` be split into smaller, more focused modules?**
  _Cohesion score 0.045454545454545456 - nodes in this community are weakly interconnected._
- **Why does `build` connect `Cross Platform Packaging` to `Project Metadata`?**
  _High betweenness centrality (0.100) - this node is a cross-community bridge._
- **Should `Cross Platform Packaging` be split into smaller, more focused modules?**
  _Cohesion score 0.046511627906976744 - nodes in this community are weakly interconnected._

## Graph Health

- Graphify reported 1 dangling endpoint, 5 self-loop edges, and 38 same-endpoint relation collisions in the simple graph export.
- The dangling endpoint is the stylesheet import to `src/styles/global.css`; CSS is unclassified by this build.
- The self-loops are recursive calls. The 38 collisions combine multiple relation types for the same node pair (for example `contains` and `calls`), so the exported simple graph keeps one edge per pair.
- No missing-endpoint edges or exact duplicate edges were reported.
