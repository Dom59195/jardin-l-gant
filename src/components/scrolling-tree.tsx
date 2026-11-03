import { useEffect, useRef } from "react";
import branch from "@/assets/branche-coton.png";
import cotton from "@/assets/feuille-coton.png";

export function ScrollingTree() {
  const decoration = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = decoration.current;
    if (!element) return;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    const update = () => {
      frame = 0;
      const distance = document.documentElement.scrollHeight - window.innerHeight;
      const progress = distance > 0 ? Math.min(1, Math.max(0, window.scrollY / distance)) : 0;
      const moving = !preference.matches;
      const y = moving ? Math.sqrt(progress) * Math.max(0, window.innerHeight - 350) : 0;
      const sway = moving ? Math.sin(progress * Math.PI * 5) * 40 : 0;
      element.style.setProperty("--leaf-y", `${y}px`);
      element.style.setProperty("--leaf-x", `${sway}px`);
      element.style.setProperty("--leaf-turn", `${moving ? Math.sin(progress * Math.PI * 5) * 45 + progress * 100 : 0}deg`);
      element.style.setProperty("--branch-y", `${-window.scrollY}px`);
    };
    const schedule = () => { if (!frame) frame = window.requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    preference.addEventListener("change", schedule);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      preference.removeEventListener("change", schedule);
    };
  }, []);

  return (
    <div ref={decoration} className="scrolling-garden" aria-hidden="true">
      <div className="scrolling-garden-branch">
        <img src={branch} width={1536} height={768} alt="" className="h-auto w-full" />
      </div>
      <div className="scrolling-garden-leaf">
        <img src={cotton} width={816} height={816} alt="" className="h-full w-full object-contain" />
      </div>
    </div>
  );
}