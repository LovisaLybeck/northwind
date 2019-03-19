const express = require("express");
const bodyparser = require("body-parser");
const mysql = require("mysql");
const app = express();

app.set('view engine','ejs');
app.use(express.static("public"));
app.use(bodyparser.urlencoded({extended: false}));
app.use(bodyparser.json());

var con = mysql.createConnection({
    host: "127.0.0.1",
    port: 3306,
    user: "User",
    password: "password",
    database: "northwind"
});

con.connect(function(err){
    if (err) {
        console.log("ERROR felaktigt password");
        return;
        }
    console.log("Connected to mysql Northwind");
});

app.get("/employees", (req, res) => {
    let sql = "select EmployeeID, FirstName from Employees";
    con.query(sql, function(err, result){
        res.json(result);
    });
});

app.get("/customers", (req, res) => {
    let sql = "select CustomerID, CompanyName from Customers";
    con.query(sql, function(err, result){
        res.json(result);
    });
});

//Set which page to show tabel of all categories
app.get('/categories',(req,res)=>{   
    res.sendFile(__dirname+'/public/categories.html')
    })

//Send all categories' objects to this path
app.get('/categories/list',(req,res)=>{
    const sql = "select categoryid,categoryname,description from categories"
    con.query(sql, function (err, result) {
      // console.log(result)
        res.json(result)
    })
})


//Send all products' objects of a certain category to this path
app.get('/products/list/:id',(req,res)=>{

    var id=req.params.id
    const sql = 'select Productid,ProductName,QuantityPerUnit,UnitPrice,UnitsInStock,UnitsOnOrder,ReorderLevel,Discontinued from Products where CategoryId='+id
    con.query(sql, function (err, result) {

        // console.log(result)
        res.json(result)        
    })    
})

//Send the product' object to this path,which productid is selected
app.get('/products/:id',(req,res)=>{

    var id=req.params.id
    const sql = 'select Productid,ProductName,QuantityPerUnit,UnitPrice,UnitsInStock,UnitsOnOrder,ReorderLevel,Discontinued from Products where Productid='+id
    con.query(sql, function (err, result) {

        // console.log(result)
        res.json(result)
        
    })
    
})


// Jenny

// Route för att posta en order
app.post("/order", (req, res) => {
    var order = req.body
    var sql = "insert into orders(CustomerID, EmployeeID, OrderDate, RequiredDate) values('" + order.customerID + "','" + order.employeeID + "','" + order.orderDate + "','" + order.requiredDate + "');"
    
    con.query(sql, function (err, result) {
        // console.log(JSON.stringify(result))
        console.log("insertID: " + result.insertId)
        res.send(result.insertId.toString())
    })
})


// Route för att posta orderDetails
app.post("/orderdetail", (req, res) => {
    var orderDetail = req.body
    var sql = "insert into `Order Details`(orderId, productId, unitPrice, quantity, discount) values('" + orderDetail.orderID + "','" + orderDetail.Productid + "','" + orderDetail.UnitPrice + "','" + orderDetail.OrderQuantity + "','" + orderDetail.OrderDiscount + "');"

    con.query(sql, function (err, result) {    
        // console.log(JSON.stringify(result))
        res.send("affectedRows: " + result.affectedRows.toString())
    })
})


// Hämta stock info om produkter
app.get("/getStock/:id", (req, res) => {
    var productId = req.params.id
    var sql = `select UnitsInStock, UnitsOnOrder from Products where ProductID = ${productId}`;
    con.query(sql, function(err, result){
        // console.log("err: " + err)
        res.json(result)
    })
})

// Uppdatera UnitsInStock och UnitsOnOrder
app.post("/postStock", (req, res) => {
    var productObj = req.body
    console.log("inStockObj in till server: " + JSON.stringify(productObj))
    // var productId = req.params.id
    // console.log("productId in till server: " + productId)
    // console.log("getStock_req.body: " + JSON.stringify(req.body))
    var response = updateStock(productObj)
    // updateStock(productObj)
    res.send("Tack så mycket")

    function updateStock(obj){
        const sql = `update Products set UnitsInStock=${obj.UnitsInStock}, UnitsOnOrder=${obj.UnitsOnOrder} where ProductID = ${obj.Productid}`;
        con.query(sql, function(err, result){
            return result;
        })
    }
})





app.listen(8080, () => console.log("Lyssnar på port 8080"));

