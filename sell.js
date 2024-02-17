import {getDatabase, set, get, update, remove, ref, child, onValue} from "https://www.gstatic.com/firebasejs/10.3.1/firebase-database.js"; 
window.itemRef = ref(db,'Items/');
window.transRef = ref(db,'Transactions/');
window.prodRef = ref(db,'Products/');
let UOM = "";
window.productPrices = {}

window.itemsOrdered = {}
let orderTotal = 0;
window.orderIndexes = []


let month = "0"+String(new Date().getMonth()+1)
let date = String(new Date()).split(" ")
let fromDateVal = date[3]+"-"+month.slice(-2)+"-"+date[2]  //to Date is today
let toDateVal =  date[3]+"-"+month.slice(-2)+"-"+date[2]  //to Date is today


renderCards()

//Render all product cards
function renderCards(){
    document.getElementById("product-list").innerHTML = ""
    get(child(ref(getDatabase()), `Products/`)).then((snapshot) => {
        snapshot.forEach(
            function(Product){
                    //get price for all products at their size options
                    Product.forEach(
                        function(Size){
                            if(Size.key=="CH"||Size.key=="M"||Size.key=="G")
                            productPrices[Product.key+"_"+Size.key] = Size.val().price
                    })
                    localStorage.products = JSON.stringify(productPrices);

                    if(Product.val().G){
                        if(Product.val().M){
                            document.getElementById("product-list").innerHTML +=
                            `<li id="${Product.key}" class="product-list-item">
                                <div style="display:flex; flex-direction:row;">
                                <div class="product-item">
                                    <img class="product-image" src="${Product.val().imgURL}" alt="" style="z-indez: 0">
                                    <h5 style=" font-size: 24px; font-weight: bolder; height:0px; padding:2px; transform: translateY(-70px); color: white; -webkit-text-stroke: 1px black; text-align: left">${Product.key}</h5>   
                                    <div style="width:100%; heigh:50px">
                                            <button class="size-button" onClick="addItemToOrder('${Product.key}','CH');" >CH</button>
                                            <button class="size-button" onClick="addItemToOrder('${Product.key}','M');" >M</button>
                                            <button class="size-button" onClick="addItemToOrder('${Product.key}','G');" >G</button>
                                    <div>
                                    
                                </div>
                                </div>
                            </li>`
                        }
                        else{
                            document.getElementById("product-list").innerHTML +=
                            `<li id="${Product.key}" class="product-list-item">
                                <div style="display:flex; flex-direction:row;">
                                <div class="product-item">
                                    <img class="product-image" src="${Product.val().imgURL}" alt="">
                                    <h5 style=" font-size: 24px; font-weight: bolder; height:0px; padding:2px; transform: translateY(-70px); color: white; -webkit-text-stroke: 1px black;">${Product.key}</h5>   
                                    <div style="width:100%; heigh:50px">
                                            <button class="size-button" onClick="addItemToOrder('${Product.key}','CH');" style="width: 45%">CH</button>
                                            <button class="size-button" onClick="addItemToOrder('${Product.key}','G');"style="width: 45%" >G</button>
                                    <div>
                                    
                                </div>
                                </div>
                            </li>`
                        }
                        
                    }
                    else{
                        document.getElementById("product-list").innerHTML +=
                            `<li id="${Product.key}" class="product-list-item">
                                <div style="display:flex; flex-direction:row;">
                                <div class="product-item">
                                    <img class="product-image" src="${Product.val().imgURL}" alt="">
                                    <h5 style=" font-size: 24px; font-weight: bolder; height:0px; padding:2px; transform: translateY(-70px); color: white; -webkit-text-stroke: 1px black;">${Product.key}</h5>   
                                    <div style="width:100%; heigh:50px">
                                            <button class="size-button" onClick="addItemToOrder('${Product.key}','CH');" style="width: 95%">CH</button>
                                    <div>
                                    
                                </div>
                                </div>
                            </li>`
                    }
                    
                    
                    
                    
        })
        console.log(productPrices)
      })
}

function renderOrderedItems(){
    document.getElementById("product-order").innerHTML = ""
    Object.entries(itemsOrdered).forEach(val =>{
        console.log(val[0], val[1], productPrices[val[0]])
        document.getElementById("product-order").innerHTML += 
            `<li class="selected-product" style="display: flex; width:auto;">
                <div style="width: 59%; padding-left: 10px; font-weight: bold;">${val[0]}</div>
                <div style="width: 30px; font-weight: bold;">${val[1]}x</div>
                <div style="width: 40px; text-align: right; padding-right: 5px;">$ ${productPrices[val[0]]}</div>
            </li>`
    })
}

function removeLastItem(){
    console.log(orderIndexes)
    if(orderIndexes.length < 1){
        alert("Orden vacia")
        return
    }

    console.log(itemsOrdered)
    console.log(orderIndexes)

    let lastItem = orderIndexes[orderIndexes.length-1]
    orderTotal = orderTotal - productPrices[lastItem]
    document.getElementById("order-total").textContent = orderTotal
    //subtract current item qty - 1 from object, if current qty is 1, remove item from object
    if(itemsOrdered[lastItem] == 1){
        delete itemsOrdered[lastItem]
    }else{
        itemsOrdered[lastItem] = itemsOrdered[lastItem] - 1
    }

    orderIndexes.pop(orderIndexes.length)

    console.log(itemsOrdered)
    console.log(orderIndexes)
    renderOrderedItems()
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

    //render product in order list
    console.log(itemsOrdered)
    renderOrderedItems()
}

function getCorte(){
    let fromDate = String(fromDateVal).replace(/-/g,"")
    let toDate = String(toDateVal).replace(/-/g,"")
    let fromDateSerial = Number(fromDate.replace(/-/g,""))
    let toDateSerial = Number(toDate.replace(/-/g,""))

    get(child(ref(db),'Sales/')).then((snapshot) => {
        let salesTotal = 0;
        let salesTotalCash = 0;
        let salesTotalCard = 0;


        snapshot.forEach(
        function(year){
            year.forEach(
                function(month){
                    month.forEach(
                        function(sale){
                            let saleDate = Number(sale.key.substring(0,8))    
                            

                            if(saleDate >= fromDateSerial && saleDate <= toDateSerial){
                                salesTotal += sale.val().Total
                    

                                if(sale.val().Method == 'cash'){
                                    salesTotalCash += sale.val().Total
                                }
                                    
                                if(sale.val().Method == 'card'){
                                    salesTotalCard += sale.val().Total
                                }
                            
                                
                            }
                        
                        }
                    )
                }
            )            
        })
        alert(
            "Total: "+salesTotal+'\n'+
            "Efectivo: "+salesTotalCash+'\n'+
            "Tarejta: "+salesTotalCard+'\n'
        )

        

        print()
        set(ref(db,'Cortes/'+new Date().getFullYear()+"/"+(new Date().getMonth()+1)+"/"+ new Date().toISOString().replace(/\D/g,'_')),{
            Time: String(new Date()).substring(16,24),
            Total: salesTotal,
            Efectivo: salesTotalCash,
            Tarjeta: salesTotalCard
        });
        location.href = "index.html"
    })

}

//create sale record with timestamp, products sold and order total
function registerSales(method){
    localStorage.myArray = JSON.stringify(itemsOrdered);
    localStorage.setItem("orderTotal",orderTotal);

    if(orderIndexes.length < 1){
        alert("Orden vacia")
        return
    }

    console.log(new Date().toISOString().replace(/\D/g,''))
    set(ref(db,'Sales/'+new Date().getFullYear()+"/"+(new Date().getMonth()+1)+"/"+ new Date().toISOString().replace(/\D/g,'')),{
        Time: String(new Date()).substring(16,24),
        Items: itemsOrdered,
        Total: orderTotal,
        Method: method
    });

    if(confirm("Necesita recibo?")){
        location.href = "receipt.html"
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
                    console.log("Deduct: ",recipeQty*qtyOrdered, "from", Child.key)

                    get(child(ref(db),'Inventory/'+Child.key+'/')).then((snapshot) => {
                        set(ref(db,'Inventory/'+Child.key+"/"),{
                            Cantidad: Number(snapshot.val().Cantidad) - qtyOrdered*recipeQty
                        });
                    })
                    
                }
            )
        })

    }
}

function resetOrder(paymentMethod) {
    if(orderIndexes.length < 1){
        alert("Orden vacia")
        return
    }

    if(paymentMethod == "none"){
        itemsOrdered = {}
        orderTotal = 0
        orderIndexes = []
        document.getElementById("order-total").textContent = orderTotal
        document.getElementById("product-order").innerHTML = ""
        console.log(itemsOrdered)
        return
    }
    
    if(confirm(Object.entries(itemsOrdered).join('\n'))){
        registerSales(paymentMethod)
        deductFromInventory()
        //alert("Payed "+orderTotal+" with "+paymentMethod)
        itemsOrdered = {}
        orderIndexes = []
        orderTotal = 0
        document.getElementById("order-total").textContent = orderTotal
        document.getElementById("product-order").innerHTML = ""
        console.log(itemsOrdered)
    }
}
window.registerSales = registerSales;
window.renderCards = renderCards;
window.addItemToOrder = addItemToOrder;
window.resetOrder = resetOrder;
window.removeLastItem = removeLastItem;
window.getCorte = getCorte;

