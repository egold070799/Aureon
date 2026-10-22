import { useEffect, useMemo, useState } from "react";
import { storage } from "./storage";

const METRICS_KEY = "sourceSpeedMetrics";

function readMetrics(titleKey) {
  return storage.get(METRICS_KEY)?.[titleKey] || {};
}

function recordTiming(titleKey, sourceId, elapsedMs) {
  const allMetrics = storage.get(METRICS_KEY) || {};
  const titleMetrics = allMetrics[titleKey] || {};
  const previous = titleMetrics[sourceId] || { samples: [] };
  const samples = [...(previous.samples || []), elapsedMs].slice(-5);
  const nextSourceMetrics = {
    samples,
    averageMs: Math.round(samples.reduce((sum, ms) => sum + ms, 0) / samples.length),
    lastMeasuredAt: Date.now(),
  };
  const nextTitleMetrics = { ...titleMetrics, [sourceId]: nextSourceMetrics };
  storage.set(METRICS_KEY, { ...allMetrics, [titleKey]: nextTitleMetrics });
  return nextTitleMetrics;
}

export default function useSourceSpeed({ mediaType, itemId, sourceId, playing, webviewRef }) {
  const titleKey = `${mediaType}_${itemId}`;
  const [metrics, setMetrics] = useState(() => readMetrics(titleKey));

  useEffect(() => {
    setMetrics(readMetrics(titleKey));
  }, [titleKey]);

  useEffect(() => {
    if (!playing || !window.electron?.queryVideoProgress) return undefined;
    let active = true;
    let checking = false;
    let completed = false;
    const startedAt = performance.now();
    const startedWallClock = Date.now();
    let interval;

    const checkPlayback = async () => {
      if (Date.now() - startedWallClock >= 60000) {
        completed = true;
        clearInterval(interval);
        return;
      }
      const webview = webviewRef.current;
      if (!active || completed || checking || !webview) return;
      checking = true;
      try {
        const progress = await window.electron.queryVideoProgress(
          webview.getWebContentsId(),
        );
        if (active && progress?.duration > 0) {
          completed = true;
          const elapsedMs = Math.max(0, Math.round(performance.now() - startedAt));
          setMetrics(recordTiming(titleKey, sourceId, elapsedMs));
        }
      } catch {
        // The source may not have attached a webview yet; keep checking.
      } finally {
        checking = false;
      }
    };

    interval = setInterval(checkPlayback, 1200);
    checkPlayback();
    return () => {
      active = false;
      clearInterval(interval);
    };
  }, [playing, sourceId, titleKey, webviewRef]);

  const fastestSourceId = useMemo(() => {
    const ranked = Object.entries(metrics)
      .filter(([, value]) => value?.averageMs > 0)
      .sort((a, b) => a[1].averageMs - b[1].averageMs);
    return ranked[0]?.[0] || null;
  }, [metrics]);

  return { metrics, fastestSourceId };
}
