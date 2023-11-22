//Import all JS dependencies and config database
import {initializeApp} from "https://www.gstatic.com/firebasejs/10.3.1/firebase-app.js";
import {getDatabase, set, get, update, remove, ref, child, onValue} from "https://www.gstatic.com/firebasejs/10.3.1/firebase-database.js"; 


const firebaseConfig = {
apiKey: "AIzaSyDb87oTfIXSDWFTmCwpoZ1hpjovJLtwDI0",
authDomain: "calesawebapp.firebaseapp.com",
databaseURL: "https://calesawebapp-default-rtdb.firebaseio.com",
projectId: "calesawebapp",
storageBucket: "calesawebapp.appspot.com",
messagingSenderId: "992390081249",
appId: "1:992390081249:web:6b5a47227f9546e64ae5a0"
}; 
// Initialize Firebases
const app = initializeApp(firebaseConfig);

window.db = getDatabase();    
window.itemRef = ref(db,'Items/');
window.userRef = ref(db,'Users/');

function increaseQty(id){
    alert(id)
}
