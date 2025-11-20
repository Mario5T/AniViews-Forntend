import React from 'react';

export default function Logo({ width = 220, height = 'auto' }) {
  return (
    <svg
      viewBox="0 0 1000 300"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width, height, display: 'block' }}
      aria-label="AniViews+"
      role="img"
    >
      <defs>
        <filter id="glow">
          <feGaussianBlur stdDeviation="5" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
        <filter id="shadow">
          <feDropShadow dx="0" dy="4" stdDeviation="3" floodOpacity="0.5"/>
        </filter>
        <linearGradient id="textGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffffff"/>
          <stop offset="100%" stopColor="#d1d1d1"/>
        </linearGradient>
      </defs>

      <g opacity="0.6">
        <text x="500" y="185" textAnchor="middle"
              style={{ fontSize: '120px', fontFamily: 'Georgia, serif', fontWeight: 900, letterSpacing: '6px', fontStyle: 'italic', userSelect: 'none' }}
              fill="#000000">
          ANIVIEWS
        </text>
      </g>

      <g filter="url(#shadow)">
        <text x="500" y="180" textAnchor="middle"
              style={{ fontSize: '120px', fontFamily: 'Georgia, serif', fontWeight: 900, letterSpacing: '6px', fontStyle: 'italic', userSelect: 'none' }}
              fill="url(#textGradient)"
              stroke="#ffffff"
              strokeWidth="2">
          ANIVIEWS
        </text>
      </g>

      <g filter="url(#glow)">
        <text x="855" y="135"
              style={{ fontSize: '85px', fontFamily: 'Georgia, serif', fontWeight: 900, fontStyle: 'italic', userSelect: 'none' }}
              stroke="#39ff14"
              strokeWidth="2"
              fill="#39ff14">
          +
        </text>
      </g>
    </svg>
  );
}