import path from "path";

const siteTitle = "My built book";

const pathToMarkup = path.join(__dirname, "../source/markup");
const pathToContent = path.join(__dirname, "../content");
const pathToMarkupBase = path.join(pathToMarkup, "base.html");
const pathToMarkupPages = path.join(pathToMarkup, "pages");
const pathToScriptEntries = path.join(__dirname, "../source/scripts/entries");
const pathToScriptDist = path.join(__dirname, "../content/scripts");

export {
  siteTitle,
  pathToMarkup,
  pathToContent,
  pathToMarkupBase,
  pathToMarkupPages,
  pathToScriptEntries,
  pathToScriptDist,
};
