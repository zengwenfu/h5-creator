# 在线版h5页面生成器 
> node版在线微场景h5页面生成工具，精简版易企秀

## 阅读前置条件
1. 了解node
2. 了解express框架
3. 了解mongodb以及node 连接框架 mongoose
4. 了解nunjucks模板 

## 说明
设计思路和主要实现步骤都写在这里：[从零打造在线版H5页面生成器](http://www.jianshu.com/p/00681bc68caf)

设计思路和主要实现步骤都是正经而且值得借鉴的（有点不谦虚哈），但是由于赶时间的玩的心态作祟，具体的代码细节上就显得有点混乱尴尬了，主要体现在这几个方面：
1. 项目结构随性
2. 未使用打包工具对代码进行压缩合并以及其它预编译处理，违背现在前端工程化的潮流，webpack.config.js放那唬人，就当是方便场景代码生成后阅读吧
3. 可读性低，难以维护的模板代码
4. 只兼容高版本的浏览器，建议在chrome上运行。由于自己很傲娇的使用formData来封装了图片上传插件，所以可以肯定的是，ie10以下的浏览器是肯定无法上传图片的
5. 很多功能都没有完善，因为懒

“自我批评这么诚恳，咋不见你改？”
拜托，我忙啊，给我点动力呗？我看有没有的。关注以下微信公众号，**留言、赞赏！赞赏！赞赏！（没有比赞赏的动力来得要更猛烈些的了）**
![](http://upload-images.jianshu.io/upload_images/2954145-6a3fe179f43ec7d0.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
如若不然，就请给颗星吧

## 安装使用
1. 安装mongodb
2. npm install
3. npm start
4. 访问: http://localhost:3000/home

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

## 后台代码简读
### 一、核心渲染（build）
在[从零打造在线版H5页面生成器](http://www.jianshu.com/p/00681bc68caf)中已经有详细介绍，关键在于实例模板化，以及数据结构的定义。

这里尚有需要特别说明的一点：**各个击破**
我们定义好模板，定义好数据结构的时候，前端还没开始开发，整个流程是无法串起来的，所以我们要构建最小的可以运行测试的单元，也就是build_bac.js(刚开始它是build.js)，这是一个可以使用node独立运行的js文件，然后创建一个config.js数据实例，把渲染功能跑通，最后再将其封装成提供外部调用的模块build.js（当然在最后跟前端串起来跑的时候会有很多新的改动）。
> 关键字：单元测试、各个击破。

### 二、数据库相关
没有什么太复杂的东西，使用mongoose，一个数据模型，实现增删改查。
> 之所以一个数据模型就够，主要是因为使用了非关系型数据库，一对多，多对多的关系中并不需要为数据冗余的问题而分表

### 三、express路由
> 为了减少配置工作量，在server/routers/index.js中，自动扫描路由文件，有点杀鸡用牛刀的意思，压根就没几个路由文件

```
    // 控制器路由表
    var actionList = [];
    files = utils.getAllFiles(process.rootPath + '/server/routers');
    for (var key in files) {
        if(files[key].indexOf('index.js') < 0) {
            actionList.push(files[key].replace(process.rootPath + '/server/routers/', ''));
        }
    }

    module.exports = (app) => {
    //循环配置控制器路由表
    Array.from(actionList, (page) => {
        require('./' + page)(app);
        return page;
    });
};
```

### nunjucks模板（views）
1. _inc目录维护一些html片段，或共享，或减少单个模板文件的代码，增强可读性
2. home.html项目列表，增删改查
3. show-h5.html预览页面
4. edit.html编辑页面（新增或修改，核心页面）

> edit.html的模板代码异常复杂，后文会详诉

## 前端js代码简读
> 如果用一句话来概括这个工具，不过是将大量场景实例提升为模板，并将满足既定数据结构模型的数据实例与模板结合渲染生成h5场景代码的过程。这句话并未突出构造数据实例这一过程（似乎在[从零打造在线版H5页面生成器](http://www.jianshu.com/p/00681bc68caf)中也被一笔带过了），然而，实现的过程中，构造数据实例的过程，即用户在前端进行可视化编辑操作过程，不光是重中之中，而且也是难中之难。此次再不能避而不谈了

### 一、拖拽、文件上传插件编写
拖拽插件：[div拖拽缩放jquery插件编写——带8个控制点](http://www.jianshu.com/p/822afede7489)

文件上传插件：使用formData新特性，低版本浏览器不兼容，只为方便并get新技能，详见ZUpload.js

>第一反应是通过网络渠道寻找合适的插件，而不是费劲的重复造轮子，只是并未找到比较合适而且可以随意控制的。重复造轮子有时候也是指的拥有的

### 二、入口(edit.js)
读代码的第一要务就是找到代码的入口，edit.js是也~
在“从零打造”中我们已经说过，要将负责的任务分解，所以入口edit.js的主要任务是协调调度各个模块
```
    //定义全局变量
    this.pageController = false; //页面控制器
    this.rTab = new RTab(); //右侧面板控制器
    //对话框 因为用到rTab的方法所以放在后面
    this.dueDialog();
    /**
     - 处理page
     */
    this.duePage();
    /**
     -  处理背景图片上传，必须在pageController之后
     */
    this.dueBgUpload();
    /**
     - 处理文本 必须在创建page之后
     */
    this.dueText();
    /**
     - 处理图片 必须在创建page之后
     */
    this.dueImage();
    /**
     - 处理预览
     */
    this.duePreview();
    /**
     - 处理头部按钮事件
     */
    this.dueHeadButton();
    /**
     - 处理头部按钮切换事件
     */
    this.changeTab();
```

### 三、右侧属性编辑面板控制(rTab.js)
在上例入口代码可以看到，rTab对象在初始化的时候是最先建立的，因为页面控制器，以及图片文本编辑都需要依赖于它来构建，rTab复制哪些事情呢？
1. 维护用户操作过程中产生的数据，并且在用户点击保存和预览的时候，可以随时构造符合后台要求的数据实例，用于构建输出结果
```
     //page数据
     pageData = window.pageData || {};
     //pageItem数据
     pageItemData = window.pageItemData || {};

     /**
     +  生成后台需要的数据结构
     */
    buildData: function() {
        var self = this;
        var pages = [];
        var pageItems = self.sortPageItems();
        $('.page-wrap').each(function(index) {
            var key = $(this).attr('id');
            var pageObj = pageData[key];
            var spb = pageObj.bgImage.split('/');
            var burl = '../images/' + spb[spb.length -1];
            var page = {
                burl: burl,
                bgColor: pageObj.bgColor,
                items: pageItems[key] || []
            };
            pages.push(page);
        });

        return {
            pages: pages
        };
    }
```
2. 



