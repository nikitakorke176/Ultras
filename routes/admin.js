const  express = require("express");
const exe= require("../conn");
// const { Route } = require("router");
const route = express.Router();

route.get("/",function(req,res){
         res.render("admin/index.ejs")
});


route.get("/about_company",async function(req,res){
    var sql = `SELECT * FROM about_company`

    var about_company= await exe(sql);

    var obj ={
        "about_company": about_company
    }
         res.render("admin/about_company.ejs",obj);
});


route.post("/save_company",async function(req,res){
    var d = req.body;
    var sql = `UPDATE about_company SET 
    company_name= '${d.company_name}',
    company_address= '${d.company_address}',
    company_email= '${d.company_email}',
    company_mobile= '${d.company_mobile}',
    company_wahtsapp_no= '${d.company_wahtsapp_no}',
    instagram='${d.instagram}',
    twitter='${d.twitter}',
    youtube='${d.youtube}',
    facebook='${d.facebook}' WHERE about_company_id =1`
    var data = await exe(sql);
         res.redirect("/admin/about_company");
});

route.get("/banner", async function(req,res){
    var Banner = await exe(`SELECT * FROM banner`);
    var obj ={"Banner":Banner}
    res.render("admin/banner.ejs",obj);
});

route.post("/save_banner",async function(req,res){

    var d= req.body;

    //part 1

    var banner_image = Date.now()+req.files.banner_image.name;

    req.files.banner_image.mv("public/upload/"+banner_image);

    // part 2
    var sql = `INSERT INTO banner (banner_title,banner_detailes,banner_text,banner_url,banner_image) VALUES
    ('${d.banner_title}','${d.banner_detailes}','${d.banner_text}','${d.banner_url}','${banner_image}' ) `

    var data = await exe(sql);
    res.redirect("/admin/banner");
});

route.get("/delete/:id",async function(req,res){
    var data = await exe(`DELETE FROM banner WHERE banner_id = '${req.params.id}'`);
    res.redirect("/admin/banner");
    
});

route.get("/edit/:id",async function(req,res){

    var sql=`SELECT * FROM banner WHERE banner_id = '${req.params.id}'`;
    var data = await exe(sql);

    var obj={"info":data[0]};
    res.render("admin/Banner_edit.ejs",obj);


});


route.post("/update_banner",async function(req,res){
    var d= req.body;

    if(res.files && req.files.banner_image){
        var banner_image =DataTransfer.now()+req.files.banner_image.name;
        req.files.banner_image.mv("public/upload/"+banner_image);

        var sql =`UPDATE banner SET banner_image = '${banner_image}' WHERE banner_id = '${d.banner_id}' `
        var data = await exe(sql);
    }

    var sql = `UPDATE banner SET
  banner_title ='${d.banner_title}',
  banner_detailes ='${d.banner_detailes}',
  banner_text= '${d.banner_text}',
  banner_url = '${d.banner_url}'
  WHERE banner_id = '${d.banner_id}'`;
  var data = await exe(sql);
  res.redirect("/admin/banner");

});



route.get("/category", async function(req,res){
    var data= await exe(`SELECT * FROM category`);
    res.render("admin/category.ejs",{"category": data});

});

route.post("/save_category",async function(req,res){
    var data = await exe(`INSERT INTO category (category_name) VALUES ('${req.body.category_name}')`);
    res.redirect("/admin/category");

});


route.get("/category_delete/:id",async function(req,res){
    var data = await exe(`DELETE FROM category WHERE category_id = '${req.params.id}'`);
    res.redirect("/admin/category");


});

//create update query for the category

route.get("/add_product",async function(req,res){
    var category = await exe(`SELECT * FROM category`);
    var obj={"category":category}
    res.render("admin/add_product.ejs",obj);

});

route.post("/save_product",async function(req,res){
    // part 1
     if(req.files.product_image1){
        var product_image1 =Date.now()+req.files.product_image1.name;
        req.files.product_image1.mv("public/upload/"+product_image1);
     }

         if(req.files.product_image2){
        var product_image2 =Date.now()+req.files.product_image2.name;
        req.files.product_image2.mv("public/upload/"+product_image2);
         }

         if(req.files.product_image3){
        var product_image3 =Date.now()+req.files.product_image3.name;
        req.files.product_image3.mv("public/upload/"+product_image3);
         }else{
            product_image3 =""
         }

         if(req.files.product_image4){
        var product_image4 =Date.now()+req.files.product_image4.name;
        req.files.product_image4.mv("public/upload/"+product_image4);
         }else{
            product_image4 =""
         }

    // part 2

    var d= req.body;
    var sql = `INSERT INTO products (category_id,product_name,product_color,product_tag,product_company,product_detailes,product_image1,product_image2,product_image3,product_image4) VALUES ('${d.category_id}','${d.product_name}','${d.product_color}','${d.product_tag}','${d.product_company}','${d.product_detailes}','${product_image1}','${product_image2}','${product_image3}','${product_image4}')`

    var data= await exe(sql);
    var product_id = data.insertId;

   

    if(d.product_size && d.product_size.length > 0){
    for(var i=0; i<d.product_size.length; i++){
        var sql = `INSERT INTO product_pricing 
        (product_id,product_size,product_price,product_duplicate_price) 
        VALUES 
        ('${product_id}','${d.product_size[i]}','${d.product_price[i]}','${d.product_duplicate_price[i]}')`;

        await exe(sql);
    }
}

     res.redirect("/admin/add_product");

});

route.get("/product_list",async function(req,res){
    var sql =`SELECT *,
    (SELECT MIN(product_price) FROM product_pricing WHERE
    products.product_id = product_pricing.product_id)
     AS product_price ,
       (SELECT MAX(product_duplicate_price) FROM product_pricing WHERE
    products.product_id = product_pricing.product_id) 
    AS product_duplicate_price FROM products`

    var data = await exe(sql);

    var obj={"product_list":data};
    res.render("admin/product_list.ejs",obj);

});

route.get("/product_delete/:id",async function(req,res){

    var id = req.params.id;
    var sql=`DELETE FROM products WHERE product_id='${id}';`
    var data=await exe(sql);
    res.redirect("/admin/product_list");

});


//create edit query




route.get("/product_info/:id",async function(req,res){
    var id = req.params.id;
    var sql=`SELECT * FROM products WHERE product_id= '${id}'`;
    var sql2=`SELECT * FROM product_pricing WHERE  product_id= '${id}'`
    var price =await exe(sql2);
    var product_info=await exe(sql);
    var obj={"product_info":product_info[0],"price":price};

    res.render("admin/product_info.ejs",obj);
   

});


route.get("/order_list/:status",async function(req,res){
    // var status=req.params.status;
    // var sql=`SELECT * FROM order_tbl WHERE order_status='${status}'`;
    // var data= await exe(sql);
    // var obj={"order_data":data};
    // res.render("admin/order_list.ejs",obj);


    var status = req.params.status;  

    var sql = `SELECT * FROM order_tbl WHERE order_status='${status}'`;

    var data = await exe(sql);  

    res.render("admin/order_list.ejs", {
        list: data,
        status: status
    });
 

});



module.exports=route;