import { Shape } from "./Graphics";
export default class Rectangle extends Shape {
    constructor(
        width: number,
        height: number,
    ) {
        super();
        this.width = width;
        this.height = height;
    }
}
