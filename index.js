const shoppingListEl = document.getElementById("shopping-list")


//realtime listener
db.collection("messages").orderBy("id").onSnapshot(snapshot => {
    let changes = snapshot.docChanges();
    changes.forEach(change => {
        
        console.log(change)
        if(change.type == 'added'){
            renderBook(change.doc);
        }
        if(change.type == 'modified'){
            renderBook(change.doc);
        }
    });
})


function renderBook(doc){
    let li = document.createElement('li')

    let text = document.createElement('li')
    let cantidad = document.createElement('li')
    let urgente = document.createElement('li')

    li.setAttribute('data-id',doc.data().id)

    text.classList.add('item')
    cantidad.classList.add('cantidad')
    urgente.classList.add('urgencia')

    urgente.textContent = "_"
    text.textContent = doc.data().text
    cantidad.textContent = doc.data().cantidad
        
    if (doc.data().cantidad == 0 ){ urgente.classList.add('zero') } 
    else{   if (doc.data().urgente == true){ urgente.classList.add('urgente') }
            else{ urgente.classList.add('non')} 
        }

        
    li.appendChild(text) 
    li.appendChild(cantidad)
    li.appendChild(urgente)
        
    shoppingListEl.append(li)    
 
    text.addEventListener("click", () => {
        db.collection("messages").doc(doc.id).update({
        cantidad : 0,
        urgente:false,
        }) 
        console.log("updated cantidad to 0")});
    
    cantidad.addEventListener("click", () => {
        const curCant=doc.data().cantidad
        const newCant=curCant+1
        db.collection("messages").doc(doc.id).update({
            cantidad: newCant
        })
        console.log("updated cantidad")});
    
    urgente.addEventListener("click", () => {
        if(doc.data().urgente==true){
            db.collection("messages").doc(doc.id).update({
            urgente: false
            }) }    
        else{
            db.collection("messages").doc(doc.id).update({
            urgente: true,
        }) }    
        console.log("updated urgencia")});

    

    
};
