import {getDatabase, set, get, update, remove, ref, child, onValue} from "https://www.gstatic.com/firebasejs/10.3.1/firebase-database.js"; 
window.itemRef = ref(db,'Items/');
window.transRef = ref(db,'Transactions/');
window.prodRef = ref(db,'Products/');
let UOM = "";

get(child(ref(getDatabase()), `Products/`)).then((snapshot) => {
    snapshot.forEach(
        function(Child){

        
                document.getElementById("product-list").innerHTML +=
                `<li id="${Child.key}" class="product-list-item">
                    <div class="product-item" id="Frappe">
                        <img width="100%"  height="80%" style="border-top-left-radius: 10px; border-top-right-radius: 10px;" src="https://i.blogs.es/25e8e5/como-preparar-frappe-de-cafe-con-moka-estilo-starbucks-su-sabor-y-rapidez-te-encantaran/1366_2000.jpg" alt="">
                        <h5>Frappe Natural</h5>
                        <div></div>
                    </div>
                </li>`

            

    })
  })



