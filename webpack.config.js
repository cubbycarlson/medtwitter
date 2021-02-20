const path = require('path');

// https://dev.to/iamismile/how-to-setup-webpack-and-babel-for-react-59ph

module.exports = {
    entry: './src/app.js',
    output: {
        path: path.join(__dirname, 'public'),
        filename: 'bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader'
            },
            // New rules to load css
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            }
        ]
    },
    // devtool: 'cheap-module-eval-source-map',
    devServer: {
        port: 8081,
        contentBase: path.join(__dirname, 'public'),
        hot: true,
        historyApiFallback: true
    },
    target: 'web'
};
