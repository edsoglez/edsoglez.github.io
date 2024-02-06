import {getDatabase, set, get, update, remove, ref, child, onValue} from "https://www.gstatic.com/firebasejs/10.3.1/firebase-database.js"; 
window.itemRef = ref(db,'Items/');
window.transRef = ref(db,'Transactions/');
window.prodRef = ref(db,'Products/');
let UOM = "";
window.items = {}

get(child(ref(getDatabase()), `Products/`)).then((snapshot) => {
    snapshot.forEach(
        function(Child){
                document.getElementById("product-list").innerHTML +=
                `<li id="${Child.key}" class="product-list-item">
                    <div class="product-item" id="Frappe">
                        <img width="100%" height="80%" style="object-fit: cover; border-top-left-radius: 10px; border-top-right-radius: 10px;" src="${Child.val().imgURL}" alt="">
                        <h5>${Child.key}</h5>
                        <div></div>
                    </div>
                </li>`

            

    })
  })




