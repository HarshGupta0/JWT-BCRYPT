const cookieParser = require('cookie-parser');
const express = require('express');
const bcrypt = require('bcryptjs');
const path = require('path');

const userModel = require('./models/user')
const jwt = require('jsonwebtoken')
const ensureAuthenticated =require("./authmiddleware")

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
    let {username, email,age,password}=req.body;
    bcrypt.genSalt(10,(err,salt)=>{
        bcrypt.hash(password,salt,async(err,hash)=>{
            let createdUser = await userModel.create({
                username:username,
                email:email,
                age:age,
                password:hash
            });
            let token= jwt.sign({email:email},"shhhh");
            res.cookie("token",token);
            res.send(createdUser);
        });
    })
})

app.get("/login",(req,res)=>{
res.render("login")
});

app.post("/login",async(req,res)=>{
    let user = await userModel.findOne({email:req.body.email});
    if(!user){
        return res.send("Something Went Wrong");
    }
    bcrypt.compare(req.body.password, user.password , function(err , result){
        if(result){
            let token= jwt.sign({email:user.email},"shhhh");
            res.cookie("token",token);
            res.send("YES YOU CAN LOGIN")
        }
        else{
           res.send("Something Went Wrong");
        }
        console.log(result);
    });
    console.log(user.password, req.body.password)
})

// Protected route: User dashboard
app.get("/dashboard", ensureAuthenticated, (req, res) => {
    res.send(`Welcome to your dashboard, ${req.user.email}`);  // Access the decoded email from token
});

app.get("/logout",(req,res)=>{
    res.cookie("token","");
    res.redirect("/");
});
app.listen(3000)
