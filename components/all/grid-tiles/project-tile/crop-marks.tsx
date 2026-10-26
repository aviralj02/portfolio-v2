const CORNERS = [
  "top-0 left-0 border-t border-l",
  "top-0 right-0 border-t border-r",
  "bottom-0 left-0 border-b border-l",
  "bottom-0 right-0 border-b border-r",
];

/* Corner marks framing the icon, like a part laid out on the drafting
   table. Sits in the emblem's grid cell, behind the icon. */
const CropMarks = () => (
  <div className="col-start-1 row-start-1 relative size-26 sm:size-30">
    {CORNERS.map((corner) => (
      <span
        key={corner}
        className={`absolute size-3 border-foreground/35 ${corner}`}
      />
    ))}
  </div>
);

export default CropMarks;
