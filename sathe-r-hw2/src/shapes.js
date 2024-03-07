class Shapes{
    constructor(ctx, x, y, width, height, fillStyle, scale){
        this.ctx = ctx;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.fillStyle = fillStyle;
        this.scale = scale;
        this.fps = 60;
    }

    update(audioData) {
        this.drawSquare(audioData);
    }

    drawSquare(){
        this.ctx.save();
        this.ctx.fillStyle = this.fillStyle;
        this.ctx.translate(this.x,this.y);
        this.ctx.scale(this.scale, this.scale);
        //now we'll draw from the center to get the rotation right
        this.ctx.fillRect(0-this.width/2, 0-this.height/2, this.width,this.height);
        //ctx.fillRect(0,0,width,height);
        this.ctx.restore();

        this.scale += 0.01;

        setTimeout(() => this.drawSquare(), 1000 / this.fps);
    }
}

export {Shapes};