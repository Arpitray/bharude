import Lenis from 'lenis'

// Create a single Lenis instance and export its controls.
// Keep this module self-contained so it won't interfere with other scroll libraries (like GSAP).
const lenis = new Lenis({
  duration: 1.2, // smoothness
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  orientation: 'vertical',
  gestureOrientation: 'vertical',
  wheelMultiplier: 1,
  touchMultiplier: 2,
  smoothWheel: true,
  smoothTouch: false,
  normalizeWheel: true,
})

function raf(time) {
  lenis.raf(time)
  requestAnimationFrame(raf)
}

// Start RAF loop when module is imported.
requestAnimationFrame(raf)

export default lenis
