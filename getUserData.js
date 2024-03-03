import {getDatabase, set, get, update, remove, ref, child, onValue} from "https://www.gstatic.com/firebasejs/10.3.1/firebase-database.js"; 
window.usersRef = ref(db,'Users/');

onValue(userRef,(userdata)=>{
    userdata.forEach(
        function(user){
            console.log(user.key,user.val().image)

            let profile_img

            if(user.val().image == undefined){
                console.log(user.key, "image not found")
                profile_img = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
            } 
            else{
                console.log(user.key, "image found")
                profile_img  = user.val().image
            }

            document.getElementById('user-list').innerHTML += `
            <li class="user-li">
                <div style="display: flex; align-items: center; gap: 20px">
                    <img class="user-image" src="${profile_img}">
                    <div style="width: 100%; font-size: 20px">${user.key}</div>
                    <div style="width: auto;font-size: 20px">
                        <a href="user.html?editUser=${user.key}">Edit</a>
                    </div>
                </div>
            </li>
            `
    
        } 
    )
})