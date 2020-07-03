/**
 * 待 optimize
 *  - @ant-design/icons
 */
import { defineConfig } from 'umi';
const shajs = require('sha.js');

const dev = process.env.NODE_ENV !== 'production';

const config = defineConfig({
    /*    forkTSCheker: {
        formatter: 'codeframe',
        async: false,
        checkSyntacticErrors: true,
        reportFiles: ['!src/.umi/!**', '!node_modules', 'src/!**!/!*.{ts,tsx}'],
    },*/
    hash: true,
    devtool: dev ? 'source-map' : 'source-map',
    antd: {},
    cssModulesTypescriptLoader: {
        mode: 'emit',
    },
    dva: {
        hmr: true,
    },
    title: '供应链管理中台',
    ignoreMomentLocale: true, // 简化moment.js locale
    locale: {
        antd: true, // 需要设置为true，否则antd会使用默认语言en-US
        title: false,
        default: 'zh-CN',
        baseNavigator: false,
    },
    dynamicImport: {
        loading: '@/components/PageLoading/index',
    },
    externals: dev
        ? {}
        : {
              react: 'window.React',
              'react-dom': 'window.ReactDOM',
          },
    scripts: dev
        ? []
        : [
              {
                  src: 'https://unpkg.com/react@16.13.1/umd/react.production.min.js',
                  crossOrigin: '',
              },
              {
                  src: 'https://unpkg.com/react-dom@16.13.1/umd/react-dom.production.min.js',
                  crossOrigin: '',
              },
          ], // for cdn
    headScripts: dev ? ['http://localhost:8097'] : undefined, // for react-tools
    extraBabelPlugins: [
        'babel-plugin-lodash',
        [
            'babel-plugin-import',
            {
                libraryName: 'lodash',
                libraryDirectory: '',
                camel2DashComponentName: false,
            },
            'lodash',
        ],
        [
            'babel-plugin-import',
            {
                libraryName: 'react-components',
                camel2DashComponentName: false,
                customName: (name: string) => {
                    if (/^use/.test(name)) {
                        return `react-components/es/hooks/${name}`;
                    }
                    return `react-components/es/${name}`;
                },
            },
            'react-components',
        ],
    ],
    cssLoader: {
        localsConvention: 'camelCaseOnly',
        modules: {
            auto: /_[a-zA-Z\.\-_0-9]+\.less$/, // 仅符合要求的文件生成module，减少code体积
            getLocalIdent: (
                context: {
                    resourcePath: string;
                },
                _: string,
                localName: string,
            ) => {
                const { resourcePath } = context;

                if (/_[a-zA-Z\.\-_0-9]+\.less$/.test(resourcePath)) {
                    const match =
                        resourcePath.match(/src(.*)/) || resourcePath.match(/node_modules(.*)/);
                    if (match && match[1]) {
                        const hash = shajs('sha256')
                            .update(resourcePath)
                            .digest('hex')
                            .substr(0, 8); //最大长度

                        return `${localName.replace(/([A-Z])/g, '-$1').toLowerCase()}_${hash}`;
                    }
                    // support node_modules
                }
                return localName;
            },
        },
    },
    proxy: {
        '/api': {
            target: 'https://scm-api-t2.vova.com.hk/',
            // target: 'http://172.16.51.8:3026',
            changeOrigin: true,
            pathRewrite: { '^/api': '' },
        },
    },
    chainWebpack(config, { webpack }) {
        config.plugin('lodash-webpack-plugin').use(require('lodash-webpack-plugin')); // lodash 简化，实际可能并没有作用，如果babel-plugin-lodash已经极尽简化
        config.plugin('antd-dayjs-webpack-plugin').use(require('antd-dayjs-webpack-plugin')); // dayjs代替moment
        // forkTSCheker 配置未传到fork-ts-checker-webpack-plugin中，暂时外部实现
        if (dev) {
            config.plugin('fork-ts-checker').use(require('fork-ts-checker-webpack-plugin'), [
                {
                    formatter: 'codeframe',
                    async: true,
                    checkSyntacticErrors: true,
                    reportFiles: ['!src/.umi/**', '!node_modules', 'src/**/*.{ts,tsx}'],
                },
            ]);
        }
    },
});

export default config;
