const express=require("express");
const Router=express.Router();

const Elder=require("./Elder");
const Family=require("./Family");
const Login=require("./Login");
const Signup=require("./SignUp");

Router.use("/signup",Signup);
Router.use("/login",Login);
Router.use("/elder",Elder);
Router.use("/family",Family);


module.exports = Router;