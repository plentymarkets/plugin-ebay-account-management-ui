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
                    'TOKEN': JSON.stringify('eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6ImM0ZWY4YTVlYWRkOGMzMDU0ZmQ4MDlmZjYwZmNmMTc5OGM2YmY3NjUzNzU2Y2IyODQyNjhhMmNiZWJkZTE0NWFkMGE2MmVhMzFlNmQ5OGY1In0.eyJhdWQiOiIxIiwianRpIjoiYzRlZjhhNWVhZGQ4YzMwNTRmZDgwOWZmNjBmY2YxNzk4YzZiZjc2NTM3NTZjYjI4NDI2OGEyY2JlYmRlMTQ1YWQwYTYyZWEzMWU2ZDk4ZjUiLCJpYXQiOjE1MDc2NjUxODUsIm5iZiI6MTUwNzY2NTE4NSwiZXhwIjoxNTA3NzUxNTg1LCJzdWIiOiIzIiwic2NvcGVzIjpbIioiXX0.kNqmSoU56w3aZvoMOvEevqCn7BJRWkN3k-RaP1O0Uqhu7gBjxyxZUt64XoNuhhcncpRttXM7QwltO-kmdbRn1-4ytXKQr0awNzg8pm4LLdNp3y_s3fsx_W7Y-3shQ10iRRZaN-k7gJnTRIHemKiO00iDFXAiAaFClz1k5c_QcrMbIHmrQQfFrxpnITbdODqpBJgC-PUIM5uYCvsBMuZ85bCB0RmJIbXoKHTTaOJt_abSXqnUWFdtGzkxCqMfPacU1cLX17eoUCor9LhLZ4BUMjPtkKmO4OnKVAwaI6Kmt375I9trGLIYi1DxG3nDkDsSHa5OZLuIj13gQRMIBPPCLIUa8gsnUS-eq7cU5ifHI0QxeGJBgkAL4AGEBl2wLwC3-tim64U2CufbaUteMN_lBxTbKE4aTN0SbmxxcpAmBDXDi3PD3uL-f_DNrPRBsef7whjXjj719Ueyppcg_WVvBt2QWXqhlowhiYBIeTG8XYac5D-W7Z-Y1QLzYjzSpkuZW3za4SYRM_tkzUy1kwye7HKy4NzdXbRN4ALk6bCCc_Au13gEyE1kMX1lI0rSiyzB9XfTEXq8suVNf8dfltgKHVbdMmFsoRyOVrUJO8eiF6E73SdQEQOMvRqDWaNiM_z9xhxs1TFSaUxAJLfoWvlp9p1xniiKBxp5L27zwGiKEwI'),
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