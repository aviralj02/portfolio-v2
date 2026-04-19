Numbers don't just swap - they slide in from above or below depending on direction. Increment and the new digit flies in from the top, decrement from the bottom. Way more intentional than a plain flip.

Every time you hit `+` or `−`, it updates both the count and the direction (`1` or `-1`) together. `AnimatePresence` uses direction as the `custom` prop to drive the variants - incoming number starts offset in the right direction, outgoing exits the same way, so they always move together.

The spring config (`stiffness: 280, damping: 22`) gives it that slight overshoot and snap. Not floaty, not instant - just enough bounce to feel alive.
