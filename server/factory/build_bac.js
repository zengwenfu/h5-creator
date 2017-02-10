'use strict';

var utils = require('../utils/utils.js');
var config = require('./config.js');
var nunjucks = require('nunjucks');
var beautify_js = require('js-beautify'); // also available under "js" export
var beautify_css = require('js-beautify').css;
var beautify_html = require('js-beautify').html;


//复制静态资源
function copy() {
    //复制css
    utils.copy('static', '../../build');

    utils.isExists('../../build/images', function(exists) {
        if(!exists) {
            utils.createExists('../../build/images');
        }
    });
    utils.copy('../upload', '../../build/images');


    /**
     * 复制 template js 临时处理 
     */
    utils.isExists('../../build/js', function(exists) {
        if(!exists) {
            utils.createExists('../../build/js');
        }
    });
    utils.copy('template/js', '../../build/js');
}

copy();

//rem处理
function px2rem(content) {
     return content.replace(/rem(\d*)\((.*?)\)/g, function(match, type, value){
            var divVal;

            // 不做 try catch，及早发现错误以免造成故障
            switch(type){
                // 1080宽度的设计稿，rem1080(value)
                case '1080':
                    divVal = 108;
                    break;
                // 默认为750宽度的设计稿，rem(value)
                case '750':
                    divVal = 75;
                    break;
                default:
                    divVal = 64;
            }

            return (value / divVal).toFixed(6) + 'rem';
        });
}

//遍历config，生成animateClass对象，主要是避免重复
var animateClasses = {};
for(var i = 0; i < config.pages.length; i++) {
    var page = config.pages[i];
    for(var j = 0; j<page.items.length; j++) {
        var item = page.items[j];
        var ac = item.animateClass;
        var isOut = false;
        if(ac.indexOf('Out') >= 0) {
            isOut = true;
        }
        if(!item.animateDuration) {
            item.animateDuration = 2000;
        }
        var ad = item.animateDuration;
        var key = ac + ad;
        animateClasses[key] = {
            ac: ac,
            ad: parseInt(ad)/1000,
            isOut
        }
    }
}

config.animateClasses = animateClasses;


var content = nunjucks.render('./template/view.html', config);
utils.createFile('../../build/view.html', beautify_html(content, {
    'max_preserve_newlines': 0 // 去掉过多的空行
}));
var styleContent = nunjucks.render('./template/css/style.css', config);
utils.createFile('../../build/css/style.css', beautify_css(px2rem(styleContent), {
    'max_preserve_newlines': 1 // 去掉过多的空行
}));
