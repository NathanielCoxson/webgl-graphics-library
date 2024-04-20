import { Position, Shape } from "./Graphics";
export default class Circle extends Shape {
    radius: number;
    vertexCount: number;
    relativeOrigin: Position
    width: number;
    height: number;

    constructor(
        radius: number,
        vertexCount: number
    ) {
        super();
        this.radius = radius;
        this.vertexCount = vertexCount;
        this.relativeOrigin = new Position(0, 0);
        this.width = radius * 2;
        this.height = radius * 2;
    }

    setOrigin(
        x: number,
        y: number
    ): void {
        this.relativeOrigin.x = x;
        this.relativeOrigin.y = y;
    }
}
