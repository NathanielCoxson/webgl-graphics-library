import { Shape } from "./Graphics";
export default class Circle extends Shape {
    radius: number;
    vertexCount: number;

    constructor(
        radius: number,
        vertexCount: number
    ) {
        super();
        this.radius = radius;
        this.vertexCount = vertexCount;
        this.width = radius * 2;
        this.height = radius * 2;
    }
}
