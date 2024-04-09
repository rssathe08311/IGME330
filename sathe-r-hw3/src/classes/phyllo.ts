export default class Phyllo{
    ctx: CanvasRenderingContext2D;
    x: number;
    y: number;
    maxX: number;
    maxY: number;
    divergence: number;
    fps: number;
    n: number;
    c: number;
    radius: number;
    animationTimeout: any;

    constructor(ctx: CanvasRenderingContext2D, x: number, y: number, maxX: number, maxY: number, divergence: number) {
        this.ctx = ctx;
        this.x = x;
        this.y = y;
        this.maxX = maxX;
        this.maxY = maxY;
        this.divergence = divergence;
        this.fps = 60;
        this.n = 0;
        this.c = 4;
        this.radius = 2;
    }

    update(audioData:Uint8Array) {
        this.loop(audioData);
    }

    loop(audioData:Uint8Array) {
        this.c += 0.01;
        this.radius += 0.01;
    
        let a = this.n * this.dtr(this.divergence);
        let r = this.c * Math.sqrt(this.n);
    
        let x = r * Math.cos(a) + this.x;
        let y = r * Math.sin(a) + this.y;
    
        if (x >= this.maxX && y >= this.maxY) {
            this.c = 4;
            this.radius = 2;
            this.n = 0;
            this.ctx.clearRect(0, 0, this.maxX, this.maxY);
        }
    
        let percent = audioData[this.n % audioData.length] / 255;
        let circleRadius = percent * (this.maxY / 8); // Adjust the maximum radius as needed
        let hue = (this.n / 5) % 360;
        hue = (hue + 240) % 360; //make it more blue
        let color = `hsl(${hue}, 100%, 50%)`;
        this.drawCircle(x, y, circleRadius, color);
    
        this.n++;
        
        this.animationTimeout = setTimeout(() => this.loop(audioData), 1000 / this.fps);
    }

    dtr(degrees:number) {
        return degrees * (Math.PI / 180);
    }

    drawCircle(x:number, y:number, radius:number, color:string) {
        this.ctx.save();
        this.ctx.fillStyle = color;
        this.ctx.beginPath();
        this.ctx.arc(x, y, radius, 0, Math.PI * 2);
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.restore();
    }

    stopAnimation() {
        clearTimeout(this.animationTimeout);
    }
}

