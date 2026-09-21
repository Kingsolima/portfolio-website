/**
 * "WANTED" in Aurebesh, drawn by hand as strokes so there is no font to
 * license. Glyphs left to right: Wesk, Aurek, Nern, Trill, Esk, Dorn.
 */
export function AurebeshWanted({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 300 56"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="5"
      strokeLinecap="square"
      strokeLinejoin="miter"
    >
      {/* Wesk (W) */}
      <polyline points="5,8 25,50 45,8" />
      <line x1="5" y1="8" x2="19" y2="8" />
      {/* Aurek (A) */}
      <polyline points="59,8 95,29 59,50 59,8" />
      {/* Nern (N) */}
      <polyline points="105,50 105,8 145,8 145,32" />
      {/* Trill (T) */}
      <line x1="155" y1="8" x2="195" y2="8" />
      <line x1="175" y1="8" x2="175" y2="50" />
      <line x1="175" y1="50" x2="189" y2="38" />
      {/* Esk (E) */}
      <polyline points="245,8 205,8 205,50" />
      <line x1="205" y1="29" x2="231" y2="50" />
      {/* Dorn (D) */}
      <polyline points="255,8 255,50 295,50 295,28 255,8" />
    </svg>
  );
}
