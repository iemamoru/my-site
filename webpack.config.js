const path = require('path');

module.exports = {
    entry: './static/js/2_76bbd318-f394-633c-85c1-29f7f464a7d0_ja.js', 
    output: {
        path: path.resolve(__dirname, 'static/dist'), 
        filename: 'bundle.js', 
        publicPath: '/static/dist/', 
    },
    module: {
        rules: [
            {
                test: /\.css$/, // CSSファイルの処理
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.(png|jpg|jpeg|gif|svg)$/i, // 画像ファイルの処理
                type: 'asset/resource',
                generator: {
                    filename: 'images/[name][hash][ext]', // 出力先と名前
                },
            },
            {
                test: /\.js$/, // JavaScriptのトランスパイル
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'], // ES6+のサポート
                    },
                },
            },
        ],
    },
    devtool: 'source-map', // デバッグ用ソースマップ
    mode: 'development', // 'development' または 'production'
};
