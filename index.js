const shoppingListEl = document.getElementById("shopping-list")


    db.collection("messages").orderBy("id").get().then((querySnapshot) => {        
    querySnapshot.forEach((doc) => {
        console.log(`${doc.id} => ${doc.data()}`);
        renderBook(doc);
    });
});



function renderBook(doc){
    let li = document.createElement('li')

    let text = document.createElement('li')
    let cantidad = document.createElement('li')
    let urgente = document.createElement('li')

    text.classList.add('item')
    cantidad.classList.add('cantidad')
    urgente.classList.add('urgencia')

    urgente.textContent = "_"
    text.textContent = doc.data().text
    cantidad.textContent = doc.data().cantidad
        
    if (doc.data().cantidad == 0 ){
        urgente.classList.add('zero')
    } 
    else{
        if (doc.data().urgente == true){
            urgente.classList.add('urgente')
        }
        else{
            urgente.classList.add('non')
        } 
    }
    
    cantidad.addEventListener("click", () => {
            db.collection("messages").doc(doc.id).set({
            categoria: doc.data().categoria,
            cantidad : doc.data().cantidad + 1,
            id: doc.data().id,
            text: doc.data().text,
            urgente: doc.data().urgente,
        }) 
        
        console.log("success")
    });

    urgente.addEventListener("click", () => {
    if(doc.data().urgente==true){
        db.collection("messages").doc(doc.id).set({
        categoria: doc.data().categoria,
        cantidad : doc.data().cantidad,
        id: doc.data().id,
        text: doc.data().text,
        urgente: false,
        }) }    
    else{
        db.collection("messages").doc(doc.id).set({
            categoria: doc.data().categoria,
            cantidad : doc.data().cantidad,
            id: doc.data().id,
            text: doc.data().text,
            urgente: true,
            }) 
    }    
    
    console.log("success")
});

    li.appendChild(text) 
    li.appendChild(cantidad)
    li.appendChild(urgente)
    
    shoppingListEl.append(li)
};

