const vertex_shader_source = `
        attribute vec4 aVertexPosition;
        uniform mat4 uModelViewMatrix;
        uniform mat4 uProjectionMatrix;
        void main()
        {
                gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
        }
`;

const fragment_shader_source = `
        void main()
        {
                gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
        }
`;

var numsidesglobal = 3;
var polygonToDraw = createPolygon(0, 0, numsidesglobal, 1);

main();

function main()
{
	//Gets the HTML element with the ID glCanvas
	const canvas = document.querySelector("#glCanvas");

	//Retrieves a/the drawing context on the canvas of contextType webgl
	const gl = canvas.getContext("webgl");
	
	if (gl == null)
	{
		alert("WebGL is either not available, or not working.\nTry another browser");
		return;
	}
	
	gl.clearColor(0, 0, 0, 1);
	gl.clear(gl.COLOR_BUFFER_BIT);

	const shaderProgram = initShaderProgram(gl, vertex_shader_source, fragment_shader_source);
	const programInfo =
	{
		program: shaderProgram,
		attribLocations: 
		{
			vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition')
		},
		uniformLocations:
		{
			projectionMatrix: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
			modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix')
		}
	};


	//currently using trianglefan
	
	var rotationAmount = 0;
	var prevDrawTime = new Date().getTime();
	
	function game_loop()
	{
		curTime = new Date().getTime();
		if (curTime - prevDrawTime > 15)
		{
                	var buffers = initBuffers(gl, polygonToDraw);
        		drawScene(gl, programInfo, buffers, polygonToDraw.length, rotationAmount);
			rotationAmount -= Math.PI * 2 /(360);
			prevDrawTime = curTime;
		}
		requestAnimationFrame(game_loop)
	}
	game_loop();
}

function changeNumberOfSides()
{
	var number = document.getElementById("numSidesForm").elements.namedItem("numSidesEntry").valueAsNumber;
	numsidesglobal = number;
	polygonToDraw = createPolygon(0, 0, numsidesglobal, 1);
}

function initBuffers(gl, position_array) {

  // Create a buffer for the square's positions.

  const positionBuffer = gl.createBuffer();

  // Select the positionBuffer as the one to apply buffer
  // operations to from here out.

  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  // Now pass the list of positions into WebGL to build the
  // shape. We do this by creating a Float32Array from the
  // JavaScript array, then use it to fill the current buffer.

  gl.bufferData(gl.ARRAY_BUFFER,
                new Float32Array(position_array),
                gl.STATIC_DRAW);

  return {position: positionBuffer};
}

function drawScene(gl, programInfo, buffers, vertexCount, rotationAmount) {
  gl.clearColor(0.0, 0.0, 0.0, 1.0);  // Clear to black, fully opaque
  gl.clearDepth(1.0);                 // Clear everything
  gl.enable(gl.DEPTH_TEST);           // Enable depth testing
  gl.depthFunc(gl.LEQUAL);            // Near things obscure far things

  // Clear the canvas before we start drawing on it.

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  // Create a perspective matrix, a special matrix that is
  // used to simulate the distortion of perspective in a camera.
  // Our field of view is 45 degrees, with a width/height
  // ratio that matches the display size of the canvas
  // and we only want to see objects between 0.1 units
  // and 100 units away from the camera.

  const fieldOfView = 45 * Math.PI / 180;   // in radians
  const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
  const zNear = 0.1;
  const zFar = 100.0;
  const projectionMatrix = mat4.create();

  // note: glmatrix.js always has the first argument
  // as the destination to receive the result.
  mat4.perspective(projectionMatrix,
                   fieldOfView,
                   aspect,
                   zNear,
                   zFar);

  // Set the drawing position to the "identity" point, which is
  // the center of the scene.
  const modelViewMatrix = mat4.create();

  // Now move the drawing position a bit to where we want to
  // start drawing the square.

  mat4.translate(modelViewMatrix,     // destination matrix
                 modelViewMatrix,     // matrix to translate
                 [-0.0, 0.0, -6.0]);  // amount to translate

  //rotating the modelview
  	mat4.rotate(modelViewMatrix,
			modelViewMatrix,
			rotationAmount,
			[0, 0, 1]);

  // Tell WebGL how to pull out the positions from the position
  // buffer into the vertexPosition attribute.
  {
    const numComponents = 2;  // pull out 2 values per iteration
    const type = gl.FLOAT;    // the data in the buffer is 32bit floats
    const normalize = false;  // don't normalize
    const stride = 0;         // how many bytes to get from one set of values to the next
                              // 0 = use type and numComponents above
    const offset = 0;         // how many bytes inside the buffer to start from
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
    gl.vertexAttribPointer(
        programInfo.attribLocations.vertexPosition,
        numComponents,
        type,
        normalize,
        stride,
        offset);
    gl.enableVertexAttribArray(
        programInfo.attribLocations.vertexPosition);
  }

  // Tell WebGL to use our program when drawing

  gl.useProgram(programInfo.program);

  // Set the shader uniforms

  gl.uniformMatrix4fv(
      programInfo.uniformLocations.projectionMatrix,
      false,
      projectionMatrix);
  gl.uniformMatrix4fv(
      programInfo.uniformLocations.modelViewMatrix,
      false,
      modelViewMatrix);

  {
    const offset = 0;
    gl.drawArrays(gl.TRIANGLE_FAN, offset, vertexCount/2);
  }
}