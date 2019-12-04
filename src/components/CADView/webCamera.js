import * as THREE from 'three';

class webCamera{
    constructor(){
        this.camera3D = null;
        this.camera2D = null;
        this.cameraUI = null;
        this.fov = null;
        this.defaultViewDistance = null;
        this.targetPosition = null;
        this.cameraSpeed = null;
        this.animateCamera = false;
        this.animationEnabled = false;
        this.renderWindow = null;
        this.originalDistanceToTarget = null;
        this.targetLookAtPosition = null;
        this.mouseHandle = null;    
    }


    init = function (renderWindow) {
        this.renderWindow = renderWindow;
        var canvasWidth = this.renderWindow.clientWidth;
        var canvasHeight = this.renderWindow.clientHeight;
      
        var aspectRatio = canvasWidth / canvasHeight;
        this.fov = 45;
        var nearClipDistance = 1.0; //Graphic errors occur if this is less than 1 and the camera is zoomed out.
        var farClipDistance = 10000000;
      
        this.camera3D = new THREE.PerspectiveCamera(this.fov, aspectRatio, nearClipDistance, farClipDistance);
        this.camera3D.name = "Camera3D";
      
        this.cameraUI = new THREE.PerspectiveCamera(this.fov, aspectRatio, nearClipDistance, farClipDistance);
        this.cameraUI.name = "CameraUI";
      
        this.cameraUI.position.x = 0;
        this.cameraUI.position.y = 0;
        this.cameraUI.position.z = 50;
        this.cameraUI.lookAt(new THREE.Vector3(0, 0, 0));
      
        var leftSide = -(canvasWidth / 2);
        var rightSide = canvasWidth / 2;
        var topSide = canvasHeight / 2;
        var bottomSide = -(canvasHeight / 2);
        this.camera2D = new THREE.OrthographicCamera(leftSide, rightSide, topSide,
          bottomSide, nearClipDistance, farClipDistance);
      
        this.targetLookAtPosition = new THREE.Vector3(0, 0, 0);
      
        this.setPosition(0, 0, 1);
      
        this.camera2D.position.x = 0;
        this.camera2D.position.y = 0;
        this.camera2D.position.z = nearClipDistance + 1;//Make sure the camera is within the clipping frustrum
      
        this.targetPosition = new THREE.Vector3(this.camera3D.position.x, this.camera3D.position.y, this.camera3D.position.z);
        this.cameraSpeed = 0;
        this.defaultViewDistance = 1;
      
        var instance = this;
      
        this.mouseHandle = function (data) { instance.cancelAnimation(data); };
        this.renderWindow.addEventListener('mousedown', this.mouseHandle, false); //If the mouse is moved, stop the current animation
        this.renderWindow.addEventListener('wheel', this.mouseHandle, false); //If the wheel is scrolled, stop the current animation
      }
      
      update = function (timeToRenderFrame) {
        if (this.animationEnabled) { //is animation enabled?
          if (this.animateCamera) { //Do we still need to animate?
            if (!this.camera3D.position.equals(this.targetPosition)) {
      
              //Is the distance smaller than a tolerance?
              var distance = Math.abs(this.camera3D.position.distanceTo(this.targetPosition));
      
              if (distance < 0.00001) {
                this.setPosition(this.targetPosition.x, this.targetPosition.y, this.targetPosition.z);
                this.animateCamera = false;
                return;
              } else {
                //To slow the camera down the closer it gets to the target, uncomment out the next two lines.
                var percent = (distance / this.originalDistanceToTarget); //Slow the camera down the closer it gets to the target
                var dist = (this.cameraSpeed * percent) * timeToRenderFrame;
      
                //var dist = (this.cameraSpeed * 1.0) * timeToRenderFrame;
      
                var direction = new THREE.Vector3(
                  this.targetPosition.x - this.camera3D.position.x,
                  this.targetPosition.y - this.camera3D.position.y,
                  this.targetPosition.z - this.camera3D.position.z);
      
                direction.normalize();
      
                //Will the new direction and distance go past the target?
                var tempPoint = new THREE.Vector3(this.camera3D.position.x + (dist * direction.x),
                                                  this.camera3D.position.y + (dist * direction.y),
                                                  this.camera3D.position.z + (dist * direction.z));
      
                var distanceTemp = Math.abs(this.camera3D.position.distanceTo(tempPoint));
      
                if (distanceTemp > distance) {
                  this.setPosition(this.targetPosition.x, this.targetPosition.y, this.targetPosition.z);
                  this.animateCamera = false;
                  return;
                } else {
                  this.setPosition(tempPoint.x, tempPoint.y, tempPoint.z);
                }
              }
            }
          }
        }
      }
      
      end = function () {
        this.renderWindow.removeEventListener('mousedown', this.mouseHandle, false);
        this.renderWindow.removeEventListener('wheel', this.mouseHandle, false);
        this.mouseHandle = null;
      
        this.camera3D = null;
        this.camera2D = null;
        this.cameraUI = null;
        this.fov = null;
        this.defaultViewDistance = null;
        this.targetPostion = null;
        this.cameraSpeed = null;
        this.animateCamera = false;
        this.animationEnabled = false;
        this.targetOrientation = null;
        this.renderWindow = null;
        this.originalDistanceToTarget = null;
      }
      
      reset = function () {
        this.enableAnimation(false);
        this.setIsoView();
      }
      
      //Helper API---------------------------------------------------------
      cancelAnimation = function (data) {
        this.animateCamera = false;
      }
      
      getCameraSpeed = function () {
        return this.cameraSpeed;
      }
      
      setCameraSpeed = function (value) {
        this.cameraSpeed = value;
      }
      
      toggleAnimation = function () {
        if (this.animationEnabled) {
          this.animationEnabled = false;
        } else {
          this.animationEnabled = true;
        }
      
        if (!this.animationEnabled) {
          this.targetPosition.x = this.camera3D.position.x;
          this.targetPosition.y = this.camera3D.position.y;
          this.targetPosition.z = this.camera3D.position.z;
          this.animateCamera = false;
        }
      }
      
      enableAnimation = function (value) {
        this.animationEnabled = value;
      
        if (!this.animationEnabled) {
          this.targetPosition.x = this.camera3D.position.x;
          this.targetPosition.y = this.camera3D.position.y;
          this.targetPosition.z = this.camera3D.position.z;
          this.animateCamera = false;
        }
      }
      
      setTargetPosition = function (x, y, z) {
        this.targetPosition.x = x;
        this.targetPosition.y = y;
        this.targetPosition.z = z;
      
        this.originalDistanceToTarget = Math.abs(this.camera3D.position.distanceTo(this.targetPosition));
      
        this.cameraSpeed = (this.originalDistanceToTarget * 0.003);
      }
      
      setPosition = function (x, y, z) {
        this.camera3D.position.x = x;
        this.camera3D.position.y = y;
        this.camera3D.position.z = z;
      
        //this.camera3D.lookAt(this.targetLookAtPosition);
        this.camera3D.lookAt(new THREE.Vector3(0, 0, 0)); //this.targetLookAtPosition);
      }
      
      setView = function (location, direction, distance) {
        this.animateCamera = this.animationEnabled;
        
        direction = direction.normalize();
      
        var cameraLocation = 
          new THREE.Vector3(location.x + (distance * direction.x), 
                            location.y + (distance * direction.y), 
                            location.z + (distance * direction.z));
      
        if (this.animationEnabled) {
          this.setTargetPosition(cameraLocation.x,
                                 cameraLocation.y,
                                 cameraLocation.z);
        } else {
          this.setPosition(cameraLocation.x,
                           cameraLocation.y,
                           cameraLocation.z);
        }
      
        this.targetLookAtPosition = location;
      }
      
      setTopView = function () {
        this.setView(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 1, 0), this.defaultViewDistance);
      }
      
      setBottomView = function () {
        this.setView(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, -1, 0), this.defaultViewDistance);
      }
      
      setLeftView = function () {
        this.setView(new THREE.Vector3(0, 0, 0), new THREE.Vector3(-1, 0, 0), this.defaultViewDistance);
      }
      
      setRightView = function () {
        this.setView(new THREE.Vector3(0, 0, 0), new THREE.Vector3(1, 0, 0), this.defaultViewDistance);
      }
      
      setBackView = function () {
        this.setView(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, -1), this.defaultViewDistance);
      }
      
      setFrontView = function () {
        this.setView(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, 1), this.defaultViewDistance);
      }
      
      setIsoView = function () {
        this.setView(new THREE.Vector3(0, 0, 0), new THREE.Vector3(-0.125, 0.125, 0.125), this.defaultViewDistance);
        //this.setView(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0.125, 0.0625, 0.125), this.defaultViewDistance);
        //this.setView(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, 1), this.defaultViewDistance);
      }
      
      setCustomView = function (direction, location, defaultViewDistancePercentage) {
        if (location === null) {
          location = new THREE.Vector3(0, 0, 0);
        }
      
        var distance = this.defaultViewDistance;
      
        if (defaultViewDistancePercentage !== null) {
          distance = this.defaultViewDistance * defaultViewDistancePercentage;
        }
      
        this.setView(location, direction, distance);
      }
      
      scaleToFit = function () {
        var pos = this.camera3D.position;
        var direction = new THREE.Vector3(pos.x, pos.y, pos.z).normalize();
      
        //Scale To Fit does not animate.
        this.setPosition(this.defaultViewDistance * direction.x,
                         this.defaultViewDistance * direction.y,
                         this.defaultViewDistance * direction.z);
      }
      
      updateUICamera = function () {
        //destination.copy(source)
      
        //Get the camera orientation from the main 3D camera
        this.cameraUI.quaternion.copy(this.camera3D.quaternion);
      
        //Ignore the zoom factor. We want a constant zoom factor for the trihedron so it does not change size
        var pos = this.camera3D.position;
        //var pos = this.cameraUI.position;
        var direction = new THREE.Vector3(pos.x, pos.y, pos.z).normalize();
      
        var distanceFromTrihedron = 15;
        this.cameraUI.position.x = distanceFromTrihedron * direction.x;
        this.cameraUI.position.y = distanceFromTrihedron * direction.y;
        this.cameraUI.position.z = distanceFromTrihedron * direction.z;
      }
      
      setDefaultViewDistance = function (viewDistance) {
        this.defaultViewDistance = viewDistance;
      }
      
      getPosition = function () {
        return this.camera3D.position;
      }
      
      getFOV = function () {
        return this.fov;
      }
      
      getThreeJSCamera3D = function () {
        return this.camera3D;
      }
      
      getThreeJSCamera2D = function () {
        return this.camera2D;
      }
      
      getThreeJSCameraUI = function () {
        return this.cameraUI;
      }   
}
export default(webCamera);