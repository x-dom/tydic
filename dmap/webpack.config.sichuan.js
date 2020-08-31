const path = require('path');
const webpack = require('webpack');

const cesiumSource = 'node_modules/cesium/Source';
const webpackModuleConfig = require("./webpack-config/webpack-module-config.js");

module.exports = {
    entry: './src/output.js',
    output: {
        filename: 'DMap.js',
        // path: path.resolve(__dirname, './api'),
        path: path.resolve(__dirname, './dist/cesium'),
        sourcePrefix: ''
    },
    amd: {
        // Enable webpack-friendly use of require in cesium
        toUrlUndefined: true
    },
    node: {
        // Resolve node module use of fs
        fs: "empty"
    },
    mode:"development",
    // devtool: 'cheap-module-eval-source-map', // source-map
    resolve: {
        alias: {
            cesium: path.resolve(__dirname, cesiumSource)
        },
        extensions: ['*','.js','.vue','.json']
    },
    plugins: [
        new webpack.DefinePlugin({
            // Define relative base path in cesium for loading assets
            // CESIUM_BASE_URL: JSON.stringify('/cesium')
            CESIUM_BASE_URL: JSON.stringify('/tydic-sichuan-dmap-demo/cesium')
        }),
    ],
    optimization: {
        splitChunks: {
            cacheGroups: {
                commons: {
                    name: "cesium",
                    chunks: "initial",
                    minChunks: 2
                }
            }
        }
    },
    module: webpackModuleConfig,
}