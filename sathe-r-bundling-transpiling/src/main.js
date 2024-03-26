// explictly import only the functions we are interested in
import { formatGreeting, doubleIt, defaultName, meaningOfLife } from "./utils.js";
//import * as utils from  "./utils.js"; // OR give all of the exported `utils` functions a namespace

let temp = "main.js temp value"; // does not conflict with `temp` in utils.js

const input = document.querySelector("#input-firstname");
const output = document.querySelector("#output");
const cbForcefully = document.querySelector("#cb-forcefully");

const helloButton = document.querySelector("#btn-hello");
const goodbyeButton = document.querySelector("#btn-goodbye");

let forcefully = cbForcefully.checked;

//cbForcefully.onchange = () => forcefully = cbForcefully.checked;
cbForcefully.onchange = e => forcefully = e.target.checked;
helloButton.onclick = () => output.innerHTML = formatGreeting("Hello",input.value.trim(),forcefully);
goodbyeButton.onclick = () => output.innerHTML = formatGreeting("Goodbye",input.value.trim(),forcefully);


