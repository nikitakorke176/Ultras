var express= require("express");
var bodyparser=require("body-parser");
var util = require("util");
var AdminRoute = require("./routes/admin");
var UserRoute = require("./routes/user");
var upload = require("express-fileupload");
var session= require("express-session");
require("dotenv").config();


var app=express();
app.use(express.static("public/"));
app.use(bodyparser.urlencoded({extended:true}));
app.use(upload());
app.use(session({
    resave:true,
    saveUninitialized:true,
    secret:"addsfd"
}));



app.use("/",UserRoute);
app.use("/admin",AdminRoute);

app.listen(process.env.PORT || 1000);

// CREATE TABLE about_company{
//     about_company_id INT PRIMARY KEY AUTO_INCREMENT,
//     company_name VARCHAR(100),
//     company_address text,
//     company_email VARCHAR(100),
//     company_mobile VARCHAR(12),
//     company_wahtsapp_no VARCHAR(12),
//     instagram text,
//     twitter text,
//     youtube text,
//     facebook text
// }


// CREATE TABLE banner(
//     banner_id INT PRIMARY KEY AUTO_INCREMENT,
//      banner_title VARCHAR(100),
//      banner_detailes Text,
//      banner_text VARHAR(100),
//      banner_url TEXT,
//      banner_image TEXT
// );