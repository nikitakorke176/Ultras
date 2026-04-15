const  express = require("express");
const exe = require("../conn");
const route = express.Router();

route.get("/",async function(req,res){
    var sql= `SELECT * FROM about_company`
    var about_company = await exe(sql);

    var Banner = await exe(`SELECT * FROM banner`);


    var obj={"about_company":about_company[0],"Banner":Banner,"is_login":varifyaccount(req)}
         res.render("user/index.ejs",obj)
});


route.get("/about",async function(req,res){
     var sql= `SELECT * FROM about_company`
    var about_company = await exe(sql);

    var obj={"about_company":about_company[0],"is_login":varifyaccount(req)}
         res.render("user/about.ejs",obj)
});


route.get("/shop", varifyaccount, async function(req,res){
     var sql= `SELECT * FROM about_company`
    var about_company = await exe(sql);

     var sql =`SELECT *,
    (SELECT MIN(product_price) FROM product_pricing WHERE
    products.product_id = product_pricing.product_id)
     AS product_price ,
       (SELECT MAX(product_duplicate_price) FROM product_pricing WHERE
    products.product_id = product_pricing.product_id) 
    AS product_duplicate_price FROM products`

    var product = await exe(sql);

    var obj={"about_company":about_company[0],"product":product,"is_login":varifyaccount(req)}
         res.render("user/shop.ejs",obj)

         
});

route.get("/blog",async function(req,res){
     var sql= `SELECT * FROM about_company`
    var about_company = await exe(sql);

    var obj={"about_company":about_company[0],"is_login":varifyaccount(req)}
         res.render("user/blog.ejs",obj)
});

route.get("/contact",async function(req,res){
     var sql= `SELECT * FROM about_company`
    var about_company = await exe(sql);

    var obj={"about_company":about_company[0],"is_login":varifyaccount(req)}
         res.render("user/contact.ejs",obj)
});

route.get("/view_product/:id",async(req,res)=>{
     var id= req.params.id;
     
     var about_company= await exe(`SELECT * FROM about_company`);
     var sql=`SELECT * FROM products WHERE product_id='${id}'`;
     var sql1=`SELECT * FROM product_pricing WHERE product_id= '${id}'`;

     var price = await exe(sql1);
     var product_info = await exe(sql);
     var obj = {"product_info":product_info[0],"price":price,"about_company":about_company[0],"is_login":varifyaccount(req)}
     res.render("user/product_info.ejs",obj);

});

route.get("/login", async function (req,res){
      var sql= `SELECT * FROM about_company`
    var about_company = await exe(sql);
     res.render("user/login.ejs",{"about_company": about_company[0],"is_login":varifyaccount(req)});

});



route.get("/create_account", async function(req,res){
    var sql= `SELECT * FROM about_company`;
    var about_company = await exe(sql);

    var obj = {
        "about_company": about_company[0],"is_login":varifyaccount(req)
    };

    res.render("user/create_account.ejs", obj);  
});

route.post("/create_new_account",async function(req,res){
     var d= req.body;
     var sql=`INSERT INTO users(user_name,user_mobile,user_email,password) VALUES ('${d.user_name}','${d.user_mobile}','${d.user_email}','${d.password}')`;
var data =await exe(sql);

     res.redirect("/login");

});

route.post("/do_login",async function(req,res){
     var d = req.body;
     var sql=`SELECT * FROM users WHERE user_email = '${d.user_email}' AND password='${d.password}' `;
     var user= await exe(sql);
     if(user.length > 0){
          req.session.user_id= user[0].user_id;

          res.redirect("/shop");
     }else{
          res.redirect("/login");
     }

});

// function varifyaccount(req,res,next){
//      // var user_id = req.session.user_id;
//      if(req.session.user_id){
//          next();   // continue request
//      } else {
//          res.redirect("/login");  // stop and redirect
//      }
// }

function varifyaccount(req,res,next){

     // ✅ CASE 1: Used as middleware
     if(typeof next === "function"){
         if(req.session.user_id){
             next();
         } else {
             res.redirect("/login");
         }
     }

     // ✅ CASE 2: Used as boolean (your current usage)
     else{
         return req.session.user_id ? true : false;
     }
}



route.get("/logout",function( req,res){
     req.session.user_id=undefined;
     res.redirect("/login");
});


route.get("/add_to_cart/:product_id/:product_pricing_id", varifyaccount, async function (req,res){
     var product_id=req.params.product_id;
     var product_pricing_id= req.params.product_pricing_id;

     

    var sql =` INSERT INTO cart(product_id,product_pricing_id,user_id,qty) VALUES ('${product_id}','${product_pricing_id}','${req.session.user_id}',1)`;

    var data=await exe(sql);

     res.redirect("/cart");
});



route.get("/cart",varifyaccount,async function(req,res){

       
    var about_company = await exe(`SELECT * FROM about_company`);

     var sql=` SELECT * FROM products,product_pricing,cart 
     WHERE
      products.product_id = product_pricing.product_id
     AND
     product_pricing.product_pricing_id=cart.product_pricing_id
     AND
     products.product_id = cart.product_id
     AND
     cart.user_id =${req.session.user_id}  `

     var cart_data =await exe(sql);

    var obj={"about_company":about_company[0],"is_login":varifyaccount(req),"cart":cart_data};

    res.render("user/cart.ejs",obj);

});


route.get("/qtyincrease/:id", async function(req,res){
     var id= req.params.id;
     var sql=`UPDATE cart SET qty = qty+1 WHERE cart_id='${id}'`;
     await exe(sql);
     res.redirect("/cart");   // ✅ FIX
});

route.get("/qtydecrease/:id", async function(req,res){
     var id= req.params.id;
     var sql=`UPDATE cart SET qty = qty-1 WHERE cart_id='${id}'`;
     await exe(sql);
     res.redirect("/cart");   // ✅ FIX
});



route.get("/remove/:id",async function(req,res){
    var data = await exe(`DELETE FROM cart WHERE cart_id = '${req.params.id}'`);
    res.redirect("/cart");


});



route.get("/checkout", varifyaccount, async function (req,res){
          
     var sql=` SELECT * FROM products,product_pricing,cart 
     WHERE
      products.product_id = product_pricing.product_id
     AND
     product_pricing.product_pricing_id=cart.product_pricing_id
     AND
     products.product_id = cart.product_id
     AND
     cart.user_id =${req.session.user_id}  `

     var cart= await exe(sql);
  

    var about_company = await exe(`SELECT * FROM about_company`);

     var obj={"about_company":about_company[0],"is_login":varifyaccount(req),"cart":cart};

        if(cart.length > 0){
           res.render("user/checkout.ejs",obj);
          
     }else{
          res.redirect("/shop");
     }
});

route.post("/order",async function(req,res){
var d =req.body;

 var sql1=` SELECT * FROM products,product_pricing,cart 
     WHERE
      products.product_id = product_pricing.product_id
     AND
     product_pricing.product_pricing_id=cart.product_pricing_id
     AND
     products.product_id = cart.product_id
     AND
     cart.user_id =${req.session.user_id}  `

     var cart= await exe(sql1);
     var sum=0;
     for(i=0;i<cart.length;i++){
          sum += cart[i].product_price *  cart[i].qty;
     }
  

var sql=`INSERT INTO order_tbl (
    customer_name,
    customer_mobile,
    customer_state,
    customer_district,
    customer_city,
    customer_area,
    customer_landmark,
    customer_pincode,
    payment_type,
    order_amount,
    payment_status,
    order_status
) VALUES (
    '${d.name}',
    '${d.mobile}',
    '${d.state}',
    '${d.district}',
    '${d.city}',
    '${d.area}',
    '${d.landmark}',
    '${d.pincode}',
    '${d.payment_type}',
    '${sum}',
    'pending',
    'pending'
);`

var data=await exe(sql);

var order_id=data.insertId;

for(var i=0;i<cart.length;i++){

    var sql3= `
    INSERT INTO order_det (
        order_id,
        product_id,
        customer_id,
        product_pricing_id,
        product_name,
        product_price,
        product_color,
        product_size,
        product_image1,
        product_company,
        product_qty,
        product_total
    ) VALUES (
        '${order_id}',
        '${cart[i].product_id}',
        '${req.session.user_id}',
        '${cart[i].product_pricing_id}',
        '${cart[i].product_name}',
        '${cart[i].product_price}',
        '${cart[i].product_color}',
        '${cart[i].product_size}',
        '${cart[i].product_image1}',
        '${cart[i].product_company}',
        '${cart[i].qty}',
        '${cart[i].product_price * cart[i].qty}'
    )`;
console.log(sql3);
   var data1= await exe(sql3);   
}

var data2 = await exe(`DELETE FROM cart WHERE user_id=${req.session.user_id}`);

if(d.payment_type == "online"){
     res.redirect("/payment/"+order_id)
}else{
     res.redirect("/order_info");
}

});

route.get("/payment/:id",async function(req,res){

     var order_id=req.params.id;
     var sql=`SELECT * FROM order_tbl WHERE order_id=${order_id}`
     var data = await exe(sql);
   //  console.log(data);

     res.render("user/payment.ejs",{"data":data[0]});
     

});


route.post("/payment_check/:id",async function(req,res){
     var order_id = req.params.id;
     var sql=`UPDATA order_tbl SET transaction_id ='${req.body.razorpay_payment_id}' WHERE  order_id =${order_id}`
     var data=await exe(sql);
     res.redirect("/order_info");

});

route.get("/order_info",async function (req,res){
      var about_company = await exe(`SELECT * FROM about_company`);

     var obj={"about_company":about_company[0],"is_login":varifyaccount(req)};
     res.render("user/order_info.ejs",obj)

});

module.exports=route;


//CREATE TABLE users(user_id INT PRIMARY KEY AUTO_INCREMENT, user_name VARCHAR(100), user_mobile VARCHAR(12), user_email VARCHAR(30), password VARCHAR(100));

//CREATE TABLE cart(
// cart_id INT PRIMARY KEY AUTO_INCREMENT,
// product_id INT, 
// product_pricing_id INT,
// user_id INT,
// qty INT 
// );




