import {getDatabase, set, get, update, remove, ref, child, onValue} from "https://www.gstatic.com/firebasejs/10.3.1/firebase-database.js"; 

function registerExpense(){
    let vendor = prompt("Proveedor/Concepto:")
        if(vendor==null ||vendor == ""){alert("Gasto no registrado"); return}
    let amount = Number(prompt("Monto:"))
        if(amount==null || amount == ""){alert("Gasto no registrado"); return}

    
    set(ref(db,'Gastos/'+new Date().getFullYear()+"/"+(new Date().getMonth()+1)+"/"+ new Date().toISOString().replace(/\D/g,'_')),{
        Time: String(new Date()).substring(16,24),
        Total: -amount,
        Vendor: vendor
        });
}

window.registerExpense = registerExpense;