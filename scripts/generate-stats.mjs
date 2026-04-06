#!/usr/bin/env node

// Generates GitHub stats SVG images locally using the github-readme-stats library.
// Expects the github-readme-stats repo to be cloned at GRS_DIR (default: /tmp/github-readme-stats)
// and the PAT_1 environment variable to contain a GitHub API token.

import { writeFileSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";

const GRS_DIR = process.env.GRS_DIR || "/tmp/github-readme-stats";
const OUTPUT_DIR = process.env.OUTPUT_DIR || resolve(process.cwd(), "images");
const USERNAME = "T145";

function grsModule(path) {
  return new URL(path, `file://${GRS_DIR}/`).href;
}

async function main() {
  const { fetchStats } = await import(grsModule("src/fetchers/stats.js"));
  const { renderStatsCard } = await import(grsModule("src/cards/stats.js"));
  const { fetchTopLanguages } = await import(
    grsModule("src/fetchers/top-languages.js")
  );
  const { renderTopLanguages } = await import(
    grsModule("src/cards/top-languages.js")
  );

  mkdirSync(OUTPUT_DIR, { recursive: true });

  console.log("Fetching GitHub stats...");
  const stats = await fetchStats(USERNAME);
  const statsCard = renderStatsCard(stats, {
    hide: ["stars"],
    show_icons: true,
    hide_title: true,
    line_height: 25,
    bg_color: "101010",
    border_color: "101010",
    text_color: "E4E4E4",
    title_color: "E06996",
    icon_color: "03FC00",
  });
  writeFileSync(resolve(OUTPUT_DIR, "github-stats.svg"), statsCard);
  console.log("Generated github-stats.svg");

  console.log("Fetching top languages...");
  const topLangs = await fetchTopLanguages(USERNAME);
  const topLangsCard = renderTopLanguages(topLangs, {
    layout: "compact",
    hide_title: true,
    bg_color: "101010",
    border_color: "101010",
    text_color: "E4E4E4",
  });
  writeFileSync(resolve(OUTPUT_DIR, "top-languages.svg"), topLangsCard);
  console.log("Generated top-languages.svg");

  console.log("Done!");
}

main().catch((err) => {
  console.error("Error generating stats:", err);
  process.exit(1);
});
