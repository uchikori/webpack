const path = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

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
  entry: './src/index.js',
  //ファイルの出力設定
  output: {
    //画像をdist内のimagesフォルダに格納
    assetModuleFilename: "images/[name][ext]",
    //出力ファイルのディレクトリ名
    path: path.resolve(__dirname, 'dist'),
    // 出力ファイル名
    filename: 'main.js',
  },
  devServer:{
    static: "dist",
    open: true
  },
  module:{
    rules:[
      { 
        test: /\.scss/,
        use:[
          // CSSファイルを書き出すオプションを有効にする
          {
            loader: MiniCssExtractPlugin.loader,
          },
          {
            loader:"css-loader",
            options:{
              url :true,
              // ソースマップを有効にする
              sourceMap: enabledSourceMap,
              // 0 => no loaders (default);
              // 1 => postcss-loader;
              // 2 => postcss-loader, sass-loader
              importLoaders: 2
            }
          },
          // PostCSSのための設定
          {
            loader: "postcss-loader",
            options: {
              postcssOptions:{
                plugins:[
                  // Autoprefixerを有効化
                  // ベンダープレフィックスを自動付与する
                  ["autoprefixer", { grid: true }],
                ],
              },
            },
          },
          {
            loader: "sass-loader",
            options:{
              // ソースマップの利用有無
              sourceMap: enabledSourceMap
            }
          },
        ],
      },
      {
        test: /\.(gif|png|jpg|svg)$/,
        type: "asset/resource",
      }
    ],
  },
  plugins: [
    // CSSファイルを外出しにするプラグイン
    new MiniCssExtractPlugin({
      // ファイル名を設定します
      filename: "style.css",
    }),
  ]
};