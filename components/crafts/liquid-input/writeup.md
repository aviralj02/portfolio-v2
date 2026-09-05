Inspired by [this post](https://x.com/mikkmartin/status/2077706511405453754) from [@mikkmartin](https://x.com/mikkmartin) - liquid glass, minus the glass.

The trick is that nothing here has a background. The input and the connector banner are transparent; behind them sits a second layer holding two plain rounded rectangles of the same size, and that layer runs through an SVG goo filter (blur, then crush the alpha back to a hard edge). Blur two shapes that are close and the space between them fills in, so the threshold reads them as one body. Pull them apart past the blur radius and they pinch off cleanly. The gap slider is literally just moving the second rectangle.

Both layers are driven by one motion value - the banner's distance from the input - so they can never drift apart. Revealing the banner animates that distance from "fully inside the input" up to the gap on a spring, and the content's blur and opacity are derived from how submerged it still is, which is why text dissolves as the banner sinks instead of just fading.

The 1px ring is part of the filter too: dilate the gooed shape by a pixel, flood it with the border colour, and merge it underneath. Same for the shadow - it's a `drop-shadow()` chained after the goo, so it follows the merged outline rather than the two boxes.
