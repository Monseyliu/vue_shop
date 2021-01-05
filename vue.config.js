module.exports = {
    chainWebpack: config => {
        // 发布模式入口
        config.when(process.env.NODE_ENV === 'production', config => {
            config.entry('app').clear().add('./src/main-prod.js');
            // 配置externals 节点，忽略以下发布打包资源项
            config.set('externals', {
                vue: 'Vue',
                'vue-router': 'VueRouter',
                axios: 'axios',
                lodash: '_',
                echarts: 'echarts',
                nprogress: 'NProgress',
                'vue-quill-editor': 'VueQuillEditor'
            })
            //配置首页自定义显示
            config.plugin('html').tap(args => {
                args[0].isProd = true;
                return args
            })
        })
        // 开发模式入口
        config.when(process.env.NODE_ENV === 'development', config => {
            config.entry('app').clear().add('./src/main-dev.js')
            //配置首页自定义显示
            config.plugin('html').tap(args => {
                args[0].isProd = false;
                return args
            })
        })
    }
}