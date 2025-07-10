import {
    FRAMES,
    PATH_PERSONAGEM,
} from "../utils/constants.js";

class Player {
    constructor(canvasWidth, canvasHeight) {
        this.alive = true;
        this.width = 48 * 3;
        this.height = 48 * 3;
        this.velocity = 10; // <-- AQUI É A VELOCIDADE

        this.position = {
            x: canvasWidth / 2 - this.width / 2,
            y: canvasHeight - this.height - 30,
        };

        this.image = this.getImage(PATH_PERSONAGEM);
        this.sx = 0;
        this.framesCounter = FRAMES;
    }

    moveLeft() {
        this.position.x -= this.velocity;
    }

    moveRight() {
        this.position.x += this.velocity;
    }

    getImage(path) {
        const image = new Image();
        image.src = path;
        return image;
    }

    draw(ctx) {
        ctx.drawImage(
            this.image,
            this.position.x,
            this.position.y,
            this.width,
            this.height
        );

        this.update();
    }

    update() {
        if (this.framesCounter === 0) {
            this.sx = this.sx === 96 ? 0 : this.sx + 48;
            this.framesCounter = FRAMES;
        }

        this.framesCounter--;

        const seaTop = window.innerHeight - 200;
        if (this.position.y + this.height > seaTop) {
            this.position.y = seaTop - this.height;
        }
    }

    hit(projectile) {
        return (
            projectile.position.x >= this.position.x + 20 &&
            projectile.position.x <= this.position.x + 20 + this.width - 38 &&
            projectile.position.y + projectile.height >= this.position.y + 22 &&
            projectile.position.y + projectile.height <=
                this.position.y + 22 + this.height - 34
        );
    }
}

export default Player;