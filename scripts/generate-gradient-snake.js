import fs from "fs";
import fetch from "node-fetch";
import * as d3 from "d3";
import { JSDOM } from "jsdom";

const username = "ma-muktadeer";
const width = 800;
const height = 200;

const gradientColors = ["#ff6a00", "#ee0979", "#06beb6", "#48c6ef"];

async function getContributionData() {
  const res = await fetch(`https://github-contributions-api.deno.dev/${username}.json`);
  const data = await res.json();
  return data.contributions;
}

async function generateSnake() {
  // Create virtual DOM
  const dom = new JSDOM(`<body></body>`);
  global.document = dom.window.document;

  const contributions = await getContributionData();
  const svg = d3.create("svg")
    .attr("viewBox", `0 0 ${width} ${height}`)
    .attr("xmlns", "http://www.w3.org/2000/svg");

  const defs = svg.append("defs");
  const gradient = defs.append("linearGradient")
    .attr("id", "snakeGradient")
    .attr("x1", "0%").attr("y1", "0%")
    .attr("x2", "100%").attr("y2", "0%");
  gradientColors.forEach((color, i) => {
    gradient.append("stop")
      .attr("offset", `${(i / (gradientColors.length - 1)) * 100}%`)
      .attr("stop-color", color);
  });

  svg.append("path")
    .attr("d", `M 0 ${height/2} Q ${width/2} 0, ${width} ${height/2}`)
    .attr("stroke", "url(#snakeGradient)")
    .attr("stroke-width", 8)
    .attr("fill", "none");

  fs.writeFileSync("snake.svg", svg.node().outerHTML);
}

generateSnake();
