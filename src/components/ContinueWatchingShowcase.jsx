import { useEffect, useMemo, useState } from "react";
import {
  FilmIcon,
  PlayIcon,
  RatingLockIcon,
  RatingShieldIcon,
  StarIcon,
  WatchedIcon,
} from "./Icons";
import { imgUrl } from "../utils/api";

function progressKey(item) {
  return item._pk || (item.media_type === "movie"
    ? `movie_${item.id}`
    : `tv_${item.id}_s${item.season}e${item.episode}`);
}

function yearFor(item) {
  return (item.release_date || item.first_air_date || "").slice(0, 4);
}

function titleFor(item) {
  return item.title || item.name || "Untitled";
}

export default function ContinueWatchingShowcase({
  items,
  progress,
  onSelect,
  onMarkWatched,
  getRating,
  itemRestricted,
}) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  // One resume card per title. For series, keep the latest episode the viewer
  // opened so the carousel does not fill up with duplicate show posters.
  const resumeItems = useMemo(() => {
    const ordered = [...items].sort((a, b) => (b.watchedAt || 0) - (a.watchedAt || 0));
    const seen = new Set();
    return ordered.filter((item) => {
      const key = `${item.media_type || "movie"}_${item.id}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, [items]);

  // New playback history is sorted to the front. Move the spotlight back to
  // that newest item when a fresh play is recorded, without resetting the
  // viewer's carousel selection on routine progress updates.
  const latestItem = resumeItems[0];
  const latestPlayback = latestItem
    ? `${latestItem.media_type || "movie"}_${latestItem.id}_${latestItem.watchedAt || ""}`
    : "";
  useEffect(() => {
    setSelectedIndex(0);
  }, [latestPlayback]);

  if (resumeItems.length === 0) {
    return (
      <section className="continue-showcase" aria-label="Continue watching">
        <header className="continue-showcase__heading">
          <div>
            <span className="continue-showcase__eyebrow">PICK UP WHERE YOU LEFT OFF</span>
            <h2>Continue Watching</h2>
          </div>
        </header>
        <div className="continue-showcase__empty">
          <span className="continue-showcase__empty-icon"><FilmIcon /></span>
          <div>
            <strong>Your next watch will be here</strong>
            <p>Start a movie or episode, and your saved progress will show up here.</p>
          </div>
        </div>
      </section>
    );
  }

  const index = selectedIndex % resumeItems.length;
  const activeItem = resumeItems[index];
  const activeKey = progressKey(activeItem);
  const savedProgress = Number(progress[activeKey]);
  const hasProgress = Number.isFinite(savedProgress) && savedProgress > 2 && savedProgress < 98;
  const pct = hasProgress ? Math.round(Math.min(100, Math.max(0, savedProgress))) : 0;
  const isSeries = activeItem.media_type === "tv";
  const title = titleFor(activeItem);
  const poster = activeItem.poster_path ? imgUrl(activeItem.poster_path, "w500") : null;
  const backdrop = activeItem.backdrop_path || activeItem.poster_path;
  const backdropUrl = backdrop ? imgUrl(backdrop, "w1280") : null;
  const date = activeItem.watchedAt
    ? new Date(activeItem.watchedAt).toLocaleDateString(undefined, { month: "short", day: "numeric" })
    : null;
  const ageRating = getRating?.(activeItem)?.cert;
  const restricted = itemRestricted?.(activeItem);

  const move = (direction) => {
    setSelectedIndex((current) => (current + direction + resumeItems.length) % resumeItems.length);
  };

  const getItemAt = (offset) =>
    resumeItems[(index + offset + resumeItems.length) % resumeItems.length];

  return (
    <section className="continue-showcase" aria-label="Continue watching">
      <header className="continue-showcase__heading">
        <div>
          <span className="continue-showcase__eyebrow">PICK UP WHERE YOU LEFT OFF</span>
          <h2>Continue Watching</h2>
        </div>
        <span className="continue-showcase__count">
          <strong>{String(index + 1).padStart(2, "0")}</strong> / {String(resumeItems.length).padStart(2, "0")}
        </span>
      </header>

      <div className="continue-showcase__stage">
        {backdropUrl && (
          <div
            className="continue-showcase__backdrop"
            style={{ backgroundImage: `url("${backdropUrl}")` }}
            aria-hidden="true"
          />
        )}

        <div className="continue-showcase__details" key={activeKey}>
          <span className="continue-showcase__kicker">
            {hasProgress ? (isSeries ? "SERIES IN PROGRESS" : "MOVIE IN PROGRESS") : "RECENTLY OPENED"}
          </span>
          <h3 title={title}>{title}</h3>
          <div className="continue-showcase__meta">
            {yearFor(activeItem) && <span>{yearFor(activeItem)}</span>}
            <span>{isSeries ? "Series" : "Movie"}</span>
            {isSeries && activeItem.season != null && activeItem.episode != null && (
              <span>S{String(activeItem.season).padStart(2, "0")} · E{String(activeItem.episode).padStart(2, "0")}</span>
            )}
            {activeItem.vote_average > 0 && (
              <span className="continue-showcase__rating"><StarIcon size={11} /> {activeItem.vote_average.toFixed(1)}</span>
            )}
            {ageRating && (
              <span className={`continue-showcase__age${restricted ? " continue-showcase__age--restricted" : ""}`}>
                {restricted ? <RatingLockIcon size={10} /> : <RatingShieldIcon size={10} />}
                {ageRating}
              </span>
            )}
          </div>
          {isSeries && activeItem.episodeName && (
            <p className="continue-showcase__episode">{activeItem.episodeName}</p>
          )}
          {activeItem.overview && <p className="continue-showcase__overview">{activeItem.overview}</p>}

          {hasProgress ? (
            <>
              <div className="continue-showcase__progress-copy">
                <span>Your progress</span>
                <strong>{pct}% watched</strong>
              </div>
              <div
                className="continue-showcase__progress-track"
                role="progressbar"
                aria-label={`${title} watch progress`}
                aria-valuemin="0"
                aria-valuemax="100"
                aria-valuenow={pct}
              >
                <span style={{ width: `${pct}%` }} />
              </div>
            </>
          ) : (
            <div className="continue-showcase__last-watched">Playback position not saved by this source</div>
          )}
          <div className="continue-showcase__last-watched">
            {date ? `Last opened ${date}` : "Saved to your watch history"}
          </div>

          <div className="continue-showcase__actions">
            <button className="continue-showcase__resume" onClick={() => onSelect(activeItem)}>
              <PlayIcon /> {hasProgress ? "Continue" : "Open title"}
            </button>
            <button
              className="continue-showcase__watched"
              onClick={() => onMarkWatched?.(activeKey)}
              title="Mark this title as watched"
            >
              <WatchedIcon size={16} /> Mark watched
            </button>
          </div>
        </div>

        <div className="continue-showcase__artwork" aria-label="Titles in progress">
          {resumeItems.length > 2 && (
            <button
              className="continue-showcase__poster continue-showcase__poster--side continue-showcase__poster--previous"
              onClick={() => move(-1)}
              aria-label={`Show previous title: ${titleFor(getItemAt(-1))}`}
            >
              <Poster item={getItemAt(-1)} />
            </button>
          )}
          {resumeItems.length > 1 && (
            <button
              className="continue-showcase__poster continue-showcase__poster--side continue-showcase__poster--next"
              onClick={() => move(1)}
              aria-label={`Show next title: ${titleFor(getItemAt(1))}`}
            >
              <Poster item={getItemAt(1)} />
            </button>
          )}
          <button
            className="continue-showcase__poster continue-showcase__poster--active"
            onClick={() => onSelect(activeItem)}
            aria-label={`Continue ${title}`}
          >
            <Poster item={activeItem} />
            {hasProgress && <span className="continue-showcase__poster-progress"><span style={{ width: `${pct}%` }} /></span>}
          </button>

          {resumeItems.length > 1 && (
            <div className="continue-showcase__controls">
              <button onClick={() => move(-1)} aria-label="Previous title">‹</button>
              <span>{String(index + 1).padStart(2, "0")} <i /> {String(resumeItems.length).padStart(2, "0")}</span>
              <button onClick={() => move(1)} aria-label="Next title">›</button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function Poster({ item }) {
  const poster = item.poster_path ? imgUrl(item.poster_path, "w342") : null;
  return poster ? (
    <img src={poster} alt="" draggable="false" loading="lazy" />
  ) : (
    <span className="continue-showcase__poster-placeholder"><FilmIcon /></span>
  );
}
