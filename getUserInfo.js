import {getDatabase, set, get, update, remove, ref, child, onValue} from "https://www.gstatic.com/firebasejs/10.3.1/firebase-database.js"; 
window.usersRef = ref(db,'Users/');

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const userID = urlParams.get('editUser')

document.getElementById("user-id").innerHTML = userID

onValue(userRef,()=>{
    get(child(ref(db),`/Users/${userID}`)).then((user)=>{
        user.forEach(permission => {
            
            try{
                let onOff = permission.val()
                document.getElementById(permission.key+"-toggle-container").innerHTML = `
                <button id="${permission.key}-toggle" class="toggle-${onOff==true? 'on':'off'}" onmousedown="
                    togglePermission('${userID}','${permission.key}',${permission.val()})                        
                ">
                    <div class="circle-push" id="${permission.key}-circle-push" style="visibility:${onOff==true?'visible':'hidden'}"></div>    
                    <div class="circle" id="${permission.key}-circle"></div>
                </button>`

                if(onOff == false){
                    document.getElementById(permission.key+'-circle-push').style.transition = '.2s'
                    document.getElementById(permission.key+'-circle-push').style.width = '2px'
                }
    
                document.getElementById(permission.key+"-button").innerHTML = " "+permission.val()
                
            }catch(e){
            }
    
        });
    })
})



function togglePermission(user, permission, currentState){

    get(child(ref(getDatabase()), `Users/${user}`)).then((snapshot) => {
        update(ref(db,'Users/'+user),{
            canAdd: (permission=="canAdd"? !currentState : snapshot.val().canAdd),
            canView: (permission=="canView"? !currentState : snapshot.val().canView) ,
            canEdit:(permission=="canEdit"? !currentState : snapshot.val().canEdit) ,
            canDelete:(permission=="canDelete"? !currentState : snapshot.val().canDelete),
            canBuy:(permission=="canBuy"? !currentState : snapshot.val().canBuy),
            canSell:(permission=="canSell"? !currentState : snapshot.val().canSell),
        });
    })

    
}

window.togglePermission = togglePermission;


