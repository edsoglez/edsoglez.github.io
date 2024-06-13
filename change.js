function calculateChange(bill){
    if(bill<orderTotal){
        document.getElementById('change-total').innerText = `No alcanza`
        return
    }
    document.getElementById('change-total').innerText = `$ ${Number(bill)-Number(orderTotal)}`
}
window.calculateChange = calculateChange;