---
type: community
cohesion: 0.11
members: 21
---

# Electron Main Process

**Cohesion:** 0.11 - loosely connected
**Members:** 21 nodes

## Members
- [[BLOCKED_HOSTS]] - code - index.js
- [[NOTE enable-low-end-device-mode removed, it cuts the GPU texture tile budget]] - rationale - index.js
- [[_bench()]] - code - index.js
- [[_t0]] - code - index.js
- [[allmangaIpc]] - code - index.js
- [[blockStats]] - code - index.js
- [[createWindow()]] - code - index.js
- [[discordRpc]] - code - index.js
- [[downloadsIpc]] - code - index.js
- [[extractSubtitleLang()]] - code - src/ipc/subtitles.js
- [[getMainWindow()]] - code - index.js
- [[getPipWindow()]] - code - index.js
- [[gotTheLock]] - code - index.js
- [[index.js]] - code - index.js
- [[path]] - code - index.js
- [[playerIpc]] - code - index.js
- [[playerWcIds]] - code - index.js
- [[setupSession()]] - code - index.js
- [[storageIpc]] - code - index.js
- [[subtitlesIpc]] - code - index.js
- [[{   app,   BrowserWindow,   ipcMain,   session,   webContents,   Notification, }]] - code - index.js

## Live Query (requires Dataview plugin)

```dataview
TABLE source_file, type FROM #community/Electron_Main_Process
SORT file.name ASC
```

## Connections to other communities
- 3 edges to [[_COMMUNITY_Subtitle Processing]]
- 2 edges to [[_COMMUNITY_Storage and Keychain]]
- 2 edges to [[_COMMUNITY_Secure Preload Bridge]]
- 1 edge to [[_COMMUNITY_Ad Block Statistics]]
- 1 edge to [[_COMMUNITY_Download Manager]]
- 1 edge to [[_COMMUNITY_Media Provider Integrations]]
- 1 edge to [[_COMMUNITY_Discord Presence]]

## Top bridge nodes
- [[index.js]] - degree 28, connects to 7 communities
- [[setupSession()]] - degree 5, connects to 1 community
- [[extractSubtitleLang()]] - degree 2, connects to 1 community