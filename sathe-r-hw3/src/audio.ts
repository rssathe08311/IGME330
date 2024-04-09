import { DEFAULTS } from './enums/audio-defaults.enum';
// 1 - our WebAudio context, **we will export and make this public at the bottom of the file**
// **These are "private" properties - these will NOT be visible outside of this module (i.e. file)**
// 2 - WebAudio nodes that are part of our WebAudio audio routing graph
let element:HTMLAudioElement;
let audioCtx: AudioContext;
let sourceNode: AudioNode;
let analyserNode: AnalyserNode;
let gainNode: GainNode;
let biquadFilter: BiquadFilterNode;
let lowshelfBiquadFilter: BiquadFilterNode;

// 3 - here we are faking an enumeration


// **Next are "public" methods - we are going to export all of these at the bottom of this file**
const  setupWebaudio = filePath => {
// 1 - The || is because WebAudio has not been standardized across browsers yet
const AudioContext = window.AudioContext;
    audioCtx = new AudioContext(); 

// 2 - this creates an <audio> element
    element = new Audio(); //document.querySelector("audio")

// 3 - have it point at a sound file
    loadSoundFile(filePath);

// 4 - create an a source node that points at the <audio> element
    sourceNode = audioCtx.createMediaElementSource(element);

//treble node work
    biquadFilter = audioCtx.createBiquadFilter();
    biquadFilter.type = "highshelf";
    //biquadFilter.frequency.setValueAtTime(1000, audioCtx.currentTime);//the bins that will get boosted
    //biquadFilter.gain.setValueAtTime(25, audioCtx.currentTime);//the amount that the bins will get boosted

//bass node work
    lowshelfBiquadFilter = audioCtx.createBiquadFilter();
    lowshelfBiquadFilter.type = "lowshelf"

// 5 - create an analyser node
// note the UK spelling of "Analyser"
    analyserNode = audioCtx.createAnalyser();
/*
// 6
We will request DEFAULTS.numSamples number of samples or "bins" spaced equally 
across the sound spectrum.

If DEFAULTS.numSamples (fftSize) is 256, then the first bin is 0 Hz, the second is 172 Hz, 
the third is 344Hz, and so on. Each bin contains a number between 0-255 representing 
the amplitude of that frequency.
*/ 

// fft stands for Fast Fourier Transform
    analyserNode.fftSize = DEFAULTS.numSamples;

// 7 - create a gain (volume) node
    gainNode = audioCtx.createGain();
    gainNode.gain.value = DEFAULTS.gain;

// 8 - connect the nodes - we now have an audio graph
    sourceNode.connect(biquadFilter);
    biquadFilter.connect(lowshelfBiquadFilter);
    lowshelfBiquadFilter.connect(analyserNode);
    analyserNode.connect(gainNode);
    gainNode.connect(audioCtx.destination);
}

const loadSoundFile = (filePath:string) => {
    element.src = filePath;
}

const playCurrentSound = () => {
    element.play();
}

const pauseCurrentSound = () => {
    element.pause();
}

const setVolume = (value:number) => {
    value = Number(value);// make sure that it's a Number rather than a String
    gainNode.gain.value = value;
}

export {audioCtx,setupWebaudio,playCurrentSound,pauseCurrentSound,loadSoundFile,setVolume,analyserNode, biquadFilter, lowshelfBiquadFilter}