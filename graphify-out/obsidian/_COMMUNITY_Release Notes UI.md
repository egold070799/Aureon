---
type: community
cohesion: 0.80
members: 5
---

# Release Notes UI

**Cohesion:** 0.80 - tightly connected
**Members:** 5 nodes

## Members
- [[ReleaseImage()]] - code - src/components/UpdateModal.jsx
- [[UpdateModal()]] - code - src/components/UpdateModal.jsx
- [[UpdateModal.jsx]] - code - src/components/UpdateModal.jsx
- [[inlineFormat()]] - code - src/components/UpdateModal.jsx
- [[renderChangelog()]] - code - src/components/UpdateModal.jsx

## Live Query (requires Dataview plugin)

```dataview
TABLE source_file, type FROM #community/Release_Notes_UI
SORT file.name ASC
```

## Connections to other communities
- 3 edges to [[_COMMUNITY_Renderer Pages]]
- 3 edges to [[_COMMUNITY_Settings and Subtitle API]]
- 1 edge to [[_COMMUNITY_Download and Search UI]]

## Top bridge nodes
- [[UpdateModal.jsx]] - degree 7, connects to 3 communities
- [[UpdateModal()]] - degree 6, connects to 2 communities