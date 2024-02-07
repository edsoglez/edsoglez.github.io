import {getDatabase, set, get, update, remove, ref, child, onValue} from "https://www.gstatic.com/firebasejs/10.3.1/firebase-database.js"; 
window.itemRef = ref(db,'Items/');
window.transRef = ref(db,'Transactions/');
window.prodRef = ref(db,'Products/');
let UOM = "";
window.productPrices = {}
window.itemsOrdered = {}
let orderTotal = 0;

get(child(ref(getDatabase()), `Products/`)).then((snapshot) => {
    snapshot.forEach(
        function(Child){
                productPrices[Child.key] = Child.val().price
                document.getElementById("product-list").innerHTML +=
                `<li id="${Child.key}" class="product-list-item" onclick="addItemToOrder(this.id)">
                    <div class="product-item" id="Frappe">
                        <img width="100%" height="80%" style="object-fit: cover; border-top-left-radius: 10px; border-top-right-radius: 10px;" src="${Child.val().imgURL}" alt="">
                        <h5 style=" font-size: 12px">${Child.key}</h5>
                        <div></div>
                    </div>
                </li>`
    })
  })

function addItemToOrder(id) {
    if(itemsOrdered[id] == null)
        itemsOrdered[id] = 1
    else
        itemsOrdered[id] = itemsOrdered[id] + 1

    orderTotal += productPrices[id]
    document.getElementById("order-total").textContent = orderTotal

    document.getElementById("product-order").innerHTML += 
    `<li class="selected-product" style="display: flex;">
        <div style="width: 70%; padding-left: 10px; font-weight: bold;">${id}</div>
        <div style="width: 40px; text-align: right; padding-right: 10px;">$ ${productPrices[id]}</div>
    </li>`
    console.log(itemsOrdered)
}

function registerSales(){

}

function deductFromInventory(){
    /*
    Steps: (seudo algo)
        -Get all products ordered
            -for each product
            -get(product recipe items)
                -foreach item
                -get(current item inv qty)
                    -update(current item invQty - recipeQty*productQty)
    */

    for (const itemsOrderedArray of Object.entries(itemsOrdered)) {
        console.log(itemsOrderedArray[0],itemsOrderedArray[1]);
        let item = itemsOrderedArray[0]
        let qtyOrdered = itemsOrderedArray[1]

        get(child(ref(db),'Products/'+item+'/recipe/')).then((snapshot) => {
            snapshot.forEach(
                function(Child){
                    let recipeQty = Child.val()
                    console.log("Deduct: ",recipeQty*qtyOrdered, "from", Child.key)

                    get(child(ref(db),'Inventory/'+Child.key+'/')).then((snapshot) => {
                        set(ref(db,'Inventory/'+item+"/"),{
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

window.addItemToOrder = addItemToOrder;
window.resetOrder = resetOrder;



