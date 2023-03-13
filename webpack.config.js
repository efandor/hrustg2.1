const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: {
        main: path.resolve(__dirname, './src/index.js'),
    },
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.s[ac]ss$/i,
                use: [
                "style-loader",
                "css-loader",
                "sass-loader",
                ],
            },
            {
                test: /\.(ico|png|jpg|jpeg|gif)$/i,
                type: 'asset/resource',
            },
            {
                test: /\.html$/i,
                loader: "html-loader",
            },
        ],
    },
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: '[name].bundle.js',
    },
    mode: 'development',
    devServer: {
    static: path.resolve(__dirname, './dist'),
    open: true,
    compress: true,
    hot: true,
    port: 8080,
    },
    resolve: {
    extensions: ['.ts, .js'],
    },
    plugins: [
    new HtmlWebpackPlugin({
        favicon:	'./src/images/favicon/favicon.ico',
        template: path.resolve(__dirname, './src/template.html'),
        filename: 'index.html',
    }),
    ],
};
