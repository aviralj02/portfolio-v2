Built with [Motion](https://motion.dev). I saw [this post](https://x.com/alyx_so/status/2071064251037520255) from [@alyx_so](https://x.com/alyx_so) and got curious how it'd feel to rebuild - this is that attempt, not a copy.

The thing I kept coming back to: it should feel like you're holding something, not watching a div move. So the lift happens the moment you press, before any actual movement - waiting for a drag threshold to "confirm" always made the UI feel a step behind the hand.

Neighbors lean out of the way early, ahead of the drop, and everything settles on a fast, tight spring instead of easing in slow. Behind the lifted card sits a matching indent with an inset shadow - a small thing, but it's what makes the card read as having come from somewhere, instead of just appearing mid-air.

Dragging is also boxed in to the list now. The first version let you fling a card well past the edges, which was fun for about five seconds and then just looked broken.

None of this is clever, exactly - it's mostly a handful of small timing decisions that, added up, feel less like a UI component and more like an object.
