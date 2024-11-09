---
theme: wide
---

# Elections

In the election for ${data.config.office}, a total of ${totalVotesCast.toLocaleString()} votes were cast.

<ul>
  ${elected.map(({name, round}) => htl.html`<li>In round ${round + 1}, ${name} was elected</li>`)}
</ul>

```js
const raceChoice = view(Inputs.select(["Mayor", "District 1", "District 2", "District 3", "District 4"]));
const resultsChoice = view(Inputs.select(["Results 4", "Results 3", "Results 2", "Results 1"]));
```

```js
const dataChoice = datas.get(`${raceChoice}, ${resultsChoice}`);
```

<div style="overflow-x: scroll; overflow-y: hidden;">
  ${htl.html`<div style=${`width: ${data.results.length * 160}px; height: 800px`}>
    ${resize((width, height) => drawSankey(data, width, height))}
  </div>`}
</div>

```js
import * as d3Sankey from "npm:d3-sankey@^0.12";
```

```js
let datas = new Map([
  ["District 1, Results 1", FileAttachment("./data/district1/round1.json")],
  ["District 1, Results 2", FileAttachment("./data/district1/round2.json")],
  ["District 1, Results 3", FileAttachment("./data/district1/round3.json")],
  ["District 1, Results 4", FileAttachment("./data/district1/round4.json")],
  ["District 2, Results 1", FileAttachment("./data/district2/round1.json")],
  ["District 2, Results 2", FileAttachment("./data/district2/round2.json")],
  ["District 2, Results 3", FileAttachment("./data/district2/round3.json")],
  ["District 2, Results 4", FileAttachment("./data/district2/round4.json")],
  ["District 3, Results 1", FileAttachment("./data/district3/round1.json")],
  ["District 3, Results 2", FileAttachment("./data/district3/round2.json")],
  ["District 3, Results 3", FileAttachment("./data/district3/round3.json")],
  ["District 3, Results 4", FileAttachment("./data/district3/round4.json")],
  ["District 4, Results 1", FileAttachment("./data/district4/round1.json")],
  ["District 4, Results 2", FileAttachment("./data/district4/round2.json")],
  ["District 4, Results 3", FileAttachment("./data/district4/round3.json")],
  ["District 4, Results 4", FileAttachment("./data/district4/round4.json")],
  ["Mayor, Results 1", FileAttachment("./data/mayor/round1.json")],
  ["Mayor, Results 2", FileAttachment("./data/mayor/round2.json")],
  ["Mayor, Results 3", FileAttachment("./data/mayor/round3.json")],
  ["Mayor, Results 4", FileAttachment("./data/mayor/round4.json")],
]);
```

```js
let data = dataChoice?.json()
  .then(d => (d.config.date = new Date(d.config.date), d));
```

```js
const margin = {top: 10, right: 10, bottom: 20, left: 10};
const color = d3
  .scaleOrdinal()
  .domain(
    Object.entries(data.results[0].tally)
      .sort((a, b) => b[1] - a[1])
      .map((d) => d[0])
  )
  .range(d3.schemeObservable10);
```

```js
const sankeyData = (() => {
  const nodesMap = new Map([["Votes", {name: "Votes", category: "Votes"}]]);
  const links = [];

  for (const [candidate, count] of Object.entries(data.results[0].tally)) {
    const target = `${candidate} (${data.results[0].round})`;
    nodesMap.set(target, {name: target, category: candidate});
    links.push({source: "Votes", target, value: count});
  }

  for (const [idx, step] of data.results.entries()) {
    const eliminated = new Set();

    for (const tr of step.tallyResults) {
      const source = `${tr.eliminated ?? tr.elected} (${step.round})`;
      if ("eliminated" in tr) eliminated.add(tr.eliminated);
      nodesMap.set(source, {name: source, category: tr.eliminated});
      for (const [candidate, count] of Object.entries(tr.transfers)) {
        if (candidate === "exhausted"  || candidate === "residual surplus") continue;
        const target = `${candidate} (${step.round + 1})`;
        nodesMap.set(target, {name: target, category: candidate});
        links.push({source, target, value: count});
      }
    }

      for (const [candidate, count] of Object.entries(step.tally)) {
        if (eliminated.has(candidate)) continue;
        const source = `${candidate} (${step.round})`;
        const target = `${candidate} (${step.round + 1})`;
        nodesMap.set(source, {name: source, category: candidate});
        if (idx < data.results.length - 1) {
          links.push({source, target, value: count});
          nodesMap.set(target, {name: target, category: candidate});
        }
    }
  }

  const nodes = Array.from(nodesMap.values());

  return {nodes, links};
})();
```

```js
function drawSankey(data, w, h) {
  const width = w - margin.left - margin.right;
  const height = h - margin.top - margin.bottom;
  const sankey = d3Sankey.sankey()
    .nodeId(d => d.name)
    .nodeWidth(10)
    .nodePadding(20)
    .extent([[margin.left, margin.top], [margin.left + width, margin.top + height]])
    .nodeAlign(d3Sankey.sankeyLeft)
    .nodeSort((a, b) => a.value - b.value);

  const svg = htl.html`<svg
    width="${width + margin.left + margin.right}"
    height="${height + margin.top + margin.bottom}"
    style="font-family: var(--sans-serif); font-size: 0.6em;"
  >
  </svg>`;

  const format = d3.format(",.0f");

  const {nodes, links} = sankey({
    nodes: sankeyData.nodes.map(d => ({...d})),
    links: sankeyData.links.map(d => ({...d})),
  });

  // Creates the rects that represent the nodes.
  const rect = d3.select(svg)
    .append("g")
    .attr("stroke", "#000")
    .selectAll()
    .data(nodes)
    .join("rect")
    .attr("x", d => d.x0)
    .attr("y", d => d.y0)
    .attr("height", d => d.y1 - d.y0)
    .attr("width", d => d.x1 - d.x0)
    .attr("fill", d => color(d.category))
    .attr("stroke", "currentcolor");

  // Adds a title on the nodes.
  rect.append("title")
    .text(d => `${d.name}\n${format(d.value)} (${percent(d.value)})`);

  // Creates the paths that represent the links.
  const link = d3.select(svg).append("g")
    .attr("fill", "none")
    .attr("stroke-opacity", 0.5)
    .selectAll()
    .data(links)
    .join("g")
    .style("mix-blend-mode", dark ? "screen" : "multiply");

  link.append("path")
      .attr("d", d3Sankey.sankeyLinkHorizontal())
      .attr("stroke",  (d) => color(d.source.category))
      .attr("stroke-width", d => Math.max(1, d.width));

  link.append("title")
      .text(d => `${d.source.name} → ${d.target.name}\n${format(d.value)} (${percent(d.value)})`);

  // Adds labels on the nodes.
  const firsts = nodes
    .filter(n => {
      let match = n.name.match(/.*\((\d+)\).*/);
      if (!match) return true;
      const num = +match[1];
      let last = data.results.at(-1).round;
      if (num === last) return true;
      if (num === 1) return true;
      if (last - num < 2) return false;
      if ((num - 1) % 3 === 0) return true;
      return false;
    })
    .filter(Boolean);

  d3.select(svg).append("g")
    .selectAll()
    .data(firsts)
    .join("text")
    .attr("x", d => d.x0 < width / 2 ? d.x1 + 6 : d.x0 - 6)
    .attr("y", d => (d.y1 + d.y0) / 2)
    .attr("dy", "0.35em")
    .attr("text-anchor", d => d.x0 < width / 2 ? "start" : "end")
    .attr("fill", "currentcolor")
    .text(d => `${d.name.replace(/\s*\(\d+\)$/, "")} (${percent(d.value)})`);

  return svg;
}
```

```js
const totalVotesCast = d3.sum(Object.values(data.results[0].tally));
```

```js
const elected = data.results.reduce((acc, result, idx) => {
  let next = [...acc];
  for (const d of result.tallyResults) {
    if ("elected" in d) {
      next.push({name: d.elected, round: idx});
    }
  }
  return next;
}, []);
```

```js
function percent(value) {
  return (Math.round(value / totalVotesCast * 1000) / 10).toFixed(1) + "%";
}
```
