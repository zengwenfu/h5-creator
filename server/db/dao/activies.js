var mongoose = require('mongoose');
var ActModel = mongoose.model('Activies');



module.exports = {
    /**
     *  保存
     */
    saveOrUpdate: function(data, callback) {
        
        if(!data._id) { //保存
            data.order = 1;
            var entity = new ActModel(data);
            entity.save(function(err) {

                if (err != null) {
                    callback({
                        code: 1,
                        msg: err
                    });
                    console.log(err);
                }
                
                // 根据拿到的id，viewpath更新入库
                var viewpath = 'projects/' + entity._id + '/view.html';
                data.viewpath = viewpath;
                ActModel.update({ _id: entity._id}, data, function(err, num) {
                    callback && callback({
                        code: 0,
                        id: entity._id
                    });
                });

            });
        } else {
            var id = data._id;
            delete data._id;
            data.viewpath = 'projects/' + id + '/view.html';
            ActModel.update({ _id: id }, data, function(err, num) {
                if (err != null) {
                    console.log(err);
                    callback({
                        code: 1,
                        msg: err
                    });
                }
                callback({
                    code: 0,
                    id: id
                });
            });
        }

    },
    /**
     *  根据id查询
     */
    findById: function(id, callback) {
        ActModel.findOne({ _id: id }).exec(function(err, model) {
            callback(model);
        });
    },
    /**
     *  查询列表
     */
    findList: function(callback) {
        var query = ActModel.find().sort({ order:'desc', _id: 'desc' }).select({
            _id: 1,
            name: 1,
            author: 1,
            discript: 1,
            cover: 1,
            viewpath: 1
        });
        query.exec(function(err, data) {
            callback(data);
        });
    },

    /**
     *  delete by id
     */
    deleteById: function(id, callback) {

        if(id != null && id != '') {
            ActModel.remove({ _id: id }, function(err) {
                if (err != null) {
                    callback({
                        code: '111111',
                        msg: err
                    });
                    console.log(err);
                } else {
                    callback({
                        code: '000000'
                    });
                }
            });
        } else {
            callback({
                code: '111111',
                msg: 'id不能为空'
            });
        }
    }
}
