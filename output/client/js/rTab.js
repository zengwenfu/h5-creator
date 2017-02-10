;
(function() {

    /**
     *  页面数据
     *  key: pageId
     *  data: {
     *      pageId
     *      stageId
     *      bgColor
     *      bgImage
     *  }
     */
    pageData = window.pageData || {};

    /**
     *  页面item数据
     *  {
     *      itemId,
     *      pageId,
     *      type: text/img
     *      animate:
     *      fontSize:
     *      color: 
     *      opacity
     *      imgUrl
     *      width:
     *      height:
     *      px:
     *      py:
     *  }
     *  
     */
    pageItemData = window.pageItemData || {};

    /**
     * 默认参数
     */
    var defaultOpts = {};

    /**
     *  定义类
     */
    var RTab = function(options) {
        this.options = $.extend({}, defaultOpts, options);
        this.init();
    };

    /**
     *  原型方法
     */
    RTab.prototype = {
        init: function() {
            /**
             * 处理背景中page入场动画和出场动画的切换
             */
            this.duePageAnimatePanelTab();
            /**
             * 文本面板的切换
             */
            this.dueTextPanelTab();
            /**
             * 图片面板的切换
             */
            this.dueImagePanelTab();
        },
        /**
         *  获取页面数据
         */
        getPageData: function(pageId) {
            return pageData.pageId;
        },
        /**
         *  保存页面数据
         */
        setPageData: function(pageId, data) {
            pageData[pageId] = data;
        },
        /**
         *  删除页面数据
         */
        removePageData: function(pageId) {
            delete pageData[pageId];
        },
        /**
         *  获取item数据
         */
        getItemData: function(itemId) {
            return pageItemData[itemId];
        },
        /**
         *  设置item数据
         */
        setItemData: function(itemId, data) {
            pageItemData[itemId] = data;
        },
        /**
         * 删除item数据
         */
        removeItemData: function(itemId) {
            delete pageItemData[itemId];
        },
        /**
         *  切换到页面面板
         */
        switchToPage: function(pageId) {
            //获得数据
            var data = pageData[pageId] || {};
            data.bgColor = data.bgColor || '#FFFFFF';
            data.bgImage = data.bgImage || 'none';

            //设置背景色
            $('#bgColor').val(data.bgColor);
            $('#showBgColor').css('background-color',data.bgColor);

            //设置预览图片
            var filePath = data.bgImage;

            //背景图片不是空
            if(data.bgImage.indexOf('none') < 0) {
                this.setPreview($('#upload-area'), filePath);
            }

            //设置舞台背景

            //显示panel
            $('.attr-wrap').removeClass('active');
            $('#bgAttr').addClass('active');

        },
        /**
         *  切换到文本编辑面板
         */
        switchToText: function(itemId) {

            // 显示panel
            $('.attr-wrap').removeClass('active');
            $('#textAttr').addClass('active');

            //获取数据
            var data = pageItemData[itemId];
            if(!data) {//默认值
                data = {
                    fontSize: '12px',
                    color: '000000',
                    opacity: '100',
                    animate: 'selectAnimation',
                    animateDuration: '0.5',
                    animateTimeOut: '1000',
                    width: 200,
                    height: 30,
                    px: 60,
                    py: 269
                };
            }

            //填充数据
            $('#textFS').val(data.fontSize);
            $('#textColor').val(data.color);
            $('#showTextColor').css('background-color','#'+data.color);
            $('#textOpacity').val(data.opacity);
            $('#textAnimate').val(data.animate);
            $('#textAniDuration').val(data.animateDuration);
            $('#textAniTimeOut').val(data.animateTimeOut);
            $('#textWidth').val(data.width);
            $('#textHeight').val(data.height);
            $('#textX').val(data.px);
            $('#textY').val(data.py);
        },
        /**
         *  切换到图片编辑面板
         */
        switchToImg: function(itemId) {

            // 显示panel
            $('.attr-wrap').removeClass('active');
            $('#imgAttr').addClass('active');

            //获取数据
            var data = pageItemData[itemId];
            if(!data) {//默认值
                data = {
                    imgUrl: 'client/images/default.png',
                    animate: 'selectAnimation',
                    animateDuration: '0.5',
                    animateTimeOut: '1000',
                    width: 100,
                    height: 100,
                    px: 110,
                    py: 234,
                    opacity: 100
                };
            }

            //设置动画
            $('#imgAnimation').val(data.animate);
            $('#imgAniDuration').val(data.animateDuration);
            $('#imgAniTimeOut').val(data.animateTimeOut);
            $('#imgWidth').val(data.width);
            $('#imgHeight').val(data.height);
            $('#imgX').val(data.px);
            $('#imgY').val(data.py);
            $('#imgOpacity').val(data.opacity);

            //设置预览
            this.setPreview($('#image-upload-area'), data.imgUrl);
        },
        /**
         *  设置图片插件预览
         */
        setPreview: function(area, filePath) {

            //删除之前的预览节点
            area.children('.imageWrap').remove();

            if (!filePath || filePath === 'none') {
                return;
            }


            //生成图片
            var image = new Image();
            image.src = filePath;
            image.height = area.height() - 2;
            //生成容器
            var imageWrap = $('<div class="imageWrap"> </div>');
            imageWrap.css({
                'position': 'absolute',
                'text-align': 'center',
                'top': '0',
                'left': '0',
                'width': '100%',
                'height': '100%',
                'z-index': '99'
            });
            //加入
            imageWrap.append(image);
            area.append(imageWrap);
        },
        /**
         *  处理背景中page入场动画和出场动画的切换
         */
        duePageAnimatePanelTab: function() {
            $('.page-animate h1').on('click',function(){
                var id=$(this).data('id');
                $(this).addClass('sel').siblings('h1').removeClass('sel');
                $('#'+id).removeClass('hidden').siblings().addClass('hidden');
            })
        },
        /**
         *  处理文本面板的切换
         */
        dueTextPanelTab: function() {
            var tabs = $('.text-tab');
            var handlers = $('#tabHandler h1');
            handlers.each(function(index) {
                $(this).on('click', function() {
                    tabs.addClass('hidden');
                    tabs.eq(index).removeClass('hidden');
                    handlers.removeClass('sel');
                    $(this).addClass('sel');
                });
            });
        },
        /**
         *  处理图片面板的切换
         */
        dueImagePanelTab: function() {
            var tabs = $('.image-tab');
            var handlers = $('#imageTabHandler h1');
            handlers.each(function(index) {
                $(this).on('click', function() {
                    tabs.addClass('hidden');
                    tabs.eq(index).removeClass('hidden');
                    handlers.removeClass('sel');
                    $(this).addClass('sel');
                });
            });
        },
        cleanText: function(str) {
            str = str.replace(/<\/?[^>]*>/g,''); //去除HTML tag
            str = str.replace(/[ | ]*\n/g,'\n'); //去除行尾空白
            str = str.replace(/\n[\s| | ]*\r/g,'\n'); //去除多余空行
            str=str.replace(/ /ig,'');//去掉 
            str=str.replace(/^[\s　]+|[\s　]+$/g, "");//去掉全角半角空格
            str=str.replace(/[\r\n]/g,"");//去掉回车换行
            return str;
        },
        /**
         * 获取page的items数据
         */
        sortPageItems: function() {
            var self = this;
            var result = {};
            for(var key in pageItemData) {
                var item = pageItemData[key];
                var pageId = item.pageId;
                if(!result[pageId]) {
                    result[pageId] = [];
                }

                var animateClass = item.animate;
                if(!animateClass || animateClass  === 'selectAnimation') {
                    animateClass = 'none';
                }

                var newItem = {
                    px: item.px, //位置x 必选
                    py: item.py, //位置y 必选
                    width: item.width, //宽度 必选
                    height: item.height, //高度 必选
                    transparent: item.opacity,//透明度  可选
                    animateClass: animateClass,//动画 可选
                    animateDuration: parseInt(item.animateDuration)*1000, //动画持续时间，默认2000
                    nextAnimateTime: item.animateTimeOut, //下一个item动画开始的时间间隔
                    zIndex: 99, //可选
                    textStyle: { //文本样式 可选
                        'color': '#' + item.color,
                        'font-size': item.fontSize,
                        'line-height': 'rem(' + item.height + ')' 
                    }
                }


                if(item.text) {
                    newItem.text = self.cleanText(item.text);
                }


                if(item.imgUrl) {
                    var temUrl;
                    if(item.imgUrl.indexOf('/') < 0 || item.imgUrl.indexOf('default') >= 0) {
                        temUrl = 'default.png';
                    } else {
                        var spb = item.imgUrl.split('/');
                        temUrl = spb[spb.length -1];
                    }
                    newItem.imgUrl = 'images/' + temUrl;
                }


                result[pageId].push(newItem);
            }
            return result;
        },
        /**
         *  生成后台需要的数据结构
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
    };

    window.RTab = RTab;

})(jQuery);
