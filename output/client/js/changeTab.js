
(function() {

    var defaultOpts = {};

    var ChangeTabs = function(options) {
        this.options = $.extend({}, defaultOpts, options);
        this.init();
    };
    ChangeTabs.prototype={
        init:function(){
            this.changeTab();
        },
        changeTab: function(){
            $('.tab1').css({'color':'rgb(85,119,221)'});
            $('.form-content1').show();
            $(".bootstrap-frm h1").bind('click',function() {
                $(this).css({'color':'rgb(85,119,221)'}).siblings().css({'color':''});
                $(".form-content").eq($(this).index()).show().siblings('.form-content').hide();
            })
        }
    }
    window.changeTabs=ChangeTabs;
})();
