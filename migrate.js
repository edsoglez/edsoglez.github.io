//Import all JS dependencies and config database
import {initializeApp} from "https://www.gstatic.com/firebasejs/10.3.1/firebase-app.js";
import {getDatabase, set, get, update, remove, ref, child, onValue} from "https://www.gstatic.com/firebasejs/10.3.1/firebase-database.js"; 
/*
const firebaseConfig = {
    apiKey: "AIzaSyDAbNF2Ic7TsuWlR6e3-VwP9nQxcSIt4pc",
    authDomain: "fde-erp.firebaseapp.com",
    databaseURL: "https://fde-erp-default-rtdb.firebaseio.com",
    projectId: "fde-erp",
    storageBucket: "fde-erp.appspot.com",
    messagingSenderId: "718556271008",
    appId: "1:718556271008:web:c9aaf308fad668ae0014c5",
    measurementId: "G-62P8017H4W"
  };
const app2 = initializeApp(firebaseConfig);
window.db2= getDatabase(app2);
*/

let JSONVIEW = document.getElementById('JSONview')

get(child(ref(db),`Sales/2024/`)).then((Sales)=>{
    Sales.forEach(month => {
        month.forEach(sale=>{
            let day = String(sale.key).substring(6,8)
            console.log(month.key,day,sale.key)
            try{set(ref(db, 'SalesMigrated/2024/'+month.key+'/'+day+'/'+sale.key),{
                Time: sale.val().Time,
                Items: sale.val().Items,
                Total: sale.val().Total,
                Method: sale.val().Method,
                Seller: sale.val().Seller
            });}
            catch(e){
                set(ref(db, 'SalesMigrated/2024/'+month.key+'/'+day+'/'+sale.key),{
                    Time: sale.val().Time,
                    Items: sale.val().Items,
                    Total: sale.val().Total,
                    Method: sale.val().Method
                });
        }
        })
        
        
    });
})