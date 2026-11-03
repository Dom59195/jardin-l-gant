import { useEffect, useRef } from "react";

export function ScrollingTree() {
  const decoration = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let disposed = false;
    let frame = 0;
    let cleanup = () => {};
    // Load WebGL only in the browser; the rest of the page remains server-rendered.
    void import("three").then((THREE) => {
      const canvas = decoration.current;
      if (disposed || !canvas) return;
      const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      const scene = new THREE.Scene();
      const camera = new THREE.OrthographicCamera(0, 1, 0, 1, -1000, 1000);
      camera.position.z = 500;
      const tokens = getComputedStyle(document.documentElement);
      // Convert semantic CSS colors through the browser for WebGL's sRGB input.
      const color = (token: string) => {
        const context = document.createElement("canvas").getContext("2d");
        if (!context) return new THREE.Color();
        context.fillStyle = tokens.getPropertyValue(token).trim();
        context.fillRect(0, 0, 1, 1);
        const [r = 0, g = 0, b = 0] = context.getImageData(0, 0, 1, 1).data;
        return new THREE.Color().setRGB(r / 255, g / 255, b / 255, THREE.SRGBColorSpace);
      };
      const green = new THREE.MeshStandardMaterial({ color: color("--moss"), side: THREE.DoubleSide, roughness: 0.7 });
      const bark = new THREE.MeshStandardMaterial({ color: color("--forest"), roughness: 1 });
      const vein = new THREE.LineBasicMaterial({ color: color("--sage") });
      scene.add(new THREE.AmbientLight(color("--primary-foreground"), 2));
      const light = new THREE.DirectionalLight(color("--primary-foreground"), 3);
      light.position.set(-200, -200, 300);
      scene.add(light);

      const makeLeaf = (size: number) => {
        const group = new THREE.Group();
        const shape = new THREE.Shape();
        shape.moveTo(0, 0);
        shape.bezierCurveTo(-size * 0.65, -size * 0.4, -size * 0.38, -size * 0.85, 0, -size);
        shape.bezierCurveTo(size * 0.38, -size * 0.85, size * 0.65, -size * 0.4, 0, 0);
        const geometry = new THREE.ShapeGeometry(shape, 24);
        const positions = geometry.getAttribute("position");
        for (let i = 0; i < positions.count; i++) {
          positions.setZ(i, Math.sin(-positions.getY(i) / size * Math.PI) * size * 0.12 - Math.abs(positions.getX(i)) * 0.2);
        }
        geometry.computeVertexNormals();
        group.add(new THREE.Mesh(geometry, green));
        const points = Array.from({ length: 25 }, (_, i) => {
          const t = i / 24;
          return new THREE.Vector3(0, -size * t, Math.sin(t * Math.PI) * size * 0.12 + 0.5);
        });
        group.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(points), vein));
        return group;
      };
      const branch = new THREE.Group();
      const twig = (points: [number, number, number?][], radius: number) => {
        const curve = new THREE.CatmullRomCurve3(points.map(([x, y, z = 0]) => new THREE.Vector3(x, y, z)));
        branch.add(new THREE.Mesh(new THREE.TubeGeometry(curve, 24, radius, 8, false), bark));
      };
      twig([[20, 0], [-85, 12], [-205, 48], [-330, 68], [-430, 55]], 3);
      twig([[-90, 14], [-145, -26], [-210, -42]], 1.5);
      twig([[-205, 48], [-245, 98], [-305, 118]], 1.3);
      twig([[-330, 68], [-355, 32], [-398, 18]], 1);
      const attachedLeaves: [number, number, number][] = [[-110, 12, 0.4], [-195, -39, -1.1], [-242, 94, 2.2], [-310, 69, -0.7], [-390, 20, 0.7], [-421, 57, -1.3]];
      attachedLeaves.forEach(([x, y, angle]) => {
        const leaf = makeLeaf(38);
        leaf.position.set(x, y, 0);
        leaf.rotation.set(0.25, -0.3, angle);
        branch.add(leaf);
      });
      scene.add(branch);
      const fallingLeaf = makeLeaf(62);
      scene.add(fallingLeaf);
      const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
      let width = window.innerWidth;
      let height = window.innerHeight;
      let scale = 1;
      let progress = 0;
      const resize = () => {
        width = window.innerWidth;
        height = window.innerHeight;
        scale = width < 640 ? 0.27 : width < 1500 ? 0.7 : 1;
        renderer.setSize(width, height);
        camera.right = width;
        camera.bottom = height;
        camera.updateProjectionMatrix();
        branch.position.set(width + 15, width < 640 ? 102 : 145, 0);
        branch.scale.setScalar(scale);
        fallingLeaf.scale.setScalar(scale);
      };
      resize();
      const render = () => {
        if (disposed) return;
        const distance = document.documentElement.scrollHeight - height;
        const target = distance > 0 ? Math.min(1, Math.max(0, window.scrollY / distance)) : 0;
        progress += (target - progress) * 0.09;
        const p = preference.matches ? 0 : progress;
        fallingLeaf.visible = !preference.matches;
        fallingLeaf.position.set(width - 305 * scale + Math.sin(p * Math.PI * 7) * 35 * scale, (width < 640 ? 102 : 145) + 118 * scale + Math.sqrt(p) * Math.max(0, height - 340), 30);
        fallingLeaf.rotation.set(Math.sin(p * 18) * 0.6, p * Math.PI * 6, 2.2 + Math.sin(p * 22) * 0.7);
        renderer.render(scene, camera);
        frame = window.requestAnimationFrame(render);
      };
      render();
      window.addEventListener("resize", resize);
      cleanup = () => {
        window.removeEventListener("resize", resize);
        scene.traverse((object) => {
          if (object instanceof THREE.Mesh || object instanceof THREE.Line) object.geometry.dispose();
        });
        green.dispose(); bark.dispose(); vein.dispose(); renderer.dispose();
      };
    }).catch(() => { /* Decoration must not prevent the page from working. */ });
    return () => {
      disposed = true;
      window.cancelAnimationFrame(frame);
      cleanup();
    };
  }, []);

  return <canvas ref={decoration} className="scrolling-garden" aria-hidden="true" />;
}