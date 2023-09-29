const path = require("path");
// CSSファイルを外出しにするプラグイン
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
//ファイル（フォルダ）をコピーするプラグイン
const CopyPlugin = require("copy-webpack-plugin");
//画像を圧縮するプラグイン
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");
//画像をWebPにするプラグイン
const ImageminWebpWebpackPlugin = require("imagemin-webp-webpack-plugin");

// [定数] webpack の出力オプションを指定します
// 'production' か 'development' を指定
const MODE = "development";
// ソースマップの利用有無(productionのときはソースマップを利用しない)
const enabledSourceMap = MODE === "development";

module.exports = {
  // モード値を production に設定すると最適化された状態で、
  // development に設定するとソースマップ有効でJSファイルが出力される
  mode: MODE,
  //メインのjavascriptファイル
  entry: "./src/index.js",
  //ファイルの出力設定
  output: {
    //画像をdist内のimagesフォルダに格納
    assetModuleFilename: "images/[name][ext]",
    //出力ファイルのディレクトリ名
    path: path.resolve(__dirname, "dist"),
    // 出力ファイル名
    filename: "main.js",
  },
  devServer: {
    static: "dist",
    open: true,
  },
  module: {
    rules: [
      {
        test: /\.scss/,
        use: [
          // CSSファイルを書き出すオプションを有効にする
          {
            loader: MiniCssExtractPlugin.loader,
          },
          // "style-loader",
          {
            loader: "css-loader",
            options: {
              url: false,
              // ソースマップを有効にする
              sourceMap: enabledSourceMap,
              // 0 => no loaders (default);
              // 1 => postcss-loader;
              // 2 => postcss-loader, sass-loader
              importLoaders: 2,
            },
          },
          // PostCSSのための設定
          {
            loader: "postcss-loader",
            options: {
              postcssOptions: {
                plugins: [
                  // Autoprefixerを有効化
                  // ベンダープレフィックスを自動付与する
                  ["autoprefixer", { grid: true }],
                ],
              },
            },
          },
          {
            loader: "sass-loader",
            options: {
              // ソースマップの利用有無
              sourceMap: enabledSourceMap,
            },
          },
        ],
      },
      {
        test: /\.(gif|png|jpg|svg)$/,
        type: "asset/resource",
      },
      {
        test: /\.(glsl|vs|fs|vert|frag)$/,
        type: "asset/source",
        generator: {
          filename: "images/[hash][ext]",
        },
      },
    ],
  },
  plugins: [
    //ファイル（フォルダ）をコピーするプラグイン
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, "src/images"),
          to: path.resolve(__dirname, "dist/images"),
        },
      ],
    }),
    new ImageMinimizerPlugin({
      minimizer: {
        implementation: ImageMinimizerPlugin.imageminMinify,
        options: {
          plugins: [
            ["mozjpeg", { quality: 89 }],
            ["pngquant", { quality: [0.75, 0.75] }],
          ],
        },
      },
    }),
    // new ImageMinimizerPlugin({
    //   test: /\.(png|jpe?g)$/i,
    //   minimizer: {
    //     filename: "images/[name]_opt[ext]",
    //     implementation: ImageMinimizerPlugin.squooshMinify,
    //     options: {
    //       encodeOptions: {
    //         mozjpeg: {
    //           quality: 89,
    //         },
    //         oxipng: {
    //           level: 3,
    //           interlace: false,
    //         },
    //       },
    //     },
    //   },
    // }),

    new ImageminWebpWebpackPlugin({
      config: [
        {
          test: /\.(png|jpe?g)$/i,
          options: {
            quality: 89,
          },
        },
      ],
      detailedLogs: true,
      overrideExtension: true,
    }),

    // CSSファイルを外出しにするプラグイン
    new MiniCssExtractPlugin({
      // ファイル名を設定します
      filename: "style.css",
    }),
  ],
};
