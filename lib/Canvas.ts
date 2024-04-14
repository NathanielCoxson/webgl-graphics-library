import Rectangle from "./Rectangle";

export default class Canvas {
    gl: WebGLRenderingContext | null;
    success: boolean;
    vertexShader: WebGLShader | undefined;
    fragmentShader: WebGLShader | undefined;
    program: WebGLProgram | undefined;
    positionAttributeLocation: any;
    positionBuffer: any;
    texCoordLocation: any;
    texCoordBuffer: any;
    resolutionUniformLocation: any;
    colorUniformLocation: any;
    
    // Shape buffers
    rectangles: Rectangle[];
    
    constructor(
        canvasElement: any, 
        image: any
    ) {
        if (!canvasElement) {
            this.success = false;
            this.gl = null;
            return;
        }
        this.gl = canvasElement.getContext("webgl");
        if (this.gl) {
            this.success = true;
        } else {
            this.success = false;
            return;
        }
        
        const vertexShaderSource: any = document.querySelector("#vertex-shader-2d")?.textContent;
        const fragmentShaderSource: any = document.querySelector("#fragment-shader-2d")?.textContent;
        this.vertexShader = createShader(this.gl, this.gl.VERTEX_SHADER, vertexShaderSource);
        if (!this.vertexShader) {
            this.success = false;
            return;
        } 
        this.fragmentShader = createShader(this.gl, this.gl.FRAGMENT_SHADER, fragmentShaderSource);
        if (!this.fragmentShader) {
            this.success = false;
            return;
        } 

        this.program = createProgram(this.gl, this.vertexShader, this.fragmentShader);
        if (!this.program) {
            this.success = false;
            return;
        }

        this.positionAttributeLocation = this.gl.getAttribLocation(this.program, "a_position");
        this.texCoordLocation = this.gl.getAttribLocation(this.program, "a_texCoord");

        // Create position buffer
        this.positionBuffer = this.gl.createBuffer();

        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer);
        setRectangle(this.gl, 0, 0, 50, 50);

        this.texCoordBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.texCoordBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array([
            0.0,  0.0,
            1.0,  0.0,
            0.0,  1.0,
            0.0,  1.0,
            1.0,  0.0,
            1.0,  1.0,
        ]), this.gl.STATIC_DRAW);

        const texture = this.gl.createTexture();
        this.gl.bindTexture(this.gl.TEXTURE_2D, texture);

        // Set the parameters so we can render any size image.
        // S and T are X and Y wrap respectively, clamp tells webgl not to repeat in these directions.
        // Min and Mag are minimize and magnify filters, nearest means don't scale image, linear will scale.
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.NEAREST);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST);

        this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, image);

        this.resolutionUniformLocation = this.gl.getUniformLocation(this.program, "u_resolution");

        resizeCanvasToDisplaySize(this.gl.canvas);

        this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);

        this.gl.clearColor(0, 0, 0, 0);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);

        this.gl.useProgram(this.program);

        this.gl.enableVertexAttribArray(this.positionAttributeLocation);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer);
        let size = 2;
        let type = this.gl.FLOAT;
        let normalize = false;
        let stride = 0;
        let offset = 0;
        this.gl.vertexAttribPointer(this.positionAttributeLocation, size, type, normalize, stride, offset);
        this.gl.enableVertexAttribArray(this.positionAttributeLocation);

        this.gl.enableVertexAttribArray(this.texCoordLocation);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.texCoordBuffer);
        size = 2;
        type = this.gl.FLOAT;
        normalize = false;
        stride = 0;
        offset = 0;
        this.gl.vertexAttribPointer(this.texCoordLocation, size, type, normalize, stride, offset);
        this.gl.enableVertexAttribArray(this.texCoordLocation);

        this.gl.uniform2f(this.resolutionUniformLocation, this.gl.canvas.width, this.gl.canvas.height);

        let primitiveType = this.gl.TRIANGLES;
        offset = 0;
        let count = 6;
        this.gl.drawArrays(primitiveType, offset, count);

        //this.positionAttributeLocation = this.gl.getAttribLocation(this.program, "a_position");
        //this.positionBuffer = this.gl.createBuffer();
        //this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer);

        //setRectangle(this.gl, 0, 0, image.width, image.height);

        //const texCoordLocation = this.gl.getAttribLocation(this.program, "a_texCoord");
        //this.texCoordBuffer = this.gl.createBuffer();
        //this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.texCoordBuffer);
        //this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array([
        //    0.0,  0.0,
        //    1.0,  0.0,
        //    0.0,  1.0,
        //    0.0,  1.0,
        //    1.0,  0.0,
        //    1.0,  1.0,
        //]), this.gl.STATIC_DRAW);

        //const texture = this.gl.createTexture();
        //this.gl.bindTexture(this.gl.TEXTURE_2D, texture);

        //// S is the X direction, Clamp means don't repeat
        //// T is the Y direction, Clamp means don't repeat
        //// Min filter is for zooming out, mag is for zooming in, nearest means that texture
        //// will not be rescaled.
        //this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
        //this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
        //this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.NEAREST);
        //this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST);

        //this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, image);

        //// Resize canvas and set viewport to fill canvas
        //resizeCanvasToDisplaySize(this.gl.canvas);
        //this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);

        //// Clear canvas
        //this.gl.clearColor(0, 0, 0, 0);
        //this.gl.clear(this.gl.COLOR_BUFFER_BIT);

        //this.gl.useProgram(this.program);


        //this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer);
        //this.gl.enableVertexAttribArray(this.positionAttributeLocation);
        //const size = 2;
        //const type = this.gl.FLOAT;
        //const normalize = false;
        //const stride = 0;
        //const offset = 0;
        //this.gl.vertexAttribPointer(this.positionAttributeLocation, size, type, normalize, stride, offset);

        //this.gl.enableVertexAttribArray(this.texCoordBuffer);
        //this.gl.vertexAttribPointer(texCoordLocation, 2, this.gl.FLOAT, false, 0, 0);

        //this.resolutionUniformLocation = this.gl.getUniformLocation(this.program, "u_resolution");
        //this.gl.uniform2f(this.resolutionUniformLocation, this.gl.canvas.width, this.gl.canvas.height);

        //this.colorUniformLocation = this.gl.getUniformLocation(this.program, "u_color");

        //this.rectangles = [];

        //this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);
    }

    draw(rect: Rectangle): void {
        if (!this.success) return;
        this.rectangles.push(rect);
    }

    display() {
        if (!this.gl || !this.success) return;
        for (const rect of this.rectangles) {
            setRectangle(this.gl, rect.position.x, rect.position.y, rect.x2 - rect.x1, rect.y2 - rect.y1);
            this.gl.uniform4f(this.colorUniformLocation, rect.color.r, rect.color.g, rect.color.b, rect.color.a);
            this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);
        } 
    }


    async displayTexture(image: HTMLImageElement) {
        if (!this.gl || !this.program) return;
        
        const texCoordLocation = this.gl.getAttribLocation(this.program, "a_texCoord");

        // Buffer texture data
        const texCoordBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, texCoordBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array([
            0.0, 0.0,
            1.0, 0.0,
            0.0, 1.0,
            0.0, 1.0,
            1.0, 0.0,
            1.0, 1.0,
        ]), this.gl.STATIC_DRAW);
        this.gl.enableVertexAttribArray(texCoordLocation);
        this.gl.vertexAttribPointer(texCoordLocation, 2, this.gl.FLOAT, false, 0, 0);

        // S is the X direction, Clamp means don't repeat
        // T is the Y direction, Clamp means don't repeat
        // Min filter is for zooming out, mag is for zooming in, nearest means that texture
        // will not be rescaled.
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.NEAREST);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST);

        this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, image);

    }
}

function createShader(
    gl: WebGLRenderingContext,
    type: any,
    source: any
) {
    const shader = gl.createShader(type);
    if (!shader) return;

    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (success) {
        return shader;
    }

    console.log(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
}

function createProgram(
    gl: WebGLRenderingContext, 
    vertexShader: any, 
    fragmentShader: any
) {
    const program = gl.createProgram();
    if (!program) return;

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    const success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (success) {
        return program;
    }

    console.log(gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
}

function resizeCanvasToDisplaySize(canvas: any) {
  // Lookup the size the browser is displaying the canvas in CSS pixels.
  const displayWidth  = canvas.clientWidth;
  const displayHeight = canvas.clientHeight;
 
  // Check if the canvas is not the same size.
  const needResize = canvas.width  !== displayWidth ||
                     canvas.height !== displayHeight;
 
  if (needResize) {
    // Make the canvas the same size
    canvas.width  = displayWidth;
    canvas.height = displayHeight;
  }
 
  return needResize;
}

function randomInt(range: number) {
    return Math.floor(Math.random() * range);
}

function setRectangle(
    gl: WebGLRenderingContext,
    x: number,
    y: number,
    width: number,
    height: number
) {
    const x1 = x;
    const x2 = x + width;
    const y1 = y;
    const y2 = y + height;

    // bufferData will use the last used buffer which in this case
    // is the positionBuffer.
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
        x1, y1,
        x2, y1,
        x1, y2,
        x1, y2,
        x2, y1,
        x2, y2
    ]), gl.STATIC_DRAW);
}
