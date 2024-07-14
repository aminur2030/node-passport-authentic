const express=require("express");
const cors=require("cors");
const ejs=require("ejs");
const app=express();
require("./config/database");
require("dotenv").config()
require("./config/passport")
const User=require("./models/user.model");
const bcrypt = require('bcrypt');
const saltRounds = 10;
const passport=require("passport");
const session=require("express-session");
const MongoStore = require('connect-mongo');
app.set("view engine","ejs");
app.use(cors());
app.use(express.urlencoded({extended:true}))
app.use(express.json());
app.set('trust proxy', 1) // trust first proxy
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  store: MongoStore.create({
    mongoUrl:process.env.MONGO_URL,
  })
  // cookie: { secure: true }
}));
app.use(passport.initialize());
app.use(passport.session());

app.get("/",(req,res)=>{
  res.render("index")
});
//regiser:get
app.get("/register",(req,res)=>{
  res.render("register")
});
//regiser:post
app.post("/register",async(req,res)=>{
  try {
    const user=await User.findOne({username:req.body.username})
    if(user) return res.status(400).send("User already exists");
    bcrypt.hash(req.body.password, saltRounds, async(err, hash)=> {
      const newUser=new User({
        username:req.body.username,
        password:hash
      })
    await newUser.save()
    res.status(201).redirect("/login")
  });
   
  } catch (error) {
    res.status(500).send(error.message)
  }
});
//login:get
app.get("/login",(req,res)=>{
  res.render("login")
});
//login:post
app.post('/login', 
  passport.authenticate('local', {
    failureRedirect: '/login',
    successRedirect:"/profile" }),
  );
//profile protected route
app.get("/profile",(req,res)=>{
  res.render("profile")
});
//logout:get
app.get("/logout",(req,res)=>{
  res.redirect("/")
});
module.exports=app;