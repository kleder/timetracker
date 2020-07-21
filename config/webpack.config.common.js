'use strict';

const CleanWebpackPlugin   = require('clean-webpack-plugin');
const HtmlWebpackPlugin    = require('html-webpack-plugin');

const helpers              = require('./helpers');
const isDev                = process.env.NODE_ENV !== 'production';

module.exports = {
    entry: {
        polyfills: './src/polyfills.ts',
        main: isDev ? './src/main.ts' : './src/main.aot.ts'
    },

    resolve: {
        extensions: ['.ts', '.js', '.scss']
    },
    "externals": {
        "electron": "require('electron')",
        "child_process": "require('child_process')",
        "crypto": "require('crypto')",
        "events": "require('events')",
        "fs": "require('fs')",
        "http": "require('http')",
        "https": "require('https')",
        "assert": "require('assert')",
        "dns": "require('dns')",
        "net": "require('net')",
        "os": "require('os')",
        "path": "require('path')",
        "querystring": "require('querystring')",
        "readline": "require('readline')",
        "repl": "require('repl')",
        "stream": "require('stream')",
        "string_decoder": "require('string_decoder')",
        "url": "require('url')",
        "util": "require('util')",
        "zlib": "require('zlib')",
        "idle": "require('@paulcbetts/system-idle-time')",
        "sqlite3": "require('sqlite3')",
        "electron-notifications": "require('electron-notifications')"
      },

    module: {
        rules: [
            {
                test: /\.html$/,
                loader: 'html-loader'
            },
            {
                test: /\.(scss|sass)$/,
                use: [
                    { loader: 'style-loader', options: { sourceMap: isDev } },
                    { loader: 'css-loader', options: { sourceMap: isDev } },
                    { loader: 'sass-loader', options: { sourceMap: isDev } }
                ],
                include: helpers.root('src', 'assets')
            },
            {
                test: /\.(scss|sass)$/,
                use: [
                    'to-string-loader',
                    { loader: 'css-loader', options: { sourceMap: isDev } },
                    { loader: 'sass-loader', options: { sourceMap: isDev } }
                ],
                include: helpers.root('src', 'app')
            },
            {
                test: /\.(png|jpe?g|gif|svg|woff2?|eot|ttf)$/i,
                use: [
                  {
                    loader: 'file-loader',
                  },
                ],
              },
        ]
    },

    plugins: [
        new CleanWebpackPlugin(
            helpers.root('dist'), { root: helpers.root(), verbose: true }),

        new HtmlWebpackPlugin({
            template: 'src/index.html'
        })
    ]
};