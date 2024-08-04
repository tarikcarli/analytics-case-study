// webpack.config.js
const path = require("path");

module.exports = {
    target: "node",
    mode: "production",
    entry: "./src/server.js",
    output: {
        filename: "bundle.js",
        path: path.join(__dirname, "dist"),
    },
    // Additional configuration goes here
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: "babel-loader",
            },
        ],
    },
    stats: {
        errorDetails: true,
    },
};
