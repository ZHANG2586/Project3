var express = require('express')
var router = express.Router();
var UserModel = require('../DataBase/userModel')
var jwt = require('jsonwebtoken')
router.get('/test',(req,res)=>{
    res.send("jinlaile")
})
// router.post('/login',(req,res)=>{
//     console.log(req);
// })

//
router.post('/seek',(req,res)=>{
    console.log('接收了');
    console.log(req.body);
    let data;
    for(let i in req.body){
        console.log(data=JSON.parse(i));
    }
    console.log(data.token);
   jwt.verify(data.token,data.secret,{expiresIn:180},(err,decoded)=>{
       if(err){
           console.log(err);
           res.json(err);
       }else{
           console.log(decoded);
           UserModel.findOne({_id:decoded._id},(err,doc)=>{
               if(err){
                   console.log(err);
                   res.send(err);
               }else{
                   console.log(doc);
                   res.json(doc);
               }
           })
       }
   });
    
   
})



router.post('/newProfile',(req,res)=>{
    let data = []
    req.on('data', chunk => {
        data.push(chunk)  // 将接收到的数据暂时保存起来
    })
    req.on('end', () => {
        // console.log(JSON.parse(data)) // 数据传输完，打印数据的内容
        let reqdata = JSON.parse(data)
        let {username,passage,text} = reqdata;
        UserModel.updateOne({username:username},{$set:{filepassage:passage,filetext:text}},{upsert:true},(err,raw)=>{
            console.log(err,raw);
            res.send("请求成功");
        })
    })
    
})
router.post('/newProject',(req,res)=>{
    let data = []
    req.on('data', chunk => {
        data.push(chunk)  // 将接收到的数据暂时保存起来
    })
    req.on('end', () => {
        // console.log(JSON.parse(data)) // 数据传输完，打印数据的内容
        let reqdata = JSON.parse(data)
        console.log(reqdata)
        let {username,jectPassage,jectText} = reqdata;
        UserModel.updateOne({username:username},{$set:{jectpassage:jectPassage,jecttext:jectText}},{upsert:true},(err,raw)=>{
            console.log(err,raw);  
            
            res.send("请求成功");
        })
        // res.send({reqdata})
    })
  
})
router.post('/register', (req, res) => {
    const { username, password } = req.body
    console.log(username)
    let data = [];
    req.on('data', chunk => {
        data.push(chunk)  // 将接收到的数据暂时保存起来
    })
    req.on('end', () => {
        // console.log(JSON.parse(data)) // 数据传输完，打印数据的内容
        let reqdata = JSON.parse(data)
        console.log(reqdata,1)
        let {username,password,Nikname,Gender} = reqdata;
        let headportrait=parseInt(Math.random()*10000);
        UserModel.findOne({ username }, (err, user) => {
            console.log(user,2)
            if (user) {
                res.send({code:-1, msg:'此用户已存在'})
            }
            else {

                new UserModel({ username,password,Nikname,Gender,headportrait}).save((err, user) => {
                    if (err) {
                        console.log(err);
                    }
                    else {
                          // 生成一个 cookie(userid: user._id), 并交给浏览器保存
                    //  res.cookie('userid', user._id, { maxAge: 1000 * 60 * 60 * 24 * 7 }) // 持久化 cookie, 浏`览器会保存在本地文件
                    //  // 返回包含user的json数据
                    //  const data = {username, _id:user._id,msg:'注册成功！'}  //响应数据中不要携带password
                    const data = {username,msg:'注册成功！'}  
                    res.send({code:1 ,username,msg:'注册成功！'})
                    }
                })
            }

    })
  
    })
})


// 用户登录
router.post('/login', (req, res) => {
    let data = []
    req.on('data', chunk => {
        data.push(chunk)  // 将接收到的数据暂时保存起来
    })
    req.on('end', () => {
        console.log(JSON.parse(data)) // 数据传输完，打印数据的内容
        let reqdata = JSON.parse(data)
        console.log(reqdata)
        // User.updateOne({SNo:reqdata.SNo},{$set:{text:reqdata.text}},{upsert:true},(err,raw)=>{
        //     console.log(err,raw);
        // })
        let {username,password,remember} = reqdata
        const header={username,remember}
    UserModel.findOne({ username,password},  (err, user) => {
        console.log(user,1)
        if (user) {
            res.cookie('userid', user._id, { maxAge: 1000 * 60 * 60 * 24 * 7 }) // 持久化 cookie, 浏 览器会保存在本地文件
            const header = {username,_id:user._id}
            var token = jwt.sign(header,username,{expiresIn:180})
            console.log(token);
            res.send({code:1, data,msg:'登录成功!',token:token})
        }
        else {
            res.send({code:-1, msg:'用户名或密码不正确'})
        }
    })
    })
    
})
router.post("/getData",(req,res)=>{
    let {token} =req.headers
    console.log("token",token)
    if(token){
        let data = [];
        req.on('data', chunk => {
            data.push(chunk)  // 将接收到的数据暂时保存起来
        })
        req.on('end', () => {
            console.log(JSON.parse(data)) // 数据传输完，打印数据的内容
            let reqdata = JSON.parse(data)
            let{username} = reqdata;
            console.log(1, username)
            jwt.verify(token,username,(err,decoded)=>{
                console.log(2, decoded != undefined )
                
                if(decoded != undefined ){
                    UserModel.findOne({username:username},(err,user)=>{
                        console.log(2,user)
                        if(err)
                            res.send({code:-1,msg:获取信息失败,error:err})
                        else{
                            let data = {
                                passage: user.filepassage,
                                text: user.filetext,
                                jectPassage: user.jectpassage,
                                jectText:user.jecttext,
                                username:username
                                
                            }
                            res.send({code:1,msg:"获取数据成功",data:data})
                        }
                 })
                }
                else{
                    res.send({code:-2,msg:"身份认证失败"})
                }
            })
            // UserModel.findOne({username:username},(err,user)=>{
            //     console.log(user)
            //     if(err)
            //         res.send({code:-1,msg:获取信息失败,error:err})
            //     res.send('已经找到')
            // })
            // User.updateOne({SNo:reqdata.SNo},{$set:{text:reqdata.text}},{upsert:true},(err,raw)=>{
            //     console.log(err,raw);
            // })
            // res.send("token失败")
        })
        
        
    }
})
module.exports = router;