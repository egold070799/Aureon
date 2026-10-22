import { useState, useRef, useEffect } from "react";
import { imgUrl } from "../utils/api";
import { useSeasonalEvent } from "../components/seasonalEvents.jsx";
import {
  AureonLogo,
  HomeIcon,
  SearchIcon,
  HistoryIcon,
  FilmIcon,
  SettingsIcon,
  DownloadsQueueIcon,
  QuitIcon,
  HelpIcon,
} from "./Icons";

export default function Sidebar({
  page,
  onNavigate,
  onSearch,
  savedList,
  activeDownloads,
  onReorderSaved,
  onRemoveSaved,
  onShowShortcuts,
}) {
  const [dragOver, setDragOver] = useState(null);
  const dragItem = useRef(null);
  const dragNode = useRef(null);
  const seasonalEvent = useSeasonalEvent();

  const [contextMenu, setContextMenu] = useState(null); // { item, x, y }

  useEffect(() => {
    const close = () => setContextMenu(null);
    window.addEventListener("click", close);
    window.addEventListener("contextmenu", close);
    return () => {
      window.removeEventListener("click", close);
      window.removeEventListener("contextmenu", close);
    };
  }, []);

  const handleContextMenu = (e, item) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({ item, x: e.clientX, y: e.clientY });
  };

  const handleDragStart = (e, index) => {
    dragItem.current = index;
    dragNode.current = e.currentTarget;
    setTimeout(() => {
      if (dragNode.current) dragNode.current.style.opacity = "0.4";
    }, 0);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragEnd = () => {
    if (dragNode.current) dragNode.current.style.opacity = "1";
    dragItem.current = null;
    dragNode.current = null;
    setDragOver(null);
  };

  const handleDragEnter = (e, index) => {
    if (dragItem.current === index) return;
    setDragOver(index);
  };

  const handleDrop = (e, dropIndex) => {
    e.preventDefault();
    const fromIndex = dragItem.current;
    if (fromIndex === null || fromIndex === dropIndex) return;

    const newList = [...savedList];
    const [moved] = newList.splice(fromIndex, 1);
    newList.splice(dropIndex, 0, moved);

    const newOrder = newList.map((item) => `${item.media_type}_${item.id}`);
    onReorderSaved(newOrder);
    setDragOver(null);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  return (
    <div className="sidebar">
      <button
        className="sidebar-logo"
        onClick={() => onNavigate("home")}
        title="Go to Aureon home"
        aria-label="Go to Aureon home"
      >
        <span className="sidebar-logo-mark">
          <AureonLogo />
          {seasonalEvent && seasonalEvent.render()}
        </span>
        <span className="sidebar-brand-copy">
          <strong>Aureon</strong>
          <small>YOUR WATCH SPACE</small>
        </span>
      </button>

      <div className="sidebar-group-label">Explore</div>
      <nav className="sidebar-nav" aria-label="Main navigation">
        <SideBtn onClick={onSearch} icon={<SearchIcon />} label="Search" shortcut="Ctrl + F" />
        <SideBtn active={page === "home"} onClick={() => onNavigate("home")} icon={<HomeIcon />} label="Home" />
        <SideBtn active={page === "browse"} onClick={() => onNavigate("browse")} icon={<BrowseIcon />} label="Discover" />
        <SideBtn active={page === "history"} onClick={() => onNavigate("history")} icon={<HistoryIcon />} label="Library & History" />
        <SideBtn active={page === "downloads"} onClick={() => onNavigate("downloads")} icon={<DownloadsQueueIcon />} label="Downloads" badge={activeDownloads > 0 ? activeDownloads : null} />
      </nav>

      <div className="sidebar-sep" />

      <div className="sidebar-saved-heading">
        <span>Saved titles</span>
        <span className="sidebar-saved-count">{savedList.length}</span>
      </div>
      <div className="sidebar-saved" aria-label="Saved titles">
        {savedList.length === 0 ? <div className="sidebar-saved-empty">Saved movies and series will appear here.</div> : savedList.map((item, index) => {
          const key = `${item.media_type}_${item.id}`;
          const title = item.title || item.name;
          return (
            <div
              key={key}
              className={`saved-thumb${dragOver === index ? " drag-over" : ""}`}
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDragEnd={handleDragEnd}
              onDragEnter={(e) => handleDragEnter(e, index)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, index)}
              onClick={() =>
                onNavigate(item.media_type === "tv" ? "tv" : "movie", item)
              }
              onContextMenu={(e) => handleContextMenu(e, item)}
              style={{ cursor: "grab", position: "relative" }}
              title={`${title} · Right-click for options`}
            >
              {item.poster_path ? (
                <img src={imgUrl(item.poster_path, "w200")} alt={title} />
              ) : (
                <div className="no-img">
                  <FilmIcon />
                </div>
              )}
              <span className="saved-thumb-info">
                <strong>{title}</strong>
                <small>{item.media_type === "tv" ? "Series" : "Movie"}</small>
              </span>
              {dragOver === index && (
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 3,
                    background: "var(--accent, #e50914)",
                    borderRadius: 2,
                    pointerEvents: "none",
                  }}
                />
              )}
            </div>
          );
        })}
      </div>

      {contextMenu && (
        <div
          className="sidebar-context-menu"
          style={{
            position: "fixed",
            top: contextMenu.y,
            left: contextMenu.x,
            zIndex: 9999,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div
            className="sidebar-context-menu-item"
            onClick={() => {
              onRemoveSaved && onRemoveSaved(contextMenu.item);
              setContextMenu(null);
            }}
          >
            Remove
          </div>
        </div>
      )}

      <div className="sidebar-bottom">
        <SideBtn
          onClick={onShowShortcuts}
          icon={<HelpIcon />}
          label="Help & Shortcuts (?)"
        />
        <SideBtn
          active={page === "settings"}
          onClick={() => onNavigate("settings")}
          icon={<SettingsIcon />}
          label="Settings"
        />
        <button
          className="sidebar-btn"
          onClick={() => window.electron?.quitApp?.()}
          title="Quit App"
          style={{ color: "#e53e3e", marginTop: 4 }}
        >
          <QuitIcon />
          <span className="sidebar-label">Quit Aureon</span>
        </button>
      </div>
    </div>
  );
}

function BrowseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="10.8" cy="10.8" r="6.8" />
      <path d="m16 16 4.2 4.2M8.5 10.8h4.6M10.8 8.5v4.6" />
    </svg>
  );
}

function SideBtn({ active, onClick, icon, label, badge, shortcut, className = "" }) {
  return (
    <button
      className={`sidebar-btn ${active ? "active" : ""} ${className}`}
      onClick={onClick}
      title={shortcut ? `${label} (${shortcut})` : label}
      aria-current={active ? "page" : undefined}
    >
      <span className="sidebar-icon">{icon}</span>
      <span className="sidebar-label">{label}</span>
      {shortcut ? <span className="sidebar-shortcut">{shortcut}</span> : null}
      {badge && (
        <span className="sidebar-badge">
          {badge}
        </span>
      )}
    </button>
  );
}
