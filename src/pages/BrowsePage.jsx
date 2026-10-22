import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import MediaCard from "../components/MediaCard";
import { tmdbFetch } from "../utils/api";
import { getRatingForItem, useRatings } from "../utils/useRatings";
import { isRestricted } from "../utils/ageRating";

const PAGE_SIZE = 24;
const TYPES = [
  { id: "all", label: "Everything" },
  { id: "movie", label: "Movies" },
  { id: "tv", label: "Series" },
];
const SORTS = [
  { id: "popularity.desc", label: "Popular" },
  { id: "vote_average.desc", label: "Top rated" },
  { id: "newest", label: "Recently released" },
];
const CATEGORIES = [
  { id: "all", label: "All genres", movie: null, tv: null },
  { id: "28", label: "Action", movie: [28], tv: [10759] },
  { id: "12", label: "Adventure", movie: [12], tv: [10759] },
  { id: "16", label: "Animation", movie: [16], tv: [16] },
  { id: "35", label: "Comedy", movie: [35], tv: [35] },
  { id: "80", label: "Crime", movie: [80], tv: [80] },
  { id: "99", label: "Documentary", movie: [99], tv: [99] },
  { id: "18", label: "Drama", movie: [18], tv: [18] },
  { id: "10751", label: "Family", movie: [10751], tv: [10751] },
  { id: "10765", label: "Fantasy & sci-fi", movie: [14, 878], tv: [10765] },
  { id: "27", label: "Horror", movie: [27], tv: [27] },
  { id: "9648", label: "Mystery", movie: [9648], tv: [9648] },
  { id: "10749", label: "Romance", movie: [10749], tv: [10749] },
  { id: "53", label: "Thriller", movie: [53], tv: [53] },
];

function discoverPath(kind, page, category, sort) {
  const genreIds = category.id === "all" ? [] : category[kind] || [];
  const params = new URLSearchParams({
    include_adult: "false",
    sort_by: sort === "newest"
      ? kind === "movie" ? "primary_release_date.desc" : "first_air_date.desc"
      : sort,
    page: String(page),
  });
  if (sort === "vote_average.desc") params.set("vote_count.gte", "100");
  if (sort === "newest") {
    params.set("vote_count.gte", "20");
    params.set("include_video", "false");
    params.set(kind === "movie" ? "primary_release_date.lte" : "first_air_date.lte", new Date().toISOString().slice(0, 10));
  }
  if (genreIds.length) params.set("with_genres", genreIds.join("|"));
  return `/discover/${kind}?${params.toString()}`;
}

export default function BrowsePage({
  apiKey,
  offline,
  onSelect,
  watched,
  onMarkWatched,
  onMarkUnwatched,
}) {
  const [categoryId, setCategoryId] = useState("all");
  const [type, setType] = useState("all");
  const [sort, setSort] = useState("popularity.desc");
  const [items, setItems] = useState([]);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const sentinelRef = useRef(null);
  const loadingMoreRef = useRef(false);
  const generationRef = useRef(0);
  const pagesRef = useRef({ movie: 1, tv: 1 });
  const totalsRef = useRef({ movie: Infinity, tv: Infinity });
  const seenRef = useRef(new Set());
  const activeCategory = CATEGORIES.find((entry) => entry.id === categoryId) || CATEGORIES[0];
  const sources = useMemo(() => type === "all" ? ["movie", "tv"] : [type], [type]);

  const fetchUntil = useCallback(async (targetCount, generation) => {
    const batch = [];
    while (batch.length < targetCount && generationRef.current === generation) {
      const eligible = sources.filter((kind) => pagesRef.current[kind] <= totalsRef.current[kind]);
      if (!eligible.length) break;
      const requests = eligible.map(async (kind) => {
        const page = pagesRef.current[kind]++;
        const data = await tmdbFetch(discoverPath(kind, page, activeCategory, sort), apiKey);
        totalsRef.current[kind] = Math.max(1, data.total_pages || 1);
        return (data.results || []).map((item) => ({ ...item, media_type: kind }));
      });
      const lists = await Promise.all(requests);
      for (const item of lists.flat()) {
        const key = `${item.media_type}_${item.id}`;
        if (!seenRef.current.has(key)) {
          seenRef.current.add(key);
          batch.push(item);
        }
      }
      if (eligible.every((kind) => pagesRef.current[kind] > totalsRef.current[kind])) break;
    }
    batch.sort((a, b) => {
      if (sort === "vote_average.desc") return (b.vote_average || 0) - (a.vote_average || 0);
      if (sort === "newest") {
        return (b.release_date || b.first_air_date || "").localeCompare(a.release_date || a.first_air_date || "");
      }
      return (b.popularity || 0) - (a.popularity || 0);
    });
    return { batch, moreAvailable: sources.some((kind) => pagesRef.current[kind] <= totalsRef.current[kind]) };
  }, [activeCategory, apiKey, sort, sources]);

  useEffect(() => {
    const generation = ++generationRef.current;
    pagesRef.current = { movie: 1, tv: 1 };
    totalsRef.current = { movie: Infinity, tv: Infinity };
    seenRef.current = new Set();
    loadingMoreRef.current = false;
    setItems([]);
    setVisibleCount(PAGE_SIZE);
    setHasMore(true);
    setError(false);
    if (!apiKey || offline) return undefined;
    setLoading(true);
    fetchUntil(PAGE_SIZE, generation)
      .then(({ batch, moreAvailable }) => {
        if (generationRef.current !== generation) return;
        setItems(batch);
        setHasMore(moreAvailable);
        setLoading(false);
      })
      .catch(() => {
        if (generationRef.current === generation) {
          setError(true);
          setLoading(false);
        }
      });
    return () => { generationRef.current++; };
  }, [apiKey, offline, categoryId, type, sort, fetchUntil]);

  const loadMore = useCallback(async () => {
    if (loading || loadingMoreRef.current || !hasMore || offline) return;
    const generation = generationRef.current;
    loadingMoreRef.current = true;
    setLoadingMore(true);
    try {
      const { batch, moreAvailable } = await fetchUntil(PAGE_SIZE, generation);
      if (generationRef.current !== generation) return;
      setItems((current) => [...current, ...batch]);
      setVisibleCount((count) => count + PAGE_SIZE);
      setHasMore(moreAvailable && batch.length > 0);
    } catch {
      if (generationRef.current === generation) setError(true);
    } finally {
      loadingMoreRef.current = false;
      if (generationRef.current === generation) setLoadingMore(false);
    }
  }, [fetchUntil, hasMore, loading, loadingMore, offline]);

  useEffect(() => {
    if (!sentinelRef.current || !hasMore || loading || loadingMore) return undefined;
    const observer = new IntersectionObserver((entries) => {
      if (entries[0]?.isIntersecting) loadMore();
    }, { rootMargin: "160px" });
    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [hasMore, loading, loadingMore, loadMore, items.length]);

  const pageItems = useMemo(() => items.slice(0, visibleCount), [items, visibleCount]);
  const { ratingsMap, ageLimitSetting } = useRatings(pageItems);
  const visibleItems = useMemo(() => pageItems.filter((item) =>
    !isRestricted(getRatingForItem(item, ratingsMap).minAge, ageLimitSetting),
  ), [pageItems, ratingsMap, ageLimitSetting]);

  const title = categoryId === "all" ? "Explore movies & series" : activeCategory.label;

  return (
    <section className="browse-page" aria-label="Discover movies and series">
      <header className="browse-hero">
        <div className="browse-hero-copy">
          <div className="browse-eyebrow">Aureon Discover</div>
          <h1>Find your next<br /><span>favorite story.</span></h1>
          <p>Pick a mood, explore a genre, and let the next great watch find you.</p>
        </div>
        <div className="browse-hero-art" aria-hidden="true">
          <div className="browse-orbit browse-orbit-one" />
          <div className="browse-orbit browse-orbit-two" />
          <div className="browse-art-label">DISCOVER<br />SOMETHING<br /><strong>NEW</strong></div>
        </div>
      </header>

      <section className="browse-controls" aria-label="Browse filters">
        <div className="browse-section-heading">
          <div><div className="browse-eyebrow">Browse by mood</div><h2>Choose a category</h2></div>
          <div className="browse-control-group" role="group" aria-label="Show">
            {TYPES.map((option) => <button key={option.id} className={type === option.id ? "active" : ""}
              onClick={() => setType(option.id)} aria-pressed={type === option.id}>{option.label}</button>)}
          </div>
        </div>
        <div className="browse-category-list" role="group" aria-label="Genres">
          {CATEGORIES.map((category) => <button key={category.id}
            className={`browse-category${category.id === categoryId ? " active" : ""}`}
            onClick={() => setCategoryId(category.id)} aria-pressed={category.id === categoryId}>
            {category.id === "all" ? <span className="browse-category-spark">✦</span> : null}{category.label}
          </button>)}
        </div>
      </section>

      <section className="browse-results" aria-label="Browse results">
        <div className="browse-results-top">
          <div>
            <div className="browse-eyebrow">Curated for your next watch</div>
            <h2>{title}<span>{visibleItems.length} titles</span></h2>
          </div>
          <label className="browse-sort">Sort by
            <select value={sort} onChange={(event) => setSort(event.target.value)}>
              {SORTS.map((option) => <option key={option.id} value={option.id}>{option.label}</option>)}
            </select>
          </label>
        </div>

        {offline ? <div className="browse-message">Connect to the internet to explore the catalog.</div> : null}
        {loading ? <div className="browse-loading"><span className="spinner" /> Loading your first picks…</div> : null}
        {error && !loading ? <div className="browse-message">Couldn’t load more titles. Check your connection and try again.</div> : null}
        {!loading && !error && visibleItems.length === 0 ? <div className="browse-message">No titles found in this category.</div> : null}
        <div className="browse-grid">
          {visibleItems.map((item) => {
            const rating = getRatingForItem(item, ratingsMap);
            return <MediaCard key={`${item.media_type}_${item.id}`} item={item}
              onClick={() => onSelect(item)} watched={watched}
              onMarkWatched={onMarkWatched} onMarkUnwatched={onMarkUnwatched}
              ageRating={rating.cert}
              restricted={isRestricted(rating.minAge, ageLimitSetting)} />;
          })}
        </div>
        <div ref={sentinelRef} className="browse-sentinel" aria-hidden="true" />
        {hasMore && !offline && !loading ? (
          <div className="browse-more-wrap">
            <button className="btn btn-secondary browse-more" onClick={loadMore} disabled={loadingMore}>
              {loadingMore ? <><span className="spinner" /> Loading more…</> : "See more titles"}
            </button>
            <span>More titles load as you scroll</span>
          </div>
        ) : null}
      </section>
    </section>
  );
}
