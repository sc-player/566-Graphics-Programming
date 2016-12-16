var mStack = [];
function pushMat4(m){
  var m2 = new Matrix4(m);
  mStack.push(m2);
}

function popMat4(){
  return mStack.pop();
}

var sStack = [];
function pushState(s){
  function copy(obj){
    if(obj == null || typeof obj != 'object') return obj;

    var c;
    if(obj instanceof Array) {
      c = [];
      for (var i = 0; i < obj.length; i++) {
        c[i] = copy(obj[i]);
      }
      return c;
    }
    for(var attr in obj){
      c = {};
      if(obj.hasOwnProperty(attr)) c[attr] = copy(obj[attr]);
    }
    return c;
  };
  sStack.push(copy(s));
}

function popState(){
  return sStack.pop();
}

function AppendModelMatrix(pos, rot, scale){
  if(typeof pos !== 'undefined')
    Object3d.prototype.model.translate(pos[0], pos[1], pos[2]);
  if(typeof rot !== 'undefined')
    Object3d.prototype.model.rotate(json.rot[0], rot[1], rot[2], rot[3]);
  if(typeof scale !== 'undefined')
    Object3d.prototype.model.scale(scale[0], scale[1], scale[2]);
};

Vector3.prototype.Plus = function(plu){ 
  var v = new Float32Array(this.elements);
  v[0]+=plu.elements[0];
  v[1]+=plu.elements[1];
  v[2]+=plu.elements[2];
  return new Vector3(v); 
};

Vector3.prototype.Minus = function(min){
  var v = new Float32Array(this.elements);
  v[0]-=min.elements[0];
  v[1]-=min.elements[1];
  v[2]-=min.elements[2];
  return new Vector3(v);
};

Vector3.prototype.Cross = function(oper){
  var v = new Float32Array(3);
  v[0] = this.elements[1] * oper.elements[2] - 
    this.elements[2] * oper.elements[1];
  v[1] = this.elements[2] * oper.elements[0] - 
    this.elements[0] * oper.elements[2];
  v[2] = this.elements[0] * oper.elements[1] - 
    this.elements[0] * oper.elements[1];
  return new Vector3(v);
};
