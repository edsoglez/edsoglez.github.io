import {getDatabase, set, get, update, remove, ref, child, onValue} from "https://www.gstatic.com/firebasejs/10.3.1/firebase-database.js"; 
window.itemRef = ref(db,'Items/');
window.transRef = ref(db,'Transactions/');
window.prodRef = ref(db,'Products/');
let UOM = "";
window.productPrices = {}
window.itemsOrdered = {}
let orderTotal = 0;

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

                    if(Product.val().G){
                        if(Product.val().M){
                            document.getElementById("product-list").innerHTML +=
                            `<li id="${Product.key}" class="product-list-item">
                                <div style="display:flex; flex-direction:row;">
                                <div class="product-item">
                                    <img class="product-image" src="${Product.val().imgURL}" alt="">
                                    <h5 style=" font-size: 24px; font-weight: bolder; height:0px; padding:2px; transform: translateY(-70px); color: white; -webkit-text-stroke: 1px black;">${Product.key}</h5>   
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

//If card is clicked, add product to temp order
function addItemToOrder(id,size) {
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
    document.getElementById("product-order").innerHTML += 
    `<li class="selected-product" style="display: flex;">
        <div style="width: 55%; padding-left: 10px; font-weight: bold;">${id}</div>
        <div style="width: 30px; font-weight: bold;">${size}</div>
        <div style="width: 40px; text-align: right; padding-right: 5px;">$ ${productPrices[id+"_"+size]}</div>
    </li>`
    console.log(itemsOrdered)
}

//create sale record with timestamp, products sold and order total
function registerSales(method){
    set(ref(db,'Sales/'+new Date()+"/"),{
        Date: new Date(),
        Items: itemsOrdered,
        Total: orderTotal,
        Method: method
    });
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
    if(paymentMethod == "none"){
        itemsOrdered = {}
        orderTotal = 0
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



