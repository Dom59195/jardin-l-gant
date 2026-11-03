// Simplified local projection: north is up, distances are in kilometres.
const centre = { lat: 50.357113, lng: 3.518332 };
const towns = [
  { name: "Lille", lat: 50.6292, lng: 3.0573, dx: -12, dy: -12, anchor: "end" },
  { name: "Tournai", lat: 50.6056, lng: 3.3878, dx: 0, dy: -14, anchor: "middle" },
  { name: "Mons", lat: 50.4542, lng: 3.9523, dx: 12, dy: -10, anchor: "start" },
  { name: "Douai", lat: 50.3708, lng: 3.0792, dx: -12, dy: 6, anchor: "end" },
  { name: "Cambrai", lat: 50.1766, lng: 3.2356, dx: 0, dy: 25, anchor: "middle" },
  { name: "Maubeuge", lat: 50.2785, lng: 3.9734, dx: 0, dy: 25, anchor: "middle" },
  { name: "Saint-Amand", lat: 50.4472, lng: 3.4307, dx: -12, dy: -10, anchor: "end" },
  { name: "Denain", lat: 50.3298, lng: 3.3943, dx: -12, dy: 26, anchor: "end" },
  { name: "Le Quesnoy", lat: 50.2482, lng: 3.6375, dx: -8, dy: 25, anchor: "end" },
] as const;

function project(lat: number, lng: number) {
  return { x: 300 + (lng - centre.lng) * 71 * 3.4, y: 220 - (lat - centre.lat) * 111.2 * 3.4 };
}

export function IllustratedSectorMap() {
  const herin = project(50.3570433, 3.4535917);
  return (
    <svg viewBox="0 0 600 440" className="h-full w-full text-primary" role="img" aria-labelledby="illustrated-map-title illustrated-map-description">
      <title id="illustrated-map-title">Communes autour de Valenciennes et zone d’intervention de 50 km</title>
      <desc id="illustrated-map-description">Carte illustrative orientée au nord. Blondel Jardin est situé à Hérin, près de Valenciennes. Le cercle représente un rayon indicatif de 50 km. Lille, Douai, Cambrai, Saint-Amand, Denain, Le Quesnoy, Maubeuge, Tournai et Mons sont indiqués.</desc>
      <g fill="var(--primary)" opacity="0.045">
        <path d="M55 85Q130 15 206 65T330 42L360 108Q290 130 256 105T140 142Z" />
        <path d="M335 265Q384 213 461 240T554 295L525 381Q451 410 406 357T323 343Z" />
        <path d="M64 309Q114 256 167 288T210 383L105 407Z" />
      </g>
      <circle cx="300" cy="220" r="170" fill="var(--primary)" fillOpacity="0.055" stroke="var(--primary)" strokeOpacity="0.1" strokeWidth="10" />
      <circle cx="300" cy="220" r="170" fill="none" stroke="var(--primary)" strokeOpacity="0.5" strokeWidth="1.5" strokeDasharray="4 6" />
      <g fill="none" stroke="var(--primary)" strokeOpacity="0.13" strokeWidth="2" strokeLinecap="round">
        <path d="M189 117Q235 152 279 184T300 220Q333 251 329 261" />
        <path d="M194 288Q228 260 270 235T300 220Q363 186 405 183" />
        <path d="M194 288Q154 238 194 117" />
        <path d="M194 215Q235 209 300 220T410 250" />
      </g>
      <path d="M265 44Q242 94 266 150T293 218Q319 264 286 301T307 398" fill="none" stroke="var(--primary)" strokeOpacity="0.18" strokeWidth="5" strokeLinecap="round" />
      <path d="M229 50Q291 97 344 106T458 147" fill="none" stroke="var(--primary)" strokeOpacity="0.2" strokeWidth="1" strokeDasharray="5 7" />
      <g fill="var(--muted-foreground)" fontSize="12" fontFamily="Manrope, sans-serif">
        <text x="460" y="118">BELGIQUE</text><text x="475" y="173">FRANCE</text>
      </g>
      <g fontFamily="Manrope, sans-serif" fontSize="18" fontWeight="500" fill="currentColor">
        {towns.map((town) => {
          const point = project(town.lat, town.lng);
          return <g key={town.name}>
            <circle cx={point.x} cy={point.y} r="3" fill="var(--primary)" opacity="0.55" />
            <text x={point.x + town.dx} y={point.y + town.dy} textAnchor={town.anchor} paintOrder="stroke" stroke="var(--background)" strokeWidth="4" strokeLinejoin="round">{town.name}</text>
          </g>;
        })}
      </g>
      <circle cx="300" cy="220" r="5" fill="var(--primary)" stroke="var(--background)" strokeWidth="2" />
      <text x="316" y="225" fontFamily="Manrope, sans-serif" fontSize="19" fontWeight="700" fill="currentColor" paintOrder="stroke" stroke="var(--background)" strokeWidth="5">Valenciennes</text>
      <path d={`M${herin.x} ${herin.y}l-28 -24h-22`} fill="none" stroke="currentColor" strokeWidth="1.5" />
      <circle cx={herin.x} cy={herin.y} r="7" fill="var(--primary)" stroke="var(--background)" strokeWidth="3" />
      <text x={herin.x - 55} y={herin.y - 31} textAnchor="end" fontFamily="Manrope, sans-serif" fontSize="21" fontWeight="700" fill="currentColor" paintOrder="stroke" stroke="var(--background)" strokeWidth="5">Hérin</text>
      <g transform="translate(551 40)" fill="none" stroke="currentColor" strokeWidth="1">
        <path d="M0 25V0m-5 8 5-8 5 8" />
        <text x="0" y="-10" textAnchor="middle" fontFamily="Manrope, sans-serif" fontSize="12" fill="currentColor" stroke="none">N</text>
      </g>
    </svg>
  );
}