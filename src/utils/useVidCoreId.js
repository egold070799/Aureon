import { useEffect, useState } from "react";
import { tmdbFetch } from "./api";

const imdbIdCache = new Map();

// VidCore accepts either TMDB or IMDb identifiers, but some catalogue entries
// only resolve correctly there by IMDb ID. Resolve it only when VidCore is
// selected, then use the TMDB ID as a fallback if the lookup has no result.
export default function useVidCoreId({
  enabled,
  mediaType,
  itemId,
  apiKey,
  knownImdbId,
}) {
  const lookupKey = `${mediaType}:${itemId}`;
  const [resolved, setResolved] = useState({ key: null, id: null, loading: false });
  const normalizedKnownId = knownImdbId ? String(knownImdbId) : null;

  useEffect(() => {
    if (!enabled || !itemId) return undefined;

    if (normalizedKnownId) {
      imdbIdCache.set(lookupKey, normalizedKnownId);
      setResolved({ key: lookupKey, id: normalizedKnownId, loading: false });
      return undefined;
    }

    const cachedId = imdbIdCache.get(lookupKey);
    if (cachedId) {
      setResolved({ key: lookupKey, id: cachedId, loading: false });
      return undefined;
    }

    let active = true;
    setResolved({ key: lookupKey, id: null, loading: true });
    tmdbFetch(`/${mediaType}/${itemId}/external_ids`, apiKey)
      .then((externalIds) => {
        if (!active) return;
        const id = externalIds?.imdb_id || String(itemId);
        imdbIdCache.set(lookupKey, id);
        setResolved({ key: lookupKey, id, loading: false });
      })
      .catch(() => {
        if (!active) return;
        const fallbackId = String(itemId);
        setResolved({ key: lookupKey, id: fallbackId, loading: false });
      });

    return () => {
      active = false;
    };
  }, [enabled, mediaType, itemId, apiKey, lookupKey, normalizedKnownId]);

  const resolvedId =
    normalizedKnownId || (resolved.key === lookupKey ? resolved.id : null);

  return {
    id: resolvedId || String(itemId),
    loading: enabled && !resolvedId,
  };
}
