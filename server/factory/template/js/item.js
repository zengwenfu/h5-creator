/**
 *  item的动画控制
 */
;(function(global){
    /**
     * 默认参数
     */
    var defaultOpts = {

    };

    /**
     *  开始显示item
     */
    var i = 0;
    function startShow(callback) {
        if(i === itemLength){
            callback && callback();
            return ;
        }
        var item = items.eq(i);
        var cls = item.attr('data-cls');//动画
        var ts = item.attr('data-ts');//下一个动画开始间隔时间
        item.addClass(cls);
        i++;
        setTimeout(function() {
            startShow(callback);
        },ts);
    };

    /**
     * 定义类
     */
    function Item(options) {
        this.options = $.extend({}, defaultOpts, options);
        this.init();
    }

    /**
     * 原型 
     */
    Item.prototype = {
        init: function() {

        },
        showPreItem: function(id) {
            $('#'+id+' .pre-item').addClass('show');
        },
        showItem: function(id, callback) {
            var self = this;
            i = 0;
            items =  $('#' + id + " .item");
            itemLength = items.length;
            if(!callback) {
                callback = function() {
                    self.showPreItem(id);
                }
            }
            startShow(callback);
        },
        resetItem: function(id) {
            $("#" + id + " .item").each(function() {
                var cls = $(this).attr('data-cls') || '';
                $(this).removeClass(cls);
            });
            $("#" + id + " .pre-item").removeClass('show');
        }
    }

    global.Item = Item;


})(this);