# 在线版h5页面生成器 
> node版在线微场景h5页面生成工具，精简版易企秀

演示地址：[传送门](http://h5.facemagic888.com/)

## 目录说明
1. 阅读前准备
2. 概要
3. 后台代码简读
4. 前端代码简读
5. 待完善功能
6. 总结

## 阅读前准备
1. 了解node
2. 了解express框架
3. 了解mongodb以及node 连接框架 mongoose
4. 了解nunjucks模板 

## 概要
设计思路和主要实现步骤都写在这里：[从零打造在线版H5页面生成器](http://www.jianshu.com/p/00681bc68caf)

设计思路和主要实现步骤都是正经而且值得借鉴的（有点不谦虚哈），但是由于赶时间以及玩的心态作祟，具体的代码细节上就显得有点混乱尴尬了，主要体现在这几个方面：  
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
2. 面板切换：编辑屏、编辑文本、编辑图片对应了不同的编辑面板，需要适时切换，最重要的还是要切换的时候要把当前编辑的数据保存，也就是保存到上一步的`pageData`和`pageItemData`中

### 四、屏/页控制器（page.js）
场景页面的核心要素为：屏/页->屏内项目->项目动画，所以首先我们要构建的是屏/页控制对象，鉴于屏以及舞台上的所有操作的数据变化都需要rTap来监控，所以需要传入rTap来构造屏控制器对象
1. 屏的增删改：每一屏应该有一个一一对应编辑舞台，也就是中间区域，用于编辑展示自身的背景，以及屏内元素。另外，请时刻记住还有一个rTab需要传进来构造
```
  /**
   *  创建page
   */
  createPage: function() {
      //索引递增
      this.pageIndex++;

      //增加page
      var pageId = 'page' + this.pageIndex;
      var pageHtml = ...;//此处省略几万字
      var page = $(pageHtml);
      $('#pageContainer').append(page);
      //增加对应的舞台（同步创建舞台）
      this.createStage(pageId);
      //设置当前页
      this.switchPage(pageId);
  },
```
2. 创建拖拽对象，拖拽插件之前已经有单独的文章介绍，这里主要有两点需要注意，在item点击，以及舞台空白区域点击的时候插件以及有事件监听，插件外部我们也需要监听这两个事件来保存数据，所以需要使用回调的方法切入事件
```
  //创建拖拽对象
  var self = this;
  this.zresize = new ZResize({
      stage: '#mainContent',
      onTriggerItem: function(el) { //item获取焦点时候切入item数据保存处理
          self.onItemTrigger(el);
      },
      onHideItem: function() { //点击舞台空白区域切入切换到page属性面板的处理
          self.onHideItem();
      },
      onDrag: function(org, options) {
          self.onDrag(org, options);
      }
  });
```
3. 判断是否为编辑状态/非新增：编辑状态需要把原先保存的数据置入，这个通过在模板中置入数据，但是需要将冰冷的数据增加可拖拽的能力，于是便有了如下处理
```
    //如果有pageItemData数据, 编辑状态
    if(window.pageItemData) {
        for(var key in pageItemData) {
            self.zresize.addResizeCapa($('#' + key));
        }
    }
```
这里不得不说，由于编辑功能的存在，导致edit.html极其复杂的模板写法，在模板中需要遍历pages，并且遍历pages中的item，并且定义page和items的属性。同时还在此初始化了pageData，和pageItemData这两个伴随着应用的整个生命周期的内存对象。
```
<script type="text/javascript">
        {% if data %}
          window.isEdit = true; //编辑状态标志
          window.settingData = {//项目配置信息
              ...
          };
          window.pageData = {//pageData
             ...
          };
          window.pageItemData = {//pageItemData
            ...
          }
        {% endif %}
</script>
```
edit.js中的弹窗处理，也需要通过模板注入的对象进行判断
```
  var self = this;
  if (!window.isEdit) { //新建则弹出窗口
      $('#pageInfoDialog').show();
  } else { //编辑的时候注入
      $('#author').val(settingData.author);
      $('#projectName').val(settingData.name);
      $('#projectDiscript').val(settingData.discript);
      self.rTab.setPreview($('#uploadCover'), settingData.cover);
  }
```
### 五、文本和图片控制器（textItem.js&imageItem.js）
这两个对象跟page和rTab都是紧密结合的，所以需要传入page和rTab来构造，这两个item对象主要是控制面板的输入和舞台item在拖拽操作，以及这面板和舞台的级联关系
> 说白了，就是一些事件监听

## 待完善功能
1. 图片库：实现图片可重用
2. page之间的入场动画和出场动画定义（现在写死了一种）
3. page的复制
4. 默认主题库
5. 背景音乐
6. ..........

> 感兴趣的同学们可以fork代码，改完之后pull request啊，服务全人类的事业进行到底

## 总结
如果说还需要总结的话，那么就是请关注！关注！关注！star!star!star!赞赏！赞赏！赞赏！


