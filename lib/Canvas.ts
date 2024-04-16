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
        canvasElement: any
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

        this.rectangles = [];
        
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

        // Set rectanglular texture clip space
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

        this.resolutionUniformLocation = this.gl.getUniformLocation(this.program, "u_resolution");

        resizeCanvasToDisplaySize(this.gl.canvas);

        this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);

        this.gl.clearColor(0, 0, 0, 0);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);

        this.gl.useProgram(this.program);

        this.gl.uniform2f(this.resolutionUniformLocation, this.gl.canvas.width, this.gl.canvas.height);

        this.colorUniformLocation = this.gl.getUniformLocation(this.program, "u_color");
    }

    draw(rect: Rectangle): void {
        if (!this.success) return;
        this.rectangles.push(rect);
    }

    drawTexture(texture: {
        width: number,
        height: number,
        image: HTMLImageElement
    }) {
        if (!this.success || !this.gl) return;
        const tex = this.gl.createTexture();
        this.gl.bindTexture(this.gl.TEXTURE_2D, tex);

        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.NEAREST);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST);

        this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, texture.image);

        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer);
        setRectangle(this.gl, 0, 0, texture.width, texture.height);
        this.gl.enableVertexAttribArray(this.positionAttributeLocation);
        this.gl.vertexAttribPointer(this.positionAttributeLocation, 2, this.gl.FLOAT, false, 0, 0);

        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.texCoordBuffer);
        this.gl.enableVertexAttribArray(this.texCoordLocation);
        this.gl.vertexAttribPointer(this.texCoordLocation, 2, this.gl.FLOAT, false, 0, 0);

        this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);
    }

    display() {
        if (!this.gl || !this.success) return;
        for (const rect of this.rectangles) {
            //this.gl.uniform4f(this.colorUniformLocation, rect.color.r, rect.color.g, rect.color.b, rect.color.a);
            if (rect.hasTexture) this.drawTexture(rect.textureInfo); 
        } 
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
