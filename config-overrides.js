const webpack = require('webpack');
const { override, addWebpackPlugin, addWebpackAlias, addWebpackModuleRule } = require('customize-cra');

module.exports = override(
    addWebpackPlugin(
        new webpack.ProvidePlugin({
            process: 'process/browser',
            Buffer: ['buffer', 'Buffer'],
        })
    ),
    addWebpackAlias({
        process: "process/browser"
    }),
    addWebpackModuleRule({
        test: /\.m?js/,
        resolve: {
            fullySpecified: false
        }
    }),
    (config) => {
        config.resolve.fallback = {
            ...config.resolve.fallback,
            "crypto": require.resolve("crypto-browserify"),
            "stream": require.resolve("stream-browserify"),
            "assert": require.resolve("assert"),
            "http": require.resolve("stream-http"),
            "https": require.resolve("https-browserify"),
            "os": require.resolve("os-browserify"),
            "url": require.resolve("url"),
            "process": require.resolve("process/browser"),
        };
        config.plugins.push(
            new webpack.NormalModuleReplacementPlugin(
                /node:crypto/,
                (resource) => {
                    resource.request = 'crypto-browserify';
                }
            )
        );
        return config;
    }
);