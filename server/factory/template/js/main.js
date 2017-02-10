;
(function() {
    //页面项目对象
    var imgList = [
        {% for item in list %}
        'images/{{item}}',
        {% endfor %}
    ];
    var item = new Item();
    var loading = new Loading({
            imgList: imgList
        })
        //页面滑动对象 基于item创建
    var slider = new Slider({
        item: item,
        loading: loading
    });

    //控制滑动
    //不禁止默认事件 他丫的不能滑
    document.addEventListener('touchmove', function(event) {
        event.preventDefault();
    }, false);
    $(document).on('swipeUp', function() {
        slider.next();
    }).on('swipeDown', function() {
        slider.pre();
    });


    window.slider = slider;

})();
