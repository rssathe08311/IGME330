import * as storage from "./storage.js"
// - load in the `items` array from storage.js and display the current items
let items = storage.readFromLocalStorage("items") || [];;


// I. declare and implement showItems()
// - this will show the contents of the items array in the <ol>
const showItems = () => {
  // loop though items and stick each array element into an <li>
  // use array.map()!
  // update the innerHTML of the <ol> already on the page
  let outputList = document.querySelector("#output-list");
  
  let listItems = items.map(item => `<li>${item}</li>`);
  
  outputList.innerHTML = `<ol>${listItems.join("")}</ol>`;
};

// II. declare and implement addItem(str)
// - this will add `str` to the `items` array (so long as `str` is length greater than 0)
let outputList = document.querySelector("#output-list");
const addItem = str => {
  if (str.length > 0) {
    items.push(str);
    storage.writeToLocalStorage("items", items);
  }
  console.log(items);
};


// Also:
// - call `addItem()`` when the button is clicked, and also clear out the <input>
// - and be sure to update .localStorage by calling `writeToLocalStorage("items",items)`
let add_button = document.querySelector("#btn-add");
add_button.onclick = () =>{
  let input = document.querySelector("#thing-text");
  let newItem = input.value;
  addItem(newItem);
  input.value = "";
  showItems()
}


// Got it working? 
// - Add a "Clear List" button that empties the items array
let clear_button = document.querySelector("#btn-clear");
clear_button.onclick = () =>{
  items = [];
  storage.writeToLocalStorage("items", items);
  showItems();
}


// When the page loads:
// you might want to double-check that you loaded an array ...
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/isArray
// ... and if you didn't, set `items` to an empty array
// Load items from local storage on page load
document.addEventListener("DOMContentLoaded", () => {
  if (Array.isArray(items)) {
    showItems();
  }
});