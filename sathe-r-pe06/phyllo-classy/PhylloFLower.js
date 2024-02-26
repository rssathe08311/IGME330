const canvasWidth = 400, canvasHeight = 300;
let ctx;

window.onload = init;


function init () {
    ctx = canvas.getContext("2d");
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    ctx.fillRect(0,0,canvasWidth,canvasHeight);
    canvas_box = document.querySelector("canvas");
    fps_select = document.querySelector("select");
    

    //call to the loop that draws the phyllotaxis
    loop();
    

    canvas_box.onclick = drawFlower;

    document.querySelector("#btn-restart").onclick = () =>{
        ctx.fillRect(0,0,canvasWidth,canvasHeight);
        n = 0;
        radius = 2;
        fps_select.value = 60;
        fps = 1000/fps_select.value;

    }
    document.querySelector("#ctrl-fps").onchange = () => {
        fps = 1000/fps_select.value;
    }
}


class PhylloFlower{

    constructor(n=0, centerX, centerY, divergence,c) {
        this.n = n;//generation number
        this.divergence = 137.5; //divergence angle 137.5
        this.c; //padding between florets
        this. fps;
        this.d = 361; //degrees 
        this.canvas_box;// the canvas
        this.clicked = false;
        this.radius = 2;
        this.fps_select;
    }

    function loop(){
		
        setTimeout(loop, fps);

		c += 0.01;
		radius += 0.01;

        // each frame draw a new dot
        // `a` is the angle
        // `r` is the radius from the center (e.g. "Pole") of the flower
        // `c` is the "padding/spacing" between the dots
        let a = n * dtr(divergence); //angle
        let r = c * Math.sqrt(n); //center pole
        //console.log(a,r);

        // now calculate the `x` and `y`
        let x = r * Math.cos(a) + canvasWidth/2;
        let y = r * Math.sin(a) + canvasHeight/2;
        //console.log(x,y);

		//resets the drawing once it has reached the bounds of the cavas
		if(x >= canvasWidth -20 && y >= canvasHeight){
			c = 4;
			radius = 2;
			n= 0;
			ctx.fillRect(0,0,canvasWidth,canvasHeight);
		}

        let aDegrees = (n * divergence) % d;
        let color = `hsl(${n/5 % d},100%,50%)`;
        drawCircle(ctx,x,y,radius,color);

		
        n++;
    }
	
	function drawFlower(e){
		let rect = e.target.getBoundingClientRect();
		let mouseX = e.clientX - rect.x;
		let mouseY = e.clientY - rect.y;

		let gen_num = 0;

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

	// helpers
	function dtr(degrees){
		return degrees * (Math.PI/180);
	}

	function drawCircle(ctx,x,y,radius,color){
		ctx.save();
		ctx.fillStyle = color;
		ctx.beginPath();
		ctx.arc(x,y,radius,0,Math.PI * 2);
		ctx.closePath();
		ctx.fill();
		ctx.restore();
	}
}