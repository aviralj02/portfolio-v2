The wobble is only width. Each tab is its own pill - the selected one springs open to let its label in, the one you left folds back to a circle. Nothing else moves: no scale, no squash, the height never changes.

The spring is measured, not guessed. A 16.5% overshoot peaking at 270ms pins the damping ratio at 0.50 and the frequency at ~14 rad/s - so `stiffness: 200, damping: 14.1`. That overshoot *is* the wobble: the pill opens about a sixth wider than it needs to be, hangs there for a beat, then pulls back.

One spring does all of it. A single value runs 0 → 1 and the pill's width, the room the label sits in, its fade and its 8px blur are all reads of that value, so when it overshoots past 1 the pill and the label overshoot together. Two springs look almost right and are subtly out of step. Under reduced motion it goes critically damped - still opens, just never bounces.
