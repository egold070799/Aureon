---
type: community
cohesion: 0.25
members: 8
---

# Home Layout Preferences

**Cohesion:** 0.25 - loosely connected
**Members:** 8 nodes

## Members
- [[DEFAULT_ROW_ORDER]] - code - src/utils/homeLayout.js
- [[DEFAULT_ROW_VISIBLE]] - code - src/utils/homeLayout.js
- [[HOME_ROWS]] - code - src/utils/homeLayout.js
- [[HomeLayoutSection()]] - code - src/pages/SettingsPage.jsx
- [[homeLayout.js]] - code - src/utils/homeLayout.js
- [[loadStartPage()]] - code - src/utils/homeLayout.js
- [[saveHomeLayout()]] - code - src/utils/homeLayout.js
- [[saveHomeViewMode()]] - code - src/utils/homeLayout.js

## Live Query (requires Dataview plugin)

```dataview
TABLE source_file, type FROM #community/Home_Layout_Preferences
SORT file.name ASC
```

## Connections to other communities
- 6 edges to [[_COMMUNITY_Settings and Subtitle API]]
- 5 edges to [[_COMMUNITY_Core UI Components]]
- 2 edges to [[_COMMUNITY_Download and Search UI]]

## Top bridge nodes
- [[homeLayout.js]] - degree 12, connects to 3 communities
- [[HomeLayoutSection()]] - degree 6, connects to 2 communities
- [[saveHomeViewMode()]] - degree 3, connects to 1 community
- [[HOME_ROWS]] - degree 2, connects to 1 community