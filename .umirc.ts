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
    devtool: dev ? 'source-map' : false,
    antd: {},
    dva: {
        hmr: true,
    },
    title: '供应链管理中台',
    // dll: !dev,
    locale: {
        antd: true,
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
    headScripts: dev ? ['http://localhost:8097'] : undefined,
    extraBabelPlugins: [
        // 'babel-plugin-lodash',
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
                libraryDirectory: 'es',
                camel2DashComponentName: false,
            },
            'react-components',
        ],
        [
            'babel-plugin-import',
            {
                libraryName: 'react-components/es/hooks',
                libraryDirectory: '',
                camel2DashComponentName: false, // default: true
            },
            'react-components/es/hooks',
        ],
        [
            'babel-plugin-import',
            {
                libraryName: 'react-components/lib/hooks',
                libraryDirectory: '',
                camel2DashComponentName: false, // default: true
            },
            'react-components/lib/hooks',
        ],
    ],
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
            target: 'https://scm-api-t4.vova.com.hk/',
            // target: 'http://192.168.120.17:3026',
            changeOrigin: true,
            pathRewrite: { '^/api': '' },
        },
    },
    chainWebpack(config, { webpack }) {
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
        // config.plugin('lodash-webpack-plugin').use(require('lodash-webpack-plugin'));
    },
});

export default config;
