One motion value, the pull's x, drives everything. The pull is a plain draggable locked to the card's width, and the cover, the teeth and the opening all read from that same number, so there's nothing to keep in sync.

The opening isn't a straight V. How far a spot has parted grows exponentially with its distance behind the pull, so it stays tight right at the slider and flares out toward the open end, the way fabric peels off a real zip. The cover is drawn twice, once per half, and each copy is clipped along that curve. Both copies hold the same content, so the two halves read as one sheet until the zip parts them.

Each tooth knows its own x. Ahead of the pull it sits on the seam, interlocked with its neighbour on the other side. Behind the pull it rides the curve and tilts to match its slope, so the teeth always follow the torn edge. The tab under the slider hangs off a spring driven by the pull's velocity, so it trails behind when you tug and swings back when you stop.

The gap only ever shows the pouch's lining, never the prize. Let go past 85% and the pull finishes the run, the halves lift away, and the ticket pops up out of the pouch on a spring, overshooting a touch before it settles. It gets its own `AnimatePresence`, so it animates in even when it mounts inside a parent that set `initial={false}`. Tapping the stub copies the code.
