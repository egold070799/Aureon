import { useState, useEffect, useRef, useCallback, useMemo, memo } from "react";
import { imgUrl, isAnimeContent } from "../utils/api";
import { StarIcon, ChevronLeftIcon, ChevronRightIcon } from "./Icons";

const VISIBLE = 5;
const HALF = Math.floor(VISIBLE / 2);

// ── Helpers ───────────────────────────────────────────────────────────────────

// Compute visibility ratio of el inside scrollRoot (or viewport)
function visibilityRatio(el, scrollRoot) {
  const r = el.getBoundingClientRect();
  const rootTop = scrollRoot ? scrollRoot.getBoundingClientRect().top : 0;
  const rootHeight = scrollRoot
    ? scrollRoot.getBoundingClientRect().height
    : window.innerHeight;
  const visTop = Math.max(r.top, rootTop);
  const visBottom = Math.min(r.bottom, rootTop + rootHeight);
  const px = Math.max(0, visBottom - visTop);
  return r.height > 0 ? px / r.height : 0;
}

// ── Sub-components ────────────────────────────────────────────────────────────

const RatingBadge = memo(function RatingBadge({ cert, restricted }) {
  if (!cert) return null;
  return (
    <span
      className={`carousel-rating-badge${restricted ? " carousel-rating-badge--restricted" : ""}`}
      title={restricted ? "Age-restricted" : `Rated ${cert}`}
    >
      {cert}
    </span>
  );
});

const CarouselSlot = memo(function CarouselSlot({
  item,
  offset,
  onSelect,
  onFocus,
  animating,
  ageRating,
  restricted,
  isAnime,
}) {
  if (!item) return null;
  const isCenter = offset === 0;
  const abs = Math.abs(offset);
  const title = item.title || item.name;
  const poster = imgUrl(item.poster_path, "w342");

  const scale = isCenter ? 1 : abs === 1 ? 0.75 : 0.54;
  const opacity = isCenter ? 1 : abs === 1 ? 0.65 : 0.35;
  const tx = offset * 150;

  // Stable date comparison — avoids new Date() on every render by caching today
  const rawDate = item.release_date || item.first_air_date;
  const isUnreleased = useMemo(() => {
    if (!rawDate) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return new Date(rawDate) > today;
  }, [rawDate]);

  const releaseLabel = useMemo(
    () =>
      rawDate
        ? new Date(rawDate).toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
            year: "numeric",
          })
        : null,
    [rawDate],
  );

  return (
    <div
      className={`carousel-item${isCenter ? " carousel-item--active" : ""}${animating ? " carousel-item--animating" : ""}`}
      role="button"
      tabIndex={0}
      aria-label={`${isCenter ? "Open" : "Select"} ${title}`}
      style={{
        transform: `translateX(${tx}px) scale(${scale})`,
        opacity,
        zIndex: isCenter ? 10 : abs === 1 ? 6 : 2,
        cursor: "pointer",
        pointerEvents: "auto",
      }}
      onClick={isCenter ? onSelect : onFocus}
      onKeyDown={(event) => {
        if (event.key !== "Enter" && event.key !== " ") return;
        event.preventDefault();
        isCenter ? onSelect?.() : onFocus?.();
      }}
    >
      <div className="carousel-poster-wrap">
        {poster ? (
          <img
            src={poster}
            alt={title}
            className="carousel-poster"
            draggable={false}
            loading={abs > 1 ? "lazy" : "eager"}
          />
        ) : (
          <div className="carousel-poster carousel-poster--placeholder">
            <span>{title}</span>
          </div>
        )}

        {isUnreleased && (
          <div className="carousel-unreleased-overlay">
            <span className="carousel-unreleased-label">🔒 Coming Soon</span>
            {releaseLabel && (
              <span className="carousel-unreleased-date">{releaseLabel}</span>
            )}
          </div>
        )}

        {isCenter && item.vote_average > 0 && (
          <div className="carousel-score">
            <StarIcon size={10} />
            {item.vote_average.toFixed(1)}
          </div>
        )}
        {isCenter && (
          <div className="carousel-badge-wrap">
            <RatingBadge cert={ageRating} restricted={restricted} />
          </div>
        )}
        {isCenter && isAnime && (
          <div className="carousel-anime-badge">ANIME</div>
        )}
      </div>

    </div>
  );
});

// ── Main component ────────────────────────────────────────────────────────────

export default function TrendingCarousel({
  items,
  onSelect,
  title,
  titleHighlight,
  ratingsMap = {},
}) {
  const count = items.length;
  const activeRef = useRef(0);
  const [active, setActive] = useState(0);
  const [direction, setDirection] = useState(1);
  const [animating, setAnimating] = useState(false);

  const intervalRef = useRef(null);
  const isFocusedRef = useRef(false);
  const wheelThrottle = useRef(false);
  const touchStartX = useRef(null);
  const containerRef = useRef(null);
  const animTimeout = useRef(null);
  const sectionRef = useRef(null);

  // ── Navigation ─────────────────────────────────────────────────────────────

  const go = useCallback(
    (idx) => {
      const next = ((idx % count) + count) % count;
      const curr = activeRef.current;
      if (next === curr) return;
      const fwd = (next - curr + count) % count;
      setDirection(fwd <= count / 2 ? 1 : -1);
      setAnimating(true);
      clearTimeout(animTimeout.current);
      animTimeout.current = setTimeout(() => setAnimating(false), 420);
      activeRef.current = next;
      setActive(next);
    },
    [count],
  );

  const goNext = useCallback(() => go(activeRef.current + 1), [go]);
  const goPrev = useCallback(() => go(activeRef.current - 1), [go]);

  const startCycle = useCallback(() => {
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => go(activeRef.current + 1), 7000);
  }, [go]);

  // resetInterval: always restarts cycle (used after manual interaction)
  const resetInterval = useCallback(() => startCycle(), [startCycle]);

  // ── Focus-aware auto-cycle ─────────────────────────────────────────────────
  // Only the carousel that is MOST visible in .main cycles automatically.

  useEffect(() => {
    if (count <= 1) return;
    const sectionEl = sectionRef.current;
    if (!sectionEl) return;
    const scrollRoot = document.querySelector(".main");

    const updateFocus = () => {
      const allSections = document.querySelectorAll(".carousel-section");
      let bestEl = null;
      let bestRatio = -1;
      allSections.forEach((el) => {
        const r = visibilityRatio(el, scrollRoot);
        if (r > bestRatio) {
          bestRatio = r;
          bestEl = el;
        }
      });

      const should = bestEl === sectionEl && bestRatio > 0.1;
      if (should && !isFocusedRef.current) {
        isFocusedRef.current = true;
        startCycle();
      } else if (!should && isFocusedRef.current) {
        isFocusedRef.current = false;
        clearInterval(intervalRef.current);
      }
    };

    const scrollEl = scrollRoot || window;
    scrollEl.addEventListener("scroll", updateFocus, { passive: true });
    window.addEventListener("resize", updateFocus, { passive: true });

    // IntersectionObserver for out-of-view fast-path (stop immediately when hidden)
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          isFocusedRef.current = false;
          clearInterval(intervalRef.current);
        } else {
          updateFocus();
        }
      },
      { root: scrollRoot, threshold: 0 },
    );
    observer.observe(sectionEl);

    // Initial check after first paint
    const id = requestAnimationFrame(updateFocus);

    return () => {
      scrollEl.removeEventListener("scroll", updateFocus);
      window.removeEventListener("resize", updateFocus);
      observer.disconnect();
      cancelAnimationFrame(id);
      clearInterval(intervalRef.current);
    };
  }, [count, startCycle]);

  // ── Wheel ──────────────────────────────────────────────────────────────────

  const handleWheel = useCallback(
    (e) => {
      // Only capture the event when the gesture is horizontal.
      const isHorizontal = Math.abs(e.deltaX) > Math.abs(e.deltaY);
      if (!isHorizontal) return;

      e.preventDefault();
      if (wheelThrottle.current) return;
      wheelThrottle.current = true;
      setTimeout(() => {
        wheelThrottle.current = false;
      }, 600);
      if (e.deltaX > 0) {
        goNext();
      } else {
        goPrev();
      }
      resetInterval();
    },
    [goNext, goPrev, resetInterval],
  );

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => el.removeEventListener("wheel", handleWheel);
  }, [handleWheel]);

  // ── Touch ──────────────────────────────────────────────────────────────────

  const onTouchStart = useCallback((e) => {
    touchStartX.current = e.touches[0].clientX;
  }, []);
  const onTouchEnd = useCallback(
    (e) => {
      if (touchStartX.current === null) return;
      const dx = e.changedTouches[0].clientX - touchStartX.current;
      touchStartX.current = null;
      if (Math.abs(dx) < 40) return;
      dx < 0 ? goNext() : goPrev();
      resetInterval();
    },
    [goNext, goPrev, resetInterval],
  );

  const handlePrev = useCallback(() => {
    goPrev();
    resetInterval();
  }, [goPrev, resetInterval]);
  const handleNext = useCallback(() => {
    goNext();
    resetInterval();
  }, [goNext, resetInterval]);
  const handleDot = useCallback(
    (i) => {
      go(i);
      resetInterval();
    },
    [go, resetInterval],
  );

  // ── Slot & rating data ─────────────────────────────────────────────────────

  // Stable slot array — only rebuilt when active or count changes
  const slots = useMemo(
    () =>
      Array.from({ length: VISIBLE }, (_, i) => {
        const offset = i - HALF;
        const idx = (((active + offset) % count) + count) % count;
        return { offset, idx };
      }),
    [active, count],
  );

  // Stable per-slot onSelect/onFocus handlers — keyed by offset so memo works
  const slotHandlers = useMemo(() => {
    const handlers = {};
    for (let i = 0; i < VISIBLE; i++) {
      const offset = i - HALF;
      const idx = (((active + offset) % count) + count) % count;
      if (offset === 0) {
        handlers[offset] = {
          onSelect: () => onSelect(items[idx]),
          onFocus: null,
        };
      } else {
        const captured = idx;
        handlers[offset] = {
          onSelect: null,
          onFocus: () => {
            go(captured);
            resetInterval();
          },
        };
      }
    }
    return handlers;
  }, [active, count, items, onSelect, go, resetInterval]);

  const activeItem = items[active];
  const activeType = activeItem?.media_type === "tv" ? "tv" : "movie";
  const activeRatingKey = activeItem ? `${activeType}_${activeItem.id}` : null;
  const activeRating = activeRatingKey ? ratingsMap[activeRatingKey] || {} : {};
  const activeYear = (activeItem?.release_date || activeItem?.first_air_date || "").slice(0, 4);
  const activeTitle = activeItem?.title || activeItem?.name;
  const activeOverview = activeItem?.overview || "Explore this title and see what makes it worth a watch.";
  const activeRatingValue = Number(activeItem?.vote_average || 0);
  const eyebrow = title.toLowerCase().includes("recommend")
    ? "Selected for you"
    : title.toLowerCase().includes("trending")
      ? "Popular right now"
      : "Audience favorites";

  const dotCount = Math.min(count, 15);

  if (!items || count === 0) return null;

  return (
    <section className="carousel-section" ref={sectionRef} aria-label={title}>
      <header className="carousel-heading">
        <div className="carousel-heading__title">
          <span className="carousel-heading__eyebrow">{eyebrow}</span>
          <h2>{titleHighlight ? <>{title} <em>{titleHighlight}</em></> : title}</h2>
        </div>
        <div className="carousel-heading__count"><span>{String(active + 1).padStart(2, "0")}</span> / {String(count).padStart(2, "0")}</div>
      </header>

      <div
        className="carousel-stage"
        onMouseEnter={() => clearInterval(intervalRef.current)}
        onMouseLeave={() => isFocusedRef.current && startCycle()}
        onFocusCapture={() => clearInterval(intervalRef.current)}
        onBlurCapture={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget) && isFocusedRef.current) startCycle();
        }}
      >
        {activeItem?.backdrop_path && (
          <div className="carousel-stage__backdrop" style={{ backgroundImage: `url("${imgUrl(activeItem.backdrop_path, "w1280")}")` }} aria-hidden="true" />
        )}
        <div className="carousel-feature">
          <span className="carousel-feature__eyebrow">{activeItem?.media_type === "tv" ? "Series spotlight" : "Movie spotlight"}</span>
          <h3>{activeTitle}</h3>
          <div className="carousel-feature__meta">
            {activeYear && <span>{activeYear}</span>}
            <span>{activeItem?.media_type === "tv" ? "Series" : "Movie"}</span>
            {activeRatingValue > 0 && <span className="carousel-feature__rating"><StarIcon size={12} /> {activeRatingValue.toFixed(1)}</span>}
            {activeRating.cert && <span>{activeRating.cert}</span>}
          </div>
          <p>{activeOverview}</p>
          <button className="carousel-feature__button" onClick={() => onSelect(activeItem)}>
            Explore title <ChevronRightIcon size={16} />
          </button>
        </div>

        <div className="carousel-track-wrap" ref={containerRef} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
          <button className="carousel-btn carousel-btn--left" onClick={handlePrev} aria-label="Previous title"><ChevronLeftIcon size={20} /></button>
          <div className={`carousel-track${animating ? ` carousel-track--dir-${direction > 0 ? "fwd" : "bwd"}` : ""}`}>
            {slots.map(({ offset, idx }) => {
              const isCenter = offset === 0;
              const ratingData = isCenter ? activeRating : {};
              const h = slotHandlers[offset];
              return (
                <CarouselSlot key={offset} item={items[idx]} offset={offset} onSelect={h.onSelect} onFocus={h.onFocus} animating={animating} ageRating={isCenter ? ratingData.cert : null} restricted={isCenter ? ratingData.restricted : false} isAnime={isCenter ? isAnimeContent(items[idx]) : false} />
              );
            })}
          </div>
          <button className="carousel-btn carousel-btn--right" onClick={handleNext} aria-label="Next title"><ChevronRightIcon size={20} /></button>
          <div className="carousel-dots">
            {Array.from({ length: dotCount }, (_, i) => <button key={`dot-${i}`} className={`carousel-dot${active === i ? " carousel-dot--active" : ""}`} onClick={() => handleDot(i)} aria-label={`Go to title ${i + 1}`} />)}
            {count > 15 && <span className="carousel-dots__more">+{count - 15}</span>}
          </div>
        </div>
      </div>
    </section>
  );
}
