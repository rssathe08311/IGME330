
// Reva Sathe - 1/31/23
import { randIndex } from "./Utils.js";

// arrays that will hold the contents from the json file
let words1 = [];
let words2 = [];
let words3 = [];

const loadBabble = () => {
  const url = "data/babble-data.json";
  const xhr = new XMLHttpRequest();

  xhr.onload = (e) => {
    const json = JSON.parse(e.target.responseText);
    words1 = json["words1"];
    words2 = json["words2"];
    words3 = json["words3"];
    // Call the generatePhrase function after loading the data
    generatePhrase();
  };

  xhr.open("GET", url, true);
  xhr.send();
};

const generatePhrase = (moreLines) => {
  if (moreLines) {
    let str = randIndex(words1) + " " + randIndex(words2) + " " + randIndex(words3) + "!";
    let str2 = randIndex(words1) + " " + randIndex(words2) + " " + randIndex(words3) + "!";
    let str3 = randIndex(words1) + " " + randIndex(words2) + " " + randIndex(words3) + "!";
    let str4 = randIndex(words1) + " " + randIndex(words2) + " " + randIndex(words3) + "!";
    let str5 = randIndex(words1) + " " + randIndex(words2) + " " + randIndex(words3) + "!";
    document.querySelector("#output").innerHTML = `${str} <br> 
                                                    ${str2} <br> 
                                                    ${str3} <br> 
                                                    ${str4} <br>
                                                    ${str5}`;
  } else {
    let str = randIndex(words1) + " " + randIndex(words2) + " " + randIndex(words3) + "!";
    document.querySelector("#output").innerHTML = str;
  }
};

// Load babble data and generate the initial phrase upon the page being loaded
loadBabble();

// Event handler that, upon the button being clicked, calls the generatePhrase() method updating the text
document.querySelector("#btn-1").onclick = () => generatePhrase(false);
document.querySelector("#btn-2").onclick = () => generatePhrase(true);
