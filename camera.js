class Camera{

    constructor(){
        this.eye = new Vector3([0,0,4]);
        this.at = new Vector3([0,0,-100]);
        this.up = new Vector3([0,1,0]);
        this.speed = .5;
        this.alpha = 10;
    }

    forward(){

        var at = new Vector3([0,0,0])
        var eye = new Vector3([0,0,0])
        at.set(this.at)
        eye.set(this.eye)

        var d = at.sub(eye)
        d = d.normalize()
        d=d.mul(this.speed)
        this.at.add(d)
        this.eye.add(d)

    }

    back(){
        var at = new Vector3([0,0,0])
        var eye = new Vector3([0,0,0])
        at.set(this.at)
        eye.set(this.eye)
        var d = eye.sub(at)
        d = d.normalize()
        d=d.mul(this.speed)
        this.at.add(d)
        this.eye.add(d)


    }

    left(){
        var at = new Vector3([0,0,0])
        var eye = new Vector3([0,0,0])
        var up = new Vector3([0,0,0])
        at.set(this.at)
        eye.set(this.eye)
        up.set(this.up)

        var d = at.sub(eye)

        var s = Vector3.cross(up,d)

        s = s.normalize()
        s=s.mul(this.speed)
        this.at.add(s)
        this.eye.add(s)


    }
    right(){
        var at = new Vector3([0,0,0])
        var eye = new Vector3([0,0,0])
        var up = new Vector3([0,0,0])
        at.set(this.at)
        eye.set(this.eye)
        up.set(this.up)

        var d = at.sub(eye)

        var s = Vector3.cross(d,up)

        s = s.normalize()
        s=s.mul(this.speed)
        this.at.add(s)
        this.eye.add(s)


    }

    panLeft(){
        var alpha = this.alpha
        var at = new Vector3([0,0,0])
        var eye = new Vector3([0,0,0])
        var up = new Vector3([0,0,0])
        var rotationMatrix = new Matrix4();
        at.set(this.at)
        eye.set(this.eye)
        up.set(this.up)

        rotationMatrix.setRotate(alpha, up.elements[0],  up.elements[1],  up.elements[2])
        var d = at.sub(eye)

        var prime = rotationMatrix.multiplyVector3(d)

        this.at=eye.add(prime)


    }
    panRight(){
        var alpha = this.alpha
        var at = new Vector3([0,0,0])
        var eye = new Vector3([0,0,0])
        var up = new Vector3([0,0,0])
        var rotationMatrix = new Matrix4();
        at.set(this.at)
        eye.set(this.eye)
        up.set(this.up)
        rotationMatrix.setRotate(-alpha, up.elements[0],  up.elements[1],  up.elements[2])

        var d = at.sub(eye)

        var prime = rotationMatrix.multiplyVector3(d)

        this.at=eye.add(prime)
        //this.eye=this.eye.add(prime)


    }

    mosuepanX(alpha){
        var at = new Vector3([0,0,0])
        var eye = new Vector3([0,0,0])
        var up = new Vector3([0,0,0])
        var rotationMatrix = new Matrix4();
        at.set(this.at)
        eye.set(this.eye)
        up.set(this.up)

        rotationMatrix.setRotate(alpha, up.elements[0],  up.elements[1],  up.elements[2])
        var d = at.sub(eye)

        var prime = rotationMatrix.multiplyVector3(d)
   
        this.at=eye.add(prime)



    }

    mosuepanY(alpha){
        var at = new Vector3([0,0,0])
        var eye = new Vector3([0,0,0])
        var up = new Vector3([0,0,0])

        var rotationMatrix = new Matrix4();
        at.set(this.at)
        eye.set(this.eye)
        up.set(this.up)
    
    
        var d = at.sub(eye)

        var s = Vector3.cross(up,d)

        rotationMatrix.setRotate(alpha, s.elements[0],  s.elements[1],  s.elements[2])
       
        var prime = rotationMatrix.multiplyVector3(d)
       
        this.at=eye.add(prime)
   


    }



}
