;
(function() {
    /**
     * author 作者
     * name 标题
     * discript 描述
     * cover 封面
     * id 项目id
     */
    var settingData = window.settingData || {};
    settingData.pointer = settingData.pointer || '15.png'; //默认箭头
    
    /**
     * 类定义
     */
    var Index = function() {
        this.init();
    };

    /**
     *  原型定义
     */
    Index.prototype = {
        init: function() {

            //定义全局变量
            this.pageController = false; //页面控制器
            this.rTab = new RTab(); //右侧面板控制器

            //对话框 因为用到rTab的方法所以放在后面
            this.dueDialog();

            /**
             * 处理page
             */
            this.duePage();
            /**
             *  处理背景图片上传，必须在pageController之后
             */
            this.dueBgUpload();
            /**
             * 处理文本 必须在创建page之后
             */
            this.dueText();
            /**
             * 处理图片 必须在创建page之后
             */
            this.dueImage();

            /**
             * 处理预览
             */
            this.duePreview();
            /**
             * 处理头部按钮事件
             */
            this.dueHeadButton();
            /**
             * 处理头部按钮切换事件
             */
            this.changeTab();
            /**
             * 拾色器处理
             */
            window.update = this.update;
            window.updateTextColor = this.updateTextColor;
        },
        /**
         * 文件上传
         */
        dueBgUpload: function() {
            var self = this;
            /**
             *  文件上传插件
             */
            var zupload = new ZUpload({
                dropArea: '#upload-area', //拖拽区域上传
                fileHandler: '#bgChange', //通过点击按钮上传
                success: function(obj) {
                    //获取当前舞台
                    var currentStageId = self.pageController.getCurrentPage().stageId;
                    $('#' + currentStageId).css({
                        'background-image': 'url(' + obj.data.filePath + ')'
                    });
                },
                error: function(res) {
                    console.log(res);
                }
            });

            /**
             * 删除按钮监听
             */
            $('#bgDelete').on('click', function() {
                zupload.clear();
                //获取当前舞台
                var currentStageId = self.pageController.getCurrentPage().stageId;
                $('#' + currentStageId).css({
                    'background-image': 'none'
                })
            });
        },
        duePage: function() {
            var self = this;
            this.pageController = new PageController({
                rTab: self.rTab
            });
            $('#page1').trigger('click');
        },
        dueText: function() {
            var self = this;
            new Text({
                pageController: self.pageController,
                rTab: self.rTab
            });
        },
        dueImage: function() {
            var self = this;
            new ImageItem({
                pageController: self.pageController,
                rTab: self.rTab
            });
        },
        /**
         *  预览
         */
        duePreview: function() {
            var self = this;
            $('#preview').on('click', function() {
                //保存当前工作page item
                self.pageController.saveCurrentPage();
                self.pageController.saveCurrentItem();

                //生成后台需要的数据结构
                var data = self.rTab.buildData();
                data.pointer = settingData.pointer;

                $.post('/build', {
                    config: JSON.stringify(data)
                }, function(data) {
                    var obj = JSON.parse(data),
                        pages = $('.simulator-box').length,
                        src = 'show-h5.html?src=' + obj.data.viewPath + '&pages=' + pages;
                    window.open(src, 'newwindow');

                });
            });
        },
        /**
         * 拾色器的初始化
         */
        update: function(jscolor) {
            // 'jscolor' instance can be used as a string
            $('.simulator-box.active').css('background-color', '#' + jscolor);
        },
        updateTextColor: function(jscolor) {
            $('.resize-item.item-show').css('color', '#' + jscolor);
        },
        /**
         *  保存
         */
        save: function(callback) {
            var self = this;
            //保存当前工作page item
            self.pageController.saveCurrentPage();
            self.pageController.saveCurrentItem();

            //生成后台需要的数据结构
            var data = self.rTab.buildData();
            data.author = settingData.author;
            data.name = settingData.name;
            data.discript = settingData.discript;
            data.cover = settingData.cover;
            data._id = settingData.id;
            data.pointer = settingData.pointer;

            $.post('/save', {
                config: JSON.stringify(data)
            }, function(data) {
                var obj = JSON.parse(data);
                if (obj.code !== '000000') {
                    alert(obj.msg);
                } else {
                    settingData.id = obj.data.id;
                    if(callback) {
                        callback();
                    } else {
                        alert('保存成功');
                    }
                }
            });
        },
        /**
         *  对话框
         */
        dueDialog: function() {
            var self = this;
            if (!window.isEdit) { //新建则弹出窗口
                $('#pageInfoDialog').show();
            } else { //编辑的时候注入
                $('#author').val(settingData.author);
                $('#projectName').val(settingData.name);
                $('#projectDiscript').val(settingData.discript);
                self.rTab.setPreview($('#uploadCover'), settingData.cover);
            }

            // 封面上传
            new ZUpload({
                dropArea: '#uploadCover', //拖拽区域上传
                success: function(obj) {
                    settingData.cover = obj.data.filePath;
                },
                error: function(res) {
                    console.log(res);
                }
            });

            //点击确定按钮
            $('#sure').bind('click', function() {
                var author = $('#author').val();
                if (!author) {
                    alert('作者必填');
                    return;
                }
                var name = $('#projectName').val();
                if (!name) {
                    alert('标题必填');
                    return;
                }
                var discript = $('#projectDiscript').val();
                console.log(discript);

                if (!settingData.cover) {
                    alert('请上传封面');
                    return;
                }

                settingData.author = author;
                settingData.name = name;
                settingData.discript = discript;

                $('#pageInfoDialog').hide();
            });

            //点击取消按钮
            $('#cancel').bind('click', function() {
                if (!settingData.name || !settingData.author) {
                    location.href = 'home';
                } else {
                    $('#pageInfoDialog').hide();
                }
            });

            $('.icon-handler').each(function(index) {
                $(this).bind('click', function() {
                    if (index === 7) {
                        $('.icon-stage').css({
                            'background': '#dbdbdb'
                        });
                    } else {
                        $('.icon-stage').css({
                            'background': '#e6e6e6'
                        });
                    }
                    $('#pointerImg').attr('src', 'client/images/pointer/' + (index + 1) + '.png');
                    settingData.pointer = (index + 1) + '.png';
                });
            });
        },
        /**
         *  顶部按钮
         */
        dueHeadButton: function() {
            var self = this;
            //保存
            $('#save').bind('click', function() {
                self.save();
            });

            // 设置
            $('#setting').bind('click', function() {
                $('#pageInfoDialog').show();
            });

            //下载
            $('#download').bind('click', function() {
                //若尚未保存，则先保存
                if (!settingData.id) {
                    self.save(function() {
                        self.download();
                    });
                } else {
                    self.download();
                }
            });
        },
        //头部设置按钮点击切换
        changeTab: function() {
            new changeTabs();
        },
        //下载
        download: function() {
            location.href = '/download?id=' + settingData.id;
        }

    };
    //
    /**
     * 创建对象执行init
     */
    new Index();

})();
