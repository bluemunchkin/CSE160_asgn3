// ColoredPoint.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE =`
  attribute vec4 a_Position;
  attribute vec2 a_UV;
  varying vec2 v_UV;
  uniform mat4 u_ModelMatrix;
  uniform mat4 u_GlobalRotateMatrix;
  uniform mat4 u_ViewMatrix;
  uniform mat4 u_ProjectionMatrix;


  void main() {
    gl_Position = u_ProjectionMatrix*u_ViewMatrix*u_GlobalRotateMatrix*u_ModelMatrix * a_Position;
    v_UV = a_UV;
  }`

// Fragment shader program
var FSHADER_SOURCE =`
  precision mediump float;
  varying vec2 v_UV;
  uniform vec4 u_FragColor;  // uniform
  uniform sampler2D u_Sampler0;
  uniform sampler2D u_Sampler1;
  uniform sampler2D u_Sampler2;
  uniform int u_whichTexture;
  void main() {

    if (u_whichTexture == -2){
      gl_FragColor = u_FragColor;

    } else if(u_whichTexture == -1){
      gl_FragColor = vec4(v_UV,1.0,1.0);

    } else if(u_whichTexture == 0){
      gl_FragColor = texture2D(u_Sampler0, v_UV);

    } else if(u_whichTexture == 1){
      gl_FragColor = texture2D(u_Sampler1, v_UV);

    }else if(u_whichTexture == 2){
      gl_FragColor = texture2D(u_Sampler2, v_UV);

    }else{
      gl_FragColor = vec4(1,.2,.2,1);
    }
  }`

// global var
let canvas;
let gl;
let a_Position;
let a_UV
let u_FragColor;
let u_ModelMatrix;
let u_GlobalRotateMatrix;
let u_ProjectionMatrix
let u_ViewMatrix
let u_Sampler0;
let u_Sampler1;
let u_Sampler2;
let u_whichTexture;
let cam = new Camera();

function setupWebGL(){
  // Retrieve <canvas> element
  canvas = document.getElementById('webgl');

  // Get the rendering context for WebGL
  //gl = getWebGLContext(canvas);
  gl = canvas.getContext("webgl",{preserveDrawingBuffer: true})
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }
  gl.enable(gl.DEPTH_TEST);


}


function connectVariablesToGLSL(){

  // Initialize shaders
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to intialize shaders.');
    return;
  }

  // Get the storage location of a_Position
  a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if (a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return;
  }
  // Get the storage location of a_UV
  a_UV = gl.getAttribLocation(gl.program, 'a_UV');
  if (a_UV < 0) {
    console.log('Failed to get the storage location of a_UV');
    return;
  }

  // Get the storage location of u_FragColor
  u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
  if (!u_FragColor) {
    console.log('Failed to get the storage location of u_FragColor');
    return;
  }

  u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
  if (!u_ModelMatrix) {
    console.log('Failed to get the storage location of u_ModelMatrix');
    return;
  }

  u_GlobalRotateMatrix = gl.getUniformLocation(gl.program, 'u_GlobalRotateMatrix');
  if (!u_GlobalRotateMatrix) {
    console.log('Failed to get the storage location of u_GlobalRotateMatrix');
    return;
  }

  // Get the storage location of the u_Sampler0
  u_Sampler0 = gl.getUniformLocation(gl.program, 'u_Sampler0'); 
  if(!u_Sampler0){
    console.log('Failed to get location of u_Sampler0')
    return false
  }

  // Get the storage location of the u_Sampler1
  u_Sampler1 = gl.getUniformLocation(gl.program, 'u_Sampler1'); 
  if(!u_Sampler1){
    console.log('Failed to get location of u_Sampler1')
    return false
  }

  // Get the storage location of the u_Sampler2
  u_Sampler2 = gl.getUniformLocation(gl.program, 'u_Sampler2'); 
  if(!u_Sampler2){
    console.log('Failed to get location of u_Sampler2')
    return false
  }

  // Get the storage location of the u_whichTexture
  u_whichTexture = gl.getUniformLocation(gl.program, 'u_whichTexture'); 
  if(!u_whichTexture){
    console.log('Failed to get location of u_whichTexture')
    return false
  }
   // Get the storage location of the u_ProjectionMatrix
   u_ProjectionMatrix = gl.getUniformLocation(gl.program, 'u_ProjectionMatrix'); 
   if(!u_ProjectionMatrix){
     console.log('Failed to get location of u_ProjectionMatrix')
     return false
   }
    // Get the storage location of the u_ViewMatrix
    u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix'); 
  if(!u_ViewMatrix){
    console.log('Failed to get location of u_ViewMatrix')
    return false
  }


  var identityM = new Matrix4();
  gl.uniformMatrix4fv(u_ModelMatrix, false, identityM.elements)



}

//constant
//const POINT =0
//const TRIANGLE =1
//const CIRCLE =2
//global ui
//let g_selectedColor =[1.0,1.0,1.0,1.0];
//let g_selectedSize = 5;

let RotateBody = -40;
let RotateNeck = 20;
let RotateHead = 30;
let Mouthopen = 10;
let RotateTail =40;
let back_leg_1 =40;
let back_leg_2 =20; 
let front_leg_1 =-80;
let front_leg_2 =0;
let animation = false;
//let g_selectedType = POINT
  /*
function addActionsforHtmlUI(){

  //button
  document.getElementById("Animation_ON").onclick = function(){ animation=true;renderALLshapes();}
  document.getElementById("Animation_OFF").onclick = function(){ animation=false;renderALLshapes();}
  //document.getElementById("pointButton").onclick = function(){ g_selectedType = POINT}
  //document.getElementById("triangleButton").onclick = function(){ g_selectedType = TRIANGLE}
  //document.getElementById("circleButton").onclick = function(){ g_selectedType = CIRCLE}
  //slider
  document.getElementById("Mouthopen").addEventListener("mouseup", function(){  Mouthopen= this.value;renderALLshapes();}) 
  document.getElementById("RotateHead").addEventListener("mouseup", function(){  RotateHead= this.value;renderALLshapes(); }) 
  document.getElementById("RotateNeck").addEventListener("mousemove", function(){ RotateNeck= this.value;renderALLshapes(); })
  document.getElementById("RotateBody").addEventListener("mousemove", function(){ RotateBody= this.value;renderALLshapes();})
  document.getElementById("RotateTail").addEventListener("mousemove", function(){ RotateTail= this.value;renderALLshapes();})
  document.getElementById("angleslider_x").addEventListener("mousemove", function(){ g_globalAngle_x= Number(this.value); renderALLshapes();})
  //legs
  document.getElementById("back_leg_1").addEventListener("mouseup", function(){  back_leg_1= this.value;renderALLshapes();}) 
  document.getElementById("back_leg_2").addEventListener("mouseup", function(){  back_leg_2= this.value;renderALLshapes(); }) 
  document.getElementById("front_leg_1").addEventListener("mousemove", function(){ front_leg_1= this.value;renderALLshapes(); })
  document.getElementById("front_leg_2").addEventListener("mousemove", function(){ front_leg_2= this.value;renderALLshapes();})
  
};
*/
function initTextures(){

  var texture = gl.createTexture(); // Create a texture object
  if(!texture){
    console.log('Failed to create the texture object')
    return false
  } 
  
  var image = new Image(); // Create an image object  
  if(!image){
    console.log('Failed to get create the image object')
    return false
  }
  // Register the event handler to be called on loading an image
  image.onload = function(){ sendTextureToGLSL( image,texture,u_Sampler0,0); };
  // Tell the browser to load an image
  image.src = 'bricksRed.png'; 


  var texture2 = gl.createTexture(); // Create a texture object
  if(!texture2){
    console.log('Failed to create the texture object')
    return false
  } 

  var image2 = new Image(); // Create an image object  
  if(!image2){
    console.log('Failed to get create the image object')
    return false
  }

   // Register the event handler to be called on loading an image
  image2.onload = function(){ sendTextureToGLSL( image2,texture2,u_Sampler1,1); };
   // Tell the browser to load an image
  image2.src = 'bricksGreen.png'; 


  var texture3 = gl.createTexture(); // Create a texture object
  if(!texture3){
    console.log('Failed to create the texture object')
    return false
  } 

  var image3 = new Image(); // Create an image object  
  if(!image3){
    console.log('Failed to get create the image object')
    return false
  }

   // Register the event handler to be called on loading an image
  image3.onload = function(){ sendTextureToGLSL( image3,texture3,u_Sampler2,2); };
   // Tell the browser to load an image
  image3.src = 'tv.png'; 

  return true;
  } 

  function sendTextureToGLSL(image,texture,u_Sampler,texunit){

  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); // Flip the image's y axis
  // Enable the texture unit 0
  if (texunit == 0) {
    gl.activeTexture(gl.TEXTURE0);
    } else if(texunit == 1){
    gl.activeTexture(gl.TEXTURE1);
  } else{
    gl.activeTexture(gl.TEXTURE2);
  }
  //gl.activeTexture(gl.TEXTURE0);
  // Bind the texture object to the target
  gl.bindTexture(gl.TEXTURE_2D, texture); 
  // Set the texture parameters
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  // Set the texture image
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
  // Set the texture unit 0 to the sampler
  gl.uniform1i(u_Sampler, texunit);

}

function main() {
  
  mapinit();
  //canvas
  setupWebGL();
  //GLSL shader
  connectVariablesToGLSL();
  //button
  //addActionsforHtmlUI();

  initTextures();
  
  // Register function (event handler) to be called on a mouse press
  //canvas.onmousedown = click;
  //canvas.onmousedown = function(ev){ if(ev.buttons == 1){ clickdown(ev)}};
  //canvas.onmousemove = function(ev){ if(ev.buttons == 1){ click(ev)}};
  //canvas.onmouseup = function(ev){ if(ev.buttons == 1){ clickup(ev)}};
  canvas.onmousemove = function(ev){MouseTrack(ev)};

  document.onkeydown = keydown;


  // Specify the color for clearing <canvas>
  //gl.clearColor(0.5, 0.8, 1.0, 1.0);
  gl.clearColor(0.9, 0.8, 4.0, 1.0);


  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
  gl.clear(gl.COLOR_BUFFER_BIT);

  requestAnimationFrame(tick)
}


var startTime = performance.now()/1000;
var seconds = performance.now()/1000 - startTime;
function tick(){

  seconds = performance.now()/1000 - startTime;
    //console.log(performance.now())

  AnimationAngle();

  shiftAnimation();

  renderALLshapes();



  requestAnimationFrame(tick)

}


let g_globalAngle_x =0;
let g_globalAngle_y =0;
let last_x =0;
let last_y =0;
let shiftanimation= false;
let oppening =false


function MouseTrack(ev){
  
  //xy of mouse 
  let [x,y] = convertCoordinatesEventToGL(ev);

  var dx=  60*(last_x-x)
  var dy=  60*(last_y-y)

  last_y=y
  last_x=x
  cam.mosuepanX(dx)
  cam.mosuepanY(dy)
  


}



function convertCoordinatesEventToGL(ev){
  var x = ev.clientX; // x coordinate of a mouse pointer
  var y = ev.clientY; // y coordinate of a mouse pointer
  var rect = ev.target.getBoundingClientRect();

  x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
  y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);

  return([x,y]);
}


function AnimationAngle(){
  if(animation){
    back_leg_1 = 45*Math.sin(1.5*seconds);
    back_leg_2 = -45*Math.sin(1.5*seconds); 
    front_leg_1 = 45*Math.sin(1.5*seconds);
    front_leg_2 = -45*Math.sin(1.5*seconds);

    RotateHead = 10*Math.sin(1.5*seconds);
    RotateTail = 10*Math.sin(1.5*seconds);

  }
}



function shiftAnimation(){

    if(shiftanimation == true){

      if(Mouthopen >= 80){
        oppening = false
      }

      if(oppening == true){
        Mouthopen+=2
      }
      else{
        Mouthopen-=10
      }

      if(Mouthopen <= 0){
        shiftanimation = false;
        oppening = false
      }
    }
   
}

function keydown(ev){
  //var d = 0.2
  //w
  if (ev.keyCode == 87){
    cam.forward()
  }
  //s
  else if(ev.keyCode == 83){
    cam.back()
  }
  //a
  else if (ev.keyCode == 65){
    cam.left()
  }
  //d
  else if(ev.keyCode == 68){
    cam.right()
  }
  //q
  else if (ev.keyCode == 81){
    cam.panLeft()
  }
  //e
  else if(ev.keyCode == 69){
    cam.panRight()
  }
  else if(ev.keyCode == 67){
    placeblock()
  }
  else if(ev.keyCode == 88){
    deleteblock()
  }

}
/*
let wall=[1,1,1,1,1]
let nothing=[0,0,0,0,0]
//var wall=nothing
let allWall=[wall,wall,wall,wall,wall,wall,wall,wall,wall,wall,wall,wall,wall,wall,wall,wall,wall,wall,wall,wall,wall,wall,wall,wall,wall,wall,wall,wall,wall,wall,wall,wall]
let sideWall=[wall,nothing,nothing,nothing,nothing,nothing,nothing,nothing,nothing,nothing,nothing,nothing,nothing,nothing,nothing,nothing,nothing,nothing,nothing,nothing,nothing,nothing,nothing,nothing,nothing,nothing,nothing,nothing,nothing,nothing,nothing,wall]
let g_map = [allWall,sideWall,sideWall,sideWall,sideWall,sideWall,sideWall,sideWall,sideWall,sideWall,sideWall,sideWall,sideWall,sideWall,sideWall,sideWall,sideWall,sideWall,sideWall,sideWall,sideWall,sideWall,sideWall,sideWall,sideWall,sideWall,sideWall,sideWall,sideWall,sideWall,sideWall,allWall]
*/
let g_map=[]
function mapinit(){

  var allWall=[]
  var sideWall=[]
  for (var x = 0; x < 32; x++){
    allWall[x]=[1,1,1,1,1];
  }
  for (var x = 0; x < 32; x++){
    sideWall[x]=[0,0,0,0,0];
  }
  sideWall[0]=[1,1,1,1,1];
  sideWall[31]=[1,1,1,1,1];

  for (var x = 0; x < 32; x++){
    g_map[x]= structuredClone(sideWall);
  }

  g_map[0]=structuredClone(allWall);
  g_map[31]=structuredClone(allWall);

}



function drawmap(){
  var Cubes = new Cube();
  Cubes.textureNUm=0;
  Cubes.matrix.scale(0.5,0.5,0.5)
  for (var x = 0; x < 32; x++){
    for(var z = 0; z<32; z++){
      for(var y=0;y<5; y++){
        if(g_map[x][z][y]==1){
        
          Cubes.matrix.translate(x-16,y-1.5,z-16)
          Cubes.renderFast()
          Cubes.matrix.translate(-(x-16),-(y-1.5),-(z-16))
        }
      }
    }
  }
}

function placeblock(){

  //console.log(  cam.eye.elements)
  x= Math.floor(cam.eye.elements[0]*2 +16)
  y= Math.floor(cam.eye.elements[1] +1)
  z= Math.floor(cam.eye.elements[2]*1.25 +16)

  
  if( g_map[x][z][y]==0){
    
    g_map[x][z][y]=1
  }
  
  //g_map[20][20][2]=1

}

function deleteblock(){
  x= Math.floor(cam.eye.elements[0]*2 +16)
  y= Math.floor(cam.eye.elements[1] +1)
  z= Math.floor(cam.eye.elements[2]*1.25 +16)

  
  if( g_map[x][z][y]==1){
    
    g_map[x][z][y]=0
  }
}


function renderALLshapes(){

  var startTime_render = performance.now();

  // Clear <canvas>
  //gl.clear(gl.COLOR_BUFFER_BIT);

  var globalRotMat= new Matrix4().rotate(g_globalAngle_x,0,1,0);
  globalRotMat= globalRotMat.rotate(g_globalAngle_y,1,0,0);
  gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);


  var projMat= new Matrix4()
  projMat.setPerspective(60, canvas.width/canvas.height,.1,100)
  gl.uniformMatrix4fv(u_ProjectionMatrix, false, projMat.elements);

  var viewMat= new Matrix4()
  viewMat.setLookAt(cam.eye.elements[0],cam.eye.elements[1],cam.eye.elements[2], cam.at.elements[0],cam.at.elements[1],cam.at.elements[2], cam.up.elements[0],cam.up.elements[1],cam.up.elements[2])
  gl.uniformMatrix4fv(u_ViewMatrix, false, viewMat.elements);

  
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
  gl.clear(gl.COLOR_BUFFER_BIT)


  drawmap();

  
  //CUBE 1
  var Cube1 = new Cube();
  Cube1.color = [0.8,0.3,0.2,1.0]
  Cube1.matrix.translate(-.33,-0.7,0.0)
  Cube1.textureNUm = 1;
  Cube1.matrix.scale(0.5,0.5,0.5)
  Cube1.render()

  //tv
  var tv = new Cube();
  tv.color = [0.8,0.3,0.2,1.0]
  tv.matrix.translate(.5,-0.7,0.0)
  tv.textureNUm = 2;
  tv.matrix.scale(0.5,0.5,0)
  tv.render()
  /*

  //CUBE 2
  var Cube2 = new Cube();
  Cube2.color = [0.3,0.8,0.2,1.0]
  Cube2.matrix.translate(0.0,0.0,0.0)
  Cube2.matrix.scale(0.5,0.5,0.5)
  Cube2.render()

  //CUBE 3
  var Cube3 = new Cube();
  Cube3.color = [0.3,0.8,0.2,1.0]
  Cube3.textureNUm = 1;
  Cube3.matrix.translate(1,-0.2,0.0)
  Cube3.matrix.scale(0.5,0.5,0.5)
  Cube3.render()
*/

  //Floor
  var floor = new Cube();
  floor.color = [0.09,0.015,0.14,1.0]
  floor.textureNUm=0;
  floor.matrix.translate(0.0,-0.75,0.0)
  floor.matrix.scale(32,0,32)
  floor.matrix.translate(-0.5,0.0,-0.5)
  floor.render()

  //sky box

  var sky = new Cube();
  //sky.color = [0.5, 0.8, 1.0, 1.0]
  sky.color =[0.09,0.015,0.14,1.0]
  sky.textureNUm = -2;
  sky.matrix.scale(50,50,50)
  sky.matrix.translate(-0.5,-0.5,-0.5)
  sky.render()


 

  //body main
  var body_top = new Cube();
  body_top.color = [0.3,0.8,0.2,1.0]
  body_top.mouth = [0.3,0.8,0.2,1.0]
  body_top.matrix.rotate(RotateBody,1.0,0.0,0.0)
  //body_top.matrix.rotate(180,0,1,0)
  var body_top_mat = new Matrix4(body_top.matrix);
  body_top.matrix.translate(-0.2,-0.2,0.0)
  body_top.matrix.scale(0.25,0.05,0.25)
  body_top.render()

  
  var body_bottom = new Cube();
  body_bottom.color = [0.9,1,0.5,1.0]
  body_bottom.mouth = [0.9,1,0.5,1.0]
  body_bottom.matrix =   new Matrix4(body_top_mat);
  //body_bottom.matrix.rotate(180,0,1,0)
  body_bottom.matrix.translate(-0.2,-.25,0.0)
  body_bottom.matrix.scale(0.25,0.05,0.25)
  //body_bottom.matrix.translate(0.0,-1.0,0.0)

  body_bottom.render()
  

  //legs

  //back 1
  var leg_back_1 = new Cube();
  leg_back_1.color = [0.3,0.8,0.2,1.0]
  leg_back_1.mouth = [0.3,0.8,0.2,1.0]
  leg_back_1.matrix = new Matrix4(body_top_mat);

  leg_back_1.matrix.translate(0.1,-0.2,0.05)
  leg_back_1.matrix.rotate(back_leg_1,1,0,0)
  leg_back_1.matrix.translate(-0.1,0.2,-0.05)

  
  leg_back_1.matrix.rotate(90,0,0,1)
  leg_back_1.matrix.rotate(90,0,1,0)
  

  leg_back_1.matrix.translate(-0.1,0.2,-.3)
  leg_back_1.matrix.scale(0.075,0.05,0.125)
  leg_back_1.render_tri(.4,.5,false)
  // back 2
  var leg_back_2 = new Cube();
  leg_back_2.color = [0.3,0.8,0.2,1.0]
  leg_back_2.mouth = [0.3,0.8,0.2,1.0]
  leg_back_2.matrix = new Matrix4(body_top_mat);

  leg_back_2.matrix.translate(0.1,-0.2,0.05)
  leg_back_2.matrix.rotate(back_leg_2,1,0,0)
  leg_back_2.matrix.translate(-0.1,0.2,-0.05)

  leg_back_2.matrix.rotate(90,0,0,-1)
  leg_back_2.matrix.rotate(270,0,1,0)
  leg_back_2.matrix.translate(0.025,0.05,-.3)
  leg_back_2.matrix.scale(0.075,0.05,0.125)
  leg_back_2.render_tri(.4,.5,false)

  //tail
  var tail_top = new Cube();
  tail_top.color = [0.3,0.8,0.2,1.0]
  tail_top.mouth = [0.3,0.8,0.2,1.0]
  tail_top.matrix = new Matrix4(body_top_mat);

  tail_top.matrix.translate(-0.2,-0.2,0.0)
  tail_top.matrix.rotate(RotateTail,1,0,0)
  tail_top.matrix.translate(0.2,0.2,0.0)
  
  var tail_top_mat = new Matrix4(tail_top.matrix);
  tail_top.matrix.translate(-0.2,-0.2,-0.35)
  tail_top.matrix.scale(0.25,0.05,0.35)
  tail_top.render_tri(.4,.5,false)
  //tail bottom
  var tail_bottom = new Cube();
  tail_bottom.color = [0.9,1,0.5,1.0]
  tail_bottom.mouth = [0.9,1,0.5,1.0]
  tail_bottom.matrix = new Matrix4(tail_top_mat);

  tail_bottom.matrix.rotate(180,0.0,0.0,1.0)
  tail_bottom.matrix.translate(-0.05, 0.2,-0.35)
  tail_bottom.matrix.scale(0.25,0.05,0.35)
  tail_bottom.render_tri(.4,.5,false)

  //neck
  var body_top_2 = new Cube();
  body_top_2.color = [0.3,0.8,0.2,1.0]
  body_top_2.mouth = [0.3,0.8,0.2,1.0]
  body_top_2.matrix = body_top_mat;

  body_top_2.matrix.translate(-0.2,-0.2,0.25)
  body_top_2.matrix.rotate(RotateNeck,1,0,0)
  body_top_2.matrix.translate(0.2,0.2,-0.25)
  var body_top_2_mat = new Matrix4(body_top_2.matrix);

  body_top_2.matrix.translate(-0.2,-0.2,0.25)
  body_top_2.matrix.scale(0.25,0.05,0.25)
  body_top_2.render_tri(.1,.1,true)
  
  //neck bottom
  var body_bottom_2 =new Cube();
  body_bottom_2.color = [0.9,1,0.5,1.0]
  body_bottom_2.matrix = new Matrix4(body_top_2.matrix);
  body_bottom_2.matrix.rotate(180,0.0,0.0,1.0)
  body_bottom_2.matrix.translate(-1.0,0.0,0.0)
  //body_bottom_2.render()
  body_bottom_2.render_tri(.1,.1)
  

   //legs front

  //front 1
  var leg_front_1 = new Cube();
  leg_front_1.color = [0.3,0.8,0.2,1.0]
  leg_front_1.mouth = [0.3,0.8,0.2,1.0]
  leg_front_1.matrix = new Matrix4(body_top_2_mat);

  leg_front_1.matrix.translate(-0.1,-0.2,0.425)
  leg_front_1.matrix.rotate(front_leg_1,1,0,0)
  leg_front_1.matrix.translate(0.1,0.2,-0.425)

  leg_front_1.matrix.rotate(90,0,0,1)
  leg_front_1.matrix.rotate(90,0,1,0)
  leg_front_1.matrix.translate(-0.48,0.18,-.3)
  leg_front_1.matrix.scale(0.075,0.05,0.125)
  leg_front_1.render_tri(.4,.5,false)
  // front 2
  var leg_front_2 = new Cube();
  leg_front_2.color = [0.3,0.8,0.2,1.0]
  leg_front_2.mouth = [0.3,0.8,0.2,1.0]
  leg_front_2.matrix = new Matrix4(body_top_2_mat);

  leg_front_2.matrix.translate(-0.1,-0.2,0.425)
  leg_front_2.matrix.rotate(front_leg_2,1,0,0)
  leg_front_2.matrix.translate(0.1,0.2,-0.425)

  leg_front_2.matrix.rotate(90,0,0,-1)
  leg_front_2.matrix.rotate(270,0,1,0)
  leg_front_2.matrix.translate(0.4,0.03,-.3)
  leg_front_2.matrix.scale(0.075,0.05,0.125)
  leg_front_2.render_tri(.4,.5,false)



  //Head
  var head_top =new Cube();
  head_top.color = [0.3,0.8,0.2,1.0]
  head_top.mouth = [.8,0.4,0.4,1.0]
  head_top.matrix = body_top_2_mat;
  head_top.matrix.translate(-0.175,-0.2,0.5)
  head_top.matrix.rotate(RotateHead,1,0,0)
  head_top.matrix.translate(0.175,0.2,-0.5)
  var head_top_mat = new Matrix4(head_top.matrix);
  head_top.matrix.translate(-0.175,-0.2,0.5)
  head_top.matrix.rotate(Mouthopen,-1,0,0)
  head_top.matrix.translate(0.175,0.2,-0.5)
  var head_top_open_mat = new Matrix4(head_top.matrix);
  //
  head_top.matrix.translate(-0.175,-0.2,0.5)
  head_top.matrix.scale(0.2,0.045,0.25)
  head_top.render_tri(.25,.25,true)

  //eye 1
  var eye_1 = new Cube();
  eye_1.color =  [0.3,0.8,0.2,1.0]
  eye_1.mouth = [0,0,0,1]
  eye_1.matrix = new Matrix4(head_top_open_mat);
  eye_1.matrix.rotate(90,-1,0,0)
  eye_1.matrix.rotate(90,0,0,1)
  //head_bottom.matrix.rotate(180,0.0,0.0,1.0)
  eye_1.matrix.translate(-0.6,-0.02,-0.16)
  //eye_1.matrix.scale(0.2,0.045,0.25)
  eye_1.matrix.scale(0.075,0.05,0.025)
  eye_1.render_tri(.25,.25,true)

  //eye 2
  var eye_2 = new Cube();
  eye_2.color =  [0.3,0.8,0.2,1.0]
  //eye_2.mouth = [.9,.9,.7,1]
  eye_2.mouth = [0,0,0,1]
  eye_2.matrix = new Matrix4(head_top_open_mat);
  eye_2.matrix.rotate(180,0,1,0)
  eye_2.matrix.rotate(90,-1,0,0)
  eye_2.matrix.rotate(90,0,0,1)
  eye_2.matrix.translate(0.525,-0.17,-0.16)
  eye_2.matrix.scale(0.075,0.05,0.025)
  eye_2.render_tri(.25,.25,true)
  

  //head bottom
  var head_bottom = new Cube();
  head_bottom.color = [0.9,1,0.5,1.0]
  head_bottom.mouth = [1,0.4,0.4,1.0]
  head_bottom.matrix = new Matrix4(head_top_mat);

  head_bottom.matrix.rotate(180,0.0,0.0,1.0)
  head_bottom.matrix.translate(-0.025,0.2,0.5)
  head_bottom.matrix.scale(0.2,0.045,0.25)
  head_bottom.render_tri(.25,.25,true)


  var duration = performance.now() - startTime_render;
  sendTextToHTML("ms: " + Math.floor(duration) + "fps: " + Math.floor(10000/duration),"numdot")


}

function sendTextToHTML(text,htmlID){
  var htmlElm = document.getElementById(htmlID);
  if(!htmlElm){
    console.log("Fialed to get " + htmlID + "from HTML")
    return;
  }
  htmlElm.innerHTML = text;

}


