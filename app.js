const express = require("express");
const app = express();
const session = require('express-session')
const formidable = require('formidable')
const fs = require('fs')
const crypto = require('crypto')


//开静态，使图片有路径,把当前文件夹提供http服务
app.use(express.static("./"))
//下面是为了实现session,是npm 社区的固定写法
app.set('trust proxy', 1)
app.use(session({
	secret: 'keyboard cat',
	resave: false,
	saveUninitialized: true,
	
  }))


app.post("/login",(req,res)=>{
	//用formidable 识别用户提交的用户名和密码
	var form = new formidable.IncomingForm();
	//下面是formidable的固定语法
	form.parse(req,(err,fields)=>{
		// console.log(fields)
		//得到用户名和密码
		const username = fields.username;
		const password = fields.password;
		//加密一下password
		const passwordsha256 = crypto.createHash("sha256").update(password + '' + password).digest('hex')
		// console.log(passwordsha256)
		// res.json({'result':fields})
		//遍历小数据库，看看有没有匹配项
		fs.readFile("./db/users.txt",(err,content)=>{
			//转为真正的数组，toString()表示把二进制变为文字
			var arr = JSON.parse(content.toString())
			//遍历这个数组
			for(var i = 0;i<arr.length;i++){
				//找到这个人了
				if(username==arr[i].username && passwordsha256==arr[i].password){
					//写session，这里感觉不到在下发cookie、登记小本本，做识别
					//实际上node.js帮我们做这些事情了
					req.session.login = true;
					req.session.username = arr[i].username;
					//返回数据
					res.json({'result':1})
					return 
				}
			} //如果不匹配，返回-1
			res.json({'result':-1})
		})

	})
})


//查看当前登陆用户的信息
app.get("/me",(req,res)=>{
	//如果登陆了
	if(req.session.login){ 
		//遍历小数据库，看看有没有匹配项
		fs.readFile("./db/users.txt",(err,content)=>{
			//转为真正的数组，toString()表示把二进制变为文字
			var arr = JSON.parse(content.toString())
			//遍历这个数组
			for(var i = 0;i<arr.length;i++){
				//找到这个人了
				if(arr[i].username==req.session.username){
					 
					res.json({
						'username':arr[i].username,
						'nickname':arr[i].nickname,
						'avatar':arr[i].avatar,
						'role':arr[i].role
					})
				}
			}
		}) 
	}else{ //如果没有登陆，返回401和-4
		res.status(401)
		res.json({"err" : -4}); 
	}
});

//上传图片，post请求
app.post("/uploadavatar",(req,res)=>{
	
	const form = new formidable.IncomingForm()
	//设置上传目录
	form.uploadDir = "./uploads";
	//保留扩展名
	form.keepExtensions = true;
	form.parse(req,(err,fields)=>{
		res.json({'result':1})
	})
})

app.listen(3000);