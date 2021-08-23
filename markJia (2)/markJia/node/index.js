const expresss = require('express');
const app = expresss();
const cors = require('cors');
const router = require('./Router/useRouter')
const data = require('./DataBase/connnect')
const User = require('./DataBase/userModel')
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }))
var corsOptions = {
    origin: ['http://localhost:3000','http://localhost:3001'],
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}
app.use(cors(corsOptions))
app.use(router)
// app.post('/login',(req,res)=>{
//   console.log(req);
// })
app.listen(3040,()=>{
    console.log("已经开启");
})