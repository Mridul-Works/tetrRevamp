// Generates public/data/land-dots.bin: evenly spread points that fall on land, as Int16 pairs
// (lat * 100, lng * 100). RouteGlobe reads this to draw the continents as a dot matrix.
// Run: node scripts/land-dots.mjs
import { readFileSync, writeFileSync } from "node:fs";
import { feature } from "topojson-client";

const TOTAL = 56000; // points over the whole sphere; roughly 29% land
const topo = JSON.parse(readFileSync(new URL("../node_modules/world-atlas/land-50m.json", import.meta.url)));
const land = feature(topo, topo.objects.land);

// Planar ray casting in lon/lat with edges bucketed by 1° latitude band (world-atlas rings are
// already cut at the antimeridian, so planar tests are fine away from the poles).
const bands = Array.from({ length: 180 }, () => []);
const addRing = (ring) => {
  for (let i = 0, n = ring.length - 1; i < n; i++) {
    const [x1, y1] = ring[i];
    const [x2, y2] = ring[i + 1];
    if (y1 === y2) continue;
    const lo = Math.max(0, Math.floor(Math.min(y1, y2) + 90));
    const hi = Math.min(179, Math.floor(Math.max(y1, y2) + 90));
    for (let b = lo; b <= hi; b++) bands[b].push(x1, y1, x2, y2);
  }
};
for (const f of land.features) {
  const polys = f.geometry.type === "Polygon" ? [f.geometry.coordinates] : f.geometry.coordinates;
  for (const poly of polys) for (const ring of poly) addRing(ring);
}
const onLand = (lng, lat) => {
  const e = bands[Math.floor(lat + 90)];
  let inside = false;
  for (let i = 0; i < e.length; i += 4) {
    const x1 = e[i], y1 = e[i + 1], x2 = e[i + 2], y2 = e[i + 3];
    if (y1 > lat !== y2 > lat && lng < ((x2 - x1) * (lat - y1)) / (y2 - y1) + x1) inside = !inside;
  }
  return inside;
};

const golden = Math.PI * (3 - Math.sqrt(5));
const out = [];
for (let i = 0; i < TOTAL; i++) {
  const y = 1 - (i / (TOTAL - 1)) * 2;
  const lat = (Math.asin(y) * 180) / Math.PI;
  const lng = ((((golden * i * 180) / Math.PI) % 360) + 540) % 360 - 180;
  if (Math.abs(lat) > 84) continue; // skip the poles
  if (onLand(lng, lat)) out.push(Math.round(lat * 100), Math.round(lng * 100));
}
const buf = Buffer.from(new Int16Array(out).buffer);
writeFileSync(new URL("../public/data/land-dots.bin", import.meta.url), buf);
console.log(`${out.length / 2} land dots, ${buf.length} bytes`);
