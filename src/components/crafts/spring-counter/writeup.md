Numbers don't just swap out instantly here - they slide in from above or below depending on which direction you're moving. Increment and the new digit flies in from the top, decrement and it comes from the bottom. Feels way more intentional than a plain number flip.

The way it works: every time you hit + or −, it stores the direction as `1` or `-1` in a ref (not state, so it doesn't trigger an extra render). `AnimatePresence` then uses that as the `custom` prop to drive the variants — the incoming number starts offset in the right direction, the outgoing one exits the same way, so they always move together.

The spring config (`stiffness: 280, damping: 22`) is what gives it that slight overshoot and snap — not floaty, not instant, just enough bounce to feel alive.
