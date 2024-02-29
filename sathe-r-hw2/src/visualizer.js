/*
	The purpose of this file is to take in the analyser node and a <canvas> element: 
	  - the module will create a drawing context that points at the <canvas> 
	  - it will store the reference to the analyser node
	  - in draw(), it will loop through the data in the analyser node
	  - and then draw something representative on the canvas
	  - maybe a better name for this file/module would be *visualizer.js* ?
*/

import * as utils from './utils.js';

let ctx,canvasWidth,canvasHeight,gradient,analyserNode,audioData;


const setupCanvas = (canvasElement,analyserNodeRef) => {
	// create drawing context
	ctx = canvasElement.getContext("2d");
	canvasWidth = canvasElement.width;
	canvasHeight = canvasElement.height;
	// create a gradient that runs top to bottom
	gradient = utils.getLinearGradient(ctx,0,0,0,canvasHeight,[{percent:0,color:"yellow"},{percent:.25,color:"orange"},{percent:.5,color:"coral"},{percent:1,color:"magenta"}]);
	// keep a reference to the analyser node
	analyserNode = analyserNodeRef;
	// this is the array where the analyser data will be stored
	audioData = new Uint8Array(analyserNode.fftSize/2);
}

const draw = (params={}) => {
  // 1 - populate the audioData array with the frequency data from the analyserNode
	// notice these arrays are passed "by reference" 
	analyserNode.getByteFrequencyData(audioData);
	// OR
	//analyserNode.getByteTimeDomainData(audioData); // waveform data
	
	// 2 - draw background
	ctx.save();
    ctx.fillStyle = "black";
    ctx.globalAlpha = 0.1;
    ctx.fillRect(0,0,canvasWidth,canvasHeight);
    ctx.restore();
		
	// 3 - draw gradient
	if(params.showGradient){
        ctx.save();
        ctx.fillStyle = gradient;
        ctx.globalAlpha = 0.3;
        ctx.fillRect(0,0,canvasWidth,canvasHeight);
        ctx.restore();

    }
	// 4 - draw bars
	if(params.showBars){
        let barSpacing = 4;

        let screenWidthForBars = canvasWidth - ((audioData.length - 30) * barSpacing);
        let barWidth = screenWidthForBars / audioData.length;
        let barHeight = 200;
        let topSpacing = 25;

        ctx.save();
        ctx.fillStyle = `rgba(255,255,255,0.5)`;
        ctx.strokeStyle = `rgba(0,0,0,0.5)`;
        //loop through the data and draw
        for(let i = 0; i < audioData.length; i++){
            ctx.fillRect(i * (barWidth + barSpacing), topSpacing + 256-audioData[i], barWidth,barHeight);
            ctx.strokeRect(i * (barWidth + barSpacing), topSpacing + 256-audioData[i], barWidth,barHeight);
        }
        ctx.restore();
    }

	// 5 - draw circles
    if(params.showCircles){
        let maxRadius = canvasHeight/4;
        ctx.save();
        ctx.globalAlpha = 0.5;
        for(let i = 0; i < audioData.length; i++){
            //blue-ish circles
            let percent = audioData[i] / 255;

            let circleRadius = percent * maxRadius;
            ctx.beginPath();
            ctx.fillStyle = utils.makeColor(0, 100, 200, .5 - percent/5.0);
            ctx.arc(canvasWidth/2, canvasHeight/2, circleRadius * 1.1, 0, 2 * Math.PI, false);
            ctx.fill();
            ctx.closePath();

            //teal-ish circles, bigger, more transparent
            ctx.beginPath();
            ctx.fillStyle = utils.makeColor(0, 200, 150, .5 - percent/5.0);
            ctx.arc(canvasWidth/2, canvasHeight/2, circleRadius * 1.25, 0, 2 * Math.PI, false);
            ctx.fill();
            ctx.closePath();

            //blue-ish circles, smaller
            ctx.save();
            ctx.beginPath();
            ctx.fillStyle = utils.makeColor(0, 100, 250, .5 - percent/5.0);
            ctx.arc(canvasWidth/2, canvasHeight/2, circleRadius * .70, 0, 2 * Math.PI, false);
            ctx.fill();
            ctx.closePath();
            ctx.restore();
        }
        ctx.restore();
    }

    if(params.showNoise){
        // 6 - bitmap manipulation
        // TODO: right now. we are looping though every pixel of the canvas (320,000 of them!), 
        // regardless of whether or not we are applying a pixel effect
        // At some point, refactor this code so that we are looping though the image data only if
        // it is necessary

        // A) grab all of the pixels on the canvas and put them in the `data` array
        // `imageData.data` is a `Uint8ClampedArray()` typed array that has 1.28 million elements!
        // the variable `data` below is a reference to that array 
        let imageData = ctx.getImageData(0,0,canvasWidth,canvasHeight);
        let data = imageData.data;
        let length = data.length;
        let width = imageData.width;//not using here
        // B) Iterate through each pixel, stepping 4 elements at a time (which is the RGBA for 1 pixel)
        for(let i = 0; i < length; i += 4){
            // C) randomly change every 20th pixel to red
            if(params.showNoise && Math.random() < .05){
                // data[i] is the red channel
                // data[i+1] is the green channel
                // data[i+2] is the blue channel
                // data[i+3] is the alpha channel
                data[i] = data[i+1] = data[i+2] = 255;//zero out the red and green and blue channels
                //data[i] = 255;//make the red channel 100% red
                // zero out the red and green and blue channels
                // make the red channel 100% red
            } // end if


        } // end for
        
        // D) copy image data back to canvas
        ctx.putImageData(imageData, 0, 0);
    }

    if(params.showInvert){
        // A) grab all of the pixels on the canvas and put them in the `data` array
        // `imageData.data` is a `Uint8ClampedArray()` typed array that has 1.28 million elements!
        // the variable `data` below is a reference to that array 
        let imageData = ctx.getImageData(0,0,canvasWidth,canvasHeight);
        let data = imageData.data;
        let length = data.length;
        let width = imageData.width;//not using here

        for(let i = 0; i < length; i += 4){
            let red = data[i], green = data[i+1], blue = data[i+2];
        data[i] = 255 - red;
        data[i+1] = 255 - green;
        data[i+2] = 255 - blue;
        }

        // D) copy image data back to canvas
        ctx.putImageData(imageData, 0, 0);
    }

    if(params.showEmboss){
        // A) grab all of the pixels on the canvas and put them in the `data` array
        // `imageData.data` is a `Uint8ClampedArray()` typed array that has 1.28 million elements!
        // the variable `data` below is a reference to that array 
        let imageData = ctx.getImageData(0,0,canvasWidth,canvasHeight);
        let data = imageData.data;
        let length = data.length;
        let width = imageData.width;//not using here

        for(let i = 0; i < length; i++){
            if(i%4 == 3) continue; //skip alpha channel
            data[i] = 127 + 2*data[i] - data[i+4] - data [i + width*4];
        }
        ctx.putImageData(imageData, 0, 0);
    }
		
}

export {setupCanvas,draw};