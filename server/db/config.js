var env = process.env.NODE_ENV;
env = env == null ? 'prd' : env;

// 数据库配置
var db = {
    dev: {
        'conn': 'mongodb://localhost/dragAnimate'
    },
    prd: {
        'conn': 'mongodb://dweb:feiliuzhixia2017@127.0.0.1:27017/dragAnimate'
    }
};

exports.db = db[env];