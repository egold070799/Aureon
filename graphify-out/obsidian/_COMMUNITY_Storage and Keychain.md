---
type: community
cohesion: 0.21
members: 18
---

# Storage and Keychain

**Cohesion:** 0.21 - loosely connected
**Members:** 18 nodes

## Members
- [[applySecretMigrationIfNeeded()]] - code - src/ipc/storage.js
- [[fs_2]] - code - src/ipc/storage.js
- [[ipcstorage.js]] - code - src/ipc/storage.js
- [[loadScheduledBackupSettings()]] - code - src/ipc/storage.js
- [[migrationFile()]] - code - src/ipc/storage.js
- [[path_3]] - code - src/ipc/storage.js
- [[readSecureStore()]] - code - src/ipc/storage.js
- [[ref_path]] - concept
- [[register()_2]] - code - src/ipc/storage.js
- [[saveScheduledBackupSettings()]] - code - src/ipc/storage.js
- [[scheduledBackupSettingsFile()]] - code - src/ipc/storage.js
- [[secureStoreFile()]] - code - src/ipc/storage.js
- [[secureStoreGet()]] - code - src/ipc/storage.js
- [[secureStoreSet()]] - code - src/ipc/storage.js
- [[shouldRunScheduledBackup()]] - code - src/ipc/storage.js
- [[writeSecretMigration()]] - code - src/ipc/storage.js
- [[writeSecureStore()]] - code - src/ipc/storage.js
- [[{ app, ipcMain, safeStorage }]] - code - src/ipc/storage.js

## Live Query (requires Dataview plugin)

```dataview
TABLE source_file, type FROM #community/Storage_and_Keychain
SORT file.name ASC
```

## Connections to other communities
- 2 edges to [[_COMMUNITY_Electron Main Process]]
- 2 edges to [[_COMMUNITY_Secure Preload Bridge]]
- 2 edges to [[_COMMUNITY_Ad Block Statistics]]
- 1 edge to [[_COMMUNITY_Download Manager]]
- 1 edge to [[_COMMUNITY_Subtitle Processing]]
- 1 edge to [[_COMMUNITY_Discord Presence]]

## Top bridge nodes
- [[ref_path]] - degree 7, connects to 6 communities
- [[ipcstorage.js]] - degree 20, connects to 3 communities