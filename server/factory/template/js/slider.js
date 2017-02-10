;(function (global) {
    /**
     *  默认参数
     */
    var defaultOpts = {
        currentPage: 1,
        item: false,//item对象，必传
        sliding: false,//是否还未完成滑动动作，否则暂停滑动动作
    }

    function Slider(options) {
        this.options = $.extend({}, defaultOpts, options);
        this.init();
    }

    /**
     *  定义原型
     */
    Slider.prototype = {
        init : function(){
            var self = this;
            self.options.loading.loading(function() {
                //todo 加载完图片资源后的逻辑
                $('.spinner').hide();
                self.goto('page1');
            })
        },
        /**
         *  进入具体的页面
         */
        goto: function(id){
            $('#' + this.options.currentPage).css({
                "-webkit-animation":"null 0.5s linear",
                "animation":"null 0.5s linear"
            });
            $('#'+id).addClass('show').show().siblings().removeClass('show');
            this.options.item.showItem(id);
        },
        /**
         *  下滑  
         */
        pre: function(callback) {
            var self = this;
            //加锁
            if(self.options.sliding) {
                return ;
            }
            self.options.sliding = true;

            var $el = $(".page-box.show");
            var $prev = $el.prev(".page-box")[0] ? $el.prev() : $(".page-box").last();
            $prev.addClass("show").show().css({
                "-webkit-animation":"slideZoom_tInt 0.5s linear",
                "animation":"slideZoom_tInt 0.5s linear"    
            });
            $el.css({
                "-webkit-animation":"slideZoom_tOut 0.5s linear",
                "animation":"slideZoom_tOut 0.5s linear"
            });
            self.options.currentPage = $prev.attr('id');
            setTimeout(function(){
                $el.removeClass("show");
                $el.hide();
                //执行回调
                callback && callback();
                //显示页面项目
                var item = self.options.item;
                item.showItem($prev.attr('id'), function() {
                    item.showPreItem($prev.attr('id'));
                    self.options.sliding = false;
                });
                item.resetItem($el.attr('id'));
            },500);
        },
        /**
         *  上滑
         */
        next: function(callback) {
            var self = this;
            //加锁
            if(self.options.sliding) {
                return ;
            }
            self.options.sliding = true;
            
            var $el = $(".page-box.show");
            var $next = $el.next(".page-box")[0] ? $el.next() : $(".page-box").first();
            $next.addClass("show").show().css({
                "-webkit-animation":"slideZoom_bInt 0.5s linear",
                "animation":"slideZoom_bInt 0.5s linear"    
            });
            $el.css({
                "-webkit-animation":"slideZoom_bOut 0.5s linear",
                "animation":"slideZoom_bOut 0.5s linear"    
            });
            self.options.currentPage = $next.attr('id');
            setTimeout(function(){
                $el.removeClass("show");
                $el.hide();
                //执行回调
                callback && callback();
            
                //显示页面项目
                var item = self.options.item;
                item.showItem($next.attr('id'), function() {
                    item.showPreItem($next.attr('id'));
                    self.options.sliding = false;
                });
                item.resetItem($el.attr('id'));
            },500);
        }
    };

    global.Slider = Slider;

})(this);