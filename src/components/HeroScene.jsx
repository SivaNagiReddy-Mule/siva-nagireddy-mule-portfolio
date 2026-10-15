import { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * HeroScene component
 * Interactive 3D "Signal Core" centrepiece built with Three.js.
 * Renders an outer icosahedron shell, inner point cloud, and tilted orbit ring.
 */
export default function HeroScene() {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Dimensions
    const width = mount.clientWidth || 300;
    const height = mount.clientHeight || 300;

    // Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.z = 7;

    // WebGLRenderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    mount.appendChild(renderer.domElement);

    // Root Group for interactive rotation
    const group = new THREE.Group();
    scene.add(group);

    // (1) Outer Shell: Edges of an Icosahedron
    const outerGeo = new THREE.IcosahedronGeometry(1.9, 1);
    const edgesGeo = new THREE.EdgesGeometry(outerGeo);
    const edgesMat = new THREE.LineBasicMaterial({
      color: 0xff5b1f,
      transparent: true,
      opacity: prefersReducedMotion ? 0.9 : 0.0,
    });
    const outerShell = new THREE.LineSegments(edgesGeo, edgesMat);
    group.add(outerShell);

    // (2) Inner Core: Points cloud
    const innerGeo = new THREE.IcosahedronGeometry(1.15, 4);
    const pointsMat = new THREE.PointsMaterial({
      color: 0xe8e6df,
      size: 0.025,
      transparent: true,
      opacity: 0.8,
    });
    const innerCore = new THREE.Points(innerGeo, pointsMat);
    group.add(innerCore);

    // (3) Orbit Ring: Tilted EllipseCurve
    const curve = new THREE.EllipseCurve(0, 0, 2.7, 2.7, 0, 2 * Math.PI, false, 0);
    const curvePoints = curve.getPoints(128);
    const ringGeo = new THREE.BufferGeometry().setFromPoints(curvePoints);
    const ringMat = new THREE.LineBasicMaterial({
      color: 0xe8e6df,
      transparent: true,
      opacity: 0.18,
    });
    const orbitRing = new THREE.LineLoop(ringGeo, ringMat);
    orbitRing.rotation.x = Math.PI / 2.4;
    group.add(orbitRing);

    // Interactive state
    let targetRotX = 0;
    let targetRotY = 0;
    let dragSpinX = 0;
    let dragSpinY = 0;
    let autoSpinY = 0;
    let isDragging = false;
    let prevPointerX = 0;
    let prevPointerY = 0;

    // Mouse tilt tracking
    const handlePointerMove = (e) => {
      const normX = (e.clientX / window.innerWidth) * 2 - 1;
      const normY = (e.clientY / window.innerHeight) * 2 - 1;
      targetRotY = normX * 0.4;
      targetRotX = normY * 0.25;

      if (isDragging) {
        const deltaX = e.clientX - prevPointerX;
        const deltaY = e.clientY - prevPointerY;
        prevPointerX = e.clientX;
        prevPointerY = e.clientY;
        dragSpinY += deltaX * 0.01;
        dragSpinX += deltaY * 0.01;
      }
    };

    // Drag interaction on canvas
    const handlePointerDown = (e) => {
      isDragging = true;
      prevPointerX = e.clientX;
      prevPointerY = e.clientY;
    };

    const handlePointerUp = () => {
      isDragging = false;
    };

    const canvas = renderer.domElement;
    canvas.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);

    // Viewport resize handling
    const handleResize = () => {
      if (!mount) return;
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      if (w === 0 || h === 0) return;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    // IntersectionObserver to pause rendering when off-screen
    let isVisible = true;
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
      },
      { threshold: 0.05 }
    );
    observer.observe(mount);

    // Animation loop & entrance materialisation
    let animId = null;
    const clock = new THREE.Clock();
    const entranceStart = performance.now();

    if (prefersReducedMotion) {
      group.scale.set(1, 1, 1);
      edgesMat.opacity = 0.9;
    }

    const animate = (currentTime) => {
      animId = requestAnimationFrame(animate);

      if (!isVisible) return;

      const elapsed = clock.getElapsedTime();

      // Intro materialisation over 1 second
      if (!prefersReducedMotion) {
        const introProgress = Math.min((currentTime - entranceStart) / 1000, 1);
        if (introProgress < 1) {
          // Ease-out cubic: 1 - (1 - t)^3
          const easeOut = 1 - Math.pow(1 - introProgress, 3);
          const currentScale = 0.6 + 0.4 * easeOut;
          group.scale.set(currentScale, currentScale, currentScale);
          edgesMat.opacity = 0.9 * introProgress;
        } else {
          group.scale.set(1, 1, 1);
          edgesMat.opacity = 0.9;
        }

        // Auto spin
        autoSpinY += 0.0025;
      }

      // Rotate inner points counter-wise
      innerCore.rotation.y = -elapsed * 0.15;

      // Smooth easing toward target rotation
      const destX = targetRotX + dragSpinX;
      const destY = targetRotY + dragSpinY + autoSpinY;
      group.rotation.x += (destX - group.rotation.x) * 0.06;
      group.rotation.y += (destY - group.rotation.y) * 0.06;

      renderer.render(scene, camera);
    };

    animId = requestAnimationFrame(animate);

    // Cleanup on unmount
    return () => {
      if (animId) cancelAnimationFrame(animId);
      observer.disconnect();

      canvas.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('resize', handleResize);

      outerGeo.dispose();
      edgesGeo.dispose();
      innerGeo.dispose();
      ringGeo.dispose();

      edgesMat.dispose();
      pointsMat.dispose();
      ringMat.dispose();

      renderer.dispose();
      renderer.forceContextLoss();

      if (mount.contains(canvas)) {
        mount.removeChild(canvas);
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="h-full w-full cursor-grab active:cursor-grabbing"
      role="img"
      aria-label="Interactive 3D shape — drag to rotate"
      data-cursor="hot"
    />
  );
}
