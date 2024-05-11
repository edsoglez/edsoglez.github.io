import {getDatabase, set, get, update, remove, ref, child, onValue} from "https://www.gstatic.com/firebasejs/10.3.1/firebase-database.js"; 
window.prodRef = ref(db,'Products/');

let productsList = document.getElementById("products-list")

productsList.innerHTML = ""

get(child(ref(getDatabase()), `Products/`)).then((products) => {
        products.forEach((product)=>{
            productsList.innerHTML +=
            `<li style="margin:10px; height: auto; text-align: left" id="${product.key}"> 
            <div class="product">
                <div>${product.key}</div>
            </div>
            </li>` 
        }
    )
})