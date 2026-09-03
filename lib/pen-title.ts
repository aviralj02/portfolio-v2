export type PenStroke = {
  d: string;
  /** Fraction of the total pen length at which this stroke begins. */
  start: number;
  /** Fraction of the total pen length this stroke occupies. */
  span: number;
};

export type PenTitleData = {
  word: string;
  viewBox: string;
  /** Filled letterforms, revealed through the pen mask. */
  letters: string;
  /** Pen-down strokes, in writing order. */
  strokes: PenStroke[];
  penWidth: number;
  writeMs: number;
  delayMs: number;
};
