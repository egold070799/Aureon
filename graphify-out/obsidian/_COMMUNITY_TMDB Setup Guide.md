---
type: community
cohesion: 0.50
members: 4
---

# TMDB Setup Guide

**Cohesion:** 0.50 - moderately connected
**Members:** 4 nodes

## Members
- [[Aureon Setup Screen]] - concept - tmdb-tutorial.md
- [[TMDB API Settings Screenshot]] - image - screenshots/api-settings_tmdb.png
- [[TMDB Account]] - concept - tmdb-tutorial.md
- [[TMDB Read Access Token]] - document - tmdb-tutorial.md

## Live Query (requires Dataview plugin)

```dataview
TABLE source_file, type FROM #community/TMDB_Setup_Guide
SORT file.name ASC
```
