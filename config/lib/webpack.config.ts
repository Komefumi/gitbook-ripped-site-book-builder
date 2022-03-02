import fs from "fs";
import path from "path";
import { Configuration } from "webpack";
import { merge as webpackMerge } from "webpack-merge";
import { CleanWebpackPlugin } from "clean-webpack-plugin";
import { scriptsConfig, stylesConfig } from "./webpack.utils";
import { pathToScriptEntries, pathToScriptDist } from "../config";

const configOptions: Configuration[] = [
  {
    entry: pathToScriptEntries,
    output: {
      filename: "[name].js",
      path: pathToScriptDist,
    },
    plugins: [new CleanWebpackPlugin()],
    resolve: {
      extensions: ["", ".js", ".json", ".ts"],
    },
  },
  scriptsConfig,
  stylesConfig,
];

// export default webpackMerge(configOptions);

export default function generateWebpackConfig() {
  const entryFiles = fs
    .readdirSync(pathToScriptEntries, { encoding: "utf8" })
    // .map((fileName) => path.join(pathToScriptEntries, fileName));
    .reduce((building, filename) => {
      building[filename.split(".")[0]] = path.join(
        pathToScriptEntries,
        filename
      );
      return building;
    }, {} as { [filename: string]: string });
  const configOptions: Configuration[] = [
    {
      entry: entryFiles,
      output: {
        filename: "[name].js",
        path: pathToScriptDist,
      },
      plugins: [new CleanWebpackPlugin()],
      resolve: {
        extensions: ["", ".js", ".json", ".ts"],
      },
    },
    scriptsConfig,
    stylesConfig,
  ];

  return webpackMerge(configOptions);
}
