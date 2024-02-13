import { getRandomColor, getRandomInt } from "./utils.js";

export { drawArc,drawRandomArc,drawLine,drawRandomLine,drawRectangle,drawRandomRect };

let drawRectangle = (ctx,x,y,width,height,fillStyle=`black`,lineWidth=0,strokeStyle=`black`) => {
	ctx.save();
	ctx.fillStyle = fillStyle;
	ctx.beginPath();
	ctx.rect(x,y,width,height);
	ctx.fill();
	if(lineWidth > 0){
		ctx.lineWidth = lineWidth;
		ctx.strokeStyle = strokeStyle;
		ctx.stroke();
	}
	ctx.closePath();
	ctx.restore();
}

let drawArc = (ctx, x, y, radius, startAngle = 0, endAngle = Math.PI*2, fillStyle=`black`,lineWidth=0,strokeStyle=`black`) => {
	ctx.save();
	ctx.fillStyle = fillStyle;
	ctx.beginPath();
	ctx.arc(x,y,radius,startAngle,endAngle,false);
	ctx.fill();
	if(lineWidth > 0){
		ctx.lineWidth = lineWidth;
		ctx.strokeStyle = strokeStyle;
		ctx.stroke();
	}
	ctx.closePath();
	ctx.restore();
}

let drawLine = (ctx,x1,y1,x2,y2,lineWidth=1,strokeStyle=`black`) => {
	ctx.save();
	ctx.lineWidth = lineWidth;
	ctx.strokeStyle = strokeStyle;
	ctx.beginPath();
	ctx.moveTo(x1,y1);
	ctx.lineTo(x2,y2);
	ctx.stroke();
	ctx.closePath();
	ctx.restore();
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