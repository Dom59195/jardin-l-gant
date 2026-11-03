import { useEffect, useRef } from "react";
import tree from "@/assets/arbre-fleuri.png";

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
      const y = moving ? progress * Math.max(0, window.innerHeight - 280) : 0;
      const sway = moving ? Math.sin(progress * Math.PI * 7) * 12 : 0;
      element.style.setProperty("--leaf-y", `${y}px`);
      element.style.setProperty("--leaf-x", `${sway}px`);
      element.style.setProperty("--leaf-turn", `${moving ? progress * 420 : 0}deg`);
      element.style.setProperty("--tree-opacity", `${moving ? Math.max(0, 1 - window.scrollY / 650) : 1}`);
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
      <img src={tree} width={768} height={1536} alt="" className="scrolling-garden-tree" />
      <div className="scrolling-garden-leaf">
        <svg viewBox="0 0 48 72" className="h-full w-full text-moss" fill="none">
          <path d="M24 3C5 15 0 40 22 60C44 48 47 20 24 3Z" fill="currentColor" />
          <path d="M24 11L22 69M23 28L12 21M23 40L35 28M22 51L12 40" className="text-sage" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </div>
    </div>
  );
}