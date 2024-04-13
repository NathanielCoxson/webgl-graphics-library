import Canvas from "../../lib/Canvas";
import { Color, Position } from "../../lib/Graphics";
import Rectangle from "../../lib/Rectangle";

const canvasElement = document.querySelector("#canvas");

const canvas = new Canvas(canvasElement);

for (let i = 0; i < 10; i++) {
    canvas.draw(new Rectangle(5, 5, new Position(10 * i, 10 * i), new Color(0, 1, 0, 1)));
}

canvas.display();

console.log(canvas);
