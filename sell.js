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
                console.log(productPrices)

                document.getElementById("product-list").innerHTML +=
                `<li id="${Child.key}" class="product-list-item" onclick="addToOrder(this.id)">
                    <div class="product-item" id="Frappe">
                        <img width="100%" height="80%" style="object-fit: cover; border-top-left-radius: 10px; border-top-right-radius: 10px;" src="${Child.val().imgURL}" alt="">
                        <h5>${Child.key}</h5>
                        <div></div>
                    </div>
                </li>`

            

    })
  })

function addToOrder(id) {
    if(itemsOrdered[id] == null)
        itemsOrdered[id] = 1
    else
        itemsOrdered[id] = itemsOrdered[id] + 1

    orderTotal += productPrices[id]
    document.getElementById("order-total").textContent = orderTotal

    document.getElementById("product-order").innerHTML += 
    `<li class="selected-product" style="display: flex;">
        <div style="width: 80%;">${id}</div>
        <div style="width: 20%; text-align: right; padding-right: 20px;">$ ${productPrices[id]}</div>
    </li>`
    console.log(itemsOrdered)
}

function addOrderToDB(){
    
}

function resetOrder(method) {
    alert("Payed "+orderTotal+" with "+method)
    itemsOrdered = {}
    orderTotal = 0
    document.getElementById("order-total").textContent = orderTotal
    document.getElementById("product-order").innerHTML = ""
    console.log(itemsOrdered)
}

window.addToOrder = addToOrder;
window.resetOrder = resetOrder;



