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
import * as jsonLoader from './jsonLoader.js';

let gradient_checkbox = document.querySelector("#cb-gradient");
let bars_checkbox = document.querySelector("#cb-bars");
let rays_checkbox = document.querySelector("#cb-rays");
let lines_checkbox = document.querySelector("#cb-lines");
let circles_checkbox = document.querySelector("#cb-circles");
let phyllo_checkbox = document.querySelector("#cb-phyllo");
let noise_checkbox = document.querySelector("#cb-noise");
let invert_checkbox = document.querySelector("#cb-invert");
let emboss_checkbox = document.querySelector("#cb-emboss");
let treble_checkbox = document.querySelector("#cb-treble");
let bass_checkbox = document.querySelector("#cb-bass");
let sunset_select = document.querySelector("#sunset-select");
let sunrise_select = document.querySelector("#sunrise-select");
let night_select = document.querySelector("#night-select");
let shape_checkbox = document.querySelector("#cb-shape");
let visual_select = document.querySelector("#info-visualizer");

let drawParams = {
  showGradient  : true,
  showBars      : true,
  showRays      : true,
  showLines     : false,
  showCircles   : true,
  showPhyllo    : true,
  showSquares   : false,
  showNoise     : false,
  showInvert    : false,
  showEmboss    : false,
  playTreble    : false,
  playBass      : false,
  toggleWave    : false
}

// 1 - here we are faking an enumeration
const DEFAULTS = Object.freeze({
	sound1  :  "media/softvibes.mp3"
});

let highshelf = false;
let lowshelf = false;

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
  rays_checkbox.checked = drawParams.showRays;
  lines_checkbox.checked = drawParams.showLines;
  phyllo_checkbox.checked = drawParams.showPhyllo;
  shape_checkbox.checked = drawParams.showSquares;

  jsonLoader.load();

	setupUI(canvasElement);
  canvas.setupCanvas(canvasElement,audio.analyserNode);
  loop();
}

const toggleHighshelf = () => {
  if(highshelf){
    audio.biquadFilter.frequency.setValueAtTime(1000,audio.audioCtx.currentTime);
    audio.biquadFilter.gain.setValueAtTime(25,audio.audioCtx.currentTime);
  }
  else{
    audio.biquadFilter.gain.setValueAtTime(0,audio.audioCtx.currentTime);
  }
}

const toggleLowshelf = () => {
  if(lowshelf){
    audio.lowshelfBiquadFilter.frequency.setValueAtTime(1000,audio.audioCtx.currentTime);
    audio.lowshelfBiquadFilter.gain.setValueAtTime(15,audio.audioCtx.currentTime);
  }
  else{
    audio.lowshelfBiquadFilter.gain.setValueAtTime(0,audio.audioCtx.currentTime);
  }
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
  let volumeSlider = document.querySelector("#slider-volume");
  let volumeLabel = document.querySelector("#label-volume");

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

  sunset_select.addEventListener('change', function(){
    if(this.checked){
      drawParams.showGradient = true;
      drawParams.showBars = false;
      drawParams.showInvert = false;
      drawParams.showRays = true;
      drawParams.showCircles = true;
      drawParams.showLines = true;
    }
});

sunrise_select.addEventListener('change', function(){
    if(this.checked){
      drawParams.showGradient = true;
      drawParams.showInvert = true;
      drawParams.showBars = true;
      drawParams.showRays = true;
      drawParams.showCircles = true;
      drawParams.showLines = false;
    }
});

night_select.addEventListener('change', function(){
    if(this.checked){
      drawParams.showGradient = false;
      drawParams.showInvert = false;
      drawParams.showBars = false;
      drawParams.showRays = false;
      drawParams.showCircles = true;
      drawParams.showLines = true;
    }
});


  treble_checkbox.checked = highshelf;
  bass_checkbox.checked = lowshelf;

  //checkbox event listeners
  gradient_checkbox.addEventListener('change', function() {
    drawParams.showGradient = this.checked;
  });

  bars_checkbox.addEventListener('change', function() {
    drawParams.showBars = this.checked;
  });

  rays_checkbox.addEventListener('change', function(){
    drawParams.showRays = this.checked;
  })

  lines_checkbox.addEventListener('change', function(){
    drawParams.showLines = this.checked;
  })

  circles_checkbox.addEventListener('change', function() {
      drawParams.showCircles = this.checked;
  });

  shape_checkbox.addEventListener('change', function() {
    drawParams.showSquares = this.checked;
  });

  phyllo_checkbox.addEventListener('change', function() {
    drawParams.showPhyllo = this.checked;
});

  noise_checkbox.addEventListener('change', function() {
      drawParams.showNoise = this.checked;
  });

  invert_checkbox.addEventListener('change', function (){
    drawParams.showInvert = this.checked;
  });

  emboss_checkbox.addEventListener('change', function() {
    drawParams.showEmboss = this.checked;
  });

  treble_checkbox.onchange = e => {
    highshelf = e.target.checked;
    toggleHighshelf();
  }

  bass_checkbox.onchange = e => {
    lowshelf = e.target.checked;
    toggleLowshelf();
  }

  visual_select.onchange = e => {
    if(e.target.value == "frequency"){
      drawParams.toggleWave = false;
    }
    else{
      drawParams.toggleWave = true;
    }
  }

  toggleHighshelf();
  toggleLowshelf();
  
	
} // end setupUI

const loop = () => {
  //makes it so that the program updates every frame
    requestAnimationFrame(loop);
    //function to call on the visualizer module in order to display the animations
    canvas.draw(drawParams);
  }



export {init};