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
                    
                    document.getElementById("product-list").innerHTML +=
                    `<li id="${Product.key}" class="product-list-item" onclick="getSizeOption(this.id);">
                        <div class="product-item">
                            <img width="100%" height="80%" style="object-fit: cover; border-top-left-radius: 10px; border-top-right-radius: 10px;" src="${Product.val().imgURL}" alt="">
                            <h5 style=" font-size: 12px">${Product.key}</h5>
                            <div></div>
                        </div>
                    </li>`
        })
        console.log(productPrices)
      })
}

function reRenderCard(item){

    get(child(ref(getDatabase()), `Products/${item}`)).then((snapshot) => {
        document.getElementById(item).innerHTML = 
        `<div class="product-item">
        <img width="100%" height="80%" style="object-fit: cover; border-top-left-radius: 10px; border-top-right-radius: 10px;" src="${snapshot.val().imgURL}" alt="">
        <h5 style=" font-size: 12px">${item}</h5>
        <div></div>
        </div>`
    })

    
    
}


function getSizeOption(item,imgURL){
    let productCard = document.getElementById(item)
    let originalState = productCard.innerHTML

    if(productPrices[item+"_M"]!=null){
        productCard.innerHTML = 
        `<li id="${item}" class="product-list-item" >
            <div class="product-item" id="Frappe">
                <button class="size-button" onClick="addItemToOrder('${item}','CH'); reRenderCard('${item}')" >CH</button>
                <button class="size-button" onClick="addItemToOrder('${item}','M'); reRenderCard('${item}')" >M</button>
                <button class="size-button" onClick="addItemToOrder('${item}','G'); reRenderCard('${item}')" >G</button>
            </div>
        </li>`
    }
    else{
        if(productPrices[item+"_G"]!=null){
            `<li id="${item}" class="product-list-item" >
            <div class="product-item" id="Frappe">
                <button class="size-button" onClick="addItemToOrder('${item}','CH'); reRenderCard('${item}')" >CH</button>
                <button class="size-button" onClick="addItemToOrder('${item}','M'); reRenderCard('${item}')" >G</button>
            </div>
            </li>`
        }
        else{
        productCard.innerHTML = 
            `<li id="${item}" class="product-list-item" >
                <div class="product-item" id="Frappe">
                    <button class="size-button" onClick="addItemToOrder('${item}','CH'); reRenderCard('${item}')" >CH</button>
                </div>
            </li>`
        }
    }

}

//If card is clicked, add product to temp order
function addItemToOrder(id,size) {
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
        <div style="width: 50%; padding-left: 10px; font-weight: bold;">${id}</div>
        <div style="width: 20%; padding-left: 10px; font-weight: bold;">${size}</div>
        <div style="width: 40px; text-align: right; padding-right: 10px;">$ ${productPrices[id+"_"+size]}</div>
    </li>`
    console.log(itemsOrdered)
}

//create sale record with timestamp, products sold and order total
function registerSales(){

}

//on sale, deduct ordered qty from inventory
function deductFromInventory(){
    //go product by product on sale
    for (const itemsOrderedArray of Object.entries(itemsOrdered)) {
        let item = itemsOrderedArray[0]
        let qtyOrdered = itemsOrderedArray[1]
        //get current item recipe items
        get(child(ref(db),'Products/'+item+'/recipe/')).then((snapshot) => {
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
    if(confirm(Object.entries(itemsOrdered).join('\n'))){
        deductFromInventory()
        //alert("Payed "+orderTotal+" with "+paymentMethod)
        itemsOrdered = {}
        
        orderTotal = 0
        document.getElementById("order-total").textContent = orderTotal
        document.getElementById("product-order").innerHTML = ""
        console.log(itemsOrdered)
    }
}

window.getSizeOption = getSizeOption;
window.renderCards = renderCards;
window.reRenderCard = reRenderCard;
window.addItemToOrder = addItemToOrder;
window.resetOrder = resetOrder;



