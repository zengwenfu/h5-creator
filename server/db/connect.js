var config = require('./config');
var mongoose = require('mongoose');



module.exports = function() {
    // 创建数据库链接
    mongoose.connect(config.db.conn);
    var db = mongoose.connection;

    db.on('error', console.error.bind(console, 'connection error:'));

    // 打开数据库链接
    db.once('open', function() {
        console.log('mongoose open...');
    }); 

    //载入实体
    require('./models/activies');

}