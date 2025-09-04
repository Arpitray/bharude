import React, { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger)

function Projects() {
  const containerRef = useRef(null)
  const textRef = useRef(null)
  const rectangleRef = useRef(null)
  const revealRef = useRef(null)

  useEffect(() => {
    const container = containerRef.current
    const text = textRef.current
    const rectangle = rectangleRef.current
    const reveal = revealRef.current

    if (!container || !text || !rectangle || !reveal) return

    // Set initial states - text is hidden, rectangle at start position
    gsap.set(reveal, { 
      clipPath: 'inset(0 100% 0 0)' // Hide text initially
    })
    gsap.set(rectangle, { 
      x: 0,
      opacity: 1 
    })

    // Create ScrollTrigger animation: reveal trail, then tilt, drop and scale to cover
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: "top 40%",
        end: "bottom 90%", // extend scroll distance to allow subsequent transforms
        scrub: true,

        
        onUpdate: (self) => {
          // Calculate text width for proper trail effect
          const textRect = text.getBoundingClientRect()
          const maxWidth = textRect.width

          // Calculate reveal percentage based on first portion of the progress
          // We'll use 0..0.4 of the progress for the text reveal and rectangle travel
          const revealPhase = Math.min(1, self.progress / 0.4)
          const currentRectPos = maxWidth * revealPhase
          const revealPercent = Math.min(100, (currentRectPos / maxWidth) * 100)

          // Update rectangle position during reveal phase
          gsap.set(rectangle, {
            x: currentRectPos
          })

          // Update the clip-path to reveal text up to rectangle's position (trail effect)
          gsap.set(reveal, {
            clipPath: `inset(0 ${100 - revealPercent}% 0 0)`
          })

          // After reveal phase (progress > 0.4) drive tilt / drop / scale by remaining progress
          const postProgress = Math.max(0, (self.progress - 0.4) / 0.6) // normalized 0..1
          if (postProgress > 0) {
            // Tilt slightly to the right (max 12deg)
            const tilt = 12 * postProgress

            // Viewport sizes
            const viewportW = window.innerWidth || document.documentElement.clientWidth
            const viewportH = window.innerHeight || document.documentElement.clientHeight
            const bottomWhitespacePercent = 0.15 // 15% whitespace at bottom
            const desiredCoverHeight = viewportH * (1 - bottomWhitespacePercent)

            // Get current rectangle bounds
            const rectBounds = rectangle.getBoundingClientRect()
            const rectWidth = rectBounds.width || 1
            const rectHeight = rectBounds.height || 1

            // Compute scale needed to cover viewport both horizontally and vertically
            const scaleX = viewportW / rectWidth
            const scaleY = desiredCoverHeight / rectHeight
            // Use larger of the two and add a buffer to ensure full coverage even with rotation
            const bufferMultiplier = 1.25
            let scaleTarget = Math.max(scaleX, scaleY) * bufferMultiplier
            // Safety floor to avoid tiny scaling glitches
            scaleTarget = Math.max(scaleTarget, 6)

            // Interpolate scale from 1 -> scaleTarget using postProgress
            const scaleVal = 1 + (scaleTarget - 1) * postProgress
            gsap.set(rectangle, { rotate: tilt, scale: scaleVal, transformOrigin: 'center center' })

            // Compute centers (document coordinates)
            const currentCenterX = rectBounds.left + rectWidth / 2 + window.scrollX
            const currentCenterY = rectBounds.top + rectHeight / 2 + window.scrollY
            const desiredCenterX = window.scrollX + viewportW / 2
            const desiredCenterY = window.scrollY + desiredCoverHeight / 2

            // Deltas to move center to desired center
            const deltaX = desiredCenterX - currentCenterX
            const deltaY = desiredCenterY - currentCenterY

            // CurrentRectPos from reveal phase positions the rectangle along the text; keep that base offset
            // Move additionally towards center as we progress in post phase
            gsap.set(rectangle, { x: (currentRectPos || 0) + deltaX * postProgress, y: deltaY * postProgress })

            // Fully reveal text as scaling completes
            gsap.set(reveal, { clipPath: `inset(0 0% 0 0)` })
          }
        }
      }
    })

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill())
    }
  }, [])

  return (
    <div ref={containerRef} className='projects-container min-h-screen flex justify-center flex-col items-center my-20 overflow-hidden'>
      <h2 className='text-7xl font-semibold'>My Projects</h2>
      <div className='project-item mt-12 text-5xl relative'>
        <div className="relative inline-block">
          {/* Hidden base text for layout */}
          <p className="opacity-0 select-none pointer-events-none">
            Immersive 3D Creations | Designed & Rendered in Blender
          </p>
          
          {/* Revealed text */}
          <div 
            ref={revealRef}
            className=" w-full h-full"
          >
            <p ref={textRef} className="text-current text-5xl overflow-visible">
              Immersive 3D Creations | Designed & Rendered in Blender
            </p>
          </div>
          
          {/* Animated Rectangle */}
          <div className="absolute top-10 left-0"
            ref={rectangleRef}
            style={{
              width: '34px',
              height: '82px',
              background: '#e3e3db',
              border: '0.5px solid #000',
              transform: 'rotate(0deg)',
              transformOrigin: 'center'
            }}
          />
        </div>
      </div>
    </div>
  )
}

export default Projects