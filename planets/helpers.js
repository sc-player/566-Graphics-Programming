function loadExternalShader(filepath, callback){
  var xhr = new XMLHttpRequest();
  xhr.open('GET', filepath, false);
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
