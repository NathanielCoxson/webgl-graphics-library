export default class Rectangle {
    x1: number;
    x2: number;
    y1: number;
    y2: number;
    color: number[];
    position: [number, number];

    constructor(
        x: number,
        y: number,
        width: number,
        height: number,
        color: number[],
        position: [number, number]
    ) {
        this.x1 = x;
        this.x2 = x + width;
        this.y1 = y;
        this.y2 = y + height;
        this.color = color;
        this.position = position;
    }
}
