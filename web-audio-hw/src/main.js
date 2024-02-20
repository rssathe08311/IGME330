/*
	main.js is primarily responsible for hooking up the UI to the rest of the application 
	and setting up the main event loop
*/

// We will write the functions in this file in the traditional ES5 way
// In this instance, we feel the code is more readable if written this way
// If you want to re-write these as ES6 arrow functions, to be consistent with the other files, go ahead!

import * as audio from './audio.js';
import * as utils from './utils.js';

// 1 - here we are faking an enumeration
const DEFAULTS = Object.freeze({
	sound1  :  "media/New Adventure Theme.mp3"
});

function init(){
	console.log("init called");
	console.log(`Testing utils.getRandomColor() import: ${utils.getRandomColor()}`);
    audio.setupWebaudio(DEFAULTS.sound1);
    console.log(audio)
	let canvasElement = document.querySelector("canvas"); // hookup <canvas> element
	setupUI(canvasElement);
}

function setupUI(canvasElement){
  // A - hookup fullscreen button
  const fsButton = document.querySelector("#fsButton");
	
  // add .onclick event to button
  fsButton.onclick = e => {
    console.log("goFullscreen() called");
    utils.goFullscreen(canvasElement);
  };

  // add .onclick event to button
  playButton.onclick = e => {
    console.log(`audioCtx.state before = ${audio.audioCtx.state}`);

    //check if context is in suspended state (autoplay policy)
    if(audio.audioCtx.state == "suspended"){
        audio.audioCtx.resume();
    }
    console.log(`audioCtx.state after = ${audio.audioCtx.state}`);
    if(e.target.dataset.playing == "no"){
        //if track is currently paused, play it
        audio.playCurrentSound();
        e.target.dataset.playing = "yes";//will change the CSS to correlate with current state
    }
    //if track is playing pause it
    else{
        audio.pauseCurrentSound();
        e.target.dataset.playing = "no";//will change the CSS to correlate with current state
    }
  }
  //on step 8
	
} // end setupUI

export {init};