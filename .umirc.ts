import { defineConfig, utils } from 'umi';
const shajs = require('sha.js');
import path from 'path';

const config = defineConfig({
    // forkTSCheker: {
    //     tsconfig: 'tsconfig.json',
    // },
    hash: true,
    devtool: process.env.NODE_ENV !== 'production' ? 'source-map' : false,
    antd: {},
    dva: {
        hmr: true,
    },
    dynamicImport: {
        loading: '@/components/PageLoading/index',
    },
    title: '供应链管理中台',
    dll: process.env.NODE_ENV === 'production',
    locale: {
        default: 'zh-CN',
        baseNavigator: false,
    },
    cssLoader: {
        localsConvention: 'camelCaseOnly',
        modules: {
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
    },
    proxy: {
        '/api': {
            // target: 'https://scm-api-t.vova.com.hk/',
            target: 'http://192.168.120.17:3026/',
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
});

export default config;
