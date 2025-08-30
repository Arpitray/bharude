import React, { useState, useEffect } from 'react'
import InfiniteMenu from './InfiniteMenu'

export default function Navbar({ items = [], isDarkMode = false, open = false, onOpen = () => {}, onClose = () => {} }) {
  useEffect(() => {
    const onPop = (e) => {
      // when the user presses back, close the overlay if open
      if (open) {
        onClose()
      }
    }

    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [open, onClose])

  useEffect(() => {
    if (!open) return
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.button === 3) onClose() // back mouse button (not all browsers emit this)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  return (
    <>
      {/* Navbar doesn't expose the InfiniteMenu button anymore; menu is controlled by BottomNavbar */}

      {/* Fullscreen overlay with InfiniteMenu when open */}
      {open && (
        <div className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm flex">
          <div className="relative flex-1">
            <button
              aria-label="Close menu"
              onClick={onClose}
              className="absolute top-4 right-4 z-50 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white grid place-items-center border border-white/10"
            >
              ✕
            </button>

            <div className="w-full h-full">
              <InfiniteMenu items={items} isDarkMode={isDarkMode} />
            </div>
          </div>
        </div>
      )}
    </>
  )
}
