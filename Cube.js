class Cube{
    constructor(){
      this.type='cube';
      //this.position =[0.0,0.0,0.0]
      this.color =[1.0,1.0,1.0,1.0]
      this.mouth =[1.0,1.0,1.0,1.0]
      //this.size = 5.0;
      //this.segments = 10;
      this.matrix = new Matrix4();
      this.textureNUm = -2;

      this.cubearray=[
      0,0,0, 1,1,0, 1,0,0,
      0,0,0, 0,1,0, 1,1,0,

      0,0,1, 0,1,1, 1,1,1,
      0,0,1, 1,0,1, 1,1,1,

      0,1,0, 0,1,1, 1,1,1,
      0,1,0, 1,1,0, 1,1,1,

      0,0,0, 0,0,1, 1,0,1,
      0,0,0, 1,0,0, 1,0,1,

      0,0,0, 0,1,0, 0,1,1,
      0,0,0, 0,0,1, 0,1,1,

      1,0,0, 1,1,0, 1,1,1,
      1,0,0, 1,0,1, 1,1,1
 
      ]

      this.uvarray=[
        0,0, 1,1, 1,0,
        0,0, 0,1, 1,1,

        0,0, 0,1, 1,1,
        0,0, 1,0, 1,1,

        0,0, 0,1, 1,1,
        0,0, 1,0, 1,1,

        0,0, 0,1, 1,1,
        0,0, 1,0, 1,1,

        0,0, 0,1, 1,1,
        0,0, 1,0, 1,1,
        0,0, 0,1, 1,1,
        0,0, 1,0, 1,1 

      ]

    }
  
    //render shape
    render(){

        var rgba = this.color;
        //testure num
        gl.uniform1i(u_whichTexture,this.textureNUm)

        //color of front and back
        gl.uniform4f(u_FragColor, rgba[0]*.9, rgba[1]*.9, rgba[2]*.9, rgba[3]);
     
         //pass matrix to 
         gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements)

        
        //draw front of cube
        drawTriangle3DUV( [0,0,0, 1,1,0, 1,0,0], [0,0, 1,1, 1,0] )
        drawTriangle3DUV( [0,0,0, 0,1,0, 1,1,0], [0,0, 0,1, 1,1] )
        //draw back of cube
        drawTriangle3DUV( [0,0,1, 0,1,1, 1,1,1], [0,0, 0,1, 1,1] )
        drawTriangle3DUV( [0,0,1, 1,0,1, 1,1,1], [0,0, 1,0, 1,1] )

        //Top and bottom
        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
        //top
        drawTriangle3DUV( [0,1,0, 0,1,1, 1,1,1], [0,0, 0,1, 1,1] )
        drawTriangle3DUV( [0,1,0, 1,1,0, 1,1,1], [0,0, 1,0, 1,1] )
        //bottom
        drawTriangle3DUV( [0,0,0, 0,0,1, 1,0,1], [0,0, 0,1, 1,1] )
        drawTriangle3DUV( [0,0,0, 1,0,0, 1,0,1], [0,0, 1,0, 1,1] )

       //sides
        gl.uniform4f(u_FragColor, rgba[0]*.8, rgba[1]*.8, rgba[2]*.8, rgba[3]);
        // R
        drawTriangle3DUV( [0,0,0, 0,1,0, 0,1,1], [0,0, 0,1, 1,1] )
        drawTriangle3DUV( [0,0,0, 0,0,1, 0,1,1], [0,0, 1,0, 1,1] )
        // L
        drawTriangle3DUV( [1,0,0, 1,1,0, 1,1,1], [0,0, 0,1, 1,1] )
        drawTriangle3DUV( [1,0,0, 1,0,1, 1,1,1], [0,0, 1,0, 1,1] )



    }

    renderFast(){

      var rgba = this.color;
      //testure num
      gl.uniform1i(u_whichTexture,this.textureNUm)

      //color of front and back
      gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
   
       //pass matrix to 
       gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements)
      /*
      var allverts=[];

      allverts = allverts.concat([0,0,0, 1,1,0, 1,0,0]);
      allverts = allverts.concat([0,0,0, 0,1,0, 1,1,0]);

      allverts = allverts.concat([0,0,1, 0,1,1, 1,1,1]);
      allverts = allverts.concat([0,0,1, 1,0,1, 1,1,1]);

      allverts = allverts.concat([0,1,0, 0,1,1, 1,1,1]);
      allverts = allverts.concat([0,1,0, 1,1,0, 1,1,1]);

      allverts = allverts.concat([0,0,0, 0,0,1, 1,0,1]);
      allverts = allverts.concat([0,0,0, 1,0,0, 1,0,1]);

      allverts = allverts.concat([0,0,0, 0,1,0, 0,1,1]);
      allverts = allverts.concat([0,0,0, 0,0,1, 0,1,1]);

      allverts = allverts.concat([1,0,0, 1,1,0, 1,1,1]);
      allverts = allverts.concat([1,0,0, 1,0,1, 1,1,1]);
      */
 
      FastdrawTriangle3DUV(this.cubearray,this.uvarray);
  }



    //render shape
    render_tri(side,top,flip){
        // side and top 

        var rgba = this.color;
        var mouth = this.mouth;

        //pass matrix to 
        gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements)
        
        if(flip==false){
        //color of point
        gl.uniform4f(u_FragColor, rgba[0]*.9, rgba[1]*.9, rgba[2]*.9, rgba[3]);
   
        //draw front of cube
        drawTriangle3D( [side,0,0, 1-side,1-top,0, 1-side,0,0] )
        drawTriangle3D( [side,0,0, 1-side,1-top,0, side,1-top,0] )

        //draw back of cube
        drawTriangle3D( [0,0,1, 1,1,1, 0,1,1] )
        drawTriangle3D( [0,0,1, 1,1,1, 1,0,1] )
    

        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

        //top
        drawTriangle3D( [side,1-top,0, 0,1,1, 1,1,1] )
        drawTriangle3D( [side,1-top,0, 1-side,1-top,0, 1,1,1] )
        gl.uniform4f(u_FragColor, mouth[0], mouth[1], mouth[2], mouth[3]);
        //bottom
        drawTriangle3D( [side,0,0, 0,0,1, 1,0,1] )
        drawTriangle3D( [side,0,0, 1-side,0,0, 1,0,1] )

        gl.uniform4f(u_FragColor, rgba[0]*.8, rgba[1]*.8, rgba[2]*.8, rgba[3]);

         // R
         drawTriangle3D( [side,0,0, side,1-top,0, 0,1,1] )
         drawTriangle3D( [side,0,0, 0,0,1, 0,1,1] )
         // L
         drawTriangle3D( [1-side,0,0, 1-side,1-top,0, 1,1,1] )
         drawTriangle3D( [1-side,0,0, 1,0,1, 1,1,1] )
   
        }
        else{

        gl.uniform4f(u_FragColor, rgba[0]*.9, rgba[1]*.9, rgba[2]*.9, rgba[3]);
        //draw front of cube
        drawTriangle3D( [0,0,0, 1,1,0, 1,0,0] )
        drawTriangle3D( [0,0,0, 0,1,0, 1,1,0] )

        //back
        gl.uniform4f(u_FragColor, rgba[0]*.9, rgba[1]*.9, rgba[2]*.9, rgba[3]);
        drawTriangle3D( [side,0,1, 1-side,1-top,1, 1-side,0,1] )
        drawTriangle3D( [side,0,1, 1-side,1-top,1, side,1-top,1] )
  

        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

        //top
        drawTriangle3D( [0,1,0, 1,1,0, 1-side,1-top,1] )
        drawTriangle3D( [0,1,0, side,1-top,1, 1-side,1-top,1] )
        gl.uniform4f(u_FragColor, mouth[0], mouth[1], mouth[2], mouth[3]);
        //bottom
        drawTriangle3D( [0,0,0, 1,0,0, 1-side,0,1] )
        drawTriangle3D( [0,0,0, 1-side,0,1, side,0,1] )

        gl.uniform4f(u_FragColor, rgba[0]*.8, rgba[1]*.8, rgba[2]*.8, rgba[3]);

         // L
         drawTriangle3D( [1,0,0, 1,1,0, 1-side,1-top,1] )
         drawTriangle3D( [1,0,0, 1-side,0,1, 1-side,1-top,1] )
         // R
         drawTriangle3D( [0,0,0, 0,1,0, side,1-top,1] )
         drawTriangle3D( [0,0,0, side,0,1, side,1-top,1] )

        }

    }
  }