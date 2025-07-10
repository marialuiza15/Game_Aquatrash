import { PATH_LIXO } from "../utils/constants.js";
import Projectile from "./Projectile.js";

class Invader {
    constructor(position, velocity) {
        this.position = position;
        this.scale = 0.8;
        this.width = 50 * this.scale;
        this.height = 37 * this.scale;
        this.velocity = velocity;

        this.image = this.getImage(PATH_LIXO);
    }

    moveRight() {
        this.position.x += this.velocity;
    }

    moveLeft() {
        this.position.x -= this.velocity;
    }

    moveDown() {
        this.position.y += this.height;
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
    }

    hit(Projectile) {
        return (
            Projectile.position.x >= this.position.x &&
            Projectile.position.x <= this.position.x + this.width &&
            Projectile.position.y >= this.position.y &&
            Projectile.position.y <= this.position.y + this.height
        );
    }

    collided(obstacle) {
        return (
            (obstacle.position.x >= this.position.x &&
                obstacle.position.x <= this.position.x + this.width &&
                obstacle.position.y >= this.position.y &&
                obstacle.position.y <= this.position.y + this.height) ||
            (obstacle.position.x + obstacle.width >= this.position.x &&
                obstacle.position.x <= this.position.x &&
                obstacle.position.y >= this.position.y &&
                obstacle.position.y <= this.position.y + this.height)
        );
    }
}

export default Invader;
