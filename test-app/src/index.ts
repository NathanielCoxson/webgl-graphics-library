import Canvas from "../../lib/Canvas";
import * as G from "../../lib/Graphics";
import Rectangle from "../../lib/Rectangle";
import Circle from "../../lib/Circle";

const canvasElement = document.querySelector("#canvas");
const canvas = new Canvas(canvasElement);

const rectangles: Rectangle[] = [];
const circles: any = [];

const radius = 25;
const circle = new Circle(radius, 30);
circle.setPosition(new G.Position(100, 50));
circle.setOrigin(radius, radius);
circle.setFillColor(new G.Color(1, 0, 0, 0.25));
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
        r.setTexture(64, 64, image);
        circle.setTexture(50, 50, image);
    }
}

let clickEvents: [number, number][] = [];
canvasElement?.addEventListener("mousedown", (e: any) => {
    e.preventDefault();
    const rect = canvasElement.getBoundingClientRect();
    const x = e.clientX - rect.left; //x position within the element.
    const y = e.clientY - rect.top;  //y position within the element.
    clickEvents.push([Math.floor(x / 64), Math.floor(y / 64)]);
});

// Basic rendering function
let moveRight = true;
let moveDown = true;
function render() {
    // Update

    // Process events
    for (const [j, i] of clickEvents) {
        rectangles[4 * i + j + i].removeTexture();
    }
    clickEvents = [];

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

    // Draw
    for (const r of rectangles) {
        canvas.drawRect(r);
    }
    for (const c of circles) {
        canvas.drawCircle(c);
    }

    // Display
    canvas.display();
    window.requestAnimationFrame(render);
}
window.requestAnimationFrame(() => render());
