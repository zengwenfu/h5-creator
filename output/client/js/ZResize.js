;
(function($) {

    /**
     * 默认参数
     */
    var defaultOpts = {
        stage: document, //舞台
        itemClass: 'resize-item', //可缩放的类名
        onTriggerItem: false,
        onHideItem: false,
        onDrag: false
    };

    /**
     * 定义类
     */
    var ZResize = function(options) {
        this.options = $.extend({}, defaultOpts, options);
        this.init();
    }

    ZResize.prototype = {
        init: function() {
            this.initResizeBox();
        },
        /**
         *  初始化拖拽item
         */
        initResizeBox: function() {
            var self = this;
            $('.' + self.options.itemClass).each(function() {
                //创建面板
                self.createResizePanel($(this));
            });
            self.bindHidePanel();
        },
        /**
         *  默认的方式创建拖拽项目
         */
        addResizeItem: function() {
            var self = this;
            var stage = $(self.options.stage);
            var item = $('<div class="' + self.options.itemClass + '"></div>');
            stage.append(item);
            self.createResizePanel(item);
        },
        /**
         *  增加拖拽的能力
         */
        addResizeCapa: function(item) {
            item.addClass(this.options.itemClass);
            this.createResizePanel(item);
        },
        /**
         *  创建面板
         */
        createResizePanel: function(item) {
            var self = this;
            //创建面板
            var width = item.outerWidth();
            var height = item.outerHeight();
            var resizePanel = $('<div class="resize-panel"></div>');
            resizePanel.css({
                width: width,
                height: height,
                top: 0,
                left: 0,
                position: 'absolute',
                'background-color': 'rgba(0,0,0,0.1)',
                cursor: 'move',
                display: 'none'
            });
            self.appendHandler(resizePanel, item);
            /**
             * 创建控制点
             */
            var n = $('<div class="n"></div>'); //北
            var s = $('<div class="s"></div>'); //南
            var w = $('<div class="w"></div>'); //西
            var e = $('<div class="e"></div>'); //东
            var ne = $('<div class="ne"></div>'); //东北
            var nw = $('<div class="nw"></div>'); //西北
            var se = $('<div class="se"></div>'); //东南
            var sw = $('<div class="sw"></div>'); //西南

            //添加公共样式
            self.addHandlerCss([n, s, w, e, ne, nw, se, sw]);
            //添加各自样式
            n.css({
                'top': '-4px',
                'margin-left': '-4px',
                'left': '50%',
                'cursor': 'n-resize'
            });
            s.css({
                'bottom': '-4px',
                'margin-left': '-4px',
                'left': '50%',
                'cursor': 's-resize'
            });
            e.css({
                'top': '50%',
                'margin-top': '-4px',
                'right': '-4px',
                'cursor': 'e-resize'
            });
            w.css({
                'top': '50%',
                'margin-top': '-4px',
                'left': '-4px',
                'cursor': 'w-resize'
            });
            ne.css({
                'top': '-4px',
                'right': '-4px',
                'cursor': 'ne-resize'
            });
            nw.css({
                top: '-4px',
                'left': '-4px',
                'cursor': 'nw-resize'
            });
            se.css({
                'bottom': '-4px',
                'right': '-4px',
                'cursor': 'se-resize'
            });
            sw.css({
                'bottom': '-4px',
                'left': '-4px',
                'cursor': 'sw-resize'
            });

            // 添加项目
            self.appendHandler([n, s, w, e, ne, nw, se, sw], resizePanel);

            //绑定拖拽缩放事件
            self.bindResizeEvent(resizePanel, item);

            //绑定触发事件
            self.bindTrigger(item);
        },
        //控制点公共样式
        addHandlerCss: function(els) {
            for (var i = 0; i < els.length; i++) {
                el = els[i];
                el.css({
                    position: 'absolute',
                    width: '8px',
                    height: '8px',
                    background: '#ff6600',
                    margin: '0'
                });
            }
        },
        /**
         *  插入容器
         */
        appendHandler: function(handlers, target) {
            for (var i = 0; i < handlers.length; i++) {
                el = handlers[i];
                target.append(el);
            }
        },
        /**
         *  显示拖拽面板
         */
        triggerResize: function(el) {

            var self = this;

            // 当拖拽焦点发生切换的时候触发
            self.options.onTriggerItem && self.options.onTriggerItem(el);

            el.siblings('.' + self.options.itemClass).removeClass('item-show').children('div').css({
                display: 'none'
            });
            el.addClass('item-show').children('div').css({
                display: 'block'
            });
        },
        /**
         * 拖拽事件控制 包含8个缩放点  和一个拖拽位置
         */
        bindResizeEvent: function(el) {

            var self = this;
            var ox = 0; //原始事件x位置
            var oy = 0; //原始事件y位置
            var ow = 0; //原始宽度
            var oh = 0; //原始高度

            var oleft = 0; //原始元素位置
            var otop = 0;
            var org = el.parent('div');

            //东
            var emove = false;
            el.on('mousedown', '.e', function(e) {
                ox = e.pageX; //原始x位置
                ow = el.width();
                emove = true;
            });

            //南
            var smove = false;
            el.on('mousedown', '.s', function(e) {
                oy = e.pageY; //原始x位置
                oh = el.height();
                smove = true;
            });

            //西
            var wmove = false;
            el.on('mousedown', '.w', function(e) {
                ox = e.pageX; //原始x位置
                ow = el.width();
                wmove = true;
                oleft = parseInt(org.css('left').replace('px', ''));
            });

            //北
            var nmove = false;
            el.on('mousedown', '.n', function(e) {
                oy = e.pageY; //原始x位置
                oh = el.height();
                nmove = true;
                otop = parseInt(org.css('top').replace('px', ''));
            });

            //东北
            var nemove = false;
            el.on('mousedown', '.ne', function(e) {
                ox = e.pageX; //原始x位置
                oy = e.pageY;
                ow = el.width();
                oh = el.height();
                nemove = true;
                otop = parseInt(org.css('top').replace('px', ''));
            });

            //西北
            var nwmove = false;
            el.on('mousedown', '.nw', function(e) {
                ox = e.pageX; //原始x位置
                oy = e.pageY;
                ow = el.width();
                oh = el.height();
                otop = parseInt(org.css('top').replace('px', ''));
                oleft = parseInt(org.css('left').replace('px', ''));
                nwmove = true;
            });

            //东南
            var semove = false;
            el.on('mousedown', '.se', function(e) {
                ox = e.pageX; //原始x位置
                oy = e.pageY;
                ow = el.width();
                oh = el.height();
                semove = true;
            });

            //西南
            var swmove = false;
            el.on('mousedown', '.sw', function(e) {
                ox = e.pageX; //原始x位置
                oy = e.pageY;
                ow = el.width();
                oh = el.height();
                swmove = true;
                oleft = parseInt(org.css('left').replace('px', ''));
            });

            //拖拽
            var drag = false;
            el.on('mousedown', function(e) {
                ox = e.pageX; //原始x位置
                oy = e.pageY;
                otop = parseInt(org.css('top').replace('px', ''));
                oleft = parseInt(org.css('left').replace('px', ''));
                drag = true;
            });

            $(self.options.stage).on('mousemove', function(e) {
                if (emove) {
                    var x = (e.pageX - ox);
                    el.css({
                        width: ow + x
                    });
                    org.css({
                        width: ow + x
                    });
                    self.options.onDrag && self.options.onDrag(org, {
                        width: ow + x
                    });
                } else if (smove) {
                    var y = (e.pageY - oy);
                    el.css({
                        height: oh + y
                    });
                    org.css({
                        height: oh + y,
                        'line-height': oh + y + 'px'
                    });
                    self.options.onDrag && self.options.onDrag(org, {
                        height: oh + y
                    });
                } else if (wmove) {
                    var x = (e.pageX - ox);
                    el.css({
                        width: ow - x,
                        // left: oleft + x
                    });
                    org.css({
                        width: ow - x,
                        left: oleft + x
                    });
                    self.options.onDrag && self.options.onDrag(org, {
                        width: ow - x,
                        left: oleft + x
                    });
                } else if (nmove) {
                    var y = (e.pageY - oy);
                    //控制面板
                    el.css({
                        height: oh - y
                    });
                    //拖拽项
                    org.css({
                        height: oh - y,
                        top: otop + y,
                        'line-height': oh-y + 'px'
                    });
                    self.options.onDrag && self.options.onDrag(org, {
                        height: oh-y,
                        top: otop + y
                    });
                } else if (nemove) {
                    var x = e.pageX - ox;
                    var y = e.pageY - oy;
                    el.css({
                        height: oh - y,
                        // top: otop + y,
                        width: ow + x
                    });
                    org.css({
                        height: oh - y,
                        'line-height': oh-y + 'px',
                        top: otop + y,
                        width: ow + x
                    });
                    self.options.onDrag && self.options.onDrag(org, {
                        height: oh-y,
                        top: otop + y,
                        width: ow + x
                    });
                } else if (nwmove) {
                    var x = e.pageX - ox;
                    var y = e.pageY - oy;
                    el.css({
                        height: oh - y,
                        // top: otop + y,
                        width: ow - x,
                        // left: oleft + x
                    });
                    org.css({
                        height: oh - y,
                        'line-height': oh-y + 'px',
                        top: otop + y,
                        width: ow - x,
                        left: oleft + x
                    });
                    self.options.onDrag && self.options.onDrag(org, {
                        height: oh-y,
                        top: otop + y,
                        width: ow - x,
                        left: oleft + x
                    });
                } else if (semove) {
                    var x = e.pageX - ox;
                    var y = e.pageY - oy;
                    el.css({
                        width: ow + x,
                        height: oh + y
                    });
                    org.css({
                        width: ow + x,
                        height: oh + y,
                        'line-height': oh + y + 'px'
                    });
                    self.options.onDrag && self.options.onDrag(org, {
                        width: ow + x,
                        height: oh + y
                    });
                } else if (swmove) {
                    var x = e.pageX - ox;
                    var y = e.pageY - oy;
                    el.css({
                        width: ow - x,
                        // left: oleft + x,
                        height: oh + y
                    });
                    org.css({
                        width: ow - x,
                        left: oleft + x,
                        height: oh + y,
                        'line-height': oh + y + 'px'
                    });
                    self.options.onDrag && self.options.onDrag(org, {
                        width: ow - x,
                        left: oleft + x,
                        height: oh + y
                    });
                } else if (drag) {
                    var x = e.pageX - ox;
                    var y = e.pageY - oy;
                    //拖拽项目 拖拽项的位置变化了 控制面板也会变化
                    org.css({
                        left: oleft + x,
                        top: otop + y
                    });

                    self.options.onDrag && self.options.onDrag(org, {
                        left: oleft + x,
                        top: otop + y
                    });
                }
            }).on('mouseup', function(e) {
                emove = false;
                smove = false;
                wmove = false;
                nmove = false;
                nemove = false;
                nwmove = false;
                swmove = false;
                semove = false;
                drag = false;
            });
        },
        /**
         *  点击item显示拖拽面板
         */
        bindTrigger: function(el) {
            var self = this;
            el.on('click', function(e) {
                e.stopPropagation();
                self.triggerResize(el);
            });
        },
        /**
         *  点击舞台空闲区域 隐藏缩放面板
         */
        bindHidePanel: function() {
            var stage = this.options.stage;
            var itemClass = this.options.itemClass;

            var self = this;
            

            $(stage).on('click', function() {
                // 点击舞台空白区域的时候触发
                self.options.onHideItem && self.options.onHideItem();
                $('.' + itemClass).removeClass('item-show').children('div').css({
                    display: 'none'
                });
            });
        }
    }

    window.ZResize = ZResize;

})(jQuery);
