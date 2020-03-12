import { defineConfig } from 'umi';
const shajs = require('sha.js');

const config = defineConfig({
    /*    forkTSCheker: {
        formatter: 'codeframe',
        async: false,
        checkSyntacticErrors: true,
        reportFiles: ['!src/.umi/!**', '!node_modules', 'src/!**!/!*.{ts,tsx}'],
    },*/
    hash: true,
    devtool: process.env.NODE_ENV !== 'production' ? 'source-map' : false,
    antd: {},
    dva: {
        hmr: true,
    },
    title: '供应链管理中台',
    dll: process.env.NODE_ENV === 'production',
    locale: {
        antd: true,
        title: false,
        default: 'zh-CN',
        baseNavigator: false,
    },
    dynamicImport: {
        loading: '@/components/PageLoading/index',
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
            // target: 'https://scm-api-t2.vova.com.hk/',
            target: 'http://192.168.120.17:3026/',
            changeOrigin: true,
            pathRewrite: { '^/api': '' },
        },
    },
    chainWebpack(config, { webpack }) {
        // forkTSCheker 配置未传到fork-ts-checker-webpack-plugin中，暂时外部实现
        config.plugin('fork-ts-checker').use(require('fork-ts-checker-webpack-plugin'), [
            {
                formatter: 'codeframe',
                async: true,
                checkSyntacticErrors: true,
                reportFiles: ['!src/.umi/**', '!node_modules', 'src/**/*.{ts,tsx}'],
            },
        ]);
    },
});

export default config;
