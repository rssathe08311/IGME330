import { useState } from "react";
import './App.css'

// app "globals" and utils
const baseurl = "https://www.amiiboapi.com/api/amiibo/?name=";

const loadXHR = (url, callback) => {
  // set up the connection
  const xhr = new XMLHttpRequest();
  // when the data loads, invoke the callback function and pass it the `xhr` object
  xhr.onload = (e) => {
    console.log(`In onload - HTTP Status Code = ${e.target.status}`);
    const response = JSON.parse(e.target.responseText);
    console.log(`Success - the response length is ${response.length}`);

    callback(response);
  };

  xhr.onerror = (e) => console.log(`In onerror - HTTP Status Code = ${e.target.status}`);

  xhr.open("GET", url);
  xhr.send();
};

const searchAmiibo = (name, callback) => {
  loadXHR( `${baseurl}${name}`, callback);
};

const parseAmiiboResult = xhr => {
  // get the `.responseText` string
  const responseText = xhr.responseText;
 
  // declare a json variable
  let json;
  try {
    // try to parse the string into a json object
    json = JSON.parse(responseText);

    // log out number of results (length of `json.amiibo`)
    console.log(`Number of results = ${json.amiibo.length}`);

    // loop through `json.amiibo` and log out the character name
    json.amiibo.forEach(amiibo => {
      console.log(amiibo.character);
    });
  } 
  catch (error) {
    console.log("Error parsing JSON response:", error);
  }
};

const App = () => {
  searchAmiibo("mario", parseAmiiboResult);
  return <>
    <header>
      <h1>Amiibo Finder</h1>
    </header>
    <hr />
    <main>
      <button>Search</button>
      <label>
        Name: 
        <input />
      </label>
    </main>
    <hr />
    <footer>
      <p>&copy; 2023 Ace Coder</p>
    </footer>
  </>;
};

export default App;
