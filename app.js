const express = require("express");
const app = express();


app.get("/api",(req,res)=>{
	res.json({"a" : 10});
});
app.get("/mingan",(req,res)=>{
	res.status(401)
	res.json({"err" : -4});
});

app.get("/me",(req,res)=>{
	// res.status(401)
	// res.json({"err" : -4});
	res.json({'username':'xiaoming','nickname':'小明','avatar':'dfaf.jpg'})
});

app.listen(3000);