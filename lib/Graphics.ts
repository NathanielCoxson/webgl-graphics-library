export class Shape {
    position: Position;
    color: Color;

    constructor(
        position: Position, 
        color: Color 
    ) {
        this.position = position;
        this.color = color;
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
