var mongoose = require('mongoose');
var schema = mongoose.Schema;

// 活动
var modelName = 'Activies';
var tableName = 'activies';
var tableSchema = new mongoose.Schema({
    // 活动名称
    name: String,
    //作者
    author: String,
    //描述
    discript: String,
    //封面
    cover: String,
    //查看链接
    viewpath: String,
    //音乐链接
    audioUrl: String,
    //向上的小图标
    pointer: String,
    //排序
    order: Number,
    //页面数据
    pages: [
        {
            burl: String, //背景图片
            inAnimate: String,
            outAnimate: String,
            bgColor: String,
            items: [ //页面项目
                {
                    px: String, //位置x 必选
                    py: String, //位置y 必选
                    width: String, //宽度 必选
                    height: String, //高度 必选
                    transparent: String,//透明度  可选
                    animateClass: String,//动画 可选
                    animateDuration: String, //动画持续时间，默认2000
                    nextAnimateTime: String, //下一个item动画开始的时间间隔
                    zIndex: String, //可选
                    imgUrl: String,// 图片路径 //可选
                    text: String, //文本
                    textStyle: {
                        'color': String,
                        'font-size': String
                    }
                }
            ]
        }
    ]
});

mongoose.model(modelName, tableSchema, tableName);
