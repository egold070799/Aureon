---
type: community
cohesion: 0.40
members: 6
---

# Backup and Restore

**Cohesion:** 0.40 - moderately connected
**Members:** 6 nodes

## Members
- [[BACKUP_KEYS]] - code - src/utils/backup.js
- [[BackupRestoreSection()]] - code - src/pages/SettingsPage.jsx
- [[ScheduledBackupSection()]] - code - src/pages/SettingsPage.jsx
- [[backup.js]] - code - src/utils/backup.js
- [[collectBackupData()]] - code - src/utils/backup.js
- [[restoreBackupData()]] - code - src/utils/backup.js

## Live Query (requires Dataview plugin)

```dataview
TABLE source_file, type FROM #community/Backup_and_Restore
SORT file.name ASC
```

## Connections to other communities
- 8 edges to [[_COMMUNITY_Settings and Subtitle API]]
- 3 edges to [[_COMMUNITY_Renderer Pages]]

## Top bridge nodes
- [[backup.js]] - degree 5, connects to 2 communities
- [[collectBackupData()]] - degree 5, connects to 2 communities
- [[BackupRestoreSection()]] - degree 5, connects to 1 community
- [[ScheduledBackupSection()]] - degree 4, connects to 1 community
- [[restoreBackupData()]] - degree 3, connects to 1 community