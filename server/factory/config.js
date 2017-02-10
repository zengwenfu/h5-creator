'use strict';

/**
 *  transition: 页面之间过渡动画
 *  pages: 页面数组
 *      burl: 页面背景 必选
 *      items: 页面项目数组
 *          px: 水平位置 必选
 *          py: 垂直位置 必选
 *          width: 宽度  必选
 *          height: 高度 必选
 *          transparent: 透明度 可选
 *          animateClass: 动画类 可选
 *          animateDuration: 1000, //动画持续时间，默认2000
 *          nextAnimateTime: 下一个动画开始的时间间隔 可选 默认500ms
 *          zIndex: z-index层级 可选
 *          imgUrl: 图片路径（图片类项目） 可选
 *          text: 文本(文本类项目) 可选
 *          textStyle: 文本样式 可选 如果是像素指，增加rem()
 */
module.exports = {
    transition: 'pullUp',
    pages: [
        {
            burl: '../images/bg.jpg', //背景图片
            items: [ //页面项目
                {
                    px: 0, //位置x 必选
                    py: 0, //位置y 必选
                    width: 640, //宽度 必选
                    height: 1140, //高度 必选
                    transparent: 100,//透明度  可选
                    animateClass: 'bounceIn',//动画 可选
                    animateDuration: 500, //动画持续时间，默认2000
                    nextAnimateTime: 1000, //下一个item动画开始的时间间隔
                    zIndex: 99, //可选
                    imgUrl: 'images/logo.png',// 图片路径 //可选
                },
                {
                    px: 100, //位置x 必选
                    py: 500, //位置y 必选
                    width: 300, //宽度 必选
                    height: 100, //高度 必选
                    transparent: 100,//透明度  可选
                    animateClass: 'slideInLeft',//动画 可选
                    animateDuration: 1000, //动画持续时间，默认2000
                    zIndex: 99, //可选
                    text: '试试来来来',//文本，可选
                    textStyle: { //文本样式 可选
                        'color': '#FFFFFF',
                        'font-size': 'rem(24)',
                    },
                }
            ]
        }, {
            burl: '../images/bg.jpg', //背景图片
            items: [ //页面项目
                {
                    px: 0, //位置x 必选
                    py: 0, //位置y 必选
                    width: 640, //宽度 必选
                    height: 1140, //高度 必选
                    transparent: 100,//透明度  可选
                    animateClass: 'bounceOut',//动画 可选
                    zIndex: 99, //可选
                    imgUrl: 'images/logo.png',// 图片路径 //可选
                },
                {
                    px: 100, //位置x 必选
                    py: 300, //位置y 必选
                    width: 100, //宽度 必选
                    height: 100, //高度 必选
                    transparent: 100,//透明度  可选
                    animateClass: 'slideInLeft',//动画 可选
                    zIndex: 99, //可选
                    text: '试试来来来',//文本，可选
                    textStyle: { //文本样式 可选
                        'color': '#FFFFFF',
                        'font-size': 'rem(50)',
                    },
                }
            ]
        }
    ]
}