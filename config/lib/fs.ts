import fs from "fs";

function readFileContents(filename: string) {
  return fs.readFileSync(filename, {
    encoding: "utf8",
  });
}

export {
  readFileContents,
};
