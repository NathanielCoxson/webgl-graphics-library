export class Shape {
    position: Position;
    relativeOrigin: Position;

    width:  number;
    height: number;

    color: Color;
    hasFillColor: boolean;

    textureInfo: {
        width:  number,
        height: number,
        image:  any 
    };
    hasTexture:   boolean;

    constructor() {
        this.position = new Position(0, 0);
        this.relativeOrigin = new Position(0, 0);
        this.hasTexture = false;
        this.hasFillColor = false;
    }

    setFillColor(
        color: Color
    ): void {
        this.hasFillColor = true;
        this.hasTexture = false;
        this.color = color;
    }

    removeFillColor(): void {
        this.hasFillColor = false;
        this.color = new Color(0, 0, 0, 0);
    }

    setTexture(
        width: number,
        height: number,
        image: HTMLImageElement
    ): void {
        if (!this.hasTexture) this.hasTexture = true;
        this.hasFillColor = false;
        this.textureInfo = { width, height, image };
    }

    removeTexture(): void {
        this.hasTexture = false;
        this.textureInfo = { ...this.textureInfo, image: undefined };
    }

    setPosition(
        position: Position
    ): void {
        this.position = position;
    }

    setOrigin(
        x: number,
        y: number
    ): void {
        this.relativeOrigin.x = x;
        this.relativeOrigin.y = y;
    }
}

export class Position {
    x: number;
    y: number;

    constructor(
        x: number,
        y: number
    ) {
        this.x = x;
        this.y = y;
    }
}

export class Color {
    r: number;
    g: number;
    b: number;
    a: number;

    constructor(
        r: number,
        g: number,
        b: number,
        a: number
    ) {
        if (r > 255) {
            throw "r value out of range";
        }
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
    }
}
