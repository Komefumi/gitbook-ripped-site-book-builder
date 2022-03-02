import chokidar from "chokidar";
import webpack from "webpack";
import generateWebpackConfig from "../lib/webpack.config";
import { pathToScriptEntries } from "../config";

function compile() {
  const webpackConfig = generateWebpackConfig();
  webpack(webpackConfig, (err, stats) => {
    if (err || stats?.hasErrors()) {
      console.error(err);
      console.log(stats);
      throw new Error("Error! Error during compile");
    }
  });
}

compile();

if (!process.argv.some((arg) => arg === "-w" || arg === "--watch")) {
  process.exit(0);
}

chokidar.watch(pathToScriptEntries).on("all", (event, filePath) => {
  console.log("Event log:");
  console.log("--------");
  console.log({ event, filePath });
  console.log("--------");
  compile();
});
