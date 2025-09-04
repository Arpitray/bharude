import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// InteractiveSkills: draggable pill-shaped skill chips with gravity physics
export default function InteractiveSkills({ words = null, height = 500, isDarkMode = true }) {
  const containerRef = useRef(null);
  const [containerBounds, setContainerBounds] = useState({ width: 0, height: 0 });
  const [isInitialized, setIsInitialized] = useState(false);

  const defaultWords = [
    { text: 'Communication', variant: 'light' },
    { text: 'UI Design', variant: 'dark' },
    { text: 'Visual Design', variant: 'light' },
    { text: 'HIG', variant: 'dark' },
    { text: 'Empathy', variant: 'dark' },
    { text: 'UX Design', variant: 'light' },
    { text: 'Collaboration', variant: 'dark' },
    { text: 'Prototyping', variant: 'light' },
    { text: 'Interaction Design', variant: 'dark' },
    { text: 'Material You', variant: 'dark' }
  ];

  const items = words && words.length ? words : defaultWords;

  // Stable chip positions computed once after container bounds are known
  const [chipData, setChipData] = useState([]);

  // Update container bounds when size changes
  useEffect(() => {
    const updateBounds = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setContainerBounds({ 
          width: rect.width - 160, // Account for chip width
          height: rect.height - 50   // Account for chip height
        });
        setIsInitialized(true);
      }
    };

    updateBounds();
    const resizeObserver = new ResizeObserver(updateBounds);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => resizeObserver.disconnect();
  }, []);

  // build stable chip positions once we have bounds
  useEffect(() => {
    if (!isInitialized) return;

    const chipWidth = 140;
    const chipHeight = 45;

    const containerWidth = containerBounds.width || 800;
    const containerHeight = containerBounds.height || 400;

    const data = items.map((item, index) => {
      const rows = Math.ceil(items.length / 4);
      const currentRow = Math.floor(index / 4);
      const posInRow = index % 4;
      const randomX = (Math.random() - 0.5) * 60;
      const randomY = (Math.random() - 0.5) * 20;
      const x = (posInRow * (chipWidth + 20)) + randomX + 20;
      const y = containerHeight - (currentRow * (chipHeight + 10)) - chipHeight - 20 + randomY;

      return {
        x: Math.max(0, Math.min(x, containerWidth)),
        y: Math.max(0, Math.min(y, containerHeight)),
        rotate: Math.random() * 10 - 5
      };
    });

    setChipData(data);
  }, [isInitialized, containerBounds.width, containerBounds.height, items]);

  // Generate initial positions with gravity effect (stacked at bottom)
  const getInitialPosition = (index) => {
    const chipWidth = 140;
    const chipHeight = 45;
    const padding = 20;
    const containerWidth = containerBounds.width || 800;
    const containerHeight = containerBounds.height || 400;
    
    // Create a loose pile at the bottom
    const rows = Math.ceil(items.length / 4);
    const currentRow = Math.floor(index / 4);
    const posInRow = index % 4;
    
    // Add some randomness for natural stacking
    const randomX = (Math.random() - 0.5) * 60;
    const randomY = (Math.random() - 0.5) * 20;
    
    const x = (posInRow * (chipWidth + padding)) + randomX + padding;
    const y = containerHeight - (currentRow * (chipHeight + 10)) - chipHeight - padding + randomY;
    
    return {
      x: Math.max(0, Math.min(x, containerWidth)),
      y: Math.max(0, Math.min(y, containerHeight))
    };
  };

  return (
    <section id="skills-section" className={`w-full px-6 py-20 ${
      isDarkMode ? 'bg-black text-white' : 'bg-white text-black'
    }`}>
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-12">Skills</h2>

        <div className={`relative rounded-3xl border-2 mx-auto ${
          isDarkMode 
            ? 'bg-gray-900/50 border-gray-700/50' 
            : 'bg-gray-50/50 border-gray-200/50'
        }`} 
        style={{ height: `${height}px`, maxWidth: '900px' }}>
          
          {/* Instruction text */}
          <div className="absolute top-6 left-6 text-sm opacity-60 pointer-events-none z-10">
            Click and Drag
          </div>

          {/* Skills container */}
          <div
            ref={containerRef}
            className="relative w-full h-full overflow-hidden rounded-3xl"
            style={{ userSelect: 'none' }}
          >
            <AnimatePresence>
              {isInitialized && chipData.length > 0 && items.map((item, i) => {
                const isLight = typeof item === 'object' ? item.variant === 'light' : i % 3 === 0;
                const text = typeof item === 'object' ? item.text : item;
                const pos = chipData[i] || { x: 0, y: 0, rotate: 0 };

                // Wrap each chip in a stable absolute-positioned wrapper (left/top) so
                // Framer Motion's transform-based dragging doesn't conflict with initial transforms.
                return (
                  <div
                    key={i}
                    className="absolute"
                    style={{
                      left: pos.x,
                      top: pos.y,
                      pointerEvents: 'auto'
                    }}
                  >
                    <motion.div
                      drag
                      dragConstraints={containerRef}
                      dragElastic={0.1}
                      dragMomentum={false}
                      whileHover={{ 
                        scale: 1.05,
                        zIndex: 1000,
                        transition: { duration: 0.2 }
                      }}
                      whileDrag={{ 
                        scale: 1.1, 
                        zIndex: 1000,
                        rotate: pos.rotate,
                        transition: { duration: 0.1 }
                      }}
                      initial={{
                        opacity: 0,
                        scale: 0.8
                      }}
                      animate={{
                        opacity: 1,
                        scale: 1,
                        transition: {
                          delay: i * 0.08,
                          duration: 0.45,
                          ease: 'backOut'
                        }
                      }}
                      className={`px-6 py-3 rounded-full text-sm font-medium cursor-grab active:cursor-grabbing select-none ${
                        isLight
                          ? isDarkMode 
                            ? 'bg-white text-black shadow-lg' 
                            : 'bg-black text-white shadow-lg'
                          : isDarkMode 
                            ? 'bg-gray-800 text-gray-200 border border-gray-600' 
                            : 'bg-gray-200 text-gray-800 border border-gray-300'
                      }`}
                      style={{ 
                        width: 'fit-content',
                        minWidth: '100px',
                        textAlign: 'center',
                        display: 'inline-block'
                      }}
                    >
                      {text}
                    </motion.div>
                  </div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
