// 公用路由器
var express = require('express');
var router = express.Router();
var utils = require('../utils/utils');


// 获取页面路由器
// var list = [];
// var files = utils.getAllFiles(process.rootPath + '/server/views', /^((?!_inc).)*$/);
// for (var key in files) {
//     list.push(files[key].replace(process.rootPath + '/server/views/', ''));
// }


// 控制器路由表
var actionList = [];
files = utils.getAllFiles(process.rootPath + '/server/routers');
for (var key in files) {
    if(files[key].indexOf('index.js') < 0) {
        actionList.push(files[key].replace(process.rootPath + '/server/routers/', ''));
    }
}


module.exports = (app) => {

    // 循环配置页面路由表
    // Array.from(list, (page) => {

    //     var key = '/' + page;

    //     app.use(router.get(key, function(req, res) {
    //         res.render(page, {
    //             slug: key.replace('/', '').replace('.html', '')
    //         });
    //     }));

    //     console.log('http://' + utils.getIp() + ':' + process.port + key);
    //     return page;
    // });

    // console.log('访问上面路径，访问对应页面');


    //循环配置控制器路由表
    Array.from(actionList, (page) => {
        require('./' + page)(app);
        return page;
    });

};




