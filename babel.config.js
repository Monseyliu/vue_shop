// 配置开发和生存阶段不同的配置项
const prodPlugins = [];
if(process.env.NODE_ENV === 'production'){
  prodPlugins.push('transform-remove-console')
}

module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset'
  ],
  'plugins': [
    // 发布产品时候的数组
    ...prodPlugins,
    // 路由拦截件插件
    '@babel/plugin-syntax-dynamic-import'
  ]
}
