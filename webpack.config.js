const path = require('path');

module.exports = {
    entry: './src/index.tsx',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js',
        clean: true,
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    module: {
        rules: [
            {
                test: /\.(ts|tsx)$/, // Handle TypeScript files
                use: 'ts-loader',
                exclude: /node_modules/, 
            },
            {
                test: /\.css$/, // Handle CSS files
                use: ['style-loader', 'css-loader'],
            },
        ],
    },
    devtool: 'source-map',
    mode: 'development', // Change to 'production' for production build
};