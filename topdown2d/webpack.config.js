const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ESLintPlugin = require("eslint-webpack-plugin");

module.exports = {
    entry: "./src/index.ts",
    output: {
        path: path.join(__dirname, "/dist"),
        filename: "bundle.js",
        assetModuleFilename: "assets/[name][ext]"
    },
    module: {
        rules: [{
                test: /\.tsx?$/,
                use: [{
                    loader: "ts-loader"
                }]
            },
            {
                test: /\.(png|jpg|gif)$/,
                type: "asset"
            }
        ]
    },
    resolve: {
        modules: [path.join(__dirname, "src"), "node_modules"],
        extensions: [".ts", ".js"]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./src/index.html",
        }),
        new ESLintPlugin({
            extensions: "ts",
        })
    ],
    devServer: {
        host: "localhost",
        port: 5500
    },
    mode: "development"
};
