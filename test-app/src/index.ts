import Canvas from "../../lib/Canvas";
import * as G from "../../lib/Graphics";
import Rectangle from "../../lib/Rectangle";
import Circle from "../../lib/Circle";

const canvasElement = document.querySelector("#canvas");
const canvas = new Canvas(canvasElement);

const rectangles: Rectangle[] = [];
const circles: any = [];

const pink = new G.Color(255, 0, 255, 255);

const radius = 25;
const circle = new Circle(radius, 30);
circle.setPosition(new G.Position(100, 50));
circle.setOrigin(radius, radius);
circle.setFillColor(pink);
circles.push(circle);

for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 5; j++) {
        const r = new Rectangle(64, 64);
        const p = new G.Position(64 * j, 64 * i);
        //if (j > 0) p.x -= 4 * j;
        //if (i > 0) p.y -= 4 * i;
        r.setPosition(p);
        rectangles.push(r);
    }
}

const image = new Image();
image.src = "minesweeper-one.svg";
image.onload = () => {
    for (const r of rectangles) {
        if (!r.hasFillColor) {
            r.setTexture(64, 64, image);
        }
    }
}

let clickEvents: [number, number][] = [];
canvasElement?.addEventListener("mousedown", (e: any) => {
    e.preventDefault();
    const rect = canvasElement.getBoundingClientRect();
    const x = e.clientX - rect.left; //x position within the element.
    const y = e.clientY - rect.top;  //y position within the element.
    clickEvents.push([x, y]);
});
let keyDownEvents: [] = [];
window.addEventListener("keypress", (e: any) => {
    keyDownEvents.push(e.key);
});
let keyUpEvents: [] = [];
window.addEventListener("keyup", (e: any) => {
    keyUpEvents.push(e.key);
})
let up = false;
let down = false;
let left = false;
let right = false;

const rotatingRect = new Rectangle(50, 100);
rotatingRect.setPosition(new G.Position(320, 320));
rotatingRect.setFillColor(pink);
rotatingRect.setOrigin(50/2, 100/2);
rectangles.push(rotatingRect);

const player = new Rectangle(50, 50);
player.setFillColor(pink);
player.setOrigin(player.width / 2, player.height / 2);
player.setPosition(new G.Position(100, 100));

// Basic rendering function
let moveRight = true;
let moveDown = true;
function render() {
    // Update

    // Process events
    for (const [x, y] of clickEvents) {
        for (const r of rectangles) {
            if (!r.hasTexture) continue; 

            if (
                x > r.position.x && x < r.position.x + r.width &&
                y > r.position.y && y < r.position.y + r.height
            ) {
                r.removeTexture(); 
            }
        }
    }
    clickEvents = [];
    
    sPlayerMovement();

    if (circle.position.x + circle.radius >= canvas.width) {
        moveRight = false;
    }
    if (circle.position.y + circle.radius >= canvas.height) {
        moveDown = false;
    }
    if (circle.position.x - circle.radius <= 0) {
        moveRight = true;
    }
    if (circle.position.y - circle.radius <= 0) {
        moveDown = true;
    }

    // Movement
    if (moveRight) {
        circle.position.x += 0.8;
    } else {
        circle.position.x -= 0.8;
    }
    if (moveDown) {
        circle.position.y += 0.8;
    } else {
        circle.position.y -= 0.8;
    }
    circle.setRotation(circle.rotation + 1);
    rotatingRect.setRotation(rotatingRect.rotation - 0.5);

    // Draw
    for (const r of rectangles) {
        canvas.drawRect(r);
    }
    for (const c of circles) {
        canvas.drawCircle(c);
    }
    canvas.drawRect(player);

    // Display
    canvas.display();
    window.requestAnimationFrame(render);
}
window.requestAnimationFrame(() => render());

function sPlayerMovement(): void {
    // Player movement
    for (const key of keyDownEvents) {
        if (key === 'w') {
            up = true;
        } else if (key === 's') {
            down = true;
        } else if (key === 'a') {
            left = true;
        } else if (key === 'd') {
            right = true;
        }
    }
    for (const key of keyUpEvents) {
        if (key === 'w') {
            up = false;
        } else if (key === 's') {
            down = false;
        } else if (key === 'a') {
            left = false;
        } else if (key === 'd') {
            right = false;
        }
    }
    if (up) {
        player.setPosition(new G.Position(player.position.x, player.position.y - 2));
    }
    if (down) {
        player.setPosition(new G.Position(player.position.x, player.position.y + 2));
    }
    if (left) {
        player.setPosition(new G.Position(player.position.x - 2, player.position.y));
    }
    if (right) {
        player.setPosition(new G.Position(player.position.x + 2, player.position.y));
    }
    keyDownEvents = [];
    keyUpEvents = [];
}
