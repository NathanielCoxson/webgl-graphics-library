import Canvas from "../../lib/Canvas";
import { Color, Position } from "../../lib/Graphics";
import Rectangle from "../../lib/Rectangle";

const canvasElement = document.querySelector("#canvas");
const canvas = new Canvas(canvasElement);

const image = new Image();
image.src = "minesweeper-one.svg";
image.onload = () => {
    const rect = new Rectangle(5, 5, new Position(0, 0), new Color(0, 1, 0, 1));
    rect.setTexture(50, 50, image);
    canvas.draw(rect);
    requestAnimationFrame(() => canvas.display());
    console.log("image loaded");
}

//for (let i = 0; i < 10; i++) {
//    canvas.draw(new Rectangle(5, 5, new Position(10 * i, 10 * i), new Color(0, 1, 0, 1)));
//}

//canvas.draw(new Rectangle(
//    200, 200,
//    new Position(0, 0),
//    new Color(1, 0, 0.5, 1),
//));

//canvas.display();


//function createShader(
//    gl: WebGLRenderingContext,
//    type: any,
//    source: any
//) {
//    const shader = gl.createShader(type);
//    if (!shader) return;
//
//    gl.shaderSource(shader, source);
//    gl.compileShader(shader);
//    const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
//    if (success) {
//        return shader;
//    }
//
//    console.log(gl.getShaderInfoLog(shader));
//    gl.deleteShader(shader);
//}
//
//function createProgram(
//    gl: WebGLRenderingContext, 
//    vertexShader: any, 
//    fragmentShader: any
//) {
//    const program = gl.createProgram();
//    if (!program) return;
//
//    gl.attachShader(program, vertexShader);
//    gl.attachShader(program, fragmentShader);
//    gl.linkProgram(program);
//    const success = gl.getProgramParameter(program, gl.LINK_STATUS);
//    if (success) {
//        return program;
//    }
//
//    console.log(gl.getProgramInfoLog(program));
//    gl.deleteProgram(program);
//}
//
//function resizeCanvasToDisplaySize(canvas: any) {
//  // Lookup the size the browser is displaying the canvas in CSS pixels.
//  const displayWidth  = canvas.clientWidth;
//  const displayHeight = canvas.clientHeight;
// 
//  // Check if the canvas is not the same size.
//  const needResize = canvas.width  !== displayWidth ||
//                     canvas.height !== displayHeight;
// 
//  if (needResize) {
//    // Make the canvas the same size
//    canvas.width  = displayWidth;
//    canvas.height = displayHeight;
//  }
// 
//  return needResize;
//}
//
//function randomInt(range: number) {
//    return Math.floor(Math.random() * range);
//}
//
//
//"use strict";
//
//function main() {
//  var image = new Image();
//  image.src = "pfp.png";
//  image.onload = function() {
//    render(image);
//  };
//}
//
//function render(image: any) {
//  // Get A WebGL context
//  var canvas: HTMLCanvasElement = document.querySelector("#canvas");
//  var gl: WebGLRenderingContext = canvas.getContext("webgl");
//  if (!gl) {
//    return;
//  }
//
//  // setup GLSL program
//  const vertexShaderSource: any = document.querySelector("#vertex-shader-2d")?.textContent;
//  var vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
//  const fragmentShaderSource: any = document.querySelector("#fragment-shader-2d")?.textContent;
//  var fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
//  var program = createProgram(gl, vertexShader, fragmentShader);
//
//  // look up where the vertex data needs to go.
//  var positionLocation = gl.getAttribLocation(program, "a_position");
//  var texcoordLocation = gl.getAttribLocation(program, "a_texCoord");
//
//  // Create a buffer to put three 2d clip space points in
//  var positionBuffer = gl.createBuffer();
//
//  // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
//  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
//  // Set a rectangle the same size as the image.
//  setRectangle(gl, 0, 0, image.width, image.height);
//
//  // provide texture coordinates for the rectangle.
//  var texcoordBuffer = gl.createBuffer();
//  gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);
//  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
//      0.0,  0.0,
//      1.0,  0.0,
//      0.0,  1.0,
//      0.0,  1.0,
//      1.0,  0.0,
//      1.0,  1.0,
//  ]), gl.STATIC_DRAW);
//
//  // Create a texture.
//  var texture = gl.createTexture();
//  gl.bindTexture(gl.TEXTURE_2D, texture);
//
//  // Set the parameters so we can render any size image.
//  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
//  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
//  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
//  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
//
//  // Upload the image into the texture.
//  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
//
//  // lookup uniforms
//  var resolutionLocation = gl.getUniformLocation(program, "u_resolution");
//
//  resizeCanvasToDisplaySize(gl.canvas);
//
//  // Tell WebGL how to convert from clip space to pixels
//  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
//
//  // Clear the canvas
//  gl.clearColor(0, 0, 0, 0);
//  gl.clear(gl.COLOR_BUFFER_BIT);
//
//  // Tell it to use our program (pair of shaders)
//  gl.useProgram(program);
//
//  // Turn on the position attribute
//  gl.enableVertexAttribArray(positionLocation);
//
//  // Bind the position buffer.
//  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
//
//  // Tell the position attribute how to get data out of positionBuffer (ARRAY_BUFFER)
//  var size = 2;          // 2 components per iteration
//  var type = gl.FLOAT;   // the data is 32bit floats
//  var normalize = false; // don't normalize the data
//  var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
//  var offset = 0;        // start at the beginning of the buffer
//  gl.vertexAttribPointer(
//      positionLocation, size, type, normalize, stride, offset);
//
//  // Turn on the texcoord attribute
//  gl.enableVertexAttribArray(texcoordLocation);
//
//  // bind the texcoord buffer.
//  gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);
//
//  // Tell the texcoord attribute how to get data out of texcoordBuffer (ARRAY_BUFFER)
//  var size = 2;          // 2 components per iteration
//  var type = gl.FLOAT;   // the data is 32bit floats
//  var normalize = false; // don't normalize the data
//  var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
//  var offset = 0;        // start at the beginning of the buffer
//  gl.vertexAttribPointer(
//      texcoordLocation, size, type, normalize, stride, offset);
//
//  // set the resolution
//  gl.uniform2f(resolutionLocation, gl.canvas.width, gl.canvas.height);
//
//  // Draw the rectangle.
//  var primitiveType = gl.TRIANGLES;
//  var offset = 0;
//  var count = 6;
//  gl.drawArrays(primitiveType, offset, count);
//}
//
//function setRectangle(gl, x, y, width, height) {
//  var x1 = x;
//  var x2 = x + width;
//  var y1 = y;
//  var y2 = y + height;
//  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
//     x1, y1,
//     x2, y1,
//     x1, y2,
//     x1, y2,
//     x2, y1,
//     x2, y2,
//  ]), gl.STATIC_DRAW);
//}
//
//main();
//
