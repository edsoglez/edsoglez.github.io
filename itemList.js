import {getDatabase, set, get, update, remove, ref, child, onValue} from "https://www.gstatic.com/firebasejs/10.3.1/firebase-database.js"; 

//Test for multiple item
//console.log(USER); need to get USER varibale across all files from index
function Render(text,cantidad,urgente,id){
    
    let ul = document.getElementById("itemList");
    let _text = document.createElement('li');
    let _cantidad = document.createElement('li');
    let _urgente = document.createElement('li');
    

    _text.classList.add('item')
    _cantidad.classList.add('cantidad')
    _urgente.classList.add('urgencia')

    if (cantidad == 0 ){_urgente.classList.add('zero') } 
    else{   if (urgente == true){_urgente.classList.add('urgente') }
            else{_urgente.classList.add('non')} 
        }

    _text.innerHTML = text;
    _cantidad.innerHTML = cantidad;
    _urgente.innerHTML = '_';

    ul.appendChild(_text);
    ul.appendChild(_cantidad);
    ul.appendChild(_urgente);
    ul.append();

    _text.addEventListener("click", () => {
        
            update(ref(db,'Items/'+id),{
                Cantidad: 0,
                Urgente: false
            });
        
    });
    
    
    _cantidad.addEventListener("click", () => {
        update(ref(db,'Items/'+id),{
            Cantidad: cantidad + 1
        });
    });
    
    _urgente.addEventListener("click", () => {
        if(urgente==true){
            update(ref(db,'Items/'+id),{
            Urgente: false
        });
        }    
        else{
            update(ref(db,'Items/'+id),{
            Urgente: true
        });
        } 
    });
}

selectCategoria = document.querySelector("#selectCategoria");

selectCategoria.addEventListener('change', fakeUpdate)

function fakeUpdate(){

console.log(currentStatus)    
if(currentStatus){
    update(ref(db,'Items/Vaso Tp16'),{
        Fake: false
    });
    
}
else{
    update(ref(db,'Items/Vaso Tp16'),{
        Fake: true
    });
    
}
    

}


onValue(itemRef, (snapshot)=>{
        document.getElementById("itemList").innerHTML = "" // on change, reset to black and re-render
        snapshot.forEach(
            function(ChildSnapshot){
                let Text = ChildSnapshot.val().Text;
                let Cantidad = ChildSnapshot.val().Cantidad;
                let Urgente = ChildSnapshot.val().Urgente;
                let id = ChildSnapshot.val().id;


                if(ChildSnapshot.val().Text=="Vaso Tp16"){
                    window.currentStatus = ChildSnapshot.val().Fake;    
                }
                
                
                if(ChildSnapshot.val().Categoria==document.querySelector("#selectCategoria").value){
                Render(Text,Cantidad,Urgente,id);
                
                }
            }
        )
});



    