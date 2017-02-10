;
(function($) {

    /**
     *  rgb(0,0,0) 转 #FFFFFF
     */
    var rgbToHex = function(rgb) {
        var rRgb = /rgb\((\d{1,3}),(\d{1,3}),(\d{1,3})\)/,
            rRgba = /rgba\((\d{1,3}),(\d{1,3}),(\d{1,3}),([.\d]+)\)/,
            r, g, b, a, rs = rgb.replace(/\s+/g, "").match(rRgb),
            rsa = rgb.replace(/\s+/g, "").match(rRgba);
        if (rs) {
            r = (+rs[1]).toString(16);
            r = r.length == 1 ? "0" + r : r;
            g = (+rs[2]).toString(16);
            g = g.length == 1 ? "0" + g : g;
            b = (+rs[3]).toString(16);
            b = b.length == 1 ? "0" + b : b;
            return {hex: "#" + r + g + b, alpha: 100};
        } else if (rsa) {
            r = (+rsa[1]).toString(16);
            r = r.length == 1 ? "0" + r : r;
            g = (+rsa[2]).toString(16);
            g = g.length == 1 ? "0" + g : g;
            b = (+rsa[3]).toString(16);
            b = b.length == 1 ? "0" + b : b;
            a = (+rsa[4]) * 100
            return {hex: "#" + r + g + b, alpha: Math.ceil(a)};
        } else {
            return {hex: rgb, alpha: 100};
        }
    };

    /**
     *  默认参数
     */
    var defaultOpts = {
        rTab: false, //右边面板对象 必传
    };

    /**
     *  定义类
     */
    var PageController = function(options) {
        this.options = $.extend({}, defaultOpts, options);
        this.init();
    };

    /**
     *  原型方法
     */
    PageController.prototype = {
        init: function() {
            //初始化全局变量
            this.pageIndex = 1;
            this.currentPageId = 'page1';

            //创建拖拽对象
            var self = this;
            this.zresize = new ZResize({
                stage: '#mainContent',
                onTriggerItem: function(el) {
                    self.onItemTrigger(el);
                },
                onHideItem: function() {
                    self.onHideItem();
                },
                onDrag: function(org, options) {
                    self.onDrag(org, options);
                }
            });

            //如果有pageItemData数据, 编辑状态
            if(window.pageItemData) {
                for(var key in pageItemData) {
                    self.zresize.addResizeCapa($('#' + key));
                }
            }
            

            //监听新增事件
            this.bindAddEvent();
            //监听删除事件
            this.bindRemoveEvent();
            //监听切换事件
            this.bindSwitchEvent();
        },
        /**
         *  创建page
         */
        createPage: function() {
            //索引递增
            this.pageIndex++;

            //增加page
            var pageId = 'page' + this.pageIndex;
            var pageHtml = '<section class="page-wrap" id="' + pageId + '">' +
                '<div class="page"></div>' +
                '<ul class="page-handle">' +
                '<li class="add" title="新增"></li>' +
                '<li class="copy" title="复制" data-page="' + pageId + '"></li>' +
                '<li class="delete" title="删除" data-page="' + pageId + '"></li>' +
                '</ul>' +
                '</section>';
            var page = $(pageHtml);
            $('#pageContainer').append(page);

            //增加对应的舞台
            this.createStage(pageId);

            //设置当前页
            this.switchPage(pageId);
        },
        /**
         *  点击舞台空白区域的时候触发
         *      1. 保存item的数据
         *      2. 切换面板
         */
        onHideItem: function() {
            var self = this;
            var rTab = self.options.rTab;
            var currentStage = $('#' + self.currentPageId + '-stage');
            //切换之前先保存数据
            var preItem = currentStage.children('.resize-item.item-show');
            if(preItem.length > 0) {
                var preItemType = preItem.attr('data-type');
                if(preItemType === 'text') {
                    self.saveTextItem(preItem);
                } else {
                    self.saveImageItem(preItem);
                }
            } 
            //切换到page面板
            self.saveCurrentPage();
            rTab.switchToPage(self.currentPageId);
        },
        /**
         *  当舞台item焦点切换的时候触发  
         *      1. 保存上一个item的数据  
         *      2. 切换面板
         */
        onItemTrigger: function(el) {
            var self = this;
            var rTab = self.options.rTab;
            var currentStage = $('#' + self.currentPageId + '-stage');

            //切换之前先保存数据
            var preItem = currentStage.children('.resize-item.item-show');
            if(preItem.length > 0) {
                var preItemType = preItem.attr('data-type');
                if(preItemType === 'text') {
                    self.saveTextItem(preItem);
                } else {
                    self.saveImageItem(preItem);
                }
            } 


            //切换
            var itemType = el.attr('data-type');
            if(itemType === 'text') {
                rTab.switchToText(el.attr('id'));
            } else {
                rTab.switchToImg(el.attr('id'));
            }
        },
        onDrag: function(org, options) {
            var type = org.attr('data-type');
            var ew = false;
            var eh = false;
            var ex = false;
            var ey = false;
            if(type === 'text') {
                ew = $('#textWidth');
                eh = $('#textHeight');
                ex = $('#textX');
                ey = $('#textY');
            } else {
                ew = $('#imgWidth');
                eh = $('#imgHeight');
                ex = $('#imgX');
                ey = $('#imgY');
            }
            
            options.width && ew.val(options.width);
            options.height && eh.val(options.height);
            options.left && ex.val(options.left);
            options.top && ey.val(options.top);
        },
        /**
         * 保存图片item
         */
        saveImageItem: function(item) {
            var self = this;
            var animate = $('#imgAnimation').val();
            var animateDuration = $('#imgAniDuration').val();
            var animateTimeOut = $('#imgAniTimeOut').val();
            var imgUrl = item.children('img').attr('src');
            var key = item.attr('id');
            var width = $('#imgWidth').val();
            var height = $('#imgHeight').val();
            var px = $('#imgX').val();
            var py = $('#imgY').val();
            var opacity = $('#imgOpacity').val();


            self.options.rTab.setItemData(key, {
                itemId: key,
                pageId: self.currentPageId,
                type: 'img',
                animate: animate,
                imgUrl: imgUrl,
                animateDuration: animateDuration,
                animateTimeOut: animateTimeOut,
                width: width,
                height: height,
                px: px,
                py: py,
                opacity: opacity
            });
        },
        /**
         *  保存文本item
         */
        saveTextItem: function(item) {
            var self = this;
            var fontSize = $('#textFS').val();
            var color = rgbToHex($('#textColor').val()).hex;
            var opacity = $('#textOpacity').val();
            var animate = $('#textAnimate').val();
            var animateDuration = $('#textAniDuration').val();
            var animateTimeOut = $('#textAniTimeOut').val();

            var key = item.attr('id');
            var width = $('#textWidth').val();
            var height = $('#textHeight').val();
            var px = $('#textX').val();
            var py = $('#textY').val();
            var text = item.children('p').html();

            self.options.rTab.setItemData(key, {
                itemId: key,
                pageId: self.currentPageId,
                type: 'text',
                animate: animate,
                animateDuration: animateDuration,
                animateTimeOut: animateTimeOut,
                fontSize: fontSize,
                color: color,
                opacity: opacity,
                width: width,
                height: height,
                px: px,
                py: py,
                text: text
            });
        },
        /**
         * 创建舞台
         */
        createStage: function(pageId) {
            var self = this;
            // $('.simulator-box').removeClass('active');
            var stage = $('<div class="simulator-box"></div>');
            stage.attr('id', pageId + '-stage');
            $('#mainContent').append(stage);
            //创建拖拽
            // this.pageResize[pageId] = new ZResize({
            //     stage: '#' + pageId + '-stage',
            //     onTriggerItem: function(el) {
            //         self.onItemTrigger(el);
            //     },
            //     onHideItem: function() {
            //         self.onHideItem();
            //     }
            // });
        },
        /**
         *  保存当前page
         */
        saveCurrentPage: function() {
            var self = this;

            var currentStage = $('#' + self.currentPageId + '-stage');
            //保存当前页数据
            var rTab = self.options.rTab;

            var bgImage = currentStage.css('background-image');
            bgImage = bgImage.replace(/url(\d*)\((.*?)\)/g, function(match, type, value) {
                return value;
            });
            bgImage = bgImage.replace(/"/g, '');

            rTab.setPageData(self.currentPageId, {
                pageId: self.currentPageId,
                stageId: self.currentPageId + '-stage',
                bgColor: rgbToHex(currentStage.css('background-color')).hex,
                bgImage: bgImage
            });
        },
        /**
         *  保存当前item
         */
        saveCurrentItem: function() {
            var self = this;
            var currentStage = $('#' + self.currentPageId + '-stage');
            var item = currentStage.children('.resize-item.item-show');
            if(item.length <= 0) {
                return ;
            }

            var type = item.attr('data-type');
            if(type === 'text') {
                self.saveTextItem(item);
            } else {
                self.saveImageItem(item);
            }
        },
        /**
         *  切换页面
         */
        switchPage: function(pageId) {

            var self = this;

            $('.page-wrap').removeClass('page-sel');
            $('#' + pageId).addClass('page-sel');

            //获取当前页和目的页
            var nextStage = $('#' + pageId + '-stage');
            var currentStage = $('#' + self.currentPageId + '-stage');
            var rTab = self.options.rTab;
            
            //保存当前页数据
            self.saveCurrentPage();

            //显示隐藏
            currentStage.removeClass('active');
            nextStage.addClass('active');

            //让所有item 失焦 并保存数据
            currentStage.trigger('click');

            //切换rTab
            rTab.switchToPage(pageId);

            //设置当前pageId
            self.currentPageId = pageId;
        },
        /**
         *  返回页面id、舞台id、以及对应的Zresize对象
         */
        getCurrentPage: function() {
            var self = this;
            return {
                pageId: self.currentPageId,
                stageId: self.currentPageId + '-stage',
                zResize: self.zresize
            }
        },
        /**
         *  监听新增事件
         */
        bindAddEvent: function() {
            var self = this;
            $('#pageContainer').on('click', '.add', function(e) {
                e.stopPropagation();
                self.createPage();
            });
        },
        /**
         *  监听删除事件
         */
        bindRemoveEvent: function() {
            var self = this;
            $('#pageContainer').on('click', '.delete', function(e) {
                e.stopPropagation();
                var pageId = $(this).attr('data-page');
                var current = $('#' + pageId);
                //是不是已经只是唯一的一页了
                var el = (current.next().length > 0 && current.next()) || (current.prev().length > 0 && current.prev());
                if (!el) {
                    console.log('就剩一页了，不能再删了，骚年！！');
                    return;
                }
                if(!confirm('该页面的所有元素也会被删除，确定删除？')){  //不删除，以后优化的时候要做成自定义的弹窗，否则用户禁用浏览器的弹窗之后就不会显示提示了
                    return false;
                }
                //如果删除的是当前选中的页面，那么需要切换一下选中的状态
                if (pageId === self.currentPageId) {
                    self.switchPage(el.attr('id'));
                }

                //删除
                current.remove();
                self.options.rTab.removePageData(pageId);
                var stageId = pageId + '-stage';
                $('#' + stageId).remove();
            });
        },
        /**
         *  监听切换事件
         */
        bindSwitchEvent: function() {
            var self = this;
            $('#pageContainer').on('click', '.page-wrap', function() {
                var pageId = $(this).attr('id');
                self.switchPage(pageId);
            });
        }
    }

    window.PageController = PageController;


})(jQuery);
