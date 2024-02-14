import {getDatabase, set, get, update, remove, ref, child, onValue} from "https://www.gstatic.com/firebasejs/10.3.1/firebase-database.js"; 
window.itemRef = ref(db,'Items/');
window.transRef = ref(db,'Transactions/');
window.salesRef = ref(db,'Sales/');

let fromDateVal = document.getElementById('from-date')
let toDateVal = document.getElementById('to-date')
let salesTotalDisp = document.getElementById('sales-total')
let salesTotalCashDisp = document.getElementById('sales-total-cash')
let salesTotalCardDisp = document.getElementById('sales-total-card')
let salesList = document.getElementById('sales-list')


fromDateVal.value = "2024-02-01"
toDateVal.value =  "2024-02-29"

fromDateVal.addEventListener('change',()=>{
    console.log(fromDateVal.value,toDateVal.value)
})
toDateVal.addEventListener('change',()=>{
    console.log(fromDateVal.value,toDateVal.value)
})


onValue(salesRef,(snapshot)=>{
    let salesTotal = 0;
    let salesTotalCash = 0;
    let salesTotalCard = 0;
    salesList.innerHTML = ""
    snapshot.forEach(
    function(year){
        year.forEach(
            function(month){
                month.forEach(
                    function(sale){
                        salesTotal += sale.val().Total
                        if(sale.val().Method == 'cash'){
                            salesTotalCash += sale.val().Total
                        }
                            
                        if(sale.val().Method == 'card'){
                            salesTotalCard += sale.val().Total
                        }
                            
                        salesTotalDisp.innerHTML = "$ "+ salesTotal
                        salesTotalCashDisp.innerHTML = "$ "+ salesTotalCash
                        salesTotalCardDisp.innerHTML = "$ "+ salesTotalCard
                        salesList.innerHTML += `
                            <li class="sale-item-li">
                                <div class="sale-item-div" style="">
                                    <div style="width: 30%; text-align: left;">${String(sale.key).substring(4, 10)}</div>
                                    <div style="width: 30%; text-align: left;">${String(sale.key).substring(16,24)}</div>
                                    <div style="width: 5%"; text-align: right>$</div>
                                    <div style="width: 15%"; text-align: left>${+sale.val().Total}</div>
                                    <div style="width: 20%"; text-align: left>${sale.val().Method}</div>
                                <div>
                            </li>
                        `
                    }
                )
            }
        )            
    })
})