const helpers = require('./helpers');
const commonConfig = require('./webpack.common.js'); // the settings that are common to prod and dev
const webpackMerge = require('webpack-merge'); // used to merge webpack configs
const DefinePlugin = require('webpack/lib/DefinePlugin');
const NamedModulesPlugin = require('webpack/lib/NamedModulesPlugin');
const LoaderOptionsPlugin = require('webpack/lib/LoaderOptionsPlugin');

const ENV = process.env.ENV = process.env.NODE_ENV = 'development';
const HOST = process.env.HOST || 'localhost';
const PORT = process.env.PORT || 3002;
const HMR = helpers.hasProcessFlag('hot');
const METADATA = webpackMerge(commonConfig({env: ENV}).metadata, {
    host: HOST,
    port: PORT,
    ENV: ENV,
    HMR: HMR
});

module.exports = function (options) {
    return webpackMerge(commonConfig({env: ENV}), {

        // devtool: 'source-map',
        devtool: 'cheap-module-source-map',

        output: {
            path: helpers.root('dist'),
            filename: '[name].bundle.js',
            chunkFilename: '[id].chunk.js'
        },

        plugins: [

            // NOTE: when adding more properties, make sure you include them in custom-typings.d.ts
            new DefinePlugin({
                'ENV': JSON.stringify(METADATA.ENV),
                'HMR': METADATA.HMR,
                'process.env': {
                    'ENV': JSON.stringify(METADATA.ENV),
                    'NODE_ENV': JSON.stringify(METADATA.ENV),
                    'HMR': METADATA.HMR,
                    'TOKEN': JSON.stringify('eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjMzOGJjY2ZlMTc4NjVhZjU1MjhlMWE1NjA5OWYwMWYzNTFkMzBjZmQ2YjE5Mzk1YmY2NjBkZWJiYzg1YmRlZGM5Y2VkNzIxMGE3MTIyYzdiIn0.eyJhdWQiOiIxIiwianRpIjoiMzM4YmNjZmUxNzg2NWFmNTUyOGUxYTU2MDk5ZjAxZjM1MWQzMGNmZDZiMTkzOTViZjY2MGRlYmJjODViZGVkYzljZWQ3MjEwYTcxMjJjN2IiLCJpYXQiOjE1MjQ2NDY3NzMsIm5iZiI6MTUyNDY0Njc3MywiZXhwIjoxNTI0NzMzMTcyLCJzdWIiOiIzIiwic2NvcGVzIjpbIioiXX0.q_yAqbXbLFpxYsigvYUe0IHzNxHtGP5udy7O2NYbcKig24BSxng2JD_YJi0H_bH86w7Cu6XQyPJ8lCh_xd8J6O9JhXST_Lg7USK0J9fVgLoTVZCDA8A5xfCERrrAiKK742T-Cw57X_ETlKXdPYip3KqWpkv8LD5jEslPpOKmgobV4rtF3cx4-VZT5HJ9TOOZ_kAodfQDjpgIDNenJAC4h8EVknFgJq1ZEilmsnN4j4Lh5aZTwIUIcJ7PCw86nsSQK5Gy8vNs709KuxE5x390tjnhHJIcu7RITecRRZn9nWB9t46PEbtAOOqV8B37eu3TT1K-uuBtzML-ctJHejs63qeVw9jAqYyl5eaock2cjUkUHHpy0uzTflMr5kSZy2DLeSlDE3ikfUIMY9AgNmHXvrnB2MEmDNEl2bB31YX8IuiVQGhyO8fDUqggQZkAAh31-4EZJtPpnaX-EkdiGEmamzrmjkrXsLSx2WErxbz_NZQeZU2HV3k0zHjf4zOWcuPTMDS5a6vpAHvfKBCepP3dyXGUyLfHRDArj_PEzTznRngx2LXqEHSPz78D6bdoGe-neGoZ7fREbsodNkfKGjolJuLHrDtbeYPl08WVKo1fPht6n_ySwZ9OZXvl0kbTj6wN6QmaN0m5JxwsNjOcF22O5nLSZPg6UbngnHySYQR3bLU'),
                    'BASE_URL': JSON.stringify('http://master.login.plentymarkets.com')
                }
            })
        ],

        devServer: {
            port: METADATA.port,
            host: METADATA.host,
            historyApiFallback: true,
            watchOptions: {
                aggregateTimeout: 300,
                poll: 1000
            }
        }

    });
};