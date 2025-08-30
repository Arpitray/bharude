import { useRef, useState, useEffect } from "react";
import Matter from "matter-js";

const FallingText = ({
  text = "",
  highlightWords = [],
  trigger = "auto",
  backgroundColor = "transparent",
  wireframes = false,
  gravity = 1,
  mouseConstraintStiffness = 0.2,
  fontSize = "1rem",
}) => {
  const containerRef = useRef(null);
  const textRef = useRef(null);
  const canvasContainerRef = useRef(null);

  const [effectStarted, setEffectStarted] = useState(false);

  useEffect(() => {
    if (!textRef.current) return;
    const words = text.split(" ");

    const newHTML = words
      .map((word) => {
        const isHighlighted = highlightWords.some((hw) => word.startsWith(hw));
        return `<span
          class="inline-block mx-[2px] select-none ${isHighlighted ? "text-cyan-500 font-bold" : ""
          }"
        >
          ${word}
        </span>`;
      })
      .join(" ");

    textRef.current.innerHTML = newHTML;
  }, [text, highlightWords]);

  useEffect(() => {
    if (trigger === "auto") {
      setEffectStarted(true);
      return;
    }
    if (trigger === "scroll" && containerRef.current) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setEffectStarted(true);
            observer.disconnect();
          }
        },
        { threshold: 0.1 }
      );
      observer.observe(containerRef.current);
      return () => observer.disconnect();
    }
  }, [trigger]);

  useEffect(() => {
    if (!effectStarted) return;

    const {
      Engine,
      Render,
      World,
      Bodies,
      Runner,
      Mouse,
      MouseConstraint,
    } = Matter;

    // prefer this component's rect, but if it's collapsed (0x0) walk up parents to find
    // the nearest ancestor with positive size (for example the rounded bg wrapper in Skills)
    const findVisibleAncestor = (startEl) => {
      let el = startEl;
      for (let i = 0; i < 6 && el; i++) {
        const r = el.getBoundingClientRect();
        if (r.width > 0 && r.height > 0) return { el, rect: r };
        el = el.parentElement;
      }
      return { el: startEl, rect: startEl.getBoundingClientRect() };
    };

  const { el: measuredElement, rect: measuredRect } = findVisibleAncestor(containerRef.current);
  // choose a single host element for canvas and coordinate space: prefer the local canvas container, then the component container, then the measured ancestor
  const hostElement = canvasContainerRef.current || containerRef.current || measuredElement;
  const hostRect = hostElement ? hostElement.getBoundingClientRect() : measuredRect;
  const width = Math.max(1, hostRect.width);
  const height = Math.max(1, hostRect.height);

    const engine = Engine.create();
    engine.world.gravity.y = gravity;

    // ensure the top-level container is positioned and raised above other stacking contexts
    if (containerRef.current && getComputedStyle(containerRef.current).position === 'static') {
      containerRef.current.style.position = 'relative';
    }
    if (containerRef.current) {
      containerRef.current.style.zIndex = '1100';
    }

    // host the canvas inside the local canvas container so canvas and text share a stacking context
    const canvasHost = canvasContainerRef.current || hostElement;
    if (canvasContainerRef.current) {
      const host = canvasContainerRef.current;
      host.style.position = 'absolute';
      host.style.top = '0px';
      host.style.left = '0px';
      host.style.width = `${width}px`;
      host.style.height = `${height}px`;
      // raise the host above common overlays so words remain visible
      host.style.zIndex = '1100';
    }

    const render = Render.create({
      element: canvasHost,
      engine,
      options: {
        width,
        height,
        background: backgroundColor,
        wireframes,
      },
    });

    // Make the canvas absolutely cover the host element
    if (render && render.canvas) {
      render.canvas.style.position = 'absolute';
      render.canvas.style.top = '0px';
      render.canvas.style.left = '0px';
      render.canvas.style.width = `${width}px`;
      render.canvas.style.height = `${height}px`;
      // allow the canvas to receive pointer events for Matter.Mouse, but keep it visually behind
  // allow pointer events on the canvas for Matter, but keep it behind the words within this container
  render.canvas.style.pointerEvents = 'auto';
  render.canvas.style.zIndex = '1100';
    }

    const boundaryOptions = {
      isStatic: true,
      render: { fillStyle: "transparent" },
    };
    // compute tallest word height so floor stops words before they visually exit the canvas
    const wordSpansList = Array.from(textRef.current.querySelectorAll("span"));
    const maxRectHeight = wordSpansList.reduce((max, el) => {
      const r = el.getBoundingClientRect();
      return Math.max(max, r.height);
    }, 0) || 50;

    const floorHeight = Math.max(50, Math.ceil(maxRectHeight) + 8);
    // position the floor so its top surface sits at (canvasHeight - halfTallestWord)
    const floorY = height - maxRectHeight / 2 + floorHeight / 2;

    const floor = Bodies.rectangle(width / 2, floorY, width, floorHeight, boundaryOptions);
    const leftWall = Bodies.rectangle(-25, height / 2, 50, height, boundaryOptions);
    const rightWall = Bodies.rectangle(width + 25, height / 2, 50, height, boundaryOptions);
    const ceiling = Bodies.rectangle(width / 2, -25, width, 50, boundaryOptions);

    const wordSpans = textRef.current.querySelectorAll("span");
    const wordBodies = [...wordSpans].map((elem) => {
      const rect = elem.getBoundingClientRect();

      // compute positions relative to the host element used for the canvas
      const x = rect.left - hostRect.left + rect.width / 2;
      const y = rect.top - hostRect.top + rect.height / 2;

      const body = Bodies.rectangle(x, y, rect.width, rect.height, {
        render: { fillStyle: "transparent" },
        restitution: 0.8,
        frictionAir: 0.01,
        friction: 0.2,
      });
      Matter.Body.setVelocity(body, {
        x: (Math.random() - 0.5) * 5,
        y: 0,
      });
      Matter.Body.setAngularVelocity(body, (Math.random() - 0.5) * 0.05);

      return { elem, body };
    });

    wordBodies.forEach(({ elem, body }) => {
      elem.style.position = "absolute";
      // place element at the body's position (updateLoop will keep it in sync)
      elem.style.left = `${body.position.x}px`;
      elem.style.top = `${body.position.y}px`;
      elem.style.transform = "translate(-50%, -50%)";
  // ensure words are visually above the canvas and can receive pointer events
  // ensure words sit above the canvas and overlays
  elem.style.zIndex = '1101';
  elem.style.pointerEvents = 'auto';
      // ensure the text has a visible color (inherit container color)
      try {
        const computed = getComputedStyle(containerRef.current || document.body).color;
        if (computed) elem.style.color = computed;
      } catch (e) {
        /* ignore */
      }
    });

  // create mouse from the actual render canvas so coordinates align with the canvas size
  const mouse = Mouse.create(render.canvas);
  const mouseConstraint = MouseConstraint.create(engine, {
      mouse,
      constraint: {
        stiffness: mouseConstraintStiffness,
        render: { visible: false },
      },
    });
  render.mouse = mouse;

  World.add(engine.world, [
      floor,
      leftWall,
      rightWall,
      ceiling,
      mouseConstraint,
      ...wordBodies.map((wb) => wb.body),
    ]);

    const runner = Runner.create();
    Runner.run(runner, engine);
    Render.run(render);

    // handle host resizes so the canvas always fills the Skills wrapper
    let resizeObserver = null;
    const resizeHandler = (entries) => {
      const e = entries[0];
      if (!e) return;
      const newRect = e.contentRect || e.target.getBoundingClientRect();
      const newW = Math.max(1, newRect.width);
      const newH = Math.max(1, newRect.height);

      // update renderer size
      render.canvas.width = newW;
      render.canvas.height = newH;
      render.options.width = newW;
      render.options.height = newH;
      render.canvas.style.width = `${newW}px`;
      render.canvas.style.height = `${newH}px`;

      // reposition static boundaries
      Matter.Body.setPosition(floor, { x: newW / 2, y: newH - maxRectHeight / 2 + floorHeight / 2 });
      Matter.Body.setPosition(leftWall, { x: -25, y: newH / 2 });
      Matter.Body.setPosition(rightWall, { x: newW + 25, y: newH / 2 });
      Matter.Body.setPosition(ceiling, { x: newW / 2, y: -25 });
    };

    try {
      resizeObserver = new ResizeObserver(resizeHandler);
      resizeObserver.observe(hostElement || measuredElement || canvasContainerRef.current || containerRef.current);
    } catch (err) {
      // ResizeObserver may not be available in some environments; ignore safely
    }

    const updateLoop = () => {
      wordBodies.forEach(({ body, elem }) => {
        const { x, y } = body.position;
        elem.style.left = `${x}px`;
        elem.style.top = `${y}px`;
        elem.style.transform = `translate(-50%, -50%) rotate(${body.angle}rad)`;
      });
      // Runner.run already advances the engine; avoid calling Engine.update here to prevent
      // double-stepping which can cause tunneling through thin static bodies.
      requestAnimationFrame(updateLoop);
    };
    updateLoop();

    return () => {
      Render.stop(render);
      Runner.stop(runner);
      if (render.canvas && (hostElement || measuredElement || canvasContainerRef.current)) {
        const host = hostElement || measuredElement || canvasContainerRef.current;
        // eslint-disable-next-line react-hooks/exhaustive-deps
        host.removeChild(render.canvas);
      }
      if (resizeObserver) resizeObserver.disconnect();
      World.clear(engine.world);
      Engine.clear(engine);
    };
  }, [
    effectStarted,
    gravity,
    wireframes,
    backgroundColor,
    mouseConstraintStiffness,
  ]);

  const handleTrigger = () => {
    if (!effectStarted && (trigger === "click" || trigger === "hover")) {
      setEffectStarted(true);
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative z-[1] w-full h-full cursor-pointer text-center pt-8 overflow-hidden"
      onClick={trigger === "click" ? handleTrigger : undefined}
      onMouseEnter={trigger === "hover" ? handleTrigger : undefined}
    >
      <div
        ref={textRef}
        className="inline-block"
        style={{
          fontSize,
          lineHeight: 1.4,
        }}
      />

      <div className="absolute top-0 left-0 z-0" ref={canvasContainerRef} />
    </div>
  );
};

export default FallingText;
