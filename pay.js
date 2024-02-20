import {getDatabase, set, get, update, remove, ref, child, onValue} from "https://www.gstatic.com/firebasejs/10.3.1/firebase-database.js"; 

function registerExpense(){
    let vendor = prompt("Proveedor/Concepto:")
        if(vendor==null ||vendor == ""){alert("Gasto no registrado"); return}
    let amount = prompt("Monto:")
        if(!isNumber(amount)){alert("Ingresaste un valor no numerico"); return}
        if(amount==null || amount == ""){alert("Gasto no registrado"); return}

    
    set(ref(db,'Gastos/'+new Date().getFullYear()+"/"+(new Date().getMonth()+1)+"/"+ new Date().toISOString().replace(/\D/g,'_')),{
        Time: String(new Date()).substring(16,24),
        Total: -Number(amount),
        Vendor: vendor
        });
}

function isNumber(value) {
    return typeof value === 'number';
}

window.registerExpense = registerExpense;