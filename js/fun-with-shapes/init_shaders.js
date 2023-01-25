//Initializes a shader program for WebGL
function initShaderProgram(gl, vertex_shader_source, fragment_shader_source)
{
	//initialize the vertex and fragment shader objects
	const vertex_shader = loadShader(gl, gl.VERTEX_SHADER, vertex_shader_source);
	const fragment_shader = loadShader(gl, gl.FRAGMENT_SHADER, fragment_shader_source);

	//Create the shader program
	const shader_program = gl.createProgram();
	gl.attachShader(shader_program, vertex_shader);
	gl.attachShader(shader_program, fragment_shader);
	gl.linkProgram(shader_program);

	//Check for shader program creation failure
	if (!gl.getProgramParameter(shader_program, gl.LINK_STATUS))
	{
		alert("Unable to initialize the shader program: " + gl.getProgramInfoLog(shader_program));
		return null;
	}

	return shader_program;
}

//Creates a shader of the given type from the given source
function loadShader(gl, type, source)
{
	const shader = gl.createShader(type);
	
	gl.shaderSource(shader, source);
	gl.compileShader(shader);

	//Check for successful compilation
	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS))
	{
		alert("An error occurred compiling the shaders: " + gl.getShaderInfoLog(shader));
		gl.deleteShader(shader);
		return null;
	}

	return shader;
}