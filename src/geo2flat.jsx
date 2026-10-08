// Hand-authored schematic for the flat-platen calibration step. Uses the same
// tilted-platen scene as geo1flat.jsx, but highlights the two things you
// actually measure once on your own machine: the grind angle you achieved
// (beta_cal) and the total bar distance you read off the rig (D_cal, drawn as a
// little ruler running back to the finger rest). Those feed the one-point
// calibration that captures platen tilt, bar/jig sizes and your measuring
// reference automatically.
//
// Like geo1flat.jsx, the physical scene is drawn in a natural frame then
// flipped vertically (matrix 1 0 0 -1 0 50); text labels live outside that group
// (at mirrored y = 50 - y) so the glyphs stay upright.
import React from "react";

function Icon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="50mm"
      height="50mm"
      version="1.1"
      viewBox="0 0 50 50"
    >
      <defs>
        <marker id="calArrowS" orient="auto" overflow="visible" refX="0" refY="0">
          <path fill="#000" fillRule="evenodd" stroke="#000" strokeWidth=".2pt" d="M-1.2 0l-1 1 3.5-1-3.5-1 1 1z" />
        </marker>
        <marker id="calArrowE" orient="auto" overflow="visible" refX="0" refY="0">
          <path fill="#000" fillRule="evenodd" stroke="#000" strokeWidth=".2pt" d="M1.2 0l1-1-3.5 1 3.5 1-1-1z" />
        </marker>
      </defs>

      {/* physical scene, flipped vertically so it reads the right way up */}
      <g transform="matrix(1 0 0 -1 0 50)">
        {/* tilted platen (belt / flat grinding surface), ~75 deg from horizontal */}
        <polygon
          points="32,47 21.13,6.43 25.96,5.14 36.83,45.71"
          fill="gray"
          fillOpacity="0.75"
        />
        <line x1="32" y1="47" x2="21.13" y2="6.43" stroke="#000" strokeWidth="0.3" />

        {/* knife blade: bevel flush on the platen at the measured angle */}
        <polygon points="27.34,29.61 12.89,10.43 10.57,11.05 25.02,30.23" fill="navy" />
        <line x1="27.34" y1="29.61" x2="26.05" y2="24.78" stroke="#ccc" strokeWidth="1.3" strokeLinecap="round" />

        {/* support bar + finger rest (the D_cal reference stop) */}
        <circle cx="15.3" cy="13.6" r="2.2" fill="none" stroke="#000064" strokeWidth="0.6" />
        <path d="M11.3 9.1 l-2.5 3.3 l3.0 1.0" fill="none" stroke="#000064" strokeWidth="0.6" strokeLinejoin="round" />
        <circle cx="27.34" cy="29.61" r="0.7" fill="#000" />

        {/* measured grind angle beta_cal */}
        <path d="M25.27 21.88 A8 8 0 0 0 22.52 23.22" fill="none" stroke="#000" strokeWidth="0.35" />

        {/* measured bar distance D_cal, drawn as a ruler back to the finger rest */}
        <line
          x1="23.48"
          y1="30.65"
          x2="9.03"
          y2="11.47"
          stroke="#000"
          strokeWidth="0.3"
          markerStart="url(#calArrowS)"
          markerEnd="url(#calArrowE)"
        />
        {/* ruler ticks across the D_cal line */}
        <line x1="20.9" y1="30.0" x2="19.1" y2="28.1" stroke="#000" strokeWidth="0.25" />
        <line x1="18.1" y1="26.3" x2="16.3" y2="24.4" stroke="#000" strokeWidth="0.25" />
        <line x1="15.3" y1="22.6" x2="13.5" y2="20.7" stroke="#000" strokeWidth="0.25" />
        <line x1="12.5" y1="18.9" x2="10.7" y2="17.0" stroke="#000" strokeWidth="0.25" />
      </g>

      {/* upright labels, placed at the mirrored positions (y -> 50 - y) */}
      <text x="22.6" y="29.6" fontFamily="sans-serif" fontSize="4" fill="#000">
        β<tspan fontSize="2.4" dy="1">cal</tspan>
      </text>
      <text x="10.6" y="26.4" fontFamily="sans-serif" fontSize="4" fill="#000">
        D<tspan fontSize="2.4" dy="1">cal</tspan>
      </text>
    </svg>
  );
}

export default Icon;
