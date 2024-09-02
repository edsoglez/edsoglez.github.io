import {getDatabase, set, get, update, remove, ref, child, onValue, orderByChild} from "https://www.gstatic.com/firebasejs/10.3.1/firebase-database.js"; 
window.itemRef = ref(db,'Items/');
window.transRef = ref(db,'Transactions/');
window.prodRef = ref(db,'Products/');
//order variable define
window.productPrices = {}
window.itemsOrdered = {}
window.orderTotal = 0;
window.orderIndexes = []
//do not change below date defintions
let month = String(new Date().getMonth()+1).padStart(2, '0')
let date = String(new Date()).split(" ")
let day = String(new Date().getDate()).padStart(2,'0')
let year = new Date().getFullYear()

let productList = document.getElementById("product-list")
let salesMade = {}



try{
    
    salesMade = JSON.parse(localStorage.salesMade)
    syncSalesToDB()
}
catch(e){
}
    
   

// ------------------------------------------------------------------------------------------------------------------------------------------------
resetOrder()
//when any change in db happens, re-renders cards
onValue(prodRef,(snapshot)=>{
    renderAllProductCards()    
})

function syncSalesToDB(){
    Object.entries(salesMade).forEach((sale)=>{
        let key = sale[0]
        let val = sale[1]

        let year = String(key).substring(0,4)
        let month = String(key).substring(5,6)
        console.log(key,val)

        set(ref(db,'Sales/'+year+"/"+month+"/"+ key),{
            Total : val.Total,
            Method : val.Method,
            Seller : val.Seller,
            Items : val.Items,
            Time : val.Time,
            Cached : true
        })
    })

    salesMade = {}
    localStorage.salesMade = JSON.stringify(salesMade)
}

function generateProductCard(Product){
    Product.forEach(
        function(Size){
            if(Size.key=="CH"||Size.key=="M"||Size.key=="G")
            productPrices[Product.key+"_"+Size.key] = Size.val().price
    })
    
    localStorage.products = JSON.stringify(productPrices);

    //render basic card layout without size buttons
    productList.innerHTML +=
            `<li id="${Product.key}" class="product-list-item">
                <div style="display:flex; flex-direction:row;">
                <div class="product-item" >
                    <h5 class="product-text">${Product.key}</h5>   
                    <img class="product-image" src="${Product.val().imgURL}" alt="">
                    <div style="width:100%; heigh:50px" id="${Product.key}-sizes">     
                    <div>
                </div>
                </div>
            </li>`

    //Render size buttons depending on available sizing
    if(Product.val().CH){
        document.getElementById(String(Product.key)+ "-sizes").innerHTML +=
            `<button class="size-button" onClick="addItemToOrder('${Product.key}','CH');" id="${Product.key}-CH" style="width: 95%">UN</button>`
        }

    if(Product.val().M){
            document.getElementById(String(Product.key)+ "-sizes").innerHTML +=
           `<button class="size-button" onClick="addItemToOrder('${Product.key}','M');" id="${Product.key}-M" style="width: 30%">M</button>`
            document.getElementById(String(Product.key)+ "-CH").style.width = '30%'
    }

    if(Product.val().G){
        document.getElementById(String(Product.key)+ "-sizes").innerHTML +=
        `<button class="size-button" onClick="addItemToOrder('${Product.key}','G');" id="${Product.key}-G" style="width: 45%">G</button>`
        document.getElementById(String(Product.key)+ "-CH").style.width = '45%'  
        document.getElementById(String(Product.key)+ "-CH").textContent = 'CH'  
           
        //since not all products have a medium size, we will render considering product does not have it
        //Only in the case it does, we risize all buttons to fill
        if(Product.val().M){
            document.getElementById(String(Product.key)+ "-CH").style.width = '30%'
            document.getElementById(String(Product.key)+ "-M").style.width = '30%'
            document.getElementById(String(Product.key)+ "-G").style.width = '30%'
        }
       

    }
}

function renderAllProductCards(){
    productList.innerHTML = ""

    get(child(ref(getDatabase()), `Products/`)).then((snapshot) => {

        //each forEach gets all products from certain category, to keep them grouped
        productList.innerHTML +=
        `<li style="margin:10px; height: auto;"> 
        <div class="product-separator">Calientes</div>
        </li>`
        snapshot.forEach(
            function(Product){
                if(Product.val().index != "caliente"){return}
                generateProductCard(Product) 
        })
        productList.innerHTML +=
        `<li style="margin:10px; height: auto;"> 
        <div class="product-separator">Frios</div>
        </li>`
        snapshot.forEach(
            function(Product){
                    if(Product.val().index != "frio"){return}
                    generateProductCard(Product)                    
        })
        productList.innerHTML +=
        `<li style="margin:10px; height: auto;"> 
        <div class="product-separator">Pasteles</div>
        </li>`
        snapshot.forEach(
            function(Product){
                    if(Product.val().index != "pastel"){return}
                    generateProductCard(Product)                    
        })
        productList.innerHTML +=
        `<li style="margin:10px; height: auto;"> 
        <div class="product-separator">Sabores</div>
        </li>`
        snapshot.forEach(
            function(Product){
                    if(Product.val().index != "sabor"){return}
                    //get price for all products at their size options
                    generateProductCard(Product)                    
        })
        productList.innerHTML +=
        `<li style="margin:10px; height: auto;"> 
        <div class="product-separator">Varios</div>
        </li>`
        snapshot.forEach(
            function(Product){
                    if(Product.val().index != "varios"){return}
                    //get price for all products at their size options
                    generateProductCard(Product)                    
        })

        productList.innerHTML +=
        `<li style="margin:10px; height: auto;"> 
        <div class="product-separator">Bebidas</div>
        </li>`
        snapshot.forEach(
            function(Product){
                    if(Product.val().index != "bebidas"){return}
                    //get price for all products at their size options
                    generateProductCard(Product)                    
        })

        productList.innerHTML +=
        `<li style="margin:10px; height: auto;"> 
        <div class="product-separator">PROMOS</div>
        </li>`
        snapshot.forEach(
            function(Product){
                    if(Product.val().index != "promos"){return}
                    //get price for all products at their size options
                    generateProductCard(Product)                    
        })
       
        
      })
}

function renderOrderedItems(){
    document.getElementById("product-order").innerHTML = ""
    document.getElementById("change-order-items").innerHTML = ""
    Object.entries(itemsOrdered).forEach(val =>{
        let item = val[0]
        let cant = val[1]
        document.getElementById("product-order").innerHTML += 
            `<li class="selected-product" style="display: flex; width:auto;">
                <div style="width: 60%; padding-left: 10px; font-weight: bold; font-size:14px">${item}</div>
                <div style="width: 30px; font-weight: bold; font-size:14px">${cant}x</div>
                <div style="width: 40px; text-align: right; padding-right: 5px; font-size:14px">$ ${productPrices[item]}</div>
            </li>`
        document.getElementById("change-order-items").innerHTML += 
            `<li style="margin: 4px; padding: 0px; height: 20px; text-align: left; display: flex;">
                            <div style="width: 85%;">${item}</div>
                            <div style="width: 10%;">x${cant}</div>
            </li>`
    })
}
//If card is clicked, add product to temp order
function addItemToOrder(id,size) {
    //orderIndex will be used to be able to subtract items in the order they were added
    orderIndexes.push(id+"_"+size)

    //Check if size for product exists
    if(productPrices[id+"_"+size]==null)
        return

    //check if produc already in order, to increase qty only if so
    if(itemsOrdered[id+"_"+size] == null){
        itemsOrdered[id+"_"+size] = 1
    }
    else{
        itemsOrdered[id+"_"+size] = itemsOrdered[id+"_"+size] + 1
    }

    //increase order total cost by product clicked price
    orderTotal += productPrices[id+"_"+size]
    document.getElementById("order-total").textContent = orderTotal
    document.getElementById("change-order-total").textContent = orderTotal

    //render product in order list
    renderOrderedItems()
}

function removeLastItem(){
    //check if order is empty
    if(orderIndexes.length < 1){
        alert("Orden vacia")
        return
    }
    //last item added is the last one in order array
    let lastItem = orderIndexes[orderIndexes.length-1]

    //substract last items price from order total
    orderTotal = orderTotal - productPrices[lastItem]
    //update total in view
    document.getElementById("order-total").textContent = orderTotal
    document.getElementById("change-order-total").textContent = orderTotal
    //subtract current item qty - 1 from order OBJECT, if current qty is 1, remove item from object
    if(itemsOrdered[lastItem] == 1){
        //instead of leaving item with qty = 0, remove from list
        delete itemsOrdered[lastItem]
    }else{
        itemsOrdered[lastItem] = itemsOrdered[lastItem] - 1
    }
    //remove last item from ARRAY
    orderIndexes.pop(orderIndexes.length)

    //re-render items ordered list
    renderOrderedItems()
}
//create sale record with timestamp, products sold and order total
function registerSales(method){
    //protection to not register empty sales
    if(orderIndexes.length < 1){
        alert("Orden vacia")
        return
    }
    //user must confirm if data is correct
    if(true){
        localStorage.myArray = JSON.stringify(itemsOrdered)
        localStorage.setItem("orderTotal",orderTotal);

        let dateFormatedID = year+month+String(new Date().getDate()).padStart(2,'0').replace(/\D/g,'')+new Date().toTimeString().replace(/\D/g,'');;
        //Example of format YYYYMMDDHHMMSSmmmm
        let TimeStamp = String(new Date()).substring(16,24);
        let sale_year = new Date().getFullYear();
        let sale_month = (new Date().getMonth()+1);
        
        try{
            salesMade[String(dateFormatedID)] = {
                Time: TimeStamp,
                Items: itemsOrdered,
                Total: orderTotal,
                Method: method,
                Seller: localStorage.getItem('USER'),
                Cached: true
            }
            localStorage.salesMade = JSON.stringify(salesMade);


            set(ref(db,'Sales/'+sale_year+"/"+sale_month+"/"+ dateFormatedID),{
                Time: TimeStamp,
                Items: itemsOrdered,
                Total: orderTotal,
                Method: method,
                Seller: localStorage.getItem('USER')
            });

            set(ref(db,'SalesMigrated/'+sale_year+"/"+sale_month+"/"+String(new Date().getDate()).padStart(2,'0')+'/'+dateFormatedID),{
                Time: TimeStamp,
                Items: itemsOrdered,
                Total: orderTotal,
                Method: method,
                Seller: localStorage.getItem('USER')
            });

            console.log("No need to cache")
            //deductFromInventory()
        }
        catch(error){
            console.log(error)
            resetOrder()
        }

        //saves current order to memory to pass to receipt html page
        try{
            localStorage.cachedSaleID = JSON.stringify(pendingSalesCache)
        }
        catch(error){
            resetOrder()
        }
        
        //if user wants receipt will be redirected, data is already in memory for fast load
        if(document.getElementById('receipt-confirm').checked == true){
            document.getElementById('receipt-confirm').checked = false
            let duration = 10
            location.href = "receipt.html?duration="+duration
        }
        resetOrder()

   
    }


}

//on sale, deduct ordered qty from inventory
function deductFromInventory(){
    //go product by product on sale
    for (const itemsOrderedArray of Object.entries(itemsOrdered)) {
        let item = String(itemsOrderedArray[0]).split('_')[0]
        let size = String(itemsOrderedArray[0]).split('_')[1]
        let qtyOrdered = itemsOrderedArray[1]
        //get current item recipe items
        get(child(ref(db),'Products/'+item+"/"+size+'/recipe/')).then((snapshot) => {
            //for each recipe item
            snapshot.forEach(
                function(Child){
                    let recipeQty = Child.val()

                    get(child(ref(db),'Inventory/'+Child.key+'/')).then((snapshot) => {
                        set(ref(db,'Inventory/'+Child.key+"/"),{
                            Cantidad: Number(snapshot.val().Cantidad) - qtyOrdered*recipeQty
                        }); //end of set
                    })//end of get
                })//end of for each function
        }) //end of promise
    } //end of for
}//end of deductFromInventory fucntion

function getCorte(){
    if(!confirm("Seguro que quieres cerrar corte?")){
        return
    }

    let EfectivoEnCaja = prompt("Ingresa cuanto efectivo hay en caja:")
    if(EfectivoEnCaja == ""){
        alert("Favor de ingresar cuanto hay en caja")
        return
    }
    
    //TODO: need to do a sweep of expenses and subtract from cash total
    let fromDateVal = date[3]+"-"+month.slice(-2)+"-"+date[2]  //from Date is today
    let toDateVal =  date[3]+"-"+month.slice(-2)+"-"+date[2]  //to Date is today
    let fromDate = String(fromDateVal).replace(/-/g,"")
    let toDate = String(toDateVal).replace(/-/g,"")
    let fromDateSerial = Number(fromDate.replace(/-/g,""))
    let toDateSerial = Number(toDate.replace(/-/g,""))
   
    get(child(ref(db),`SalesMigrated/${new Date().getFullYear()}/${new Date().getMonth()+1}/${String(new Date().getDate()).padStart(2,'0')}`)).then((sales) => {
        //sets sum to zero
        let salesTotal = 0;
        let salesTotalCash = 0;
        let salesTotalCard = 0;
        let gastosTotal = 0;

        sales.forEach(
            function(sale){
                let saleDate = Number(sale.key.substring(0,8))    
                salesTotal += sale.val().Total
                if(sale.val().Method == 'cash'){ salesTotalCash += sale.val().Total }
                if(sale.val().Method == 'card'){ salesTotalCard += sale.val().Total } 
        })

        console.log(salesTotal,salesTotalCash,salesTotalCard)

        get(child(ref(db),'Gastos/')).then((snapshot) => {
            snapshot.forEach(
            function(year){
                year.forEach(
                    function(month){
                        gastosTotal = 0
                        month.forEach(
                            function(gasto){
                                let saleDate = Number(gasto.key.substring(0,8))    
                                
                                if(saleDate >= fromDateSerial && saleDate <= toDateSerial){
                                    console.log("Gasto: ",gasto.val().Total)
                                    gastosTotal += gasto.val().Total
                                }
                            
                            })
                    })            
            })

        try{

        get(child(ref(db),'Cortes/'+new Date().getFullYear()+"/"+(new Date().getMonth()+1)+"/"+ day+"/Mat")).then(function(data){
            window.pastCorte = data.val();
            if(pastCorte == undefined){

                console.log("Corte Mat")
                //adds record of when corte was done and total in that moment
                set(ref(db,'Cortes/'+new Date().getFullYear()+"/"+(new Date().getMonth()+1)+"/"+day+"/Mat"),{
                    Time: String(new Date()).substring(16,24),
                    Total: salesTotal,
                    Efectivo: salesTotalCash,
                    Tarjeta: salesTotalCard,
                    Gastos: -Number(gastosTotal),
                    Restante: (Number(salesTotalCash) + Number(gastosTotal)),
                    EfectivoCaja: Number(EfectivoEnCaja),
                    Diff: (Number(EfectivoEnCaja) - ((Number(salesTotalCash) + Number(gastosTotal))))
                });

                alert(
                    "Corte \n\n"+
                    "Total: " + (Number(salesTotal))+'\n'+
                    "Efectivo: " + Number(salesTotalCash)+'\n'+
                    "Tarjeta: " + Number(salesTotalCard)+'\n\n'+
                    "Gastos: " + (-Number(gastosTotal))+'\n\n'+
                    "Efectivo restante: " + ((Number(salesTotalCash) + Number(gastosTotal)))+'\n\n'+
                    "Efectivo en caja: " + Number(EfectivoEnCaja) +'\n\n'+
                    "Differencia: "+ (Number(EfectivoEnCaja) - ((Number(salesTotalCash) + Number(gastosTotal))))
                )
                
                
                
            }
            else{
                console.log("Corte Vesp")

                set(ref(db,'Cortes/'+new Date().getFullYear()+"/"+(new Date().getMonth()+1)+"/"+day+"/Vesp"),{
                    Time: String(new Date()).substring(16,24),
                    Total: (Number(salesTotal) - Number(pastCorte.Total)),
                    Efectivo: (Number(salesTotalCash) - Number(pastCorte.Efectivo)),
                    Tarjeta: (Number(salesTotalCard) - Number(pastCorte.Tarjeta)),
                    Gastos: (-Number(gastosTotal) - Number(pastCorte.Gastos)),
                    Restante: (Number(salesTotalCash) - Number(pastCorte.Efectivo)) - ((-Number(gastosTotal) - Number(pastCorte.Gastos))),
                    EfectivoCaja: Number(EfectivoEnCaja),
                    Diff: (Number(EfectivoEnCaja) - ((Number(salesTotalCash) - Number(pastCorte.Efectivo)) - ((-Number(gastosTotal) - Number(pastCorte.Gastos)))))
                });   

                alert(
                    "Corte \n\n"+
                    "Total: " + (Number(salesTotal) - Number(pastCorte.Total))+'\n'+
                    "Efectivo: " + (Number(salesTotalCash) - Number(pastCorte.Efectivo))+'\n'+
                    "Tarjeta: " + (Number(salesTotalCard) - Number(pastCorte.Tarjeta))+'\n\n'+
                    "Gastos: " + (-Number(gastosTotal) - Number(pastCorte.Gastos))+'\n\n'+
                    "Efectivo restante: " + ((Number(salesTotalCash) - Number(pastCorte.Efectivo)) - ((-Number(gastosTotal) - Number(pastCorte.Gastos))))+'\n\n'+
                    "Efectivo en caja: " + Number(EfectivoEnCaja) +'\n\n'+
                    "Differencia: "+ (Number(EfectivoEnCaja) - ((Number(salesTotalCash) - Number(pastCorte.Efectivo)) - ((-Number(gastosTotal) - Number(pastCorte.Gastos)))))
                )
                
                    
                

                
            }
            
        });
        }catch(error){
            console.log("no hay corte previo")
        }        
        
        })
    })

    
}

function resetOrder() {
    //resets data
    itemsOrdered = {}
    orderIndexes = []
    orderTotal = 0

    //upadates view
    document.getElementById("order-total").textContent = orderTotal
    document.getElementById("change-order-total").textContent = orderTotal

    document.getElementById("change-order-items").textContent = ""
    document.getElementById("product-order").innerHTML = ""
    document.getElementById("product-order").innerHTML = ""
    document.getElementById("change-total").innerHTML = ""
    document.getElementById("change-confirm").style.visibility = 'hidden'
}

function fixScript() {
    console.log('fixing')
    get(child(ref(db),'SalesMigrated/2024/9/21')).then((sales) => {
        
        sales.forEach((sale)=>{
            let string1 = sale.key
            let fixedArray = String(string1).split('092')
            let string2 = fixedArray[0]+'0902'+fixedArray[1]
            console.log(string1,string2)
            
            set(ref(db,'SalesMigrated/2024/9/02/'+string2),{
                Time: sale.val().Time,
                Items: sale.val().Items,
                Total: sale.val().Total,
                Method: sale.val().Method,
                Seller: 'Vero'
            });
        } 
        ) 
    })
}


window.registerSales = registerSales;
window.renderAllProductCards = renderAllProductCards;
window.addItemToOrder = addItemToOrder;
window.resetOrder = resetOrder;
window.removeLastItem = removeLastItem;
window.getCorte = getCorte;

