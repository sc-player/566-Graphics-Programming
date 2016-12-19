/**
 * Philip Strachan
 * shaderInterface.js
 * Engine to create and access shader variables.
 */

//Sources.
var SSources = {};

//Compiled programs.
var ShaderPrograms = {};

/**
 * ShaderVars
 * A ShaderVars contains all the attribute and uniform information that an 
 * object needs to send data to the shader. It is created by reading a JSON
 * object.
 */
var ShaderVars = function(vars, obj){
  var ShaderVar = function(){
    this.type=-1;
    this.buffer=-1;
 
    //Texture
    if(arguments.length === 0) this.texture=true;

    //Uniform
    else if(arguments.length <= 2){
      this.data=arguments[0];
      this.type=arguments[1];
    } 
    
    //Attribute
    else {
      this.data=arguments[0];
      this.size=arguments[1];
      this.type=arguments[3];
      if(this.data === 'indexed') return;   //Data stored in Object3d prototype.
      this.buffer=createBuff(
        arguments[2], (typeof(arguments[0])==="string" ?
        Generator[arguments[0]] : arguments[0]), arguments[4]
      );
    }
  };
  for(i=0; i<vars.attrib.length; ++i){
    //Texture, data comes from texture engine.
    if(vars.data[i] === null) this[vars.attrib[i]] = new ShaderVar();

    //Uniform
    else if(isUniform(vars.attrib[i])) 
      this[vars.attrib[i]] = new ShaderVar(
        typeof vars.data[i] === "string" ? //Data stored in Generator
          typeof Generator[vars.data[i]] === "function" ?
            Generator[vars.data[i]]() : //Call function
            Generator[vars.data[i]] :   //Return already generated data
          vars.data[i],                 //Pass data.
        typeof vars.types !=='undefined' ? vars.types[i] : gl.FLOAT
      );

    //Attribute
    else this[vars.attrib[i]] = new ShaderVar(
      vars.data[i], vars.sizes[i], gl.ARRAY_BUFFER, 
      (typeof vars.types !== 'undefined') ? vars.types[i] : gl.FLOAT 
    ); 
  }
}

/**
 * function setAllShaderVars
 * @param {object} owner - Object that this ShaderVars refers to.
 * @param {string} obj - Object3d name (optional).
 */
ShaderVars.prototype.setAllShaderVars = function(owner, obj){
  var length=0;
  for(var v in this){ 
    if(v === "setAllShaderVars") continue;

    //Bind element buffer.
    if(this[v].data==="indexed") {
      gl.bindBuffer(
        gl.ELEMENT_ARRAY_BUFFER, Object3d.prototype[obj+"Buffer"].indices
      );  
      length = Object3d.prototype[obj].length; 
    }
   
    //Get texture.
    if(this[v].texture){ 
      setUniform(owner.program[v], textures[owner.getCurrentTexture()].unit-
        gl.TEXTURE0, false, v
      );
      continue;
    }

    //Get data.
    var dat = (typeof this[v].data === "string") ? 
      (
        this[v].data === 'indexed' ?
          Object3d.prototype[obj + "Buffer"][     //Data from prototype.
            v.slice(2).toLowerCase()] :           //Data from Generator.
          (
            typeof Generator[this[v].data] === "function" ? 
            Generator[this[v].data](obj) :        //Call function.
            Generator[this[v].data]               //Grab data.
          )
      ) : 
      this[v].data;

    //Grab length if this is not indexed.
    if(v==="a_Position" && typeof elementBuffer === 'undefined') 
      length = dat.length;
    
    //Uniform
    if(isUniform(v)){
      if(dat.hasOwnProperty("elements"))    //Matrix
        gl.uniformMatrix4fv(owner.program[v], false, dat.elements);
      else setUniform(owner.program[v], dat, 
        (this[v].type || gl.FLOAT)===gl.FLOAT, v);
    }

    //Attribute
    else initAttribute(
      owner.program[v], dat instanceof WebGLBuffer ? dat : this[v].buffer, 
      this[v].size, this[v].type, this[v].stride, this[v].offset
    );
  }
  return length;
}

/**
 * Load both shaders and create the program object. 
 * @param (string) vert Vertex shader filename.
 * @param (string) frag Fragment shader filename.
 * @return (ShaderProgram) Created program.
 */
function createShaderProgram(vert, frag, shaderVars){
  if(ShaderPrograms[vert+frag]) return ShaderPrograms[vert+frag];
  if(!SSources[vert]) SSources[vert] = loadExternalFile(shaderDir+vert);
  if(!SSources[frag]) SSources[frag] = loadExternalFile(shaderDir+frag);
  if(!SSources[frag] || !SSources[vert]){
    console.log("Shader " + vert + " or " + frag + " cannot be found!");
    return;
  }
  var res=createProgram(gl, SSources[vert], SSources[frag]);
  for(var v in shaderVars){
    res[v]=getShaderVar(res, v);
  }
  return ShaderPrograms[vert+frag]=res;
}

/**
 * Submits an XML HTTP Request in order to load the shader. 
 *
 * @param (string) Filename of shader program.
 * @return (string) Shader program text.
 */
function loadExternalFile(filepath){
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
  gl.vertexAttribPointer(att, size, type || gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(att);
}

/**
 * Set uniform variable in shader.
 *
 * @param {number} uniform Index of uniform in shader program.
 * @param {Array} arr Array of variables to upload.
 * @param {flo} boolean Is the data floating point or integers?
 */
function setUniform(uniform, arr, flo, debug){
  if(arr instanceof Matrix4) gl.uniformMatrix4fv(uniform, false, arr.elements);
  else if(arr[0] instanceof Array)
    gl["uniform"+arr[0].length+((flo) ? "f" : "i")+"v"](uniform, flatten(arr)); 
  else{
    var res=flatten([arr]); 
    gl["uniform"+res.length+((flo) ? "f" : "i")+"v"](uniform, res);
  }
}

/**
 * Take a multi-dimensional array and flatten to a single-dimensional array.
 *
 * @param {Array} multiDArray Array to flatten.
 * @return (Array) Flattened array.
 */
function flatten(multiDArray){
  const flat = [].concat.apply([], multiDArray);
  return flat.some(Array.isArray) ? flatten(flat) : flat;
}

/**
 * Get location of uniform or attribute.
 *
 * @param (ShaderProgram) program Shader program object to get location from.
 * @param (string) name Name of attribute or uniform.
 * @return (int) Location of variable.
 */
function getShaderVar(program, name){
  return (isUniform(name)) ? gl.getUniformLocation(program, name) : 
    gl.getAttribLocation(program, name);
}

//Unifrom if name starts with u_
function isUniform(name){
  return name[0]==='u';
}

/**
 * Creates an array buffer with data and draw type.
 *
 * @param (ArrayBuffer) data Data to buffer.
 * @param (gl.Draw_Type) draw Draw type for the buffer.
 * @return (GLBuffer) Created buffer.
 */
function createBuff(type, data, name){
  try{
    var res = gl.createBuffer();
    gl.bindBuffer(type, res);
    gl.bufferData(type, data, gl.STATIC_DRAW);
    return res;
  } catch(err){
    throw ('Failed to create buffer object! ' + err.message);
    return null;
  }
}
