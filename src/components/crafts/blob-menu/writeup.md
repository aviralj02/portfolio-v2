## Morph menu

**Idea:** move a circle and a rectangle like stickers; when they touch, a goo filter makes them **fuse**, then **split** again. No custom art—just motion + overlap.

**Layers:** blob shapes live **under** a filter; messages live **on top**, unfiltered, and fade in **late** so you’re never squinting through the stunt.

**Placement:** card hangs above the trigger with `bottom: triggerHeight + gap` (real button height + fixed gap). It **starts** parked on the button: `y = cardHeight / 1.5 + gap` and `scale: 0`, then eases up to full size; closing runs the same path backward so the merge reads twice.

**Motion:** springs for the blob (snappier close than open); content opacity is **delayed in, fast out**. Slow-motion mode swaps springs for long tweens so you can stare at the overlap without guesswork.
