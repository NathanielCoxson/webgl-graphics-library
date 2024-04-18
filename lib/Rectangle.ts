import { Shape } from "./Graphics";
export default class Rectangle extends Shape {

    width:  number;
    height: number;

    textureInfo: {
        width:  number,
        height: number,
        image:  any 
    };
    hasTexture:   boolean;

    constructor(
        width: number,
        height: number,
    ) {
        super();
        this.width = width;
        this.height = height;
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
