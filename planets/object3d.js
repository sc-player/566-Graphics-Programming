var Object3d = function(name){
  function checkTextured(val){
    if(typeof val.texture === 'string'){
      this.loaded=false;
      this.textured=true;
      if(val.texture.indexOf(".gif") === -1) loadCubeMap(val.texture, this);
      else loadTexture(val.texture, this);
    } else if(typeof val.constructor === Array) 
      val.forEach(checkTextured, this);
  };
  WObject.call(this, name);
  this.objs.forEach(checkTextured, this);
  this.drawType=gl.TRIANGLES;
  if(typeof this.json.pos !== 'undefined') this.pos=this.json.pos;
  if(typeof this.json.rot !== 'undefined') this.rot=this.json.rot;
  if(typeof this.json.scale !== 'undefined') this.scale=this.json.scale;
};

Object3d.prototype = Object.create(WObject.prototype);
Object3d.prototype.constructor = Object3d;

Object3d.prototype.model = new Matrix4();

Object3d.prototype.cubePoints=new Float32Array([
  //Corners
  //front
  1,  1,  1,    -1,  1,  1,    -1, -1,  1,     1, -1,  1,
  //right
  1,  1,  1,     1, -1,  1,     1, -1, -1,     1,  1, -1,
  //up
  1,  1,  1,     1,  1, -1,    -1,  1, -1,    -1,  1,  1,
  //left
 -1,  1,  1,    -1,  1, -1,    -1, -1, -1,    -1, -1,  1,
  //down
 -1, -1, -1,     1, -1, -1,     1, -1,  1,    -1, -1,  1,
  //back
  1, -1, -1,     1,  1, -1,    -1,  1, -1,    -1, -1, -1,
]);

Object3d.prototype.cubeNormals=new Float32Array([
  0, 0, 1,   0, 0, 1,    0, 0, 1,    0, 0, 1,
  1, 0, 0,   1, 0, 0,    1, 0, 0,    1, 0, 0,
  0, 1, 0,   0, 1, 0,    0, 1, 0,    0, 1, 0,
 -1, 0, 0,  -1, 0, 0,   -1, 0, 0,   -1, 0, 0,
  0,-1, 0,   0,-1, 0,    0,-1, 0,    0,-1, 0,
  0, 0,-1,   0, 0,-1,    0, 0,-1,    0, 0,-1
]);

Object3d.prototype.cube=new Uint8Array([
  0, 1, 2,   0, 2, 3,    //front
  4, 5, 6,   4, 6, 7,    //right
  8, 9,10,  8, 10,11,    //up
 12,13,14,  12,14,15,    //left
 16,17,18,  16,18,19,    //down
 20,21,22,  20,22,23     //back
]);

Object3d.prototype.cubeBuffer={
  position: createBuff(gl.ARRAY_BUFFER, Object3d.prototype.cubePoints),
  normal: createBuff(gl.ARRAY_BUFFER, Object3d.prototype.cubeNormals),
  indices: createBuff(gl.ELEMENT_ARRAY_BUFFER, Object3d.prototype.cube)
};

Object3d.prototype.pyramidPoints=new Float32Array([
  //front 
  0,  1,  0,    -1, -1,  1,     1, -1,  1,
  //right 
  0,  1,  0,     1, -1,  1,     1, -1, -1,
  //left
  0,  1,  0,    -1, -1, -1,     1, -1, -1,
  //back
  0,  1,  0,    -1, -1,  1,    -1, -1, -1,
  //down
 -1, -1, -1,     1, -1, -1,     1, -1,  1,    -1, -1,  1,
]);

Object3d.prototype.pyramidNormals = function(vert){
  var res = [];
  var a, b, c, u, v;
  for(var x=0; x<36; x+=9){
    a=new Vector3(vert.slice(x, x+3));
    b=new Vector3(vert.slice(x+3, x+6));
    c=new Vector3(vert.slice(x+6, x+9));
    u=b.Minus(a);
    v=c.Minus(a);
    cross=u.Cross(v).elements;
    for(var y=0; y<3; ++y)
      res.push(Array.prototype.slice.call(cross));
  }
  for(var x=0; x<4; ++x) res.push([0, -1, 0]);
  return new Float32Array(flatten(res));
}(Object3d.prototype.pyramidPoints);

Object3d.prototype.pyramid=new Uint8Array([
  0, 1, 2,  3, 4, 5,     //front, right
  6, 7, 8,  9,10,11,     //left, back
 12,13,14, 12,14,15      //down
]);

Object3d.prototype.pyramidBuffer={
  position: createBuff(gl.ARRAY_BUFFER, Object3d.prototype.pyramidPoints),
  normal: createBuff(gl.ARRAY_BUFFER, Object3d.prototype.pyramidNormals),
  indices: createBuff(gl.ELEMENT_ARRAY_BUFFER, Object3d.prototype.pyramid)
};

Object3d.prototype.getCurrentTexture = function(){
  return this.currentTexture;
};

Object3d.prototype.checkObjLoaded = function(obj){
  function checkTexLoaded(val){
    if(typeof val.texture !== 'undefined' && (
      typeof textures[val.texture] === 'undefined' ||
        !textures[val.texture].loaded)){
          this.loaded=false;
          return;
    }
    if(typeof(val.objs !== 'undefined')){
      val.objs.forEach(checkTexLoaded, this);
    }
  };
  WObject.prototype.checkObjLoaded.call(this);
  if(this.loaded) return;
  else{
    this.loaded=true;
    this.objs.forEach(checkTexLoaded, this);
  }
};

Object3d.prototype.gatherTextureUnits = function(){
  function gatherUnit(val){
    if(typeof val.texture !== 'undefined'){
      activateTexUnit(this.program, val.texture);
    }
    if(typeof val.objects !== 'undefined'){
      val.objects.forEach(gatherUnit, this);
    }
  };
  WObject.prototype.gatherTextureUnits.call(this);
  this.objs.forEach(gatherUnit, this);
};

Object3d.prototype.createModelMatrix = function(){
  if(typeof this.pos !== 'undefined')
    Object3d.prototype.model.translate(
      this.pos[0], this.pos[1], this.pos[2]
    );
  if(typeof this.rot !== 'undefined')
    Object3d.prototype.model.rotate(
      this.json.rot[0], this.rot[1], this.rot[2], this.rot[3]
    );
  if(typeof this.scale !== 'undefined')
    Object3d.prototype.model.scale(
      this.scale[0], this.scale[1], this.scale[2]
    );
  this.shaderVars.u_NormalMatrix.data= new Matrix4().setInverseOf(
      Object3d.prototype.model
  ).transpose();
};

Object3d.prototype.draw = function(){
  function recursiveDraw(val){
    if(typeof val === 'object') {
      if(typeof val.texture === 'string') this.currentTexture = val.texture;
      if(typeof val.name === 'string'){ 
        AppendModelMatrix(val.pos, val.rot, val.scale);
        WObject.prototype.draw.call(this, this.shaderVars, val.name);
      }
      if(typeof val.objects !== 'undefined')
         val.objects.forEach(recursiveDraw, this);
    }
  };
  Object3d.prototype.model.setIdentity();
  AppendModelMatrix(this.pos, this.rot, this.scale);
  this.objs.forEach(recursiveDraw, this);
};
