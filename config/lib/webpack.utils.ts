import { ModuleOptions, WebpackPluginInstance } from "webpack";
import MiniCssExtractPlugin from "mini-css-extract-plugin";

interface ModuleConfig {
  module: ModuleOptions;
}

interface ModuleWithPluginConfig extends ModuleConfig {
  plugins: WebpackPluginInstance[];
}

export const scriptsConfig: ModuleConfig = {
  module: {
    rules: [
      {
        test: /\.(t|j)s?$/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-typescript", "@babel/preset-env"],
          },
        },
      },
    ],
  },
};

export const stylesConfig: ModuleWithPluginConfig = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
    ],
  },
  plugins: [new MiniCssExtractPlugin()],
};
