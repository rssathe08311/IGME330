"use strict";
	const canvasWidth = 400, canvasHeight = 300;
	let ctx;
    //let n = 0;//generation number
    const divergence = 137.5; //divergence angle 137.5
    let padding = 4; //padding between florets
	let fps;
	const d = 361; //degrees 
	let canvas_box;// the canvas
	let clicked = false;
	let fps_select;

    let flower1;
    let flower2;

    window.onload = init;

	function init(){
		ctx = canvas.getContext("2d");
		canvas.width = canvasWidth;
		canvas.height = canvasHeight;
		ctx.fillRect(0,0,canvasWidth,canvasHeight);
		canvas_box = document.querySelector("canvas");
		fps_select = document.querySelector("select");
		
        //initialization of flower objects
        flower1 = new PhylloFlower(100, 150, 100, padding);
        flower2 = new PhylloFlower(300, 150, divergence, padding);

        //call to the loop that draws the phyllotaxis
		loop();
		

		//canvas_box.onclick = drawFlower;

		document.querySelector("#btn-restart").onclick = () =>{
			ctx.fillRect(0,0,canvasWidth,canvasHeight);
			flower1.n = 0;
            flower2.n = 0;
			flower1.radius = 2;
            flower2.radius = 2;
            flower1.c = 4;
            flower2.c = 4;
			fps_select.value = 60;
			fps = 1000/fps_select.value;

		}
		document.querySelector("#ctrl-fps").onchange = () => {
			fps = 1000/fps_select.value;
		}
	}


    function loop(){
		
        setTimeout(loop, fps);

        flower1.draw(ctx);
        flower2.draw(ctx);

		
    }
	
class PhylloFlower{
    constructor(centerX, centerY, divergence, c){
        this.n = 0;
        this.centerX = centerX;
        this.centerY = centerY;
        this.divergence = divergence;
        this.c = c;
        this.radius = 2;
    }

    /*
    drawFlower(e){
        let rect = e.target.getBoundingClientRect();
        let mouseX = e.clientX - rect.x;
        let mouseY = e.clientY - rect.y;

        let gen_num = 0;

        console.log("test")
        for(let i = 0; i < 20; i++){
            let a = gen_num * dtr(divergence); //angle
            let r = (c-1)*Math.sqrt(gen_num); //center pole

            let x = r * Math.cos(a) + mouseX;
            let y = r * Math.sin(a) + mouseY;

            let aDegrees = (gen_num * divergence) % d;
            let color = `hsl(${gen_num/5 % d},100%,50%)`;
            
            drawCircle(ctx,x,y,radius,color);
            gen_num ++;
        }
    }
    */

    // helpers
    dtr(degrees){
        return degrees * (Math.PI/180);
    }

    drawCircle(ctx,x,y,radius,color){
        ctx.save();
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(x,y,radius,0,Math.PI * 2);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
    }

    draw(ctx){
        this.c += 0.01;

        // each frame draw a new dot
        // `a` is the angle
        // `r` is the radius from the center (e.g. "Pole") of the flower
        // `c` is the "padding/spacing" between the dots
        let a = this.n * this.dtr(this.divergence); //angle
        let r = this.c * Math.sqrt(this.n); //center pole
        //console.log(a,r);

        // now calculate the `x` and `y`
        let x = r * Math.cos(a) + this.centerX;
        let y = r * Math.sin(a) + this.centerY;
        //console.log(x,y);

		//resets the drawing once it has reached the bounds of the cavas
		if(x >= canvasWidth -20 || x < 0){
			this.c = 4;
			this.n = 0;
			ctx.fillRect(0,0,this.centerX*2,this.centerY*2);
		}

        let aDegrees = (this.n * this.divergence) % d;
        let color = `hsl(${this.n/5 % d},100%,50%)`;
        this.drawCircle(ctx,x,y,this.radius,color);

		
        this.n++;
    }
}