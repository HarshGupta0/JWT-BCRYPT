const cookieParser = require('cookie-parser');
const express = require('express');
const bcrypt = require('bcryptjs');
const path = require('path');

const userModel = require('./models/user')

const app = express();

app.set("view engine" , "ejs");

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname,"public")));

app.get("/",function(req,res){
res.render('index');
});
app.post("/create",(req,res)=>{
    let {username, email,password,age}=req.body;
    bcrypt.genSalt(10,(err,salt)=>{
        bcrypt.hash(password,salt,async(err , hash)=>{
            let createdUser = await userModel.create({
                username:username,
                email:email,
                age:age,
                password:hash
            })
            res.send(createdUser);
        });
    })
})
app.listen(3000)
