const canvas = document.querySelector("#canvas");

/** @type {WebGLRenderingContext} */
const gl = canvas.getContext("webgl");

if (!gl) {
    console.log("Failed to get WebGL context.");
} else {
    console.log("WebGL context successfully created.");
}

/**
    * Create a shader
    * @param {WebGLRenderingContext} gl
*/
function createShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (success) {
        return shader;
    }

    console.log(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
}
const vertexShaderSource = document.querySelector("#vertex-shader-2d").text;
const fragmentShaderSource = document.querySelector("#fragment-shader-2d").text;
const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

/**
    * Create the webgl program by linking the shaders
    * @param {WebGLRenderingContext} gl
*/
function createProgram(gl, vertexShader, fragmentShader) {
    const program = gl.createProgram();
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
const program = createProgram(gl, vertexShader, fragmentShader);

// Bind positionBuffer to the ARRAY_BUFFER
const positionAttributeLocation = gl.getAttribLocation(program, "a_position");
const positionBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);


// Resizes the canvas
function resizeCanvasToDisplaySize(canvas) {
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
// Resize canvas and set viewport to fill canvas
resizeCanvasToDisplaySize(gl.canvas);
gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

// Clear canvas
gl.clearColor(0, 0, 0, 0);
gl.clear(gl.COLOR_BUFFER_BIT);

gl.useProgram(program);

// Set the resolution uniform to canvas width / height
const resolutionUniformLocation = gl.getUniformLocation(program, "u_resolution");
gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);

// Tell the attribute how to get data out of positionBuffer
gl.enableVertexAttribArray(positionAttributeLocation);
const size = 2;
const type = gl.FLOAT;
const normalize = false;
const stride = 0;
const offset = 0;
gl.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, offset);

// Fragment shader color uniform location
var colorUniformLocation = gl.getUniformLocation(program, "u_color");
// Draw 50 random rectangles
for (let i = 0; i < 50; i++) {
    // Set rectangle with random position and size
    setRectangle(gl, randomInt(300), randomInt(300), 50, 50);

    // Set random color for fragment shader
    gl.uniform4f(colorUniformLocation, Math.random(), Math.random(), Math.random(), 1);

    // Draw the rectangle
    gl.drawArrays(gl.TRIANGLES, 0, 6);
}

// Returns random int in interval [0, range)
function randomInt(range) {
    return Math.floor(Math.random() * range);
}

/**
    Fills the buffer with the values that define a rectangle
    * @param {WebGLRenderingContext} gl
*/
function setRectangle(gl, x, y, width, height) {
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

// Buffer ARRAY_BUFFER with positions array
const positions = [
    10, 20,
    80, 20,
    10, 30,
    10, 30,
    80, 20,
    80, 30,
];
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

// Set color
gl.uniform4f(colorUniformLocation, 1, 0, 0.5, 1);

// Execute the program
const primitiveType = gl.TRIANGLES;
const draw_offset = 0;
const count = 6;
gl.drawArrays(primitiveType, draw_offset, count);
