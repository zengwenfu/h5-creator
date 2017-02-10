;
(function(global) {
    /**
     * 默认参数
     */
    var defaultOpts = {
        imgList: false //必传,所有图片列表
    };

    /**
     *  进度条
     */
    function dopercent(less, total) {
        var loaded = total - less;
        var percent = Math.round(loaded * 100 / total) + '%';
        //todo 更新进度,暂时不采用进度条的方式
        $('.loading .logo-top').css({
            width: percent
        });

    }

    /**
     *  
     * 
     */
    function Loading(options) {
        this.options = $.extend({}, defaultOpts, options);
    }

    Loading.prototype = {
        //图片加载完成后，调起callback
        loading: function(callback) {
            var self = this;
            var iulength = self.options.imgList.length;
            if(iulength === 0) {
                callback && callback();
                return ;
            }
            for (var i = 0; i < self.options.imgList.length; i++) {
                var cimage = new Image();
                cimage.src = new String(self.options.imgList[i]);

                if (cimage.complete) { //若图片已经加载
                    iulength--;
                    if (iulength <= 0) {
                        console.log('loaded');
                        //延时半秒让100%的时候能显示
                        dopercent && setTimeout(function() {
                            clearInterval();
                            callback && callback();
                        }, 500);
                        !dopercent && callback && callback();
                    }
                    dopercent && dopercent(iulength, self.options.imgList.length);
                    continue;
                }

                cimage.onload = function() {
                    iulength--;
                    if (iulength <= 0) {
                        console.log('loaded');
                        //延时半秒让100%的时候能显示
                        dopercent && setTimeout(function() {
                            clearInterval();
                            callback && callback();
                        }, 500);
                        !dopercent && callback && callback();
                    }
                    dopercent && dopercent(iulength, self.options.imgList.length);
                }

                cimage.onerror = function() {
                    var msg = 'load:' + cimage.src + 'error';
                    console.log(msg);
                    iulength--;
                    if (iulength <= 0) {
                        console.log('loaded');
                        //延时半秒让100%的时候能显示
                        dopercent && setTimeout(function() {
                            clearInterval();
                            $(".loading").addClass('hide');
                            callback && callback();
                        }, 500);
                        !dopercent && callback && callback();
                    }
                    dopercent && dopercent(iulength, self.options.imgList.length);
                }
            }
        }
    }
    
    global.Loading = Loading;
})(this);
