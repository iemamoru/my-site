const path = require('path');

module.exports = {
    entry: './static/js/index.js', // JavaScriptエントリポイント
    output: {
        path: path.resolve(__dirname, 'static/dist'), // 出力先ディレクトリ
        filename: 'bundle.js', // 出力ファイル名
        publicPath: '/static/dist/', // Flaskからの参照用パス
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
                test: /\.js$/, // JavaScriptトランスパイル（必要に応じて）
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'], // ES6+対応
                    },
                },
            },
        ],
    },
    devtool: 'source-map', // デバッグ用ソースマップ
    mode: 'development', // モード: 'development' or 'production'
};
