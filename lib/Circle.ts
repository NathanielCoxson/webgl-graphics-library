import { Position, Shape } from "./Graphics";
export default class Circle extends Shape {
    radius: number;
    vertexCount: number;
    relativeOrigin: Position
    width: number;
    height: number;

    // TODO: move this to shape prototype
    textureInfo: {
        width:  number,
        height: number,
        image:  any 
    };
    hasTexture:   boolean;

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

    setTexture(
        width: number,
        height: number,
        image: HTMLImageElement
    ): void {
        if (!this.hasTexture) this.hasTexture = true;
        this.textureInfo = { width, height, image };
    }

    removeTexture(): void {
        this.hasTexture = false;
        this.textureInfo = { ...this.textureInfo, image: undefined };
    }
}
