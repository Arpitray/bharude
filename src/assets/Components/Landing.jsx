import React, { useState } from 'react'
import Navbar from './Navbar'
import Particles from './Particles'
import DarkModeToggle from './DarkModeToggle'
import BottomNavbar from './BottomNavbar'
import InteractiveSkills from './InteractiveSkills'

const items = [
  {
    image: 'https://res.cloudinary.com/dsjjdnife/image/upload/v1755711983/load2_z4atye',
    link: 'https://land-book.com/',
    title: 'Item 1',
    description: 'My First Project'
  },
  {
    image: 'https://res.cloudinary.com/dsjjdnife/image/upload/v1755711983/load3_oqxway',
    link: 'https://google.com/',
    title: 'Item 2',
    description: 'This is pretty cool, right?'
  },
  {
    image: 'https://res.cloudinary.com/dsjjdnife/video/upload/v1755597901/camera_lmj7cm',
    link: 'https://google.com/',
    title: 'Item 3',
    description: 'This is pretty cool, right?'
  },
  {
    image: 'https://res.cloudinary.com/dsjjdnife/video/upload/v1755597902/2_ouwpqf',
    link: 'https://google.com/',
    title: 'Item 4',
    description: 'This is pretty cool, right?'
  }
]

function Landing() {
  const [isDarkMode, setIsDarkMode] = useState(true)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => setIsMenuOpen(v => !v)
  const openMenu = () => setIsMenuOpen(true)
  const closeMenu = () => setIsMenuOpen(false)
  const [isFading, setIsFading] = useState(false)

  // central navigation handler used by BottomNavbar to create a fade transition
  const handleNavigateFromBottom = (item) => {
    setIsFading(true);
    const duration = 200; // shortened fade duration

    setTimeout(() => {
      // If Projects was clicked, toggle the InfiniteMenu after fade-out
      if (item.id === 'projects') {
        toggleMenu();
      } else if (item.id === 'home') {
        // ensure overlays closed, then scroll to landing after fade
        closeMenu();
        const el = document.querySelector('#home');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      } else if (item.href && item.href.startsWith('http')) {
        window.open(item.href, '_blank');
      } else if (item.href && item.href.startsWith('#')) {
        const el = document.querySelector(item.href);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }

  // fade back in
  setTimeout(() => setIsFading(false), 60);
    }, duration);
  }

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
  }

  return (
    <>
  <div id="home" className={`relative h-screen overflow-hidden transition-colors duration-500 ${
      isDarkMode ? 'bg-gray-900 text-white' : 'bg-[#f7eee2] text-gray-900'
    }`}>
    <div className={`absolute inset-0 transition-opacity duration-200 ${isFading ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
      {/* Interactive star background */}
      <div className="absolute inset-0 z-0">
        <Particles
          particleCount={600}
          particleSpread={15}
          speed={0.3}
          particleColors={isDarkMode ? ["#ffffff", "#ffffff", "#f8fafc", "#e2e8f0"] : ["#d4a574", "#c09450", "#b8945a", "#a0824d"]}
          isDarkMode={isDarkMode}
          moveParticlesOnHover={true}
          particleHoverFactor={2}
          alphaParticles={true}
          particleBaseSize={80}
          sizeRandomness={0.8}
          cameraDistance={25}
          disableRotation={false}
          className="opacity-60"
        />
      </div>

      {/* Dark mode toggle */}
      <div className="absolute top-4 left-4 z-50">
        <DarkModeToggle isDark={isDarkMode} onToggle={toggleDarkMode} />
      </div>
      
  <Navbar items={items} isDarkMode={isDarkMode} open={isMenuOpen} onOpen={openMenu} onClose={closeMenu} />
      
  {/* Bottom Dock Navigation */}
  <BottomNavbar isDarkMode={isDarkMode} onToggleMenu={toggleMenu} isMenuOpen={isMenuOpen} onNavigate={handleNavigateFromBottom} />

  </div>
      
      {/* existing landing content would sit here (kept empty for the hero) */}
    </div>

    {/* Skills section placed after landing */}
    <InteractiveSkills />

  </>
  )
}

export default Landing