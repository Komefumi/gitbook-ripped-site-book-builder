import chokidar from "chokidar";
import path from "path";
import {
  orderedPages,
  writeHTMLFile,
  writeAllPages,
} from "../lib/page-generation";
import { pathToMarkupBase, pathToMarkupPages } from "../config";

const isWatchMode = process.argv.some(
  (item) => item === "-w" || item === "--watch"
);

writeAllPages();
console.log("Write complete");

if (!isWatchMode) process.exit(0);

const markupBaseWatcher = chokidar.watch(pathToMarkupBase);
const markupPagesWatcher = chokidar.watch(pathToMarkupPages);

markupBaseWatcher.on("change", () => {
  writeAllPages();
  console.log("All files regenerated");
});

markupPagesWatcher.on("change", () => {
  writeAllPages();
  console.log("All files regenerated");
});

markupPagesWatcher.on("add", (filePath) => {
  const filename = path.basename(filePath);
  if (orderedPages.includes(filename)) return;
  orderedPages.push(filename);
  writeAllPages();
  console.log("All files regenerated");
});
