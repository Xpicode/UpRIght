"use client";

import { useEffect, useRef, useState } from "react";
import { Map as MapLibreMap, Marker, AttributionControl } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, ChevronDown, ChevronUp, Mail, MapPin, Phone, Plus, Minus, Navigation } from "lucide-react";
import { site } from "@/data/site";

type Office = (typeof site.offices)[number];

// Free CARTO basemaps (no API key). Voyager = detailed streets/buildings/water.
// Alternatives: positron-gl-style (minimal light), dark-matter-gl-style (very dark —
// only use with the overlays below turned off).
const MAP_STYLE = "https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json";

// Fallback: plain OpenStreetMap raster tiles (no style.json to fetch, works almost anywhere).
const FALLBACK_STYLE = {
  version: 8 as const,
  sources: {
    osm: {
      type: "raster" as const,
      tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
      tileSize: 256,
      attribution: "© OpenStreetMap contributors",
    },
  },
  layers: [{ id: "osm", type: "raster" as const, source: "osm" }],
};

const VIEW = { zoom: 15.6, pitch: 52, bearing: -18 };
const CTRL =
  "grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-ink/70 text-white/80 backdrop-blur-xl transition hover:bg-brand hover:text-ink";

export function OfficesMap() {
  const reduce = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const markersRef = useRef<Record<string, Marker>>({});
  const [active, setActive] = useState<Office>(site.offices[0]);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  // Details card can be collapsed so the map itself is visible (handy on phones).
  const [showInfo, setShowInfo] = useState(true);

  // --- init map once ---
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    const first = site.offices[0];

    const map = new MapLibreMap({
      container: containerRef.current,
      style: MAP_STYLE,
      center: [first.coordinates.lng, first.coordinates.lat],
      zoom: reduce ? VIEW.zoom : 11,
      pitch: reduce ? 0 : VIEW.pitch,
      bearing: reduce ? 0 : VIEW.bearing,
      attributionControl: false,
      scrollZoom: false, // don't hijack page scrolling
      dragRotate: false,
    });
    map.addControl(new AttributionControl({ compact: true }), "bottom-right");
    mapRef.current = map;

    // Custom pulsing markers for every office.
    site.offices.forEach((o) => {
      const el = document.createElement("button");
      el.type = "button";
      el.className = "office-marker";
      el.setAttribute("aria-label", `${o.name} office`);
      el.innerHTML = `<span class="office-marker__ring"></span><span class="office-marker__dot"></span>`;
      el.addEventListener("click", () => setActive(o));
      markersRef.current[o.id] = new Marker({ element: el, anchor: "center" })
        .setLngLat([o.coordinates.lng, o.coordinates.lat])
        .addTo(map);
    });

    // If the basemap can't load (offline / blocked CDN) still show the office panel.
    let loaded = false;
    let usingFallback = false;
    const switchToFallback = (why: string) => {
      if (usingFallback || loaded) return;
      usingFallback = true;
      console.info("[map] styled tiles unavailable, using OpenStreetMap instead:", why);
      map.setStyle(FALLBACK_STYLE);
      setFailed(true);
    };

    map.on("error", (e) => {
      const msg = e.error?.message ?? String(e);
      console.warn("[map]", msg);
      // Style/tile fetch failed before first paint → try the fallback tiles.
      if (!loaded && /style|fetch|AJAX|network/i.test(msg)) switchToFallback(msg);
      setReady(true);
    });
    // If the CARTO style hasn't loaded after 15s (slow connection), don't sit on a blank box.
    const timeout = setTimeout(() => switchToFallback("timeout"), 15000);

    map.on("load", () => {
      loaded = true;
      clearTimeout(timeout);
      setReady(true);
      // Cinematic settle-in on first paint.
      if (!reduce) {
        map.easeTo({ zoom: VIEW.zoom, duration: 2200, easing: (t: number) => 1 - Math.pow(1 - t, 3) });
      }
    });

    return () => {
      clearTimeout(timeout);
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // --- fly when the active office changes ---
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !ready) return;
    Object.entries(markersRef.current).forEach(([id, m]) =>
      m.getElement().classList.toggle("is-active", id === active.id),
    );
    const target: [number, number] = [active.coordinates.lng, active.coordinates.lat];
    if (reduce) {
      map.jumpTo({ center: target, zoom: VIEW.zoom });
      return;
    }
    map.flyTo({
      center: target,
      zoom: VIEW.zoom,
      pitch: VIEW.pitch,
      bearing: active.id === "manila" ? VIEW.bearing : 22,
      speed: 0.9,
      curve: 1.6,
      essential: true,
    });
  }, [active, ready, reduce]);

  function zoomBy(delta: number) {
    const map = mapRef.current;
    if (map) map.zoomTo(map.getZoom() + delta, { duration: 400 });
  }
  function recenter() {
    mapRef.current?.flyTo({
      center: [active.coordinates.lng, active.coordinates.lat],
      zoom: VIEW.zoom,
      pitch: reduce ? 0 : VIEW.pitch,
      speed: 1.2,
    });
  }

  return (
    <div className="relative h-[34rem] overflow-hidden rounded-[1.75rem] bg-[#e9e5da] md:h-[38rem]">
      {/* map canvas — inline style on purpose: maplibre-gl.css sets `position: relative`
          on the container and would otherwise beat Tailwind's `absolute inset-0` */}
      <div
        ref={containerRef}
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
      />

      {/* soft edge vignette so the map sits in the card (kept light so tiles stay readable) */}
      <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_120px_rgba(11,11,12,0.35)]" />

      {/* loading shimmer */}
      <AnimatePresence>
        {!ready && (
          <motion.div
            key="loading"
            exit={{ opacity: 0, transition: { duration: 0.6 } }}
            className="pointer-events-none absolute inset-0 flex items-center justify-center bg-ink/40 backdrop-blur-[2px]"
          >
            <span className="office-marker is-active"><span className="office-marker__ring" /><span className="office-marker__dot" /></span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* office switcher + details */}
      <div className="absolute inset-x-4 top-4 flex flex-col gap-3 md:inset-auto md:left-6 md:top-6 md:w-[22rem]">
        <div className="flex items-center gap-2 rounded-full border border-white/10 bg-ink/70 p-1 backdrop-blur-xl">
          {site.offices.map((o) => {
            const isActive = o.id === active.id;
            return (
              <button
                key={o.id}
                type="button"
                onClick={() => setActive(o)}
                className={[
                  "relative flex-1 rounded-full px-4 py-2.5 text-sm font-semibold transition",
                  isActive ? "text-ink" : "text-white/70 hover:text-white",
                ].join(" ")}
              >
                {isActive && (
                  <motion.span
                    layoutId="office-pill"
                    className="absolute inset-0 rounded-full bg-brand"
                    transition={{ type: "spring", stiffness: 400, damping: 34 }}
                  />
                )}
                <span className="relative flex items-center justify-center gap-1.5">
                  <MapPin size={14} /> {o.name}
                </span>
              </button>
            );
          })}
          {/* collapse / expand the details card */}
          <button
            type="button"
            onClick={() => setShowInfo((v) => !v)}
            aria-expanded={showInfo}
            aria-label={showInfo ? "Hide office details" : "Show office details"}
            title={showInfo ? "Hide details" : "Show details"}
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-white/70 transition hover:bg-white/10 hover:text-white"
          >
            <motion.span animate={{ rotate: showInfo ? 0 : 180 }} transition={{ duration: 0.3 }} className="grid">
              <ChevronUp size={16} />
            </motion.span>
          </button>
        </div>

        <AnimatePresence mode="wait" initial={false}>
          {showInfo && (
          <motion.div
            key={active.id}
            initial={reduce ? false : { opacity: 0, y: 14, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={reduce ? undefined : { opacity: 0, y: -10, filter: "blur(6px)", transition: { duration: 0.2 } }}
            transition={{ duration: 0.45, ease: [0.2, 0.8, 0.2, 1] }}
            className="rounded-[1.5rem] border border-white/10 bg-ink/75 p-6 text-white shadow-2xl backdrop-blur-xl"
          >
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-brand">
              {active.label}
            </p>
            <h3 className="font-display mt-1 text-2xl font-bold tracking-tight">
              {active.name} Office
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-white/70">{active.address}</p>

            <ul className="mt-4 space-y-2 text-sm">
              <li className="flex items-center gap-2.5">
                <Phone size={15} className="text-brand" />
                <a href={active.telHref} className="link-underline hover:text-brand">
                  {active.tel}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail size={15} className="text-brand" />
                <a href={`mailto:${active.email}`} className="link-underline hover:text-brand">
                  {active.email}
                </a>
              </li>
            </ul>

            <a
              href={active.mapUrl}
              target="_blank"
              rel="noreferrer"
              className="btn btn-brand mt-5 w-full !py-2.5 text-sm"
            >
              Open in Google Maps <ArrowUpRight size={16} />
            </a>
          </motion.div>
          )}
        </AnimatePresence>

        {/* compact one-liner while the card is hidden */}
        <AnimatePresence>
          {!showInfo && (
            <motion.button
              key="peek"
              type="button"
              onClick={() => setShowInfo(true)}
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="flex items-center gap-2 self-start rounded-full border border-white/10 bg-ink/70 px-3.5 py-2 text-xs font-semibold text-white/80 backdrop-blur-xl transition hover:bg-brand hover:text-ink"
            >
              <MapPin size={13} className="text-brand" /> {active.name} Office · details <ChevronDown size={13} />
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {failed && (
        <div className="absolute bottom-4 left-4 right-20 rounded-xl border border-white/10 bg-ink/80 px-3 py-2 text-xs text-white/70 backdrop-blur-xl md:right-auto md:left-6 md:bottom-6">
          Using OpenStreetMap tiles (the styled map couldn&apos;t load).
        </div>
      )}

      {/* map controls */}
      <div className="absolute bottom-4 right-4 flex flex-col gap-1.5 md:bottom-6 md:right-6">
        <button type="button" aria-label="Zoom in" onClick={() => zoomBy(1)} className={CTRL}>
          <Plus size={16} />
        </button>
        <button type="button" aria-label="Zoom out" onClick={() => zoomBy(-1)} className={CTRL}>
          <Minus size={16} />
        </button>
        <button type="button" aria-label="Recenter" onClick={recenter} className={CTRL}>
          <Navigation size={16} />
        </button>
      </div>
    </div>
  );
}
