## 安装使用
1. 安装mongodb
2. npm install
3. npm start

## 目录结构说明
    |-- output                       --------静态资源目录(express static)
        |--client                    --------前端界面对应静态资源
            |--css                   --------前端css目录
            |--images                --------前端图片目录
            |--js                    --------前端js目录
        |--projects                  --------保存后h5场景代码输出目录
            |--projectId             --------根据项目id创建的目录
                |--css               --------输出代码的css样式
                |--images            --------输出代码的图片目录
                |--js                --------输出代码的js目录
                |--view.html         --------html
        |--temp                      --------预览时候h5场景代码输出的临时目录
        |--upload                    --------图片上传地址
    |-- server                       --------服务器端代码
        |--db                        --------数据库相关
          |--dao                     --------数据库操作
          |--models                  --------mongoose模型
          |--config.js               --------数据库链接配置文件
          |--connect.js              --------数据库连接
        |--factory                   --------h5代码构建工厂
            |--static                --------h5场景代码静态资源（原装复制）
            |--template              --------h5场景代码模板
            |--build.js              --------核心渲染处理
            |--build_bac.js          --------测试js，直接运行渲染
            |--config.js             --------mock数据
        |--middleware                --------express中间件
        |--routers                   --------express路由
        |--utils                     --------公共代码
        |--views                     --------nunjucks模板
    |-- server.js                    --------服务入口文件
    |-- webpack.config.js            --------未使用
