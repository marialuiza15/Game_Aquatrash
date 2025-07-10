class LixoCaindo {
    constructor(position, velocity) {
        this.position = position;
        this.width = 40;
        this.height = 40;
        this.velocity = velocity;
        this.image = new Image();
        this.image.src = "src/images/lixo.png";
    }

    draw(ctx) {
        ctx.drawImage(this.image, this.position.x, this.position.y, this.width, this.height);
    }

    update() {
        this.position.y += this.velocity;
    }
}

export default LixoCaindo;