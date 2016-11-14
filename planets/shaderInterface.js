var ShaderVars = function(vars){
  var ShaderVar = function(){
    this.type=-1;
    this.buffer=-1;
    if(arguments.length===0){
      this.texture=true;
    } else if(arguments.length===1){
      this.data=arguments[0];
      this.matrix=true;
    } else if(gl.hasOwnProperty(Object.prototype.toString.call(arguments[1]))){
        this.data=arguments[0];
        this.type=arguments[1];
    } else {
      this.data=arguments[0];
      this.size=arguments[1];
      if(typeof arguments[3] !== 'undefined'){
        if(arguments[2]===gl.ARRAY_BUFFER || 
          arguments[2]===gl.ELEMENT_ARRAY_BUFFER){
            this.buffer=createBuff(arguments[2], this.data);
            this.type=arguments[3];
        } else {
          this.buffer=createBuff(arguments[3], this.data);
          this.type=arguments[2];
        }
      }
      else if(typeof arguments[2] !== 'undefined'){
        if(arguments[2]===gl.ARRAY_BUFFER || 
          arguments[2]===gl.ELEMENT_ARRAY_BUFFER)
            this.buffer=createBuff(arguments[2], this.data); 
        else this.type=arguments[2];
      }
      if(this.type===-1) this.type=gl.FLOAT;
      if(this.buffer===-1) this.buffer=createBuff(gl.ARRAY_BUFFER, this.data);  
    }
  };
  for(i=0; i<vars.attrib.length; ++i){
    if(typeof vars.data[i] === "string") vars.data[i]=Generator[vars.data[i]]();

    if(vars.data[i] === null) this[vars.attrib[i]] = new ShaderVar();

    else if(vars.data[i] === "matrix") 
      this[vars.attrib[i]] = new ShaderVar(vars.data[i]);

    else if(isUniform(vars.attrib[i])) 
      this[vars.attrib[i]] = new ShaderVar(vars.data[i], 
        (typeof vars.types !== 'undefined') ? vars.types[i] : null);

    else{
      this[vars.attrib[i]] = new ShaderVar(
        vars.data[i], vars.sizes[i], (typeof vars.types !== 'undefined') ? 
        vars.types[i] : gl.FLOAT, (typeof vars.buffs !== 'undefined') ? 
        vars.buffs[i] : gl.ARRAY_BUFFER
      );
    }
  }
}

function setAllShaderVars(obj){
  for(var v in obj.shaderVars){ 
    if(obj.shaderVars[v].texture) setUniform(obj.program[v], 
      textures[obj.textures[0]].unit-gl.TEXTURE0, false);
    else if(isUniform(v)){
      if(obj.shaderVars[v].matrix) gl.uniformMatrix4fv(
        obj.program[v], false, obj.shaderVars[v].data.elements
      );
      else setUniform(obj.program[v], obj.shaderVars[v].data, 
        obj.shaderVars[v].type===gl.FLOAT
      );
    }
    else initAttribute(
      obj.program[v], obj.shaderVars[v].buffer, 
      obj.shaderVars[v].size, obj.shaderVars[v].type, 
      obj.shaderVars[v].stride, obj.shaderVars[v].offset
    );
  }
}



/**
 * Load both shaders and create the program object. 
 * @param (string) vert Vertex shader filename.
 * @param (string) frag Fragment shader filename.
 * @return (ShaderProgram) Created program.
 */
function createShaderProgram(vert, frag, shaderVars){
  var VSHADER = loadExternalFile(shaderDir+vert);
  var FSHADER = loadExternalFile(shaderDir+frag);
  if(!VSHADER || !FSHADER){
    console.log("Shader " + vert + " or " + frag + " cannot be found!");
    return;
  }
  var res=createProgram(gl, VSHADER, FSHADER);
  for(var v in shaderVars){
    res[v]=getShaderVar(res, v);
  }
  return res;
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
function initAttribute(att, buffer, size, type, start, stride){
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
function setUniform(uniform, arr, flo){
  if(arr instanceof Matrix4) gl.uniformMatrix4fv(uniform, false, arr.elements);
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
function createBuff(type, data){
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
