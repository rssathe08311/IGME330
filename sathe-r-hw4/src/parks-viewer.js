/* #1 - The Firebase setup code goes here  - both imports, `firebaseConfig` and `app` */
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getDatabase, ref, set, push, onValue, increment, get, update } from  "https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyDrb8SOfvx6j82kI2jcSuPUb6CEbM0b4cc",
    authDomain: "high-scores-4c5c5.firebaseapp.com",
    projectId: "high-scores-4c5c5",
    storageBucket: "high-scores-4c5c5.appspot.com",
    messagingSenderId: "601384446851",
    appId: "1:601384446851:web:50198bc9cc699be71f24b6"
};
    
// Initialize Firebase
const app = initializeApp(firebaseConfig);
console.log(app); // make sure firebase is loaded

const favoritesList = document.querySelector("#favorite-tracker");

const parks = {
    "p79"   : "Letchworth State Park",
    "p20"   : "Hamlin Beach State Park",
    "p180"  : "Brookhaven State Park",
    "p35"   : "Allan H. Treman State Marine Park",
    "p118"  : "Stony Brook State Park",
    "p142"  : "Watkins Glen State Park",
    "p62"   : "Taughannock Falls State Park",
    "p84"   : "Selkirk Shores State Park",
    "p43"   : "Chimney Bluffs State Park",
    "p200"  : "Shirley Chisholm State Park",
    "p112"  : "Saratoga Spa State Park"
};

const getParkNameById = id => {
    return parks[id] || "Unknown Park";
};
  

export const writeFavNameData = (id, number) => {
    const db = getDatabase();
    const favRef = ref(db, 'favorites/' + id);
    set(favRef, {
      id,
      likes: increment(number)
    });



};

const favoritesChanged = (snapshot) => {
    if(favoritesList){
        //clears the list when it updates so that there are no repeats
        favoritesList.innerHTML = "";

        snapshot.forEach(favorite =>{
            const childKey = favorite.key;
            const childValue = favorite.val();

            if(childValue.likes > 0){
                favoritesList.innerHTML += `<li><b> ${getParkNameById(childKey)} (${childKey})</b> - Likes: ${childValue.likes}</li>`
            }
        })
    }
};

const init = () => {
    const db = getDatabase();
    const favoritesRef = ref(db, 'favorites/');
    onValue(favoritesRef,favoritesChanged);

};

init();