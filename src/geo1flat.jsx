// Hand-authored schematic for flat-platen (belt sander) sharpening geometry.
// Mirrors geo1.svg (the round-wheel diagram) in styling, but shows the edge
// riding on a flat belt instead of a wheel. The platen is drawn tilted ~15 deg
// off vertical (i.e. 75 deg from horizontal), matching the real Tormek-style
// support-bar rig on a 1x30 sander: the blade's bevel sits flush on the platen
// at the grind angle beta, the knife is held in a jig riding the support bar a
// perpendicular distance h_r off the belt, and l_p is the projection from the
// edge back to the finger rest that sits just behind the bar.
//
// The physical scene is drawn in a natural frame and then flipped vertically
// (matrix 1 0 0 -1 0 50) so it reads the right way up; text labels are placed
// outside that group (at mirrored y = 50 - y) so the glyphs stay upright.
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
        {/* small dimension arrowheads, matching geo1.svg's Inkscape markers */}
        <marker id="flatArrowS" orient="auto" overflow="visible" refX="0" refY="0">
          <path
            fill="#000"
            fillRule="evenodd"
            stroke="#000"
            strokeWidth=".2pt"
            d="M-1.2 0l-1 1 3.5-1-3.5-1 1 1z"
          />
        </marker>
        <marker id="flatArrowE" orient="auto" overflow="visible" refX="0" refY="0">
          <path
            fill="#000"
            fillRule="evenodd"
            stroke="#000"
            strokeWidth=".2pt"
            d="M1.2 0l1-1-3.5 1 3.5 1-1-1z"
          />
        </marker>
        <marker id="flatBelt" orient="auto" overflow="visible" refX="0" refY="0">
          <path
            fill="#fff"
            fillRule="evenodd"
            stroke="#fff"
            strokeWidth=".2pt"
            d="M-1.2 0l-1 1 3.5-1-3.5-1 1 1z"
          />
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
        {/* working face of the platen */}
        <line x1="32" y1="47" x2="21.13" y2="6.43" stroke="#000" strokeWidth="0.3" />
        {/* belt travel direction (up the platen) */}
        <line
          x1="34.45"
          y1="41.2"
          x2="32.38"
          y2="33.48"
          stroke="#fff"
          strokeWidth="0.6"
          strokeLinecap="round"
          opacity="0.8"
          markerEnd="url(#flatBelt)"
        />

        {/* knife blade: bevel flush on the platen, body lifted off by beta */}
        <polygon points="27.34,29.61 12.89,10.43 10.57,11.05 25.02,30.23" fill="navy" />
        {/* ground bevel sitting flat on the belt */}
        <line x1="27.34" y1="29.61" x2="26.05" y2="24.78" stroke="#ccc" strokeWidth="1.3" strokeLinecap="round" />

        {/* support bar the jig rides on */}
        <circle cx="15.3" cy="13.6" r="2.2" fill="none" stroke="#000064" strokeWidth="0.6" />
        {/* finger rest just behind the bar (the l_p reference stop) */}
        <path d="M11.3 9.1 l-2.5 3.3 l3.0 1.0" fill="none" stroke="#000064" strokeWidth="0.6" strokeLinejoin="round" />

        {/* edge contact point */}
        <circle cx="27.34" cy="29.61" r="0.7" fill="#000" />

        {/* grind angle arc (face -> blade) */}
        <path d="M25.27 21.88 A8 8 0 0 0 22.52 23.22" fill="none" stroke="#000" strokeWidth="0.35" />

        {/* projection l_p (edge -> finger rest, parallel to the blade) */}
        <line
          x1="23.48"
          y1="30.65"
          x2="9.03"
          y2="11.47"
          stroke="#000"
          strokeWidth="0.3"
          markerStart="url(#flatArrowS)"
          markerEnd="url(#flatArrowE)"
        />

        {/* bar distance h_r (platen face -> support bar, perpendicular) */}
        <line x1="15.3" y1="13.6" x2="22.53" y2="11.67" stroke="#000" strokeWidth="0.25" strokeDasharray="1 1" />
        <circle cx="22.53" cy="11.67" r="0.5" fill="#000" />
        <circle cx="15.3" cy="13.6" r="0.5" fill="#000" />
      </g>

      {/* upright labels, placed at the mirrored positions (y -> 50 - y) */}
      <text x="23.0" y="29.6" fontFamily="sans-serif" fontSize="4" fill="#000">β</text>
      <text x="11.0" y="26.4" fontFamily="sans-serif" fontSize="4" fill="#000">
        l<tspan fontSize="3" dy="1">p</tspan>
      </text>
      <text x="16.6" y="39.7" fontFamily="sans-serif" fontSize="4" fill="#000">
        h<tspan fontSize="3" dy="1">r</tspan>
      </text>
    </svg>
  );
}

export default Icon;
