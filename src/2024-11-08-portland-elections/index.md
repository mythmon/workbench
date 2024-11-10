---
theme: wide
---

# Elections

How did the 2024 ranked choice voting elections in Portland go? Data is based on the official counts released at https://rcvresults.multco.us/ and includes provisional data that is not finalized.

## Vote counts

${Plot.plot({
  x: {type: "time"},
  y: {tickFormat: "s"},
  color: {
    legend: true,
    domain: ["mayor", "district 1", "district 2", "district 3", "district 4"],
    range: ["currentcolor", ...d3.schemeCategory10],
  },
  marks: [
    Plot.areaY(districtSummary, {
      x: "timestamp",
      y: "totalVotes",
      fill: "office",
    }),
    Plot.ruleX(mayorSummary, {
      x: "timestamp",
      stroke: dark ? "#1e1e1e" : "white",
    }),
    Plot.lineY(mayorSummary, {
      x: "timestamp",
      y: "totalVotes",
      strokeDasharray: [7, 7],
    }),
    Plot.dot(mayorSummary.filter(d => d.resultsNum === maxResultsNum), {
      x: "timestamp",
      y: "totalVotes",
      tip: true,
    }),
    Plot.text(districtSummary.filter(d => d.resultsNum === maxResultsNum), Plot.stackY1({
      x: "timestamp",
      y: "totalVotes",
      text: "office",
      textAnchor: "end",
      dx: -5,
      dy: -8,
    })),
    Plot.text(mayorSummary.filter(d => d.resultsNum === maxResultsNum), {
      x: "timestamp",
      y: "totalVotes",
      text: "office",
      textAnchor: "end",
      dx: -5,
      dy: 16
    }),
    Plot.gridY(),
  ]
})}

## RCV Results

In the election for ${data.config.office}, as of ${tallyDate.toLocaleString()} a total of ${totalVotesCast.toLocaleString()} votes were cast.

<ul>${elected.map(({name, round}) => htl.html`<li>In round ${round + 1}, ${name} was elected.</li>`)}</ul>

```js
const raceChoice = view(Inputs.select(["Mayor", "District 1", "District 2", "District 3", "District 4"]));
const resultsChoice = view(Inputs.select(["Results 5", "Results 4", "Results 3", "Results 2", "Results 1"]));
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
const datas = new Map([
  ["District 1, Results 1", FileAttachment("./all-results/district_1/results_1.json")],
  ["District 1, Results 2", FileAttachment("./all-results/district_1/results_2.json")],
  ["District 1, Results 3", FileAttachment("./all-results/district_1/results_3.json")],
  ["District 1, Results 4", FileAttachment("./all-results/district_1/results_4.json")],
  ["District 1, Results 5", FileAttachment("./all-results/district_1/results_5.json")],
  ["District 2, Results 1", FileAttachment("./all-results/district_2/results_1.json")],
  ["District 2, Results 2", FileAttachment("./all-results/district_2/results_2.json")],
  ["District 2, Results 3", FileAttachment("./all-results/district_2/results_3.json")],
  ["District 2, Results 4", FileAttachment("./all-results/district_2/results_4.json")],
  ["District 2, Results 5", FileAttachment("./all-results/district_2/results_5.json")],
  ["District 3, Results 1", FileAttachment("./all-results/district_3/results_1.json")],
  ["District 3, Results 2", FileAttachment("./all-results/district_3/results_2.json")],
  ["District 3, Results 3", FileAttachment("./all-results/district_3/results_3.json")],
  ["District 3, Results 4", FileAttachment("./all-results/district_3/results_4.json")],
  ["District 3, Results 5", FileAttachment("./all-results/district_3/results_5.json")],
  ["District 4, Results 1", FileAttachment("./all-results/district_4/results_1.json")],
  ["District 4, Results 2", FileAttachment("./all-results/district_4/results_2.json")],
  ["District 4, Results 3", FileAttachment("./all-results/district_4/results_3.json")],
  ["District 4, Results 4", FileAttachment("./all-results/district_4/results_4.json")],
  ["District 4, Results 5", FileAttachment("./all-results/district_4/results_5.json")],
  ["Mayor, Results 1", FileAttachment("./all-results/mayor/results_1.json")],
  ["Mayor, Results 2", FileAttachment("./all-results/mayor/results_2.json")],
  ["Mayor, Results 3", FileAttachment("./all-results/mayor/results_3.json")],
  ["Mayor, Results 4", FileAttachment("./all-results/mayor/results_4.json")],
  ["Mayor, Results 5", FileAttachment("./all-results/mayor/results_5.json")],
]);
const summary = FileAttachment("./all-results/summary.json").json();
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
const wonIn = new Map();
for (const {round, tallyResults} of data.results) {
  for (const d of tallyResults) {
    if (d.elected) wonIn.set(d.elected, round);
  }
}
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
    .nodePadding(15)
    .extent([[margin.left, margin.top], [margin.left + width, margin.top + height]])
    .nodeAlign(d3Sankey.sankeyLeft)
    .nodeSort((a, b) => d3.descending(wonIn.get(a.category), wonIn.get(b.category)) || d3.ascending(a.value, b.value));

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
    .selectAll()
    .data(links)
    .join("g")
    .attr("stroke-opacity", d => d.source.layer >= wonIn.get(d.source.category) && d.source.category === d.target.category ? 1 : 0.5)
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
    .attr("font-size", "1.3em")
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

```js
const tallyDate = (() => {
  const dateStr = data.config.contest
    .replace(/district_\d/i, "")
    .replace(/^[^\d]+/i, "");
  return d3.timeParse("%Y_%m_%d_%H_%M_%S")(dateStr);
})();
```

```js
const mayorSummary = summary.filter(d => d.office === "mayor");
const districtSummary = summary.filter(d => d.office !== "mayor");
```

```js
const maxResultsNum = d3.max(summary, d => d.resultsNum);
```
