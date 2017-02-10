'use strict';
(function() {
    var obj={};

    function ShowH5() {
        this.init();
    }
    ShowH5.prototype = {
        init: function() {
            var src = this.getSearchValue('src');
            obj.allH5Page = this.getSearchValue('pages');
            obj.setSwitchBtn=this.setSwitchBtn;
            window.frames['h5Content'].src = src;
            obj.setSwitchBtn(1);
            this.initBtn();
        },
        getSearchValue: function(name) {
            var search = window.location.search.substr(1),
                arr = search.split('&'),
                subArr = [];
            for (var i = 0; i < arr.length; i++) {
                subArr = arr[i].split('=');
                if (subArr[0] == name) {
                    return subArr[1];
                }
            }
        },
        setSwitchBtn: function(pageIndex) {
            // if (pageIndex > 1) {
            //     $('.icon-pre').addClass('able');
            // } else {
            //     $('.icon-pre').removeClass('able');
            // }
            // if (pageIndex < obj.allH5Page) {
            //     $('.icon-next').addClass('able');
            // } else {
            //     $('.icon-next').removeClass('able');
            // }
            $('.icon-pre').addClass('able');
            $('.icon-next').addClass('able');
        },
        initBtn: function() {
            $('#showH5Btn').on('click', '.able', function() {
                var _this = $(this),
                    currentSlider = h5ContentName.window.slider,
                    pageIndex = parseInt($('.page-index').html());
                if (_this.hasClass('icon-pre')) {
                    currentSlider.pre();
                    pageIndex--;
                } else if (_this.hasClass('icon-next')) {
                    currentSlider.next();
                    pageIndex++;
                }
                // $('.page-index').html(pageIndex);
                obj.setSwitchBtn(pageIndex);
            })
        }
    }

    new ShowH5();
})();
