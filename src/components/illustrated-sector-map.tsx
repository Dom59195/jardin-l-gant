// North-up local geographic projection. The outlined sector is illustrative,
// not an administrative boundary or an exact coverage polygon.
const centre = { lat: 50.357113, lng: 3.518332 };
function project(lat: number, lng: number) {
  return { x: 325 + (lng - centre.lng) * 71 * 5, y: 265 - (lat - centre.lat) * 111.2 * 5 };
}

export function IllustratedSectorMap() {
  const herin = project(50.3570433, 3.4535917);
  const lille = project(50.6292, 3.0573);
  return (
    <svg viewBox="0 0 600 440" className="h-full w-full text-primary" role="img" aria-labelledby="illustrated-map-title illustrated-map-description">
      <title id="illustrated-map-title">Blondel Jardin à Hérin, près de Valenciennes et de Lille</title>
      <desc id="illustrated-map-description">Carte épurée orientée au nord avec le point de Blondel Jardin à Hérin, Lille au nord-ouest et Valenciennes à proximité. Le contour en lignes représente le secteur de manière schématique, sans valeur de frontière administrative.</desc>
      <path d="M81 95L128 59L211 70L240 53L313 84L359 75L410 119L462 136L450 195L489 230L460 278L472 328L414 369L348 355L310 389L247 364L198 377L162 334L110 318L122 263L77 228L98 181L70 145Z" fill="var(--primary)" fillOpacity="0.045" stroke="currentColor" strokeOpacity="0.48" strokeWidth="1.5" strokeLinejoin="round" />
      <g fill="none" stroke="currentColor" strokeWidth="1" strokeOpacity="0.12" strokeLinejoin="round">
        <path d="M0 81L81 95M128 59L135 0M313 84L345 0M462 136L524 103L600 116M489 230L548 252L600 225M472 328L523 368L600 354M310 389L302 440M162 334L118 392L121 440M77 228L0 249" />
      </g>
      <g fontFamily="Manrope, sans-serif" fill="currentColor">
        <path d={`M${lille.x - 4} ${lille.y - 4}h8v8h-8Z`} fill="currentColor" opacity="0.6" />
        <text x={lille.x + 16} y={lille.y + 7} fontSize="24" fontWeight="500">Lille</text>
        <path d="M321 261h8v8h-8Z" fill="currentColor" opacity="0.6" />
        <text x="342" y="273" fontSize="24" fontWeight="500">Valenciennes</text>
      </g>
      <g transform={`translate(${herin.x} ${herin.y})`}>
        <path d="M0 0C-5-7-14-16-14-25a14 14 0 1 1 28 0C14-16 5-7 0 0Z" fill="var(--primary)" stroke="var(--background)" strokeWidth="3" />
        <path d="M-4-29h8v8h-8Z" fill="var(--background)" />
        <path d="M-10-24H-34" fill="none" stroke="currentColor" strokeWidth="1" />
        <text x="-44" y="-30" textAnchor="end" fontFamily="Manrope, sans-serif" fontSize="24" fontWeight="700" fill="currentColor">Blondel Jardin</text>
        <text x="-44" y="-7" textAnchor="end" fontFamily="Manrope, sans-serif" fontSize="18" fill="var(--muted-foreground)">Hérin</text>
      </g>
    </svg>
  );
}
