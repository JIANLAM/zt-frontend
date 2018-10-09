'use strict'
// Template version: 1.3.1
// see http://vuejs-templates.github.io/webpack for documentation.

const path = require('path')

module.exports = {
  dev: {

    // Paths
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    proxyTable: {
          '/apiBudget': {
            target: 'http://192.168.1.238:8196',
            changeOrigin: true,
            pathRewrite: {
              '^/apiBudget':'/'
              }
          },
          '/apiPurchaseOrder': {
            target: 'http://192.168.1.238:8182',
            // target: 'http://192.168.1.96:8888',
            changeOrigin: true,
            pathRewrite: {
              '^/apiPurchaseOrder':'/'
              }
          },
          '/apiRecommBuy': {
            target: 'http://192.168.1.238:8186',
            changeOrigin: true,
            pathRewrite: {
              '^/apiRecommBuy':'/'
              }
          },
          '/apiCredit': {
            target: 'http://192.168.1.238:8192',
            changeOrigin: true,
            pathRewrite: {
              '^/apiCredit':'/'
              }
          },
          '/lendbuy': {
            target: 'http://192.168.1.238:8184',
            changeOrigin: true,
            pathRewrite: {
              '^/lendbuy':'/'
              }
          },
          '/apiNewBook': {
            target: 'http://192.168.1.238:8193',
            changeOrigin: true,
            pathRewrite: {
              '^/apiNewBook':'/'
              }
          },
          '/notice': { //信息发布
            target: 'http://192.168.1.238:8190',
            changeOrigin: true,
            pathRewrite: {
              '^/notice':'/'
              }
          },
          '/roleUser': {//系统管理-角色管理和用户管理
              target: 'http://192.168.1.238:8191',
            changeOrigin: true,
            pathRewrite: {
              '^/roleUser':'/'
            }
          },
          '/libnews': {//馆内资讯
            target: 'http://192.168.1.238:8281',
            changeOrigin: true,
            pathRewrite: {
              '^/libnews':'/'
            }
          } ,
           // 数据统计
           '/datacount': {
            target: 'http://192.168.1.238:8288',
            changeOrigin: true,
            pathRewrite: {
              '^/datacount':'/'
              }
          },
          '/apiTop':{
            // target: 'http://192.168.1.96:8888',
            target: 'http://192.168.1.238:8238',
            changeOrigin: true,
            pathRewrite: {
              '^/apiTop':'/'
              }
          },
          '/interact':{
            target: 'http://192.168.1.238:8199',
            changeOrigin: true,
            pathRewrite: {
              '^/interact':'/'
              }
          },
          // 系统设置
          '/apiParameter': {
            target: 'http://192.168.1.238:8197',
            changeOrigin: true,
            pathRewrite: {
              '^/apiParameter':'/'
              }
          },
           // 基本参数
           '/dictionary': {
            target: 'http://192.168.1.238:8289',
            changeOrigin: true,
            pathRewrite: {
              '^/dictionary':'/'
              }
          },
          // 借阅规则
          '/circulate': {
            target: 'http://192.168.1.238:8283',
            changeOrigin: true,
            pathRewrite: {
              '^/circulate':'/'
              }
          },
          // 馆藏管理
          '/holding':{
            target: 'http://192.168.1.238:8286',
            changeOrigin: true,
            pathRewrite: {
              '^/holding':'/'
              }
          },
          // 年级管理
          '/grade':{
            target: 'http://192.168.1.238:8287',
            changeOrigin: true,
            pathRewrite: {
              '^/grade':'/'
              }
          },
          // 编目
          '/apiCatalog':{
          target: 'http://192.168.1.238:8290',
            changeOrigin: true,
            pathRewrite: {
              '^/apiCatalog':'/'
              }
          },
          //流通查询
          '/currentSearch':{
            target: 'http://192.168.1.238:8292',
            changeOrigin: true,
            pathRewrite: {
              '^/currentSearch':'/'
            }
          },
          '/organize': { //组织机构
            target: 'http://192.168.1.238:8194',
            changeOrigin: true,
            pathRewrite: {
              '^/organize':'/'
              }
          },
          '/apioperationlog': { //日志
            target: 'http://192.168.1.238:8284',
            changeOrigin: true,
            pathRewrite: {
              '^/apioperationlog':'/'
              }
          },
          // 读者财经
          '/dataquery': {
            target: 'http://192.168.1.238:8293',
            changeOrigin: true,
            pathRewrite: {
              '^/dataquery':'/'
              }
          }
    },

    // Various Dev Server settings
    host: '0.0.0.0', // can be overwritten by process.env.HOST
    port: 8081, // can be overwritten by process.env.PORT, if port is in use, a free one will be determined
    autoOpenBrowser: false,
    errorOverlay: true,
    notifyOnErrors: true,
    poll: false, // https://webpack.js.org/configuration/dev-server/#devserver-watchoptions-


    /**
     * Source Maps
     */

    // https://webpack.js.org/configuration/devtool/#development
    devtool: 'cheap-module-eval-source-map',

    // If you have problems debugging vue-files in devtools,
    // set this to false - it *may* help
    // https://vue-loader.vuejs.org/en/options.html#cachebusting
    cacheBusting: true,

    cssSourceMap: true
  },

  build: {
    // Template for index.html
    index: path.resolve(__dirname, '../dist/index.html'),

    // Paths
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: 'static',
    assetsPublicPath: './',

    /**
     * Source Maps
     */

    productionSourceMap: true,
    // https://webpack.js.org/configuration/devtool/#production
    devtool: '#source-map',

    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: false,
    productionGzipExtensions: ['js', 'css'],

    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report
  }
}
