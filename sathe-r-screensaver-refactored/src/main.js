import { getRandomColor, getRandomInt } from "./utils.js";
import { drawArc, drawLine,drawRectangle } from "./canvas-utils.js";

//global variables
let ctx;
let paused = false;
let canvas;
let createRectangles = true;
let createArcs = true;
let createLines = true;

let init = () =>{
	console.log(`page loaded!`);
	//canvas variable points at <canvas> tag
	canvas = document.querySelector("canvas");
	
	//ctx variable points at a "2D drawing context"
	ctx = canvas.getContext("2d");
	
    //draws the initial image
	drawRectangle(ctx,20,20,600,440,`#ffca80`)
	drawRectangle(ctx,120,120,400,300,`#a4f5d7`,20,`#66ccd1`)
	drawLine(ctx,20,20,620,460,15,`#66ccd1`)
	drawLine(ctx,20,460,620,20,15,`#66ccd1`)
	drawArc(ctx,320,240,50,0,Math.PI*2,`#a4f5d7`,5,`#66ccd1`)
	drawArc(ctx,320,250,20,0,Math.PI,`#ffffff`,5,`#66ccd1`)
	drawArc(ctx,300,220,15,0,Math.PI*2,`#ffffff`,2,`#66ccd1`)
	drawArc(ctx,340,220,15,0,Math.PI*2,`#ffffff`,2,`#66ccd1`)
	drawArc(ctx,300,220,5,0,Math.PI*2,`#000000`)
	drawArc(ctx,340,220,5,0,Math.PI*2,`#000000`)
	drawArc(ctx,300,220,15,Math.PI,0,`#a4f5d7`,2,`#66ccd1`);
	drawArc(ctx,340,220,15,Math.PI,0,`#a4f5d7`,2,`#66ccd1`)
	drawLine(ctx,20,340,620,340,20,`#66ccd1`)

    //call to helper functions
	setupUI();
	update();
}
//helpers
let update = () =>{
	if(paused) return;
	requestAnimationFrame(update);
	if(createArcs) drawRandomArc(ctx);
	if (createLines) drawRandomLine(ctx);
	if (createRectangles) drawRandomRect(ctx);
}

let setupUI = () =>{
	let clicked = false;
	document.querySelector("#btn-pause").onclick = function(){
		paused = true;
		clicked = true;
	};
	document.querySelector("#btn-play").onclick = function(){
		paused = false;
		if(clicked){
			clicked = false;
			update();
		}
	};
	document.querySelector("#btn-clear").onclick = function(){
		paused = true;
		clicked = true;
		ctx.fillStyle = `#ffca80`;
		ctx.fillRect(0,0,640,480);
		ctx.fill();
	};
	canvas.onclick = canvasClicked;
	document.querySelector("#cb-rectangles").onclick = (e) => {createRectangles = e.target.checked;}
	document.querySelector("#cb-arcs").onclick = (e) => {createArcs = e.target.checked;}
	document.querySelector("#cb-lines").onclick = (e) => {createLines = e.target.checked;}
}

let drawRandomRect = (ctx) => {
	drawRectangle(ctx,getRandomInt(0, 640), getRandomInt(0, 480), getRandomInt(10, 90),getRandomInt(10, 90),getRandomColor(),0,getRandomColor())
}

let drawRandomArc = (ctx) => {
	drawArc(ctx, getRandomInt(0, 640), getRandomInt(0, 480),getRandomInt(0, 30),0,Math.PI * 2, getRandomColor());
}
let drawRandomLine = (ctx) => {
	drawLine(ctx,getRandomInt(0,640),getRandomInt(0, 480),getRandomInt(0,640),getRandomInt(0, 480),getRandomInt(1, 20),getRandomColor())
}
//event handlers 
let canvasClicked = (e) => {
	let rect = e.target.getBoundingClientRect();
	let mouseX = e.clientX - rect.x;
	let mouseY = e.clientY - rect.y;
	console.log(mouseX,mouseY);
	for(let i = 0; i < 10; i++){
		let x = getRandomInt(-75,75) + mouseX;
		let y = getRandomInt(-75,75) + mouseY;
		let radius = getRandomInt(5,30);
		let color = getRandomColor();
		drawArc(ctx,x,y,radius,0,Math.PI*2,color)
	}
}
//canvas helpers 
init();
