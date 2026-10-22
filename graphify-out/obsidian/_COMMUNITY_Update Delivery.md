---
type: community
cohesion: 0.29
members: 10
---

# Update Delivery

**Cohesion:** 0.29 - loosely connected
**Members:** 10 nodes

## Members
- [[CODEBERG_REPO]] - code - src/utils/updates.js
- [[DEFAULT_UPDATE_SOURCE]] - code - src/utils/updates.js
- [[GITHUB_REPO]] - code - src/utils/updates.js
- [[UPDATE_SOURCES]] - code - src/utils/updates.js
- [[checkForUpdates()]] - code - src/utils/updates.js
- [[checkForUpdatesWithFallback()]] - code - src/utils/updates.js
- [[getCurrentVersion()]] - code - src/utils/updates.js
- [[normaliseVersion()]] - code - src/utils/updates.js
- [[semverGt()]] - code - src/utils/updates.js
- [[updates.js]] - code - src/utils/updates.js

## Live Query (requires Dataview plugin)

```dataview
TABLE source_file, type FROM #community/Update_Delivery
SORT file.name ASC
```

## Connections to other communities
- 5 edges to [[_COMMUNITY_Settings and Subtitle API]]
- 4 edges to [[_COMMUNITY_Renderer Pages]]

## Top bridge nodes
- [[updates.js]] - degree 11, connects to 2 communities
- [[checkForUpdatesWithFallback()]] - degree 6, connects to 2 communities
- [[DEFAULT_UPDATE_SOURCE]] - degree 3, connects to 2 communities
- [[UPDATE_SOURCES]] - degree 2, connects to 1 community