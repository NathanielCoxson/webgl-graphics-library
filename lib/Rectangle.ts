import { Shape, Position, Color } from "./Graphics";
export default class Rectangle extends Shape {

    x1: number;
    x2: number;
    y1: number;
    y2: number;
    width: number;
    height: number;
    textureInfo: {
        width: number,
        height: number,
        image: any 
    };
    hasTexture: boolean;

    constructor(
        width: number,
        height: number,
        position: Position,
        color: Color 
    ) {
        super(position, color);
        this.x1 = position.x;
        this.x2 = position.x + width;
        this.y1 = position.y;
        this.y2 = position.y + height;
    }

    setTexture(
        width: number,
        height: number,
        image: HTMLImageElement
    ) {
        if (!this.hasTexture) this.hasTexture = true;
        this.textureInfo = { width, height, image };
    }
}
