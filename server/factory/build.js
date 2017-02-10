'use strict';

var utils = require('../utils/utils.js');
var nunjucks = require('nunjucks');
var beautify_js = require('js-beautify'); // also available under "js" export
var beautify_css = require('js-beautify').css;
var beautify_html = require('js-beautify').html;
var fs = require('fs');


//复制静态资源
function copy(target, images, pointer) {
    
    //复制css
    utils.copy(process.rootPath + '/server/factory/static', target);

    //复制图片
    var targetImage = target + '/images';
    utils.isExists(targetImage, function(exists) {
        //如果存在，先删除，避免多余图片
        if (exists) {
            //删除目录下文件
            utils.removeFiles(targetImage);
        } else {
            utils.createExists(targetImage);
        }
        utils.copyFiles(process.rootPath + '/output/upload', images, targetImage);
        utils.createFile(target + '/images/pointer.png', fs.readFileSync(process.rootPath + '/server/factory/template/images/pointer/' + pointer));
    });
}


//rem处理
function px2rem(content) {
    return content.replace(/rem(\d*)\((.*?)\)/g, function(match, type, value) {
        var divVal;

        // 不做 try catch，及早发现错误以免造成故障
        switch (type) {
            // 1080宽度的设计稿，rem1080(value)
            case '1080':
                divVal = 108;
                break;
                // 默认为750宽度的设计稿，rem(value)
            case '750':
                divVal = 75;
                break;
            default:
                divVal = 25.5;
        }

        return (value / divVal).toFixed(6) + 'rem';
    });
}

// 裁剪图片地址
function cutImagePath(url) {
    var us = url.split('/');
    url = us[us.length-1];
    if(url === 'none' || url === 'default.png') {
        return ;
    }
    return url;
}



module.exports = function(config, callback, target) {
    //默认复制目录
    target = target || 'temp/0000';
    var viewPath = target + '/view.html';

    //绝对路径
    target = process.rootPath + '/output/' +  target;

    //遍历config，生成animateClass对象，主要是避免重复
    var animateClasses = {};
    var images = [];//保存所有用到的图片数组
    for (var i = 0; i < config.pages.length; i++) {
        var page = config.pages[i];
        //筛选图片
        if(cutImagePath(page.burl)) {
            images.push(cutImagePath(page.burl));
        }

        // 为空的时候
        if(page.burl.indexOf('none') >= 0) {
            page.burl = false;
        }

        for (var j = 0; j < page.items.length; j++) {


            var item = page.items[j];
            var ac = item.animateClass;
            var isOut = false;
            if (ac && ac.indexOf('Out') >= 0) {
                isOut = true;
            }
            if (!item.animateDuration) {
                item.animateDuration = 2000;
            }
            var ad = item.animateDuration;
            var key = ac + ad;
            animateClasses[key] = {
                ac: ac,
                ad: parseInt(ad) / 1000,
                isOut
            }
            //筛选图片
            if (item.imgUrl && cutImagePath(item.imgUrl)) {
                images.push(cutImagePath(item.imgUrl));
            }
        }
    }


    //复制
    copy(target, images, config.pointer);

    //生成动画类
    config.animateClasses = animateClasses;

    var htmlTemplate = new nunjucks.Environment(new nunjucks.FileSystemLoader('./server/factory/template'));

    //解析view
    var content = htmlTemplate.render('view.html', config);
    utils.createFile(target + '/view.html', beautify_html(content, {
        'max_preserve_newlines': 0 // 去掉过多的空行
    }));
    //解析样式
    var styleContent = htmlTemplate.render('css/style.css', config);
    utils.createFile(target + '/css/style.css', beautify_css(px2rem(styleContent), {
        'max_preserve_newlines': 1 // 去掉过多的空行
    }));

    //解析main.js
    var mainJsContent = htmlTemplate.render('js/main.js', {
        list: images
    });
    utils.createFile(target + '/js/main.js', beautify_js(mainJsContent, {
        'max_preserve_newlines': 1 // 去掉过多的空行
    }));

    // TO DO 暂时复制
    utils.copyFiles(process.rootPath + '/server/factory/template/js', [
        'item.js',
        'loading.js',
        'slider.js'
    ], target + '/js');

    callback && callback(viewPath);

}
