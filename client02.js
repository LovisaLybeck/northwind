var employeeID;
var customerID;


function checkEmployee(){
    const id = document.querySelector("input").value;


    var ok = 0;
    var emp;
    $.get("/employees", function(response){
        emp = Array.from(response);
        emp.map(x => {
            if(x.EmployeeID == id){
                document.querySelector("h1").innerHTML = `Välkommen ${x.FirstName}, vänligen ange kundID`;
                document.querySelector("input").value = "";
                document.querySelector("button").onclick = checkCustomer;
                ok = 1;
                employeeID = x.EmployeeID;
            }
    
        })
        if(ok == 0){
            document.querySelector("h1").innerHTML = "Ogiltigt inlogg";
        }
        
    });
    
}

function checkCustomer(){
    const id = document.querySelector("input").value;
    
    var ok = 0;
    var cust;
    $.get("/customers", function(response){
        cust = Array.from(response);
        cust.map(x => {
            if(x.CustomerID == id){
                goToCategories();
                ok = 1;
                customerID = x.CustomerID;
            }
        })
    });
    if(ok == 0){
        document.querySelector("h1").innerHTML = "Ogiltigt inlogg";
    }
    
}



// $(window).on("load", function(){

//     if(window.location.href.match('categories.html') != null)
//     {
//         console.log("cat")
//         init();
//     } else if (window.location.href.match('kassa.html') != null){
//         rowsOfProducts(orderItemArray)
//         console.log(orderItemArray)
//         addKassaElements();
//     }
//   });


  //Klient javascript
/***************************  Categories' page  ******************************************** */
//Initial sight of categories' page with table

//Skapa ett formulär med knappar
function init() {
   $.get("/categories/list",function(response){       
    const header=response[0]
    getHeader(header)
    getAllCategories()
    var buttons=document.getElementById("buttons")
    var btns=`<div><button onclick=>Back</button>
    <button onclick=checkAll()>Select All</button> 
    <button onclick=uncheckCheckbox()>Clear</button>
    <button onclick=gotoProducts()>Next</button> </div>`
    buttons.innerHTML = btns
  })
}

//Show the head of tabel 
function getHeader(header){
    var headers=[]
    headers.push("Choose")  //the checkbox is first
    for(var v in header){           
        headers.push(v.charAt(0).toUpperCase()+v.substr(1))           
    }
    //console.log(headers)
    var h=headers.map(x=>{
        var rad=`<th>${x}</th>`
        return rad
    })
    document.querySelector("thead").innerHTML=`<tr>${h.join('')}</tr>`
    
}

function getAllCategories() {
    var url = "/categories/list"
    var oReq = new XMLHttpRequest();
    oReq.addEventListener("load", function () {
        var array = JSON.parse(this.responseText)//alla categories
        showTableData(array)
    });
    oReq.open("GET", url);
    oReq.send();
}

function showTableData(array) {
    var tableRows = array.map(x => {
        var row =
       `<tr id="category">
        <td class="checkbox"><input type=checkbox value=${x.categoryid}></td>
        <td>${x.categoryid}</td>
        <td>${x.categoryname}</td>
        <td>${x.description}</td>
        </tr>
        `
        return row
    })
    document.querySelector("tbody").innerHTML=tableRows.join("")
}

class Category {
    constructor(categoryid, categoryname, description) {
        this.categoryid = categoryid
        this.categoryname = categoryname
        this.description = description
    }
}

// Get the array of categories' id which are seleted
function getSelectedId(){
    //console.log($('input:checkbox').val())
    var selectedIDArray = []
    $('input:checkbox').filter(':checked').each(function(){
        selectedIDArray.push($(this).val())
    })
    console.log(selectedIDArray)
    return selectedIDArray
 }

 // Choose the first one
 function gotoProducts(){
    var id=getSelectedId()[0]  
    console.log(id)
    visaProducts(id)  
 }

 /***************************  Products' page  ******************************************** */

 // Initial sight of products' page with tabel

 var productsArray=[]
 var orderItemArray=[]

 function visaProducts(id) {
    let testvar = $.get('/products/list/' + id,function(response){   
        console.log("tests")    
     const header=response[0]
     getHeaderProducts(header)
     getProductsByCategroyId(id)
     var buttons=document.getElementById("buttons")
     var btns=`<div><button onclick=init()>Back</button>
     <button onclick=checkAll()>Select All</button> 
     <button onclick=uncheckCheckbox()>Clear</button>
     <button id='next'>Next</button> </div>`
     buttons.innerHTML = btns
     
   })
 }

 function getHeaderProducts(header){
    var headers=[]
    headers.push("Choose")
    headers.push("OrderQuantity")
    headers.push("OrderDiscount")
    for(var v in header){
        //console.log(v)           
        headers.push(v.charAt(0).toUpperCase()+v.substr(1))           
    }
    //console.log(headers)
    var h=headers.map(x=>{
        var rad=`<th>${x}</th>`
        return rad
    })
    document.querySelector("thead").innerHTML=`<tr>${h.join('')}</tr>`
    
}

// Get all products of a certain categorId in this path
 function getProductsByCategroyId(id) {
    var url = "/products/list/" +id
    var oReq = new XMLHttpRequest();
    oReq.addEventListener("load", function () {
        var array = JSON.parse(this.responseText)
        showTableDataProducts(array)
    })
    oReq.open("GET", url);
    oReq.send();
    
}

function showTableDataProducts(array) {
   
    var tableRows = array.map(x => {
        var row =
       `<tr id="product">
        <td class="checkbox"><input type=checkbox value=${x.Productid}></td>
        <td><input type=number value=0></td>
        <td><input type=number value=0></td>
        <td>${x.Productid}</td>
        <td>${x.ProductName}</td>
        <td>${x.QuantityPerUnit}</td>
        <td>${x.UnitPrice}</td>
        <td>${x.UnitsInStock}</td>
        <td>${x.UnitsOnOrder}</td>
        <td>${x.ReorderLevel}</td>
        <td>${x.Discontinued}</td>
        </tr> `       
        var product=new Product(x.Productid,x.ProductName,x.QuantityPerUnit,x.UnitPrice,x.UnitsInStock,x.UnitsOnOrder,x.ReorderLevel,x.Discontinued)
        productsArray.push(product)
        //console.log(product)
        return row
    })
    document.querySelector("tbody").innerHTML=tableRows.join("")
   
    
}

class Product {
    constructor(Productid,ProductName,QuantityPerUnit,UnitPrice,UnitsInStock,UnitsOnOrder,ReorderLevel,Discontinued) {
        this.Productid=Productid
        this.ProductName=ProductName
        this.QuantityPerUnit=QuantityPerUnit
        this.UnitPrice=UnitPrice
        this.UnitsInStock=UnitsInStock
        this.UnitsOnOrder=UnitsOnOrder
        this.ReorderLevel=ReorderLevel
        this.Discontinued=Discontinued
    }
}

//Build class to order
class OrderItem{
    consturctor(Productid,ProductName,UnitPrice,OrderQuantity,OrderDiscount){
        this.Productid=Productid
        this.ProductName=ProductName
        this.UnitPrice=UnitPrice
        this.OrderQuantity=OrderQuantity
        this.OrderDiscount=OrderDiscount
    }
}

//Varja en product sen klicka på button för att skapa en OrderItem objekt.Man kan gå tillbacka till category för att välja annan category sen välja product.
$(document).on("click","#next",function(){
    
    $("input:checkbox").filter(":checked").each(function(){
        var item=new OrderItem()
        item.Productid=$(this).val()
        for(var n in productsArray){
            if(productsArray[n].Productid==item.Productid){
                item.ProductName=productsArray[n].ProductName
                item.UnitPrice=productsArray[n].UnitPrice
                
            }
        }
        //item.ProductName=$(this).data(“ProductName”)
        //item.UnitPrice=$(this).data(“UnitPrice”)
        item.OrderQuantity=$(this).parent().next().children().eq(0).val()
        item.OrderDiscount=$(this).parent().next().next().children().eq(0).val()
        console.log($(this).data())
        orderItemArray.push(item)
    })
    console.log(orderItemArray)
    
    
    document.querySelector(".content").innerHTML = "<h1>Kassa</h1> <!-- <kassa id=kassaContainer><ul class=kassaList id=kassaList></ul></kassa> --> <kassa id=kassaContainer></kassa> <table id=tableContainer></table>"
    rowsOfProducts(orderItemArray);
    addKassaElements();
        
 })
 

//Select all checkbox
function uncheckCheckbox(){
    $(":checkbox").prop("checked", false);
}

function checkAll(){
    $(":checkbox").prop("checked", true);
}


// _______________________________________________________________________________________________________________


var listOfProducts
function rowsOfProducts(orderItemArray) {
   console.log("rowsOfProducts")
    var row = ""
    listOfProducts = "<thead><tr><th>Produkt Id</th><th>Vara</th><th>Pris</th><th>Rabatt</th><th>Antal</th><tr></thead><tbody id=kassaList>"
    for (i = 0; i < orderItemArray.length; i++){
        row = `<tr><td>${orderItemArray[i].Productid}</td><td>${orderItemArray[i].ProductName}</td><td>${orderItemArray[i].UnitPrice}</td><td>${orderItemArray[i].OrderDiscount}</td><td><input class=amountOfProduct value=${orderItemArray[i].OrderQuantity}></td></tr>`
        // console.log("return row: " + row)   
        listOfProducts += row
    }
    listOfProducts += "</tbody>"
    console.log("listOfProducts: " + listOfProducts)
    console.log("orderItemArray: " + JSON.stringify(orderItemArray))
}


// Hämtar nodeList
// const kassaTabell = document.querySelector("#tableContainer")

function addKassaElements() {
    const kassaTabell = document.querySelector("#tableContainer")
    console.log("add: " + listOfProducts)
    // Lägger till taggar + data i nodeListen
    kassaTabell.innerHTML = listOfProducts
    // Lägger till fält där man kan välja datum
    kassaTabell.innerHTML += `<form onsubmit='return false'><label class=lbl>Datum för leverans: </label><input id='requiredDateInput' type='date'></input></form><br>`
    // Lägger till knappar
    kassaTabell.innerHTML += "<button type=button id=updateBtn onclick=updateKassaOrderList()>Uppdatera</button>"
    kassaTabell.innerHTML += "<button type=button id=updateBtn onclick=goToCategories()>Visa kategorier</button>"
    kassaTabell.innerHTML += "<button type=button id=updateBtn onclick=insertOrder()>Slutför</button>"  // Lägga in i db
}


// Värdet från requiredDate
var dateInput

// Läsa in värdena från input-elementen
function readAmountInput(){
    var amountInput = Array.from(document.querySelectorAll(".amountOfProduct"))
    dateInput = document.querySelector("#requiredDateInput").value
    var amountArray = amountInput.map(x=>x.value)
    return amountArray
}


function updateKassaOrderList(){
    var amountArray = readAmountInput()
    
    // Håller reda på om listan ändrats
    var changedAmount = false

    // Börjar kolla bakifrån för att inte index ska påverkas när ngt tagits bort
    for (i = orderItemArray.length-1; i >= 0; i--){
        // console.log("amountArray[i]: " + amountArray[i] + " -- orderItemArray[i].OrderQuantity: " + orderItemArray[i].OrderQuantity)

        if (amountArray[i] == 0){
            var arr1 = orderItemArray.splice(i+1, orderItemArray.length)
            // console.log("tar slutet på arrayen:" + arr1)
            var arr2 = orderItemArray.splice(0, i)
            // console.log("tar början på arrayen:" + arr2)
            // Lägga ihop arrayerna
            orderItemArray = arr2.concat(arr1);
            // console.log("orderItemArray efter splice: " + JSON.stringify(orderItemArray))
            changedAmount = true
        }
        // Uppdatera en lista om man bara ändrar antal
        else if(amountArray[i] != orderItemArray[i].OrderQuantity){
            changedAmount = true;
            orderItemArray[i].OrderQuantity = amountArray[i]
        }
    }
    // Skriv ut ny lista, om den ändrats
    if (changedAmount){
        // Tar bort de rader som användes före ändringen
        removeElementsById("tableContainer", "kassaList")
        // Lägger in produkterna i elementrader
        rowsOfProducts(orderItemArray)
        // Lägg till element + data på nytt
        addKassaElements()
    }   
}

// Ta bort den gamla listan
function removeElementsById(parentId, childId){
    parent = document.getElementById(parentId);
    child = document.getElementById(childId);
    // console.log("child log: " + child)
    parent.removeChild(child);
}



// Skapar en order och sparar orderID

//  fejkvariabler för employeeID, customerID 


// Genererar datum: "2019-03-15 14:31:00"
var time = new Date().toISOString().slice(0, 19).replace('T', ' ');

// Klass för order-obj
class order{
    constructor(customerID, employeeID, time, dateInput){
        this.customerID = customerID;   // byta till riktig variabel
        this.employeeID = employeeID;   // byta till riktig variabel
        this.orderDate = time;
        this.requiredDate = dateInput;
    }
}


var orderID = "";

function insertOrder(){
    // Lägger till en tid till datumet
    var requestedDate = addTimeToRequiredDate()

    // Orderobjekt skapas och skickas
    var orderObj = new order(customerID, employeeID, time, requestedDate);
    $.post('/order', orderObj, function(response){
        // console.log("response hos client: " + response);
        orderID = response;
        insertOrderDetail()
    })
}

function addTimeToRequiredDate(){
    var reqDate = `${dateInput} 01:00:00`
    // console.log("reqDate: " + reqDate)
    // 2019-03-15 14:31:48
    return reqDate
}


// Skapar obj som kan läggas in i OrderDetails
function orderDetailsAdjustedObjects(){
    var orderDetailsArray = [];
    orderItemArray.map(x=> {
        let moveOrderID = orderID;
        let moveProductid = x.Productid;
        let moveUnitPrice = x.UnitPrice;
        let moveOrderQuantity = x.OrderQuantity;
        let moveOrderDiscount = x.OrderDiscount;
        var ProductObj = {orderID: moveOrderID, Productid: moveProductid, UnitPrice: moveUnitPrice, OrderQuantity: moveOrderQuantity, OrderDiscount: moveOrderDiscount}
        orderDetailsArray.push(ProductObj);
    })
    console.log(orderDetailsArray)
    return orderDetailsArray;
}


function insertOrderDetail(){
    // Hämtar array med objekt som passar OrderDetail
    var orderDetailsArray = orderDetailsAdjustedObjects()

    // Hämta lagerstatus
    getStockInfo()

    // Kolla om kunden försöker beställa mer än det finns. I så fall: alert!
    setTimeout(addProductId, 1000);

    orderDetailsArray.map(x=>{
        $.post('/orderdetail', x, function(response){
            console.log("response från insertOrderDetail: " + response)
            var response = response
        })
    })

    // Uppdaterar antal varor i lagret: UnitsInStock, samt hur många varor som är beställda: UnitsOnOrder
    setTimeout(adjustProductStockAmount, 2000);
    
}

function getStockInfo(){
    orderItemArray.map(x=>{
        var id = x.Productid
        url = "/getStock/" + id
        $.get(url, function(response){
            // console.log("result för getStockInfo: " + JSON.stringify(response[0]));
            createStockInfoArray(response)
        })
    })
}

var stockInfoArray = [];
function createStockInfoArray(response){
    stockInfoArray.push(response[0])
}


function addProductId(){
    var amountInStock
    orderItemArray.map((x, index) => {        

        if (x.OrderQuantity < stockInfoArray[index].UnitsInStock){
            amountInStock = true
        }
        else {
            amountInStock = false
            var productName = x.ProductName
            var inStock = stockInfoArray[index].UnitsInStock
            alert("Det finns bara " + inStock + " i lager av " + productName + ".");
        }
    });    
    return amountInStock
}

function createStockArrayForSendingToServer(){
    var changeStockArray = []
    orderItemArray.map((x, index) => {
        var newInStockAmount = stockInfoArray[index].UnitsInStock - x.OrderQuantity;
        var newOnOrderAmount = stockInfoArray[index].UnitsOnOrder + x.OrderQuantity;
        var productObj = {Productid: x.Productid, UnitsInStock: newInStockAmount, UnitsOnOrder: newOnOrderAmount};
        changeStockArray.push(productObj)
    })
    return changeStockArray
}


// Uppdaterar varornas antal i products-tabellen
function adjustProductStockAmount(){
    // Behöver arrayen med varorna, orderItemArray. {Productid: 1, ProductName: "Chai", UnitPrice: 20, OrderQuantity: 4, OrderDiscount: 0};
    // Arrayen med antal varor i lager, stockInfoArray: {"UnitsInStock":39,"UnitsOnOrder":0}
    var changeStockArray = createStockArrayForSendingToServer()

    changeStockArray.map(x=>{
        console.log("x: " + JSON.stringify(x))
        $.post("/postStock", x, function(response){
            alert(response);
            console.log("response för post-funktion: " + JSON.stringify(response[0]));        
        });
    })

}

function goToCategories(){
    document.querySelector(".content").innerHTML = `<div id="order"></div>
                <hr>
                <table>
                    <thead>
                        <tr>
                            <th></th>
                            <th></th>
                            <th></th>
                            <th></th>
                            <th></th>
                            <th></th>
                            <th></th>
                            <th></th>
                            <th></th>
                            <th></th>
                            <th></th>
                            
                        </tr>
                    </thead>
                    <tbody></tbody>
                </table>
                <div id="buttons"></div>`
                init();
}