### 项目说明

##### 项目结构

```
├── build                      # 构建相关
├── mock                       # 项目mock 模拟数据
├── plop-templates             # 基本模板
├── public                     # 静态资源
│   │── favicon.ico            # favicon图标
│   └── index.html             # html模板
├── src                        # 源代码
│   ├── api                    # 所有请求
│   ├── assets                 # 主题 字体等静态资源
│   ├── components             # 全局公用组件
│   ├── directive              # 全局指令
│   ├── filters                # 全局 filter
│   ├── icons                  # 项目所有 svg icons
│   ├── lang                   # 国际化 language
│   ├── layout                 # 全局 layout
│   ├── router                 # 路由
│   ├── store                  # 全局 store管理
│   ├── styles                 # 全局样式
│   ├── utils                  # 全局公用方法
│   ├── vendor                 # 公用vendor
│   ├── views                  # views 所有页面
│   ├── App.vue                # 入口页面
│   ├── main.js                # 入口文件 加载组件 初始化等
│   └── permission.js          # 权限管理
├── tests                      # 测试
├── .editorconfig              # 编辑文件配置
├── .env.xxx                   # 环境变量配置
├── .eslintignore              # eslint 忽略文件
├── .eslintrc.js               # eslint 配置项
├── .travis.yml                # 自动化CI配置
├── babel.config.js            # babel-loader 配置
├── jest.config.js             # jest 配置
├── vue.config.js              # vue-cli 配置
├── postcss.config.js          # postcss 配置
└── package.json               # package.json
```

##### 安装

```
# 安装依赖
npm install

# 可以通过如下操作解决 npm 下载速度慢的问题
npm install --registry=https://registry.npm.taobao.org

# 本地开发 启动项目
npm run dev
```

> 其中 node-sass 是依赖 python 环境，
> 如果你之前没有安装和配置过的话，需要自行查看一下相关安装教程。

启动完成后会自动打开浏览器访问 http://localhost:9527，默认端口为9527

