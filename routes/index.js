var express = require('express');
var router = express.Router();


router.post('/auth/login', function(req, resp){
    var body = req.body;
    console.log(body);
    console.log(req.params);
    if(body.username === "zhangyao" && body.password === "zhangyao1oseasy") {
            resp.json({status: true});
    } else {
            // resp.status(500).end("username and password unmatch.");
            resp.status(400).json(body);
    }
});
// 自动跳转 angular 文档
router.get('/angular', function(req, resp, next){
	resp.redirect('/angular/docs/index.html');
});


module.exports = router;
