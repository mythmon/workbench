# 2024-06-14 Hueicon

This page has a dynamic, animated favicon ${display(canvas)}. It is a square cycling through the rainbow. Right now its color is <code>${color}</code>.

```js
const width = 16;
const height = 16;
const canvas = document.createElement("canvas");
canvas.setAttribute("width", width);
canvas.setAttribute("height", height);
const ctx = canvas.getContext("2d");
```

```js
const generatorOutput = (function* () {
  let hue = 0;
  while (true) {
    const color = `oklch(60% 100% ${hue})`
    ctx.fillStyle = color;
    hue = (hue + 1) % 360;
    ctx.fillRect(0, 0, width, height);
    yield {url: canvas.toDataURL(), color};
  }
})();
```

```js
const {url, color} = generatorOutput;
```

```js
const link = (() => {
  let link = document.querySelector("link[rel~='icon']");
  if (!link) {
    link = document.createElement("link");
    link.rel = "icon";
    document.head.appendChild(link);
  }
  return link;
})();
```

```js
(() => {
  link.href = url;
})();
```
