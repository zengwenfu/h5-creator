var env = process.env.NODE_ENV;
env = env == null ? 'prd' : env;

// 数据库配置
var db = {
    dev: {
        'conn': 'mongodb://localhost/dragAnimate'
    },
    prd: {
        'conn': 'mongodb://localhost/dragAnimate'
    }
};

exports.db = db[env];