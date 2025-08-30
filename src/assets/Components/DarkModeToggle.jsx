import React from 'react';
import styled from 'styled-components';

const DarkModeToggle = ({ isDark, onToggle }) => {
  return (
    <StyledWrapper aria-hidden={false}>
      <div className="toggleWrapper">
        <input
          className="input"
          id="darkmode"
          type="checkbox"
          checked={isDark}
          onChange={onToggle}
          aria-label="Toggle dark mode"
        />
        <label className="toggle" htmlFor="darkmode" role="switch" aria-checked={isDark}>
          <span className="toggle__track" />
          <span className="toggle__handler" aria-hidden>
            {/* sun (light) / moon (dark) icons as inline SVG for crisper visuals */}
            <svg className="icon icon--sun" viewBox="0 0 24 24" width="18" height="18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="4" fill="#FFDD57" />
              <g stroke="#FFDD57" strokeWidth="1.2">
                <path d="M12 1v2" />
                <path d="M12 21v2" />
                <path d="M4.2 4.2l1.4 1.4" />
                <path d="M18.4 18.4l1.4 1.4" />
                <path d="M1 12h2" />
                <path d="M21 12h2" />
                <path d="M4.2 19.8l1.4-1.4" />
                <path d="M18.4 5.6l1.4-1.4" />
              </g>
            </svg>
            <svg className="icon icon--moon" viewBox="0 0 24 24" width="16" height="16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" fill="#E6F0FF" />
            </svg>
            <span className="handler-glow" />
            <span className="comet" />
          </span>
        </label>
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  --w: 110px;
  --h: 56px;
  --track-light: linear-gradient(90deg, rgba(255,220,120,0.18), rgba(255,255,255,0.04));
  --track-dark: linear-gradient(90deg, rgba(20,24,44,0.9), rgba(40,44,64,0.95));
  display: inline-block;

  .toggleWrapper {
    position: relative;
    width: var(--w);
    height: var(--h);
    display: inline-flex;
    align-items: center;
  }

  .input {
    position: absolute;
    left: -9999px;
  }

  .toggle {
    cursor: pointer;
    display: block;
    position: relative;
    width: 100%;
    height: 100%;
    border-radius: 40px;
    transition: transform 300ms ease;
    -webkit-tap-highlight-color: transparent;
    user-select: none;
  }

  .toggle__track {
    position: absolute;
    inset: 0;
    border-radius: inherit;
    box-shadow: inset 0 1px 0 rgba(255,255,255,0.03), 0 6px 18px rgba(11,14,25,0.35);
    background: var(--track-light);
    backdrop-filter: blur(6px) saturate(120%);
    transition: background 350ms ease, box-shadow 350ms ease;
  }

  .toggle__handler {
    position: absolute;
    top: 50%;
    left: 6px;
    width: calc(var(--h) - 12px);
    height: calc(var(--h) - 12px);
    transform: translateY(-50%) rotate(-10deg);
    border-radius: 50%;
    background: linear-gradient(145deg, rgba(255,255,255,0.95), rgba(255,255,255,0.75));
    box-shadow: 0 6px 20px rgba(3,6,18,0.45), inset 0 1px 0 rgba(255,255,255,0.6);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    transition: left 420ms cubic-bezier(0.22,1,0.36,1), transform 420ms cubic-bezier(0.22,1,0.36,1), box-shadow 300ms ease;
    z-index: 2;
    overflow: visible;
  }

  /* small glow element to make the handler feel alive */
  .handler-glow {
    position: absolute;
    width: 70%;
    height: 70%;
    border-radius: 50%;
    filter: blur(6px);
    opacity: 0.6;
    background: radial-gradient(circle at 30% 30%, rgba(255,220,70,0.55), rgba(255,120,80,0.0));
    transform: translateZ(0);
    pointer-events: none;
  }

  .icon { position: absolute; pointer-events: none; opacity: 1; transition: opacity 280ms ease, transform 420ms cubic-bezier(0.22,1,0.36,1); }
  .icon--sun { left: 10px; top: 50%; transform: translateY(-50%) rotate(0deg); }
  .icon--moon { right: 10px; top: 50%; transform: translateY(-50%) scale(0.9); opacity: 0; }

  .comet {
    position: absolute;
    right: -18px;
    top: -10px;
    width: 24px;
    height: 6px;
    background: linear-gradient(90deg, rgba(255,255,255,0.9), rgba(255,255,255,0.05));
    border-radius: 12px;
    opacity: 0.0;
    transform-origin: left center;
    transition: all 520ms ease;
  }

  /* Checked (dark) state */
  .input:checked + .toggle .toggle__track {
    background: var(--track-dark);
    box-shadow: inset 0 1px 0 rgba(255,255,255,0.02), 0 10px 28px rgba(2,6,20,0.6);
  }

  .input:checked + .toggle .toggle__handler {
    left: calc(100% - (var(--h) - 6px));
    transform: translateY(-50%) rotate(0deg);
    background: linear-gradient(145deg, rgba(26,40,72,0.95), rgba(44,56,88,0.95));
    box-shadow: 0 10px 26px rgba(3,8,30,0.65), inset 0 -6px 18px rgba(255,255,255,0.02);
  }

  .input:checked + .toggle .icon--sun { opacity: 0; transform: translateY(-50%) scale(0.8); }
  .input:checked + .toggle .icon--moon { opacity: 1; transform: translateY(-50%) scale(1); }

  .input:checked + .toggle .handler-glow {
    background: radial-gradient(circle at 30% 30%, rgba(120,180,255,0.08), rgba(0,0,0,0));
    opacity: 0.9;
  }

  .input:checked + .toggle .comet {
    right: 6px;
    top: -6px;
    transform: rotate(18deg) scaleX(1.2);
    opacity: 0.9;
  }

  /* focus style for keyboard users */
  .input:focus + .toggle { outline: 3px solid rgba(120,160,255,0.12); outline-offset: 4px; }

  /* small responsive tweak */
  @media (max-width: 420px) {
    --w: 86px; --h: 46px;
  }
`;

export default DarkModeToggle;
