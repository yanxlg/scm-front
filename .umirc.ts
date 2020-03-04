import { IConfig } from 'umi-types';
const shajs = require('sha.js');
import path from 'path';
const eslint = require('eslint');

// ref: https://umijs.org/config/
const config: IConfig = {
    treeShaking: true,
    hash: true,
    devtool: process.env.NODE_ENV !== 'production' ? 'source-map' : false,
    cssLoaderOptions: {
        modules: false,
        localsConvention: 'camelCase', // scope支持camel转换
        getLocalIdent: (
            context: {
                resourcePath: string;
            },
            _: string,
            localName: string,
        ) => {
            const { resourcePath } = context;
            if (/_[a-zA-Z\.\-_0-9]+\.less$/.test(resourcePath)) {
                const match = resourcePath.match(/src(.*)/);
                if (match && match[1]) {
                    const hash = shajs('sha256')
                        .update(resourcePath)
                        .digest('hex')
                        .substr(0, 8); //最大长度
                    return `${localName.replace(/([A-Z])/g, '-$1').toLowerCase()}_${hash}`;
                }
            }
            return localName;
        },
    },
    plugins: [
        // ref: https://umijs.org/plugin/umi-plugin-react.html
        [
            'umi-plugin-react',
            {
                antd: true,
                dva: true,
                dynamicImport: { webpackChunkName: true },
                dll: process.env.NODE_ENV === 'production',
                locale: {
                    enable: false,
                    default: 'zh-CN',
                    baseNavigator: false,
                },
                routes: {
                    exclude: [
                        /models\//,
                        /services\//,
                        /model\.(t|j)sx?$/,
                        /service\.(t|j)sx?$/,
                        /components\//,
                    ],
                },
            },
        ],
    ],
    proxy: {
        '/api': {
            target: 'https://scm-api-t.vova.com.hk/',
            changeOrigin: true,
            pathRewrite: { '^/api': '' },
        },
    },
    chainWebpack(config, { webpack }) {
        const appSrc = path.resolve(process.cwd(), 'src');
        const umi = path.resolve(process.cwd(), 'src/pages/.umi');
        config.module
            .rule('lint')
            .test(/\.(js|mjs|jsx|ts|tsx)$/)
            .include.add(appSrc)
            .end()
            .exclude.add(umi)
            .end()
            .enforce('pre')
            .use('eslint-loader')
            .loader('eslint-loader')
            .options({
                cache: true,
                resolvePluginsRelativeTo: __dirname,
                useEslintrc: true,
            });
    },
};

export default config;
