import Canvas from "../../lib/Canvas";
import Rectangle from "../../lib/Rectangle";

const canvasElement = document.querySelector("#canvas");

const canvas = new Canvas(canvasElement);

for (let i = 0; i < 10; i++) {
    canvas.draw(new Rectangle(10 * i, 10 * i, 5, 5, [1, 1, 1], [10 * i, 10 * i]));
}

canvas.display();

console.log(canvas);
