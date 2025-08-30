import React, { useState, useRef, useEffect, useMemo, Children, cloneElement } from 'react';
import styled from 'styled-components';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'motion/react';

const BottomNavbar = ({ isDarkMode, onToggleMenu = () => {}, isMenuOpen = false, onNavigate = () => {} }) => {
  // motion-driven dock implementation
  const [hoveredItem, setHoveredItem] = useState(null);

  const navItems = [
    { id: 'home', icon: HomeIcon, label: 'Home', href: '#home' },
    { id: 'projects', icon: EditIcon, label: 'Projects', href: '#projects' },
    { id: 'skills', icon: GlobeIcon, label: 'Skills', href: '#skills' },
    { id: 'about', icon: MenuIcon, label: 'About', href: '#about' },
    { id: 'resume', icon: StarIcon, label: 'Resume', href: '#resume' },
  { id: 'linkedin', icon: LinkedInIcon, label: 'LinkedIn', href: 'https://www.linkedin.com/in/rohit-bharude-12594121a/' },
  { id: 'email', icon: BookIcon, label: 'Email', href: 'mailto:bharuderohit6266@gmail.com' }
  ];

  const handleItemClick = (item) => {
    // handle mailto/tel links first to open the user's mail client/dialer
    if (item.href && (item.href.startsWith('mailto:') || item.href.startsWith('tel:'))) {
      window.location.href = item.href;
      return;
    }

    if (typeof onNavigate === 'function') {
      onNavigate(item);
      return;
    }

    if (item.href && item.href.startsWith('http')) {
      window.open(item.href, '_blank');
      return;
    }

    if (item.href && item.href.startsWith('#')) {
      const el = document.querySelector(item.href);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // --- Dock subcomponents (copied/adapted) ---
  function DockItem({ children, className = '', onClick, mouseX, spring, distance, magnification, baseItemSize }) {
    const ref = useRef(null);
    const isHovered = useMotionValue(0);

    const mouseDistance = useTransform(mouseX, (val) => {
      const rect = ref.current?.getBoundingClientRect() ?? { x: 0, width: baseItemSize };
      return val - rect.x - baseItemSize / 2;
    });

    const targetSize = useTransform(mouseDistance, [-distance, 0, distance], [baseItemSize, magnification, baseItemSize]);
    const size = useSpring(targetSize, spring);

    return (
      <motion.button
        ref={ref}
        style={{ width: size, height: size }}
        onHoverStart={() => isHovered.set(1)}
        onHoverEnd={() => isHovered.set(0)}
        onFocus={() => isHovered.set(1)}
        onBlur={() => isHovered.set(0)}
        onClick={onClick}
        className={`relative inline-flex items-center justify-center rounded-full bg-transparent border-0 ${className}`}
        tabIndex={0}
        role="button"
        aria-haspopup="true"
      >
        {Children.map(children, (child) => cloneElement(child, { isHovered }))}
      </motion.button>
    );
  }

  function DockLabel({ children, className = '', ...rest }) {
    const { isHovered } = rest;
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
      const unsubscribe = isHovered.on('change', (latest) => {
        setIsVisible(latest === 1);
      });
      return () => unsubscribe();
    }, [isHovered]);

    return (
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, y: 0 }}
            animate={{ opacity: 1, y: -10 }}
            exit={{ opacity: 0, y: 0 }}
            transition={{ duration: 0.16 }}
            className={`${className} absolute -top-6 left-1/2 w-fit whitespace-pre rounded-md px-2 py-0.5 text-xs ${isDarkMode ? 'text-black bg-white' : 'text-white bg-gray-800'}`}
            role="tooltip"
            style={{ x: '-50%' }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  function DockIcon({ children, className = '' }) {
    return <div className={`flex items-center justify-center ${className}`}><div className="icon-wrapper">{children}</div></div>;
  }

  // dock-level motion
  const mouseX = useMotionValue(Infinity);
  const isHovered = useMotionValue(0);
  const spring = { mass: 0.08, stiffness: 160, damping: 14 };
  const magnification = 66;
  const distance = 180;
  const baseItemSize = 44;

  const maxHeight = useMemo(() => Math.max(80, magnification + magnification / 2 + 4), [magnification]);

  return (
    <StyledWrapper $isDarkMode={isDarkMode}>
      <div className="outer-rect">
        <motion.div style={{ height: maxHeight }} className="dock-container mx-2 flex max-w-full items-center">
          <motion.div
            onMouseMove={({ pageX }) => {
              isHovered.set(1);
              mouseX.set(pageX);
            }}
            onMouseLeave={() => {
              isHovered.set(0);
              mouseX.set(Infinity);
            }}
            className={`dock absolute bottom-2 left-1/2 transform -translate-x-1/2 flex items-end w-fit gap-4 rounded-2xl pb-2 px-4`}
            style={{ height: 64 }}
            role="toolbar"
            aria-label="Application dock"
          >
            {navItems.map((item, index) => (
              <DockItem
                key={item.id}
                onClick={() => handleItemClick(item)}
                className={item.className}
                mouseX={mouseX}
                spring={spring}
                distance={distance}
                magnification={magnification}
                baseItemSize={baseItemSize}
              >
                <DockIcon>
                  <item.icon />
                </DockIcon>
                <DockLabel>{item.label}</DockLabel>
              </DockItem>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </StyledWrapper>
  );
};

// Icon Components
const HomeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" stroke="currentColor" strokeWidth="2" fill="none"/>
    <polyline points="9,22 9,12 15,12 15,22" stroke="currentColor" strokeWidth="2" fill="none"/>
  </svg>
);

const GalleryIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" stroke="currentColor" strokeWidth="2" fill="none"/>
    <circle cx="8.5" cy="8.5" r="1.5" stroke="currentColor" strokeWidth="2" fill="none"/>
    <polyline points="21,15 16,10 5,21" stroke="currentColor" strokeWidth="2" fill="none"/>
  </svg>
);

const EditIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="3" width="20" height="14" rx="2" ry="2" stroke="currentColor" strokeWidth="2" fill="none"/>
    <line x1="8" y1="21" x2="16" y2="21" stroke="currentColor" strokeWidth="2"/>
    <line x1="12" y1="17" x2="12" y2="21" stroke="currentColor" strokeWidth="2"/>
  </svg>
);

const GlobeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" stroke="currentColor" strokeWidth="2" fill="none"/>
    <path d="M9 9h6v6H9z" stroke="currentColor" strokeWidth="2" fill="none"/>
    <path d="M9 1v6" stroke="currentColor" strokeWidth="2"/>
    <path d="M15 1v6" stroke="currentColor" strokeWidth="2"/>
    <path d="M9 17v6" stroke="currentColor" strokeWidth="2"/>
    <path d="M15 17v6" stroke="currentColor" strokeWidth="2"/>
  </svg>
);

const StarIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke="currentColor" strokeWidth="2" fill="none"/>
    <polyline points="14,2 14,8 20,8" stroke="currentColor" strokeWidth="2" fill="none"/>
    <line x1="16" y1="13" x2="8" y2="13" stroke="currentColor" strokeWidth="2"/>
    <line x1="16" y1="17" x2="8" y2="17" stroke="currentColor" strokeWidth="2"/>
    <polyline points="10,9 9,9 8,9" stroke="currentColor" strokeWidth="2" fill="none"/>
  </svg>
);

const MenuIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="2" fill="none"/>
    <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2" fill="none"/>
  </svg>
);

const LinkedInIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6z" stroke="currentColor" strokeWidth="2" fill="none"/>
    <rect x="2" y="9" width="4" height="12" stroke="currentColor" strokeWidth="2" fill="none"/>
    <circle cx="4" cy="4" r="2" stroke="currentColor" strokeWidth="2" fill="none"/>
  </svg>
);

const BookIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="currentColor" strokeWidth="2" fill="none"/>
    <polyline points="22,6 12,13 2,6" stroke="currentColor" strokeWidth="2" fill="none"/>
  </svg>
);

const StyledWrapper = styled.div`
  .dock-container {
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 1000;
    pointer-events: none;
  }

  .outer-rect {
    display: inline-block;
    padding: 10px 14px;
    border-radius: 18px;
    background: transparent;
    pointer-events: none;
  }

  .outer-rect .dock {
    pointer-events: auto;
    padding: 10px 14px;
    border-radius: 14px;
  border: 1px solid ${props => props.$isDarkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'};
  box-shadow: 0 6px 20px ${props => props.$isDarkMode ? 'rgba(0,0,0,0.45)' : 'rgba(0,0,0,0.08)'};
  }

  .dock {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 8px 12px;
    background: ${props => props.$isDarkMode 
      ? 'rgba(20, 24, 36, 0.85)' 
      : 'rgba(255, 255, 255, 0.85)'};
    backdrop-filter: blur(20px) saturate(120%);
    border-radius: 24px;
    border: 1px solid ${props => props.$isDarkMode 
      ? 'rgba(255, 255, 255, 0.08)' 
      : 'rgba(0, 0, 0, 0.06)'};
    box-shadow: 
      0 8px 32px ${props => props.$isDarkMode 
        ? 'rgba(0, 0, 0, 0.4)' 
        : 'rgba(0, 0, 0, 0.12)'}, 
      inset 0 1px 0 ${props => props.$isDarkMode 
        ? 'rgba(255, 255, 255, 0.05)' 
        : 'rgba(255, 255, 255, 0.8)'};
  pointer-events: auto;
  cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .dock:hover {
    cursor: pointer;
  }

  /* Force pointer cursor consistently across the entire dock and its children */
  .dock, .dock * {
    cursor: pointer !important;
  }

  .dock-item {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 52px;
    height: 52px;
  border: 1px solid ${props => props.$isDarkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.08)'};
    border-radius: 10px;
  background: ${props => props.$isDarkMode ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.6)'};
  color: ${props => props.$isDarkMode ? '#e2e8f0' : '#374151'};
    cursor: pointer;
    transition: all 0.18s cubic-bezier(0.4, 0, 0.2, 1);
    outline: none;
    overflow: visible;
    box-sizing: border-box;
  }

  .dock-item:hover {
    background: ${props => props.$isDarkMode 
      ? 'rgba(255, 255, 255, 0.08)' 
      : 'rgba(0, 0, 0, 0.04)'};
    color: ${props => props.$isDarkMode ? '#ffffff' : '#111827'};
    transform: translateY(-2px) scale(1.05);
    box-shadow: 0 4px 16px ${props => props.isDarkMode 
      ? 'rgba(255, 255, 255, 0.1)' 
      : 'rgba(0, 0, 0, 0.1)'};
  cursor: pointer;
  }

  .dock-item:active {
    transform: translateY(-1px) scale(1.02);
  }

  .dock-item:focus-visible {
  outline: 2px solid ${props => props.$isDarkMode ? '#60a5fa' : '#3b82f6'};
    outline-offset: 2px;
  }

  .icon-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
  width: 20px;
  height: 20px;
    transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .dock-item:hover .icon-wrapper {
    transform: scale(1.1);
  }

  .tooltip {
    position: absolute;
    bottom: 100%;
    left: 50%;
    transform: translateX(-50%) translateY(-8px);
    background: ${props => props.$isDarkMode 
      ? 'rgba(0, 0, 0, 0.9)' 
      : 'rgba(55, 65, 81, 0.9)'};
    color: white;
    padding: 6px 10px;
    border-radius: 6px;
    font-size: 12px;
    font-weight: 500;
    white-space: nowrap;
    opacity: 0;
    visibility: hidden;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    pointer-events: none;
    z-index: 10;
  }

  .tooltip::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border: 4px solid transparent;
    border-top-color: ${props => props.$isDarkMode 
      ? 'rgba(0, 0, 0, 0.9)' 
      : 'rgba(55, 65, 81, 0.9)'};
  }

  .dock-item:hover .tooltip {
    opacity: 1;
    visibility: visible;
    transform: translateX(-50%) translateY(-12px);
  }

  /* Responsive adjustments */
  @media (max-width: 640px) {
    .dock {
      gap: 2px;
      padding: 6px 8px;
      border-radius: 20px;
    }

    .dock-item {
      width: 40px;
      height: 40px;
      border-radius: 10px;
    }

    .tooltip {
      font-size: 11px;
      padding: 4px 8px;
    }
  }

  @media (max-width: 480px) {
    .dock {
      gap: 1px;
      padding: 4px 6px;
    }

    .dock-item {
      width: 36px;
      height: 36px;
    }
  }
`;

export default BottomNavbar;
