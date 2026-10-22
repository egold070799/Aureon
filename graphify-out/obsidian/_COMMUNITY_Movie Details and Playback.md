---
type: community
cohesion: 0.50
members: 4
---

# Movie Details and Playback

**Cohesion:** 0.50 - moderately connected
**Members:** 4 nodes

## Members
- [[Movie Detail Page]] - image - screenshots/movie.png
- [[Movie Metadata Hero]] - concept - screenshots/movie.png
- [[Playback and Watch Controls]] - concept - screenshots/movie.png
- [[Related Franchise Collection]] - concept - screenshots/movie.png

## Live Query (requires Dataview plugin)

```dataview
TABLE source_file, type FROM #community/Movie_Details_and_Playback
SORT file.name ASC
```
