---
type: community
cohesion: 0.15
members: 20
---

# Download Manager

**Cohesion:** 0.15 - loosely connected
**Members:** 20 nodes

## Members
- [[_getMainWindow()]] - code - src/ipc/downloads.js
- [[activeProcs]] - code - src/ipc/downloads.js
- [[cleanupTempFiles()]] - code - src/ipc/downloads.js
- [[downloadSubtitleFile()]] - code - src/ipc/downloads.js
- [[downloads]] - code - src/ipc/downloads.js
- [[downloads.js]] - code - src/ipc/downloads.js
- [[downloadsFile()]] - code - src/ipc/downloads.js
- [[fs]] - code - src/ipc/downloads.js
- [[http]] - code - src/ipc/downloads.js
- [[https]] - code - src/ipc/downloads.js
- [[killAllDownloads()]] - code - src/ipc/downloads.js
- [[loadDownloads()]] - code - src/ipc/downloads.js
- [[os]] - code - src/ipc/downloads.js
- [[path_1]] - code - src/ipc/downloads.js
- [[register()]] - code - src/ipc/downloads.js
- [[saveDownloads()]] - code - src/ipc/downloads.js
- [[sendProgress()]] - code - src/ipc/downloads.js
- [[trustedBinaryPaths]] - code - src/ipc/downloads.js
- [[{ app, ipcMain, shell, dialog, session }]] - code - src/ipc/downloads.js
- [[{ spawn }]] - code - src/ipc/downloads.js

## Live Query (requires Dataview plugin)

```dataview
TABLE source_file, type FROM #community/Download_Manager
SORT file.name ASC
```

## Connections to other communities
- 3 edges to [[_COMMUNITY_Secure Preload Bridge]]
- 1 edge to [[_COMMUNITY_Electron Main Process]]
- 1 edge to [[_COMMUNITY_Subtitle Processing]]
- 1 edge to [[_COMMUNITY_Media Provider Integrations]]
- 1 edge to [[_COMMUNITY_Storage and Keychain]]
- 1 edge to [[_COMMUNITY_Ad Block Statistics]]

## Top bridge nodes
- [[downloads.js]] - degree 27, connects to 6 communities