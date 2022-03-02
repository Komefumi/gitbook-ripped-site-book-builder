import path from "path";
import fs from "fs";
import cheerio from "cheerio";
import {
  siteTitle,
  pathToContent,
  pathToMarkupBase,
  pathToMarkupPages,
} from "../config";
import { readFileContents } from "./fs";
import { timestampToRelativeTime } from "./time";

interface PageMetaDataInterface {
  page: string;
  title: string;
}

function getEmptyPageMetadata(): PageMetaDataInterface {
  return {
    page: "",
    title: "",
  };
}

let latestModified = 0;

const orderedPages = [
  "index.html",
];
let orderedPageMeta: PageMetaDataInterface[] = [];

function calculateLatestModifiedAndOrderedPageMeta() {
  latestModified = 0;
  orderedPageMeta = [];
  orderedPages.forEach((pageName) => {
    const pagePath = path.join(pathToMarkupPages, pageName);
    const lastModifiedForFile = fs.statSync(pagePath).mtime.valueOf();
    if (lastModifiedForFile > latestModified)
      latestModified = lastModifiedForFile;

    const pathToPage = path.join(pathToMarkupPages, pageName);
    const $page = cheerio.load(readFileContents(pathToPage));
    let config = getEmptyPageMetadata();
    const configArea = $page("#config").html() as string;
    eval(configArea);
    orderedPageMeta.push({
      page: pageName,
      title: config.title,
    });
  });
}

function writeHTMLFile(pagePosition: number) {
  const config = orderedPageMeta[pagePosition];
  const { page: pageFilename, title: localTitle } = config;
  const pathToPage = path.join(pathToMarkupPages, pageFilename);
  const $base = cheerio.load(readFileContents(pathToMarkupBase));
  const $page = cheerio.load(readFileContents(pathToPage));
  $base("head").append($page("#head").html() as string);
  $base("body").append($page("#scripts").html() as string);
  $base("#main-content").html($page("#main-content").html() as string);
  $base("title").text(`${localTitle} - ${siteTitle}`);
  $base("#last-modified-string").text(
    timestampToRelativeTime(latestModified) as string
  );
  const $prevLinkElement = $base(
    "#page-footer .footer-navigation-link.previous"
  );
  const $nextLinkElement = $base("#page-footer .footer-navigation-link.next");

  let prevRemoved = false;
  let nextRemoved = false;
  const removePrevElement = () => {
    $prevLinkElement.remove();
    prevRemoved = true;
  };
  const removeNextElement = () => {
    $nextLinkElement.remove();
    nextRemoved = true;
  };
  if (orderedPages.length < 2) {
    removePrevElement();
    removeNextElement();
  } else if (pagePosition === 0) {
    removePrevElement();
  } else if (pagePosition === orderedPages.length - 1) {
    $base("#page-footer .footer-navigation-link.next").remove();
    removeNextElement();
  }
  if (!prevRemoved) {
    console.log("reached prev not removed");
    const { page: pageName, title } = orderedPageMeta[pagePosition - 1];
    $prevLinkElement.prop("href", pageName);
    const mainOfPrevLinkElement = $prevLinkElement.find(".description .main");
    mainOfPrevLinkElement.text(title);
  }

  if (!nextRemoved) {
    console.log("reached next not removed");
    const nextPosition = pagePosition + 1;
    const { page: pageName, title } = orderedPageMeta[nextPosition];
    $nextLinkElement.prop("href", pageName);
    const mainOfNextLinkElement = $nextLinkElement.find(".description .main");
    mainOfNextLinkElement.text(title);
  }

  $base("body > div:not([data-not-default])").addClass("section");
  $base(".section > div:not([data-not-default])").addClass("sub-section");

  $base("a[data-not-default!='true']").each(function (_index, _element) {
    $base(this).addClass("general-link").prop("target", "_blank");
  });

  $base("ul:not([data-not-default])").each(function (_index, _element) {
    $base(this).addClass("general-list");
  });

  $base("li[data-label!='']").each(function (_index, _element) {
    const labelText = $base(this).prop("data-label");
    $base(this).html(
      `<strong>${labelText}</strong>${($base(this).html() || "").trim()}`
    );
  });

  $base("code:not([data-not-default])", "p").addClass("inf");

  const $siteNavigationUL = $base("#site-navigation ul");
  orderedPageMeta.forEach(({ title, page }) => {
    $siteNavigationUL.append(`<li><a href="${page}">${title}</a></li>`);
  });

  fs.writeFileSync(path.join(pathToContent, pageFilename), $base.html());
}

function writeAllPages() {
  calculateLatestModifiedAndOrderedPageMeta();
  orderedPages.forEach((_filename, index) => {
    writeHTMLFile(index);
  });
}

export { orderedPages, orderedPageMeta, writeHTMLFile, writeAllPages };
