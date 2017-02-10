;
(function($) {
    /**
     *  默认参数
     */
    var defaultOpts = {
        rTab: false, //右边面板对象 必传
        pageController: false,
    };

    /**
     *  定义类
     */
    var Text = function(options) {
        this.options = $.extend({}, defaultOpts, options);
        this.init();
    };

    /**
     *  定义原型方法
     */
    Text.prototype = {
        init: function() {

            this.index = 0;

            this.bindAddEvent();

            this.bindDeleteEvent();

            this.bindColorEvent();

            this.bindSizeEvent();

            this.bindAnimateEvent();
        },
        /**
         * 增加文本
         */
        addText: function() {

            var self = this;
            var pageController = self.options.pageController;
            if(!pageController) {
                console.log('骚年，没传页面控制器我怎么给你增加文本啊');
            }
            var pageObj = pageController.getCurrentPage();
            var currentStage = $('#' + pageObj.stageId);

            //创建文本
            self.index++;
            var itemId = pageObj.stageId + '-text-item' + self.index; 
            var text = $('<div id="' + itemId + '" class="create-text-box" title="编辑文本"  data-type="text" ><p contentEditable="true" class="ol-n">输入文本</p></div>');
            currentStage.append(text);
            pageObj.zResize.addResizeCapa(text);
            pageObj.zResize.triggerResize(text);
            text.children('p').focus();

        },
        /**
         *  监听增加文本事件
         */
        bindAddEvent: function() {
            var self = this;
            $('#addText').on('click', function() {
                self.addText();
            });
        },
        /**
         *  删除事件监听
         */
        bindDeleteEvent: function() {
            var self = this;
            $('#textDelete').bind('click', function() {
                var pageObj = self.options.pageController.getCurrentPage();
                var currentStage = $('#' + pageObj.stageId);
                var item = currentStage.children('.resize-item.item-show');
                var itemId = item.attr('id');
                item.remove();
                self.options.rTab.switchToPage(pageObj.pageId);
                self.options.rTab.removeItemData(itemId);
            });
        },
        /**
         *  监听颜色事件
         */
        bindColorEvent: function() {
           
        },
        /**
         *  获取当前item
         */
        getCurentItem: function() {
            var self = this;
            var pageObj = self.options.pageController.getCurrentPage();
            var currentStage = $('#' + pageObj.stageId);
            var item = currentStage.children('.resize-item.item-show');
            return item;
        },
        /**
         *  监听尺寸事件  
         */
        bindSizeEvent: function() {
            var self = this;
            $('#textFS').on('input',function(e){
                var item = self.getCurentItem(),
                    value=parseFloat(e.target.value);    //若用户只输入纯数字，也能正确级联
                if(value && value>0){
                    item.find('p[contenteditable="true"]').css('font-size',value+'px');
                }
            });

            $('#textWidth').on('keydown', function(event) {
                var item = self.getCurentItem();
                if(event.keyCode === 13) {
                    item.css({
                        width: $(this).val()
                    }).children('.resize-panel').css({
                        width: $(this).val()
                    });
                }
            });

            $('#textHeight').on('keydown', function(event) {
                var item = self.getCurentItem();
                if(event.keyCode === 13) {
                    item.css({
                        height: $(this).val(),
                        'line-height': $(this).val() + 'px',
                    }).children('.resize-panel').css({
                        height: $(this).val()
                    });
                }
            });

            $('#textX').on('keydown', function(event) {
                var item = self.getCurentItem();
                if(event.keyCode === 13) {
                    item.css({
                        left: $(this).val() + 'px'
                    });
                }
            });

            $('#textY').on('keydown', function(event) {
                var item = self.getCurentItem();
                if(event.keyCode === 13) {
                    item.css({
                        top: $(this).val() + 'px'
                    });
                }
            });

            $('#textOpacity').on('keydown', function(event) {
                var item = self.getCurentItem();
                if(event.keyCode === 13) {
                    item.css({
                        opacity: parseInt($(this).val())/100
                    });
                }
            });
        },
        /**
         *  监听动画
         */
        bindAnimateEvent: function() {
             var self = this;
             $('#textAnimate').on('change', function() {
                    var animate = $(this).val();
                    var animateDuration = $('#textAniDuration').val();
                    var animateTimeOut = $('#textAniTimeOut').val();
                    self.getCurentItem().css({
                        '-webkit-animation': animate + ' ' + animateDuration + 's linear',
                        "animation":animate + ' ' + animateDuration + 's linear'
                    });
             });

             $('#textAniDuration').on('keydown', function(event) {
                var item = self.getCurentItem();
                if(event.keyCode === 13) {
                    var animate = $('#textAnimate').val();
                    var animateDuration = $(this).val();
                    item.css({
                        '-webkit-animation': 'none',
                        'animation': 'none'
                    });
                    setTimeout(function() {
                        item.css({
                            '-webkit-animation': animate + ' ' + animateDuration + 's linear',
                            "animation":animate + ' ' + animateDuration + 's linear'
                        });
                    }, animateDuration);
                }
             });
        },
        
    }

    window.Text = Text;

})(jQuery);