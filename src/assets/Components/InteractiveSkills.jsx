import React, { useRef, useEffect, useState } from 'react';

// InteractiveSkills: simple physics-like repulsion on mousemove.
export default function InteractiveSkills({ words = null, height = 420 }) {
  const containerRef = useRef(null);
  const elemsRef = useRef([]); // DOM refs
  const positionsRef = useRef([]); // base positions {x,y}
  const offsetsRef = useRef([]); // current offsets {x,y}
  const targetRef = useRef(null);
  const rafRef = useRef(null);

  const defaultWords = [
    'React','JavaScript','TypeScript','Three.js','WebGL','GSAP','Tailwind','CSS','HTML','Node.js','Vite','Redux','Framer Motion','Sass','GraphQL'
  ];

  const items = words && words.length ? words : defaultWords;

  // position words in a loose grid
  const computePositions = () => {
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;

    const cols = Math.ceil(Math.sqrt(items.length));
    const rows = Math.ceil(items.length / cols);
    const pad = 30;
    const cellW = (w - pad * 2) / cols;
    const cellH = (h - pad * 2) / rows;

    positionsRef.current = items.map((_, i) => {
      const col = i % cols;
      const row = Math.floor(i / cols);
      const x = pad + cellW * col + cellW / 2;
      const y = pad + cellH * row + cellH / 2;
      return { x, y };
    });

    // initialize offsets
    offsetsRef.current = items.map(() => ({ x: 0, y: 0 }));
  };

  useEffect(() => {
    computePositions();
    const resizeObserver = new ResizeObserver(() => {
      computePositions();
    });
    if (containerRef.current) resizeObserver.observe(containerRef.current);

    return () => {
      resizeObserver.disconnect();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items.length]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const onMove = (e) => {
      const rect = container.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      targetRef.current = { x: mx, y: my };
    };
    const onLeave = () => {
      targetRef.current = null;
    };

    container.addEventListener('mousemove', onMove);
    container.addEventListener('mouseleave', onLeave);

    const animate = () => {
      const target = targetRef.current;
      const radius = Math.min(220, (container.getBoundingClientRect().width / 2));
      const strength = 1.0;
      positionsRef.current.forEach((pos, i) => {
        const el = elemsRef.current[i];
        if (!el) return;
        let tx = 0, ty = 0;
        if (target) {
          const dx = pos.x - target.x;
          const dy = pos.y - target.y;
          const dist = Math.sqrt(dx*dx + dy*dy) || 0.001;
          if (dist < radius) {
            const force = (1 - dist / radius) * strength * 80;
            tx = (dx / dist) * force;
            ty = (dy / dist) * force;
          }
        }

        // lerp current offset to target offset
        const cur = offsetsRef.current[i] || { x: 0, y: 0 };
        const lerp = (a, b, t) => a + (b - a) * t;
        const nx = lerp(cur.x, tx, 0.18);
        const ny = lerp(cur.y, ty, 0.18);
        offsetsRef.current[i] = { x: nx, y: ny };
        el.style.transform = `translate(${positionsRef.current[i].x + nx - 50}px, ${positionsRef.current[i].y + ny - 12}px)`;
      });
      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      container.removeEventListener('mousemove', onMove);
      container.removeEventListener('mouseleave', onLeave);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [items.length]);

  return (
    <section id="skills-section" className="w-full max-w-6xl mx-auto px-6 py-16">
      <h2 className="text-4xl font-semibold text-center mb-8">Skills</h2>

      <div className="bg-transparent rounded-lg p-4 flex items-center justify-center">
        <div
          ref={containerRef}
          className="relative w-full"
          style={{ height: `${height}px`, minHeight: `${height}px`, overflow: 'hidden' }}
        >
          {items.map((word, i) => (
            <div
              key={i}
              ref={(el) => (elemsRef.current[i] = el)}
              className="absolute whitespace-nowrap select-none text-lg font-medium"
              style={{ left: 0, top: 0, transform: 'translate(-50%, -50%)' }}
            >
              {word}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
