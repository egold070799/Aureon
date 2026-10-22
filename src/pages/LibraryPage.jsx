import { useCallback, useMemo, useState, useEffect } from "react";
import MediaCard from "../components/MediaCard";
import { imgUrl } from "../utils/api";
import { EyeIcon, WatchedIcon } from "../components/Icons";
import { useRatings, getRatingForItem } from "../utils/useRatings";
import { isRestricted } from "../utils/ageRating";
import { storage, STORAGE_KEYS } from "../utils/storage";

const historyDateFormatter = new Intl.DateTimeFormat(undefined, {
  year: "numeric",
  month: "short",
  day: "numeric",
});

export default function LibraryPage({
  history,
  inProgress,
  saved,
  progress,
  onSelect,
  watched,
  onMarkWatched,
  onMarkUnwatched,
  onRemoveHistory,
}) {
  const allItems = useMemo(
    () => [...inProgress, ...saved],
    [inProgress, saved],
  );
  const { ratingsMap, ageLimitSetting } = useRatings(allItems);

  const [sort, setSort] = useState(
    () => storage.get(STORAGE_KEYS.LIBRARY_SORT) || "manual",
  );
  useEffect(() => {
    const handler = (e) => setSort(e.detail);
    window.addEventListener("Aureon:library-sort-changed", handler);
    return () =>
      window.removeEventListener("Aureon:library-sort-changed", handler);
  }, []);

  const sortLabels = {
    manual: "Custom order",
    title: "A-Z",
    rating: "Top rated",
    year: "Newest first",
  };

  const getRating = useCallback(
    (item) => getRatingForItem(item, ratingsMap),
    [ratingsMap],
  );
  const itemRestricted = useCallback(
    (item) => isRestricted(getRating(item).minAge, ageLimitSetting),
    [getRating, ageLimitSetting],
  );

  return (
    <div className="fade-in">
      <div className="library-header">
        <h1 className="library-title">My Library</h1>
        <div className="library-sub">
          Watch history, progress, and saved titles
        </div>
      </div>

      {inProgress.length > 0 && (
        <div className="library-section">
          <h2 className="library-section-title">Continue Watching</h2>
          <div className="cards-grid">
            {inProgress.map((item, i) => {
              const pk =
                item.media_type === "movie"
                  ? `movie_${item.id}`
                  : `tv_${item.id}_s${item.season}e${item.episode}`;
              const r = getRating(item);
              const restr = itemRestricted(item);
              return (
                <MediaCard
                  key={pk}
                  item={item}
                  onClick={() => onSelect(item)}
                  progress={progress[pk] || 0}
                  watched={watched}
                  onMarkWatched={onMarkWatched}
                  onMarkUnwatched={onMarkUnwatched}
                  ageRating={r.cert}
                  restricted={restr}
                />
              );
            })}
          </div>
        </div>
      )}

      {saved.length > 0 && (
        <div className="library-section">
          <h2 className="library-section-title">
            Watchlist ({saved.length})
            {sort !== "manual" && (
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 400,
                  color: "var(--text3)",
                  marginLeft: 10,
                }}
              >
                {sortLabels[sort]}
              </span>
            )}
          </h2>
          <div className="cards-grid">
            {saved.map((item) => {
              const r = getRating(item);
              const restr = itemRestricted(item);
              return (
                <MediaCard
                  key={`${item.media_type}_${item.id}`}
                  item={item}
                  onClick={() => onSelect(item)}
                  watched={watched}
                  onMarkWatched={onMarkWatched}
                  onMarkUnwatched={onMarkUnwatched}
                  ageRating={r.cert}
                  restricted={restr}
                />
              );
            })}
          </div>
        </div>
      )}

      {history.length > 0 && (
        <div className="library-section">
          <h2 className="library-section-title">Watch History</h2>
          <div className="history-rows">
            {history.map((item, i) => {
              const pk =
                item.media_type === "movie"
                  ? `movie_${item.id}`
                  : `tv_${item.id}_s${item.season}e${item.episode}`;
              const isWatched = !!watched?.[pk];
              return (
                <div
                  key={`${pk}_${item.watchedAt}`}
                  className="history-row"
                  role="group"
                  aria-label={`Watch history: ${item.title}`}
                >
                  <button
                    type="button"
                    className="history-open"
                    onClick={() => onSelect(item)}
                    aria-label={`Open ${item.title}`}
                  >
                    <span className="history-thumb">
                      {item.poster_path && (
                        <img src={imgUrl(item.poster_path, "w92")} alt="" width="92" height="138" loading="lazy" />
                      )}
                    </span>
                    <span className="history-open__copy">
                      <span className="history-open__title">
                        {item.title}
                        {isWatched && <WatchedIcon size={16} />}
                      </span>
                      <span className="history-open__date">
                        {item.media_type === "tv" && item.season != null && item.episode != null && (
                          <>{`S${item.season}E${item.episode}`}{item.episodeName ? ` · ${item.episodeName}` : ""}{" · "}</>
                        )}
                        {historyDateFormatter.format(new Date(item.watchedAt))}
                      </span>
                    </span>
                  </button>
                  <span
                    className={`search-result-type ${item.media_type === "tv" ? "type-tv" : "type-movie"}`}
                  >
                    {item.media_type === "tv" ? "Series" : "Movie"}
                  </span>
                  {onRemoveHistory && (
                    <button
                      className="history-remove-btn"
                      title="Remove from history"
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemoveHistory(item);
                      }}
                    >
                      ✕
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {history.length === 0 && saved.length === 0 && (
        <div className="empty-state">
          <EyeIcon />
          <h3>Nothing here yet</h3>
          <p>
            Start watching a movie or series and your history will appear here.
          </p>
        </div>
      )}
    </div>
  );
}
