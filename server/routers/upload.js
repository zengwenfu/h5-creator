var multiparty = require('multiparty');
var parseRes = require('../utils/parseRes.js');

const UPLOAD_ERROR = '000001'; //上传错误

module.exports = function(app) {

    /**
     *  文件上传接口
     * 
     */
    app.post('/upload-file', function(req, res) {


        var form = new multiparty.Form({
            uploadDir: './output/upload',//文件保存路径
            // autoFiles: true,
            // maxFilesSize: 100*1024 //最大限制上传100KB的图片
        });

        form.parse(req, function(err, fields, files) {
            //假如出错了
            if(err) {
                res.send(parseRes.error(UPLOAD_ERROR, err));
            } else {
                var filePath = files.file[0].path;

                filePath = 'upload/' + filePath.split('/')[2];
                var result = {
                    filePath: filePath
                };
                res.send(parseRes.success(result));
            }
        });


    });
};
