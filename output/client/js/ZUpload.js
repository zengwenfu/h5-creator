;
(function($) {
    /**
     * 默认参数
     */
    var defaultOpts = {
        dropArea: '#upload-area', //拖拽区域
        success: false, //成功的回调
        error: false, //错误的回调
        url: '/upload-file', //图片上传地址
        fileHandler: '#fileHandler'
    };

    var ZUpload = function(options) {
        this.options = $.extend({}, defaultOpts, options);
        this.init();
    }

    ZUpload.prototype = {
        init: function() {
            // 全局变量
            this.area = $(this.options.dropArea);

            this.clearDefault();
            this.bindOnDrop();
            this.bindFileInput();
        },
        /**
         *  清楚默认拖拽事件的影响
         */
        clearDefault: function() {
            $(document).on({
                dragleave: function(e) { //拖离 
                    e.preventDefault();
                },
                drop: function(e) { //拖后放 
                    e.preventDefault();
                },
                dragenter: function(e) { //拖进 
                    e.preventDefault();
                },
                dragover: function(e) { //拖来拖去 
                    e.preventDefault();
                }
            });
        },
        bindOnDrop: function() {
            var self = this;
            var areaItem = self.area[0];
            areaItem.addEventListener("drop", function(e) {
                e.preventDefault(); //取消默认浏览器拖拽效果 
                var fileList = e.dataTransfer.files; //获取文件对象 
                //检测是否是拖拽文件到页面的操作 
                if (fileList.length == 0) {
                    return false;
                }
                //检测文件是不是图片 
                if (fileList[0].type.indexOf('image') === -1) {
                    console.log("您拖的不是图片！");
                    return false;
                }

                self.upload(fileList[0]);
            });
        },
        /**
         * 图片上传
         */
        upload: function(file) {
            var self = this;
            var formData = new FormData();
            formData.append('file', file);
            $.ajax({
                url: self.options.url,
                type: 'POST',
                cache: false,
                data: formData,
                processData: false,
                contentType: false
            }).done(function(res) {
                var obj = JSON.parse(res);
                //预览
                self.preview(obj.data.filePath);
                //执行回调
                self.options.success && self.options.success(obj);
            }).fail(function(res) {
                //执行回调
                self.options.error && self.options.error(success);
            });
        },
        bindFileInput: function() {
            var self = this;
            var handler = $(self.options.fileHandler);
            //增加一个隐藏的文件域
            var fileInput = $('<input type="file" class="file-input"></input>');
            fileInput.css({
                display: 'none'
            });
            handler.parent('div').append(fileInput);

            //关联按钮和隐藏文件域
            handler.on('click', function() {
                handler.parent('div').children('.file-input').trigger('click');
            });

            //监听文件域的改变
            fileInput.on('change', function() {
                self.upload($(this)[0].files[0]);
            });
        },
        /**
         *  图片预览
         */
        preview: function(filePath) {
            var self = this;
            var area = this.area;
            //删除之前的预览节点
            area.children('.imageWrap').remove();

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
        clear: function() {
            this.area.children('.imageWrap').remove();
        }
    }

    window.ZUpload = ZUpload;

})(jQuery);
