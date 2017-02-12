var express = require('express');
var path = require('path');
var nunjucks = require('nunjucks');
var bodyParser = require('body-parser');
var http = require('http');
var session = require('express-session');
var connect = require('./server/db/connect');

var env = process.env.NODE_ENV;
env = env == null ? 'prd' : env;


//连接数据库
connect();

var port = 80;
process.rootPath = __dirname;
process.port = port;

var host = {
    dev: 'http://localhost:3000',
    prd: 'http://dweb.pinganh5.com'
};

process.host = host[env];



var app = express();

// view engine setup
app.set('view engine', 'html');
app.engine('html', nunjucks.render);
// 管理视图文件，设置之后， HTML有修改，刷新才能有效果
nunjucks.configure(path.join(__dirname, 'server/views'), {
    autoescape: true,
    express: app,
    watch: true
});

app.use(session({
  secret: 'recommand 128 bytes random string', // 建议使用 128 个字符的随机字符串
}));

//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'output')));



require('./server/routers/index.js')(app);



// 创建应用服务器
var server = http.createServer(app);

server.listen(port, '0.0.0.0', function onStart(err) {
    if (err) {
        console.log(err);
    }
    console.log('启动成功');
});

