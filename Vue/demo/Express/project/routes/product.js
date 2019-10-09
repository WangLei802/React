var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
	var data={
		code:2000,
		data:[
			{
				text:'陈胖子',
				title:'姓名'
			},
			{
				text:'不开心',
				title:'今日心情'
			},
			{
				text:'不能如愿回家',
				title:'原因'
			}
		],
		isSuccess:true,
		msg:"请求成功"
	}
	res.json(data);
});
 
module.exports = router;