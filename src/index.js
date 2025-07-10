import Player from "./classes/Player.js";
import LixoCaindo from "./classes/LixoCaindo.js";
import { GameState, TEST } from "./utils/constants.js";


const start_tela = document.querySelector(".start_tela");
const gameover_tela = document.querySelector(".game-over");
const menu_pontos = document.querySelector(".menu_superior");
const pontos = menu_pontos.querySelector(".pontos > span");
//const dificuldade = menu_pontos.querySelector(".dificuldade > span");
const play_botao = document.querySelector(".button-play");
const restart_botao = document.querySelector(".button-restart");
const vitoria_tela = document.querySelector(".vitoria");


gameover_tela.remove();
vitoria_tela.remove();


const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

canvas.width = innerWidth;
canvas.height = innerHeight;

ctx.imageSmoothingEnabled = false;

let currentState = GameState.START;

const gameData = {
    pontos: 0,
    //dificuldade: 0,
    vidas: 3,
};

const vidasElement = menu_pontos.querySelector(".vidas > span");

const showGameData = () => {
    pontos.textContent = gameData.pontos;
    //dificuldade.textContent = gameData.dificuldade;
    vidasElement.textContent = gameData.vidas;
};

const player = new Player(canvas.width, canvas.height);
const particles = [];
const LixoCaindos = [];

const SEA_HEIGHT = 200;

// Ponte parabólica
function drawBridge() {
    const bridgeWidth = canvas.width * 1;
    const bridgeHeight = 20;
    const bridgeX = (canvas.width - bridgeWidth) / 2;
    const bridgeY = 100;

    ctx.save();
    ctx.fillStyle = "#c6c6c6";
    ctx.beginPath();
    ctx.moveTo(bridgeX, bridgeY);
    for (let i = 0; i <= 100; i++) {
        const t = i / 100;
        const x = bridgeX + t * bridgeWidth;
        const y = bridgeY + bridgeHeight * Math.pow(3 * t - 1.5, 2);
        ctx.lineTo(x, y);
    }
    ctx.lineTo(bridgeX + bridgeWidth, 0);
    ctx.lineTo(bridgeX, 0);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    ctx.save();
    ctx.strokeStyle = "#c6c6c6";
    ctx.lineWidth = 12;
    ctx.beginPath();
    for (let i = 0; i <= 100; i++) {
        const t = i / 100;
        const x = bridgeX + t * bridgeWidth;
        const y = bridgeY + bridgeHeight * Math.pow(3 * t - 1.5, 2);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.restore();
}

// Objetos caindo
function dropObjectFromBridge() {
    const bridgeY = 100;
    const minX = 500;
    const maxX = canvas.width - 500;

    const x = Math.random() * (maxX - minX) + minX;
    const y = bridgeY;

    const obj = new LixoCaindo({ x, y }, 6);
    LixoCaindos.push(obj);
}

function drawLixoCaindos() {
    LixoCaindos.forEach((obj) => {
        obj.draw(ctx);
        obj.update();
    });
}

function checkLixoCaindoHitsPlayer() {
    LixoCaindos.some((obj, index) => {
        if (
            player.hit({
                position: obj.position,
                width: obj.width,
                height: obj.height,
            })
        ) {
            LixoCaindos.splice(index, 1);
            gameData.pontos += 10;
            showGameData();

            if (gameData.pontos >= 100) {
                currentState = GameState.GAME_OVER;
                clearInterval(dropInterval);
                showVictoryTela();
                return true;
            }

            return true;
        }
    });
}

function showGameOverTela() {
    document.body.appendChild(gameover_tela);
    gameover_tela.classList.add("tela");
    gameover_tela.style.display = "flex";
    menu_pontos.style.display = "none";
}

function showVictoryTela() {
    document.body.appendChild(vitoria_tela);
    vitoria_tela.classList.add("tela");
    vitoria_tela.style.display = "flex";
    menu_pontos.style.display = "none";
    clearInterval(dropInterval);
}



document.querySelectorAll(".button-restart").forEach(button => {
    button.addEventListener("click", restartGame);
});



function checkLixoCaindoHitsSea() {
    for (let i = LixoCaindos.length - 1; i >= 0; i--) {
        const obj = LixoCaindos[i];
        if (obj.position.y + obj.height >= canvas.height - SEA_HEIGHT) {
            gameData.vidas -= 1;
            LixoCaindos.splice(i, 1);
            showGameData();

            if (gameData.vidas <= 0) {
                currentState = GameState.GAME_OVER;
                clearInterval(dropInterval);
                showGameOverTela(); 
            }
        }
    }
}
// Game Loop
const keys = {
    left: false,
    right: false,
};

const gameLoop = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (currentState === GameState.PLAYING) {
        showGameData();
        drawBridge();

        drawLixoCaindos();

        checkLixoCaindoHitsPlayer();
        checkLixoCaindoHitsSea();

        ctx.save();
        ctx.translate(
            player.position.x + player.width / 2,
            player.position.y + player.height / 2
        );

        if (keys.left && player.position.x >= 0) {
            player.moveLeft();
            ctx.rotate(-0.15);
        }

        if (keys.right && player.position.x <= canvas.width - player.width) {
            player.moveRight();
            ctx.rotate(0.15);
        }

        ctx.translate(
            -player.position.x - player.width / 2,
            -player.position.y - player.height / 2
        );

        player.draw(ctx);
        ctx.restore();
    }

    if (currentState === GameState.GAME_OVER) {
        ctx.fillStyle = "rgba(0, 0, 0, 0.5)"; // fundo escuro com transparência
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        drawLixoCaindos();
    }

    requestAnimationFrame(gameLoop);
};

// Iniciar objetos caindo ao clicar em "Iniciar"
let dropInterval;
play_botao.addEventListener("click", () => {
    start_tela.remove();
    menu_pontos.style.display = "block";
    currentState = GameState.PLAYING;

    dropInterval = setInterval(() => {
        dropObjectFromBridge();
    }, 1000);
});

// Restart Game
const restartGame = () => {
    currentState = GameState.PLAYING;
    player.alive = true;
    LixoCaindos.length = 0;
    gameData.pontos = 0;
    gameData.vidas = 3;
    //gameData.dificuldade = 0;

    gameover_tela.style.display = "none";
    vitoria_tela.style.display = "none";
    menu_pontos.style.display = "block";

    showGameData();

    clearInterval(dropInterval);
    dropInterval = setInterval(() => {
        dropObjectFromBridge();
        //gameData.dificuldade += 1;
    }, 2000);
};

addEventListener("keydown", (event) => {
    const key = event.key.toLowerCase();
    if (key === "a") keys.left = true;
    if (key === "d") keys.right = true;
});
addEventListener("keyup", (event) => {
    const key = event.key.toLowerCase();
    if (key === "a") keys.left = false;
    if (key === "d") keys.right = false;
});



gameLoop();
