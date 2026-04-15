import { useRef, useEffect } from "preact/hooks";

function deduplicateByCountry(records) {
  const seen = new Set();
  const result = [];
  for (const record of records) {
    if (seen.has(record.country)) {
      const existing = result.find((r) => r.country === record.country);
      if (existing) existing.addresses.push(record.address);
      continue;
    }
    seen.add(record.country);
    result.push({ ...record, addresses: [record.address] });
  }
  return result;
}

export function MapOutput({ records }) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: "mapbox://styles/mapbox/streets-v11",
    });
    map.addControl(new mapboxgl.NavigationControl(), "top-right");
    mapRef.current = map;
    return () => map.remove();
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const update = () => {
      if (map.getLayer("markers")) {
        map.removeLayer("markers");
        map.removeSource("markersSource");
      }

      map.setZoom(2).setCenter([0, 0]);

      if (!records || !records.length) return;

      const deduplicated = deduplicateByCountry(records);

      map.addSource("markersSource", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: deduplicated.map((record) => ({
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: [...record.coordinates].reverse(),
            },
            properties: {
              title: record.country,
              description: record.addresses.join(", "),
            },
          })),
        },
      });

      map.addLayer({
        id: "markers",
        type: "circle",
        source: "markersSource",
        paint: {
          "circle-radius": 6,
          "circle-color": "#007cbf",
        },
      });

      const bounds = deduplicated.reduce((b, record) => {
        return b.extend([...record.coordinates].reverse());
      }, new mapboxgl.LngLatBounds());

      map.fitBounds(bounds, { maxZoom: 2 });
      map.resize();
    };

    if (map.loaded()) {
      update();
    } else {
      map.on("load", update);
    }
  }, [records]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const id = requestAnimationFrame(() => {
      if (mapRef.current) map.resize();
    });
    return () => cancelAnimationFrame(id);
  });

  return <div class="map-container" ref={containerRef} />;
}
