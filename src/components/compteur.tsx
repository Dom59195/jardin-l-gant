import { useEffect, useRef, useState } from "react";

export function Compteur({ fin, duree = 1800, prefixe = "", suffixe = "" }: { fin: number; duree?: number; prefixe?: string; suffixe?: string }) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const obs = new IntersectionObserver(([e]) => {
      if (!e?.isIntersecting) return;
      obs.disconnect();
      const t0 = performance.now();
      const step = (t: number) => {
        const p = Math.min(1, (t - t0) / duree);
        setVal(Math.round(fin * (1 - Math.pow(1 - p, 3))));
        if (p < 1) raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
    }, { threshold: 0.4 });
    obs.observe(el);
    return () => { obs.disconnect(); cancelAnimationFrame(raf); };
  }, [fin, duree]);

  return <span ref={ref}>{prefixe}{val}{suffixe}</span>;
}
