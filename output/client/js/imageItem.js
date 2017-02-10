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
    var ImageItem = function(options) {
        this.options = $.extend({}, defaultOpts, options);
        this.init();
    };

    /**
     * 定义原型方法
     */
    ImageItem.prototype = {
        init: function() {

            this.index = 0;

            this.bindAddEvent();

            this.dueImageUpload();

            this.bindDeleteEvent();

            this.bindAnimateEvent();

            this.bindSizeEvent();

        },
        addImageItem: function() {

            var self = this;
            var pageController = self.options.pageController;
            if(!pageController) {
                console.log('骚年，没传页面控制器我怎么给你增加图片域啊');
            }

            // 获得当前舞台
            var pageObj = pageController.getCurrentPage();
            var currentStage = $('#' + pageObj.stageId);

            // 创建新项目
            self.index++;
            var itemId = pageObj.stageId + '-img-item' + self.index + '_'; //增加下划线是避免跟服务器创建的冲突
            var html = '<div class="create-img-box" id="'+ itemId +'">' +
                '<img src="client/images/default.png" />' +
                '</div>';
            var item = $(html);
            currentStage.append(item);
            pageObj.zResize.addResizeCapa(item);
            pageObj.zResize.triggerResize(item);
        },
        /**
         *  监听增加文本事件
         */
        bindAddEvent: function() {
            var self = this;
            $('#addImage').on('click', function() {
                self.addImageItem();
            });
        }, 
        dueImageUpload: function() {
            var self = this;
            /**
             *  文件上传插件
             */
            var zupload= new ZUpload({
                dropArea: '#image-upload-area', //拖拽区域上传
                fileHandler: '#imgChange', //通过点击按钮上传
                success: function(obj) {
                    //获取当前item
                    var currentStage = $('#' + self.options.pageController.getCurrentPage().stageId);
                    var item = currentStage.children('.resize-item.item-show');
                    item.children('img').attr('src', obj.data.filePath);
                    
                },
                error: function(res) {
                    console.log(res);
                }
            });

            /**
             * 删除按钮监听
             */
            $('#imgDelete').on('click', function() {
                zupload.clear();
                //获取当前舞台
                var currentStage = $('#' + self.options.pageController.getCurrentPage().stageId);
                var item = currentStage.children('.resize-item.item-show');
                item.children('img').removeAttr('src');
            });
        },
        /**
         *  删除事件监听
         */
        bindDeleteEvent: function() {
            var self = this;
            $('#imageItemDelete').bind('click', function() {
                var pageObj = self.options.pageController.getCurrentPage();
                var currentStage = $('#' + pageObj.stageId);
                var item = currentStage.children('.resize-item.item-show');
                item.remove();
                self.options.rTab.switchToPage(pageObj.pageId);
                self.options.rTab.removeItemData(item.attr('id'));

            });
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
         *  监听动画
         */
        bindAnimateEvent: function() {
             var self = this;
             $('#imgAnimation').on('change', function() {
                    var animate = $(this).val();
                    var animateDuration = $('#imgAniDuration').val();
                    var animateTimeOut = $('#imgAniTimeOut').val();
                    self.getCurentItem().css({
                        '-webkit-animation': animate + ' ' + animateDuration + 's linear',
                        "animation":animate + ' ' + animateDuration + 's linear'
                    });
             });

             $('#imgAniDuration').on('keydown', function(event) {
                var item = self.getCurentItem();
                if(event.keyCode === 13) {
                    var animate = $('#imgAnimation').val();
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
        /**
         * 监听位置移动 尺寸变化
         */
        bindSizeEvent: function() {
            var self = this;
            $('#imgWidth').on('keydown', function(event) {
                var item = self.getCurentItem();
                if(event.keyCode === 13) {
                    item.css({
                        width: $(this).val()
                    }).children('.resize-panel').css({
                        width: $(this).val()
                    });
                }
            });

            $('#imgHeight').on('keydown', function(event) {
                var item = self.getCurentItem();
                if(event.keyCode === 13) {
                    item.css({
                        height: $(this).val()
                    }).children('.resize-panel').css({
                        height: $(this).val()
                    });
                }
            });

            $('#imgX').on('keydown', function(event) {
                var item = self.getCurentItem();
                if(event.keyCode === 13) {
                    item.css({
                        left: $(this).val() + 'px'
                    });
                }
            });

            $('#imgY').on('keydown', function(event) {
                var item = self.getCurentItem();
                if(event.keyCode === 13) {
                    item.css({
                        top: $(this).val() + 'px'
                    });
                }
            });

            $('#imgOpacity').on('keydown', function(event) {
                var item = self.getCurentItem();
                if(event.keyCode === 13) {
                    item.css({
                        opacity: parseInt($(this).val())/100
                    });
                }
            });
        }
    }

    window.ImageItem = ImageItem;

})(jQuery);
