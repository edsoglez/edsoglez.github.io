import {getDatabase, set, get, update, remove, ref, child, onValue} from "https://www.gstatic.com/firebasejs/10.3.1/firebase-database.js"; 
window.itemRef = ref(db,'Items/');
window.transRef = ref(db,'Transactions/');
window.salesRef = ref(db,'Sales/');

let fromDateVal = document.getElementById('from-date')
let toDateVal = document.getElementById('to-date')
let month = "0"+String(new Date().getMonth()+1)
let date = String(new Date()).split(" ")

let salesTotalDisp = document.getElementById('sales-total')
let salesTotalCashDisp = document.getElementById('sales-total-cash')
let salesTotalCardDisp = document.getElementById('sales-total-card')

let salesList = document.getElementById('sales-list')
let Months = {
    'Jan' : '01',
    'Feb' : '02',
    'Mar' : '03',
    'Apr' : '04',
    'May' : '05',
    'Jun' : '06',
    'Jul' : '07',
    'Aug' : '08',
    'Sep' : '09',
    'Oct' : '10',
    'Nov' : '11',
    'Dec' : '12',
}

onValue(salesRef,(snapshot)=>{
    renderSales(String(fromDateVal.value).replace(/-/g,""),String(toDateVal.value).replace(/-/g,""))
})

fromDateVal.value = date[3]+"-"+month.slice(-2)+"-01"       //from Date is start current month 
toDateVal.value =  date[3]+"-"+month.slice(-2)+"-"+date[2]  //to Date is today

renderSales(date[3]+"-"+month.slice(-2)+"-01",date[3]+"-"+month.slice(-2)+"-"+date[2]) //Default renders from current month day 1 to today

fromDateVal.addEventListener('change',()=>{
    renderSales(String(fromDateVal.value).replace(/-/g,""),String(toDateVal.value).replace(/-/g,""))
})
toDateVal.addEventListener('change',()=>{
    renderSales(String(fromDateVal.value).replace(/-/g,""),String(toDateVal.value).replace(/-/g,""))
})

function renderSales(fromDate,toDate){
    let lastUpdate = String(new Date()).substring(0,25)
    document.getElementById('last-update').innerHTML = lastUpdate

    console.log("Rendering sales from",fromDate.replace(/-/g,""),"to",toDate.replace(/-/g,"")) //SERIALIZE DATE TO LATER COMPARE GREATER AND LESS THAN
    let fromDateSerial = Number(fromDate.replace(/-/g,""))
    let toDateSerial = Number(toDate.replace(/-/g,""))

    get(child(ref(db),'Sales/')).then((snapshot) => {
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
                            let saleDate = Number(sale.key.substring(11,15) + Months[sale.key.substring(4,7)] + sale.key.substring(8,10) )
                            console.log(saleDate)

                            if(saleDate >= fromDateSerial && saleDate <= toDateSerial){
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
                        
                        }
                    )
                }
            )            
        })
    })
}
