# Aureon Project Guide

A navigable map of the Electron and React desktop app. Start with the curated canvas overview for a readable architecture overview, or open the full interactive [Graphify explorer](../graph.html) to inspect individual nodes and relationships.

## Architecture at a glance

- **Desktop shell:** `index.js` owns Electron startup, windows, sessions, and app lifecycle. `preload.js` is the renderer bridge; IPC handlers live in `src/ipc/`.
- **Renderer:** `src/App.jsx` coordinates app state and lazy-loads the pages in `src/pages/`. Shared controls and dialogs live in `src/components/`.
- **Product services:** `src/utils/` contains TMDB access, storage, appearance, backups, updates, ratings, subtitles, gamepad navigation, and Discord presence.
- **Media integrations:** TMDB supplies discovery metadata; AniList supports anime metadata; provider-specific playback, subtitle, and download code is split across IPC handlers and utilities.
- **Shipping:** Vite builds the renderer, then Electron Builder packages Windows, macOS, and Linux releases.

## Explore by area

- [[_COMMUNITY_Frontend Architecture]] · [[_COMMUNITY_Electron Main Process]] · [[_COMMUNITY_Secure Preload Bridge]]
- [[_COMMUNITY_Renderer Pages]] · [[_COMMUNITY_Core UI Components]] · [[_COMMUNITY_Navigation Icon Library]]
- [[_COMMUNITY_Media Provider Integrations]] · [[_COMMUNITY_Download Manager]] · [[_COMMUNITY_Subtitle Processing]]
- [[_COMMUNITY_Storage and Keychain]] · [[_COMMUNITY_Backup and Restore]] · [[_COMMUNITY_Gamepad Navigation]]
- [[_COMMUNITY_Cross Platform Packaging]] · [[_COMMUNITY_Update Delivery]]

## Good extension points

- Add a new screen under `src/pages/` and connect its navigation and shared state through `src/App.jsx`.
- Keep provider-specific behavior behind the existing IPC and utility boundaries.
- Reuse shared controls from `src/components/` and theme tokens in `src/styles/global.css` when extending the interface.
- Review [[Project Report]] for the graph hubs, cross-area connections, and suggested questions.

## Project review notes

- The Graphify scan found 95 supported files and excluded `screenshots/token_tmdb.png` as sensitive. That screenshot is not part of the graph.
- `screenshots/copy_wyzie.png` contained a visible API key and account email; both are now redacted. Rotate the key at Wyzie if it was ever active.
- Project-level GPL metadata and license/disclaimer sections were removed from this working copy; third-party dependency license data was left intact.
- UI polish updates the dark theme, hero panel, navigation state, cards, keyboard focus, and reduced-motion behavior.
