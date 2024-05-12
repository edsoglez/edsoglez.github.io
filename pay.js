import {getDatabase, set, get, update, remove, ref, child, onValue} from "https://www.gstatic.com/firebasejs/10.3.1/firebase-database.js"; 

function registerExpense(){
    let vendor = prompt("Proveedor/Concepto:")
        if(vendor==null ||vendor == ""){alert("Gasto no registrado"); return}
    let amount = Number(prompt("Monto:"))
        if(amount===NaN){alert("Ingresaste un valor no numerico"); return}
        if(amount==null || amount == ""){alert("Gasto no registrado"); return}

        let month = String(new Date().getUTCMonth()+1).padStart(2, '0')
        let date = String(new Date()).split(" ")
        let day = String(new Date().getDate()).padStart(2,'0')
        let year = new Date().getUTCFullYear()
        //on page load reset order to 0 and render product cards
        let dateFormatedID = year+month+day+new Date().toTimeString().replace(/\D/g,'');    //Example of format YYYYMMDDHHMMSS

    set(ref(db,'Gastos/'+new Date().getFullYear()+"/"+(new Date().getMonth()+1)+"/"+ dateFormatedID),{
        Time: String(new Date()).substring(16,24),
        Total: -Number(amount),
        Vendor: vendor
        });
}

function isNumber(value) {
    return typeof value === 'number';
}

window.registerExpense = registerExpense;