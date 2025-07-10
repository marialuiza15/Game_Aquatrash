import {
    INITIAL_FRAMES,
    PATH_PERSONAGEM,
} from "../utils/constants.js";

import Projectile from "./Projectile.js";

class Player {
    constructor(canvasWidth, canvasHeight) {
        this.alive = true;
        this.width = 48 * 3;
        this.height = 48 * 3;
        this.velocity = 6;

        this.position = {
            x: canvasWidth / 2 - this.width / 2,
            y: canvasHeight - this.height - 30,
        };

        this.image = this.getImage(PATH_PERSONAGEM);
        // this.engineImage = this.getImage(PATH_ENGINE_IMAGE);
        // this.engineSprites = this.getImage(PATH_ENGINE_SPRITES);

        this.sx = 0;
        this.framesCounter = INITIAL_FRAMES;
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
            this.framesCounter = INITIAL_FRAMES;
        }

        this.framesCounter--;

        // Limite para não entrar no mar
        const seaTop = window.innerHeight - 200;
        if (this.position.y + this.height > seaTop) {
            this.position.y = seaTop - this.height;
        }
    }

    shoot(Projectiles) {
        const p = new Projectile(
            {
                x: this.position.x + this.width / 2 - 2,
                y: this.position.y + 2,
            },
            -10
        );

        Projectiles.push(p);
    }

    hit(Projectile) {
        return (
            Projectile.position.x >= this.position.x + 20 &&
            Projectile.position.x <= this.position.x + 20 + this.width - 38 &&
            Projectile.position.y + Projectile.height >= this.position.y + 22 &&
            Projectile.position.y + Projectile.height <=
                this.position.y + 22 + this.height - 34
        );
    }
}

export default Player;
