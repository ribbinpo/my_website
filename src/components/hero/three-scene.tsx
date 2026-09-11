import { useEffect, useRef } from "react";

/** The canvas is decorative; the CSS sculpture remains when WebGL is unavailable. */
export default function ThreeScene({
  dark,
  paused,
}: {
  dark: boolean;
  paused: boolean;
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const pausedRef = useRef(paused);
  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);
  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    let disposed = false;
    let cleanup: (() => void) | undefined;
    import("three")
      .then((THREE) => {
        if (disposed) return;
        let renderer: InstanceType<typeof THREE.WebGLRenderer>;
        try {
          renderer = new THREE.WebGLRenderer({
            alpha: true,
            antialias: true,
            powerPreference: "low-power",
          });
        } catch {
          host.dataset.state = "fallback";
          return;
        }
        renderer.setPixelRatio(Math.min(devicePixelRatio, 1.6));
        renderer.setClearColor(0x000000, 0);
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        host.appendChild(renderer.domElement);
        host.dataset.state = "ready";
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 50);
        camera.position.set(0, 0, 7.6);
        const group = new THREE.Group();
        group.scale.setScalar(.9);
      scene.add(group);
        const geometries: InstanceType<typeof THREE.BufferGeometry>[] = [];
        const materials: InstanceType<typeof THREE.Material>[] = [];
        const knotGeometry = new THREE.TorusKnotGeometry(
          1.15,
          0.31,
          180,
          28,
          2,
          3,
        );
        const knotMaterial = new THREE.MeshPhysicalMaterial({
          color: dark ? 0x65e5b0 : 0x178a69,
          metalness: 0.6,
          roughness: 0.24,
          clearcoat: 1,
          clearcoatRoughness: 0.2,
        });
        geometries.push(knotGeometry);
        materials.push(knotMaterial);
        const knot = new THREE.Mesh(knotGeometry, knotMaterial);
        knot.rotation.set(0.3, 0.2, -0.4);
        group.add(knot);
        const ringGeometry = new THREE.TorusGeometry(2.04, 0.008, 8, 140);
        const ringMaterial = new THREE.MeshBasicMaterial({
          color: dark ? 0x80e8bb : 0x29795c,
          transparent: true,
          opacity: 0.28,
        });
        geometries.push(ringGeometry);
        materials.push(ringMaterial);
        for (let i = 0; i < 3; i++) {
          const ring = new THREE.Mesh(ringGeometry, ringMaterial);
          ring.rotation.set(i * 0.9 + 0.2, i * 0.7, i * 0.35);
          group.add(ring);
        }
        const points = new Float32Array(75 * 3);
        for (let i = 0; i < 75; i++) {
          const angle = i * 2.39996323;
          const y = 1 - (2 * (i + 0.5)) / 75;
          const radius = Math.sqrt(1 - y * y) * 2.4;
          points[i * 3] = Math.cos(angle) * radius;
          points[i * 3 + 1] = y * 2.4;
          points[i * 3 + 2] = Math.sin(angle) * radius;
        }
        const pointGeometry = new THREE.BufferGeometry();
        pointGeometry.setAttribute(
          "position",
          new THREE.BufferAttribute(points, 3),
        );
        const pointMaterial = new THREE.PointsMaterial({
          color: dark ? 0xa3f7d2 : 0x206b55,
          size: 0.025,
          transparent: true,
          opacity: 0.65,
        });
        geometries.push(pointGeometry);
        materials.push(pointMaterial);
        group.add(new THREE.Points(pointGeometry, pointMaterial));
        scene.add(new THREE.AmbientLight(0xffffff, 1.5));
        const key = new THREE.DirectionalLight(0xffffff, 4);
        key.position.set(3, 4, 4);
        scene.add(key);
        const fill = new THREE.DirectionalLight(0x88aaff, 3);
        fill.position.set(-4, -1, 2);
        scene.add(fill);
        const rim = new THREE.DirectionalLight(0x96ffd6, 5);
        rim.position.set(2, -3, -2);
        scene.add(rim);
        let visible = true;
        let lost = false;
        let frame = 0;
        let previousTime = 0;
        let elapsed = 0;
        const pointer = { x: 0, y: 0 };
        const render = () => {
          if (!lost) renderer.render(scene, camera);
        };
        const resize = () => {
          const { width, height } = host.getBoundingClientRect();
          if (!width || !height) return;
          camera.aspect = width / height;
          camera.updateProjectionMatrix();
          renderer.setSize(width, height);
          render();
        };
        const observer = new ResizeObserver(resize);
        observer.observe(host);
        const intersection = new IntersectionObserver(([entry]) => {
          visible = entry.isIntersecting;
        });
        intersection.observe(host);
        const move = (event: PointerEvent) => {
          if (event.pointerType !== "mouse") return;
          const rect = host.getBoundingClientRect();
          pointer.x = (event.clientX - rect.left) / rect.width - 0.5;
          pointer.y = (event.clientY - rect.top) / rect.height - 0.5;
        };
        const leave = () => {
          pointer.x = 0;
          pointer.y = 0;
        };
        const contextLost = (event: Event) => {
          event.preventDefault();
          lost = true;
          host.dataset.state = "fallback";
        };
        const contextRestored = () => {
          lost = false;
          host.dataset.state = "ready";
          resize();
        };
        host.addEventListener("pointermove", move);
        host.addEventListener("pointerleave", leave);
        renderer.domElement.addEventListener("webglcontextlost", contextLost);
        renderer.domElement.addEventListener(
          "webglcontextrestored",
          contextRestored,
        );
        const tick = (time: number) => {
          if (disposed) return;
          frame = requestAnimationFrame(tick);
          const delta = Math.min((time - previousTime) / 1000, 0.05);
          previousTime = time;
          if (!visible || document.hidden || pausedRef.current || lost) return;
          elapsed += delta;
          group.rotation.y += (pointer.x * 0.45 - group.rotation.y) * 0.035;
          group.rotation.x += (pointer.y * 0.3 - group.rotation.x) * 0.035;
          knot.rotation.y = 0.2 + elapsed * 0.16;
          knot.rotation.z = -0.4 + Math.sin(elapsed * 0.3) * 0.14;
          group.position.y = Math.sin(elapsed * 0.65) * 0.08;
          render();
        };
        resize();
        frame = requestAnimationFrame(tick);
        cleanup = () => {
          cancelAnimationFrame(frame);
          observer.disconnect();
          intersection.disconnect();
          host.removeEventListener("pointermove", move);
          host.removeEventListener("pointerleave", leave);
          renderer.domElement.removeEventListener(
            "webglcontextlost",
            contextLost,
          );
          renderer.domElement.removeEventListener(
            "webglcontextrestored",
            contextRestored,
          );
          geometries.forEach((g) => g.dispose());
          materials.forEach((m) => m.dispose());
          renderer.dispose();
          renderer.domElement.remove();
        };
      })
      .catch(() => {
        if (!disposed) host.dataset.state = "fallback";
      });
    return () => {
      disposed = true;
      cleanup?.();
    };
  }, [dark]);
  return (
    <div
      className="three-canvas"
      ref={hostRef}
      data-paused={paused}
      aria-hidden="true"
    />
  );
}
