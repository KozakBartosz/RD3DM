const path = require("path");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const resolve = require("path").resolve;

module.exports = {
	entry: "./src/index.js",
	output: { publicPath: "dist/" },
	// output: { publicPath: resolve("dist") },
	// output: {
	// 	path: resolve(__dirname, "/dist"),
	// 	filename: "main.js"
	// },
	devServer: {
		contentBase: path.join(__dirname, "/"),
		compress: true,
		port: 9000
	},
	devtool: "source-map",
	optimization: {
		minimizer: [
			new UglifyJsPlugin({
				cache: true,
				parallel: true,
				sourceMap: true
			}),
			new OptimizeCssAssetsPlugin({})
		]
	},
	plugins: [new MiniCssExtractPlugin({ filename: "main.css" })],
	module: {
		rules: [
			{
				test: /\.js/,
				exclude: /node_modules/,
				use: {
					loader: "babel-loader"
				}
			},
			// {
			//     test: /\.css$/,
			//     use: ['style-loader', {
			//     loader: 'css-loader',
			//     options: { importLoaders: 1 }
			// }, 'postcss-loader'],
			// },
			{
				test: /\.css$/,
				use: [
					{
						loader: MiniCssExtractPlugin.loader,
						options: {
							modules: true,
							publicPath: resolve(__dirname, "dist")
						}
					},
					{
						loader: "css-loader",
						options: { importLoaders: 1 }
					},
					"postcss-loader"
				]
			}
		]
	}
};
