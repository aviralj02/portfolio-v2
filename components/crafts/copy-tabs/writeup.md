It's a copy button, that's all. I saw [Till Janek](https://x.com/tilljanek) do this and wanted to build it myself, so the idea is his.

A copy button has three things to say: what it holds, what a click does, and that it worked. Here each one gets its own tab and only one is open at a time. Hover and "E-mail" folds into a thin bar while "Click to copy" opens next to it. Click and "Copied!" takes over for a second before handing back.

The code is two booleans, hovered and copied. Each tab springs its width between a 10px bar and `auto`, and the label blurs in as it opens. The hover area is a little bigger than the button, so it wakes up just before you get there.
