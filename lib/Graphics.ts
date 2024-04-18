export class Shape {
    position: Position;
    color: Color;
    hasFillColor: boolean;

    constructor() {
        this.position = new Position(0, 0);
    }

    setFillColor(
        color: Color
    ): void {
        this.hasFillColor = true;
        this.color = color;
    }

    removeFillColor(): void {
        this.hasFillColor = false;
    }

    setPosition(
        position: Position
    ): void {
        this.position = position;
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
