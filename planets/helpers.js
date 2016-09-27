var shaderDir = "shaders/";

function createShaderProgram(vert, frag){
  var VSHADER = loadExternalShader(vert);
  var FSHADER = loadExternalShader(frag);
  if(!VSHADER || !FSHADER){
    console.log("Shader " + vert + " or " + frag + " cannot be found!");
    return;
  }
  return createProgram(gl, VSHADER, FSHADER);
}

function loadExternalShader(filepath){
  var xhr = new XMLHttpRequest();
  xhr.open('GET', shaderDir+filepath, false);
  xhr.send(null);
  return xhr.responseText;
}

/**
 * Initialize attribute variable in shader.
 *
 * @param {number} att Attribute index in shader program.
 * @param {WebGLBuffer} buffer Buffer to bind
 * @param {number} size Elements to bind to a single vertex.
 * @param {type} type GL type enum.
 */
function initAttribute(att, buffer, size, type){
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.vertexAttribPointer(att, size, type, false, 0, 0);
  gl.enableVertexAttribArray(att);
}

/**
 * Set uniform variable in shader.
 *
 * @param {number} uniform Index of uniform in shader program.
 * @param {Array} arr Array of variables to upload.
 * @param {flo} boolean Is the data floating point or integers?
 */
function setUniform(uniform, arr, flo){
  var res=flatten([arr]);
  gl["uniform"+res.length+((flo) ? "f" : "i")+"v"](uniform, res);
}

/**
 * Take a multi-dimensional array and flatten to a single-dimensional array.
 *
 * @param {Array} multiDArray Array to flatten.
 */
function flatten(multiDArray){
  const flat = [].concat.apply([], multiDArray);
  return flat.some(Array.isArray) ? flatten(flat) : flat;
}

function createBuffer(){
  var buff = gl.createBuffer();
  try{
    return buff;
  }
  catch(err){
    throw ('Failed to create buffer object! ' + err.message);
    return null;
  }
}
