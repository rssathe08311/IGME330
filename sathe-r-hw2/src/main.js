/*
	main.js is primarily responsible for hooking up the UI to the rest of the application 
	and setting up the main event loop
*/

// We will write the functions in this file in the traditional ES5 way
// In this instance, we feel the code is more readable if written this way
// If you want to re-write these as ES6 arrow functions, to be consistent with the other files, go ahead!

import * as canvas from './visualizer.js';
import * as audio from './audio.js';
import * as utils from './utils.js';

let gradient_checkbox = document.querySelector("#cb-gradient");
let bars_checkbox = document.querySelector("#cb-bars");
let circles_checkbox = document.querySelector("#cb-circles");
let noise_checkbox = document.querySelector("#noiseCB");
let invert_checkbox = document.querySelector("#invertCB");
let emboss_checkbox = document.querySelector("#embossCB");

let drawParams = {
  showGradient  : true,
  showBars      : true,
  showCircles   : true,
  showNoise     : false,
  showInvert    : false,
  showEmboss    : false
}

// 1 - here we are faking an enumeration
const DEFAULTS = Object.freeze({
	sound1  :  "media/New Adventure Theme.mp3"
});

const init = () => {
	console.log("init called");
	console.log(`Testing utils.getRandomColor() import: ${utils.getRandomColor()}`);
    audio.setupWebaudio(DEFAULTS.sound1);
    console.log(audio)
	let canvasElement = document.querySelector("canvas"); // hookup <canvas> element

  gradient_checkbox.checked = drawParams.showGradient;
  bars_checkbox.checked = drawParams.showBars;
  circles_checkbox.checked = drawParams.showCircles;
  noise_checkbox.checked = drawParams.showNoise;

	setupUI(canvasElement);
  canvas.setupCanvas(canvasElement,audio.analyserNode);
  loop();
}

const setupUI = (canvasElement) => {
  // A - hookup fullscreen button
  const fsButton = document.querySelector("#btn-fs");
  const playButton = document.querySelector("#btn-play");
	
  // add .onclick event to button
  fsButton.onclick = e => {
    console.log("goFullscreen() called");
    utils.goFullscreen(canvasElement);
  };

  //B - add .onclick event to button
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
  //C - hookup volume slider & label
  let volumeSlider = document.querySelector("#volumeSlider");
  let volumeLabel = document.querySelector("#volumeLabel");

  //add .oninput event to slider
  volumeSlider.oninput = e => {
    //set the gain
    audio.setVolume(e.target.value);
    //update value of label to match value of slider
    volumeLabel.innerHTML = Math.round((e.target.value/2 * 100));
  };

  //set value of label to match initial value of slider
  volumeSlider.dispatchEvent(new Event("input"));

  //D - hookup track <select>
  let trackSelect = document.querySelector("#select-track");
  //add .onchange event to <select>
  trackSelect.onchange = e => {
    audio.loadSoundFile(e.target.value);
    //pause the current track if it is playing
    if(playButton.dataset.playing == "yes"){
      playButton.dispatchEvent(new MouseEvent("click"));
    }
  }

  //checkbox event listeners
  gradient_checkbox.addEventListener('change', function() {
    drawParams.showGradient = this.checked;
  });

  bars_checkbox.addEventListener('change', function() {
    drawParams.showBars = this.checked;
  });

  circles_checkbox.addEventListener('change', function() {
      drawParams.showCircles = this.checked;
  });

  noise_checkbox.addEventListener('change', function() {
      drawParams.showNoise = this.checked;
  });

  invert_checkbox.addEventListener('change', function (){
    drawParams.showInvert = this.checked;
  });

  emboss_checkbox.addEventListener('change', function() {
    drawParams.showEmboss = this.checked;
  })
  
	
} // end setupUI

const loop = () => {
  //makes it so that the program updates every frame
    requestAnimationFrame(loop);
    //function to call on the visualizer module in order to display the animations
    canvas.draw(drawParams);
  }

export {init};