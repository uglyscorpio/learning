import * as THREE from 'three';
class axisDisplay {
    constructor(){
        this.xMarker = null;
        this.arrowX = null;
        this.arrowY = null;
        this.arrowZ = null;
        this.scene = null;
        this.location = null;
        this.axisVisible = true;
        this.renderWindow = null;
        this.renderer = null;
        this.camera = null;
        this.xAxisLabel = null;
        this.yAxisLabel = null;
        this.zAxisLabel = null;
        this.viewportSize = null;   
    }


    init = function (scene, renderWindow, renderer, camera) {
        this.scene = scene;
        this.location = new THREE.Vector3(0, 0, 0);
        this.renderWindow = renderWindow;
        this.renderer = renderer;
        this.camera = camera;
      
        this.xAxisLabel = document.getElementById("xAxisLabelContainer");
        this.xAxisLabel.style.visibility = "visible";
        this.xAxisLabel.textContent = "X";
      
        this.yAxisLabel = document.getElementById("yAxisLabelContainer");
        this.yAxisLabel.style.visibility = "visible";
        this.yAxisLabel.textContent = "Y";
      
        this.zAxisLabel = document.getElementById("zAxisLabelContainer");
        this.zAxisLabel.style.visibility = "visible";
        this.zAxisLabel.textContent = "Z";
      
        var sphererMaterial = new THREE.MeshBasicMaterial();
        sphererMaterial.wireframe = true;
      
        var size = 5;
        var arrowTop = size * 0.3;
      
        this.arrowX = new THREE.ArrowHelper(new THREE.Vector3(1, 0, 0),
          new THREE.Vector3(0, 0, 0), size, new THREE.Color(0xd8292f), arrowTop, arrowTop * 0.3);
        this.arrowY = new THREE.ArrowHelper(new THREE.Vector3(0, 1, 0),
          new THREE.Vector3(0, 0, 0), size, new THREE.Color(0x4c9d2f), arrowTop, arrowTop * 0.3);
        this.arrowZ = new THREE.ArrowHelper(new THREE.Vector3(0, 0, -1),
          new THREE.Vector3(0, 0, 0), size, new THREE.Color(0x4eb5cd), arrowTop, arrowTop * 0.3);
      
        this.xMarker = new THREE.Mesh(new THREE.SphereGeometry(0.5, 2, 2), sphererMaterial);
        this.yMarker = new THREE.Mesh(new THREE.SphereGeometry(0.5, 2, 2), sphererMaterial);
        this.zMarker = new THREE.Mesh(new THREE.SphereGeometry(0.5, 2, 2), sphererMaterial);
      
        this.xMarker.visible = false;
        this.yMarker.visible = false;
        this.zMarker.visible = false;
      
        this.xMarker.position.x = size;
        this.yMarker.position.y = size;
        this.zMarker.position.z = -size;
      
        this.scene.add(this.arrowX);
        this.scene.add(this.arrowY);
        this.scene.add(this.arrowZ);
      
        this.scene.add(this.xMarker);
        this.scene.add(this.yMarker);
        this.scene.add(this.zMarker);
      
        this.viewportSize = 200;
      }
      
      update = function () {
        this.camera.updateUICamera();
      
        this.renderer.setViewport(0, this.renderWindow.clientHeight - this.viewportSize, this.viewportSize, this.viewportSize);
        this.renderer.render(this.scene, this.camera.getThreeJSCameraUI());
        this.renderer.setViewport(0, 0, this.renderWindow.clientWidth, this.renderWindow.clientHeight);
      
        var screenLocation;
        var left;
        var top;
      
        if (this.xAxisLabel !== null) {
          screenLocation = this.getScreenCoordinates(this.xMarker.position);
          left = screenLocation.x;
          top = ((this.renderWindow.clientHeight - this.viewportSize) + screenLocation.y) - (this.xAxisLabel.clientHeight / 2);
      
          this.xAxisLabel.style.left = left + "px";
          this.xAxisLabel.style.top = top + "px";
        }
      
        if (this.yAxisLabel !== null) {
          screenLocation = this.getScreenCoordinates(this.yMarker.position);
          left = screenLocation.x - this.yAxisLabel.clientWidth / 2;
          top = ((this.renderWindow.clientHeight - this.viewportSize) + screenLocation.y) - this.yAxisLabel.clientHeight;
      
          this.yAxisLabel.style.left = left + "px";
          this.yAxisLabel.style.top = top + "px";
        }
      
        if (this.zAxisLabel !== null) {
          screenLocation = this.getScreenCoordinates(this.zMarker.position);
          left = screenLocation.x - this.zAxisLabel.clientWidth / 2;
          top = (this.renderWindow.clientHeight - this.viewportSize) + screenLocation.y;
      
          this.zAxisLabel.style.left = left + "px";
          this.zAxisLabel.style.top = top + "px";
        }
      }
      
      end = function () {
        if (this.arrowX !== null) {
          this.scene.remove(this.arrowX);
          this.arrowX = null;
        }
      
        if (this.arrowY !== null) {
          this.scene.remove(this.arrowY);
          this.arrowY = null;
        }
      
        if (this.arrowZ !== null) {
          this.scene.remove(this.arrowZ);
          this.arrowZ = null;
        }
      
        if (this.xMarker !== null) {
          this.scene.remove(this.xMarker);
          this.xMarker = null;
        }
      
        if (this.yMarker !== null) {
          this.scene.remove(this.yMarker);
          this.yMarker = null;
        }
      
        if (this.zMarker !== null) {
          this.scene.remove(this.zMarker);
          this.zMarker = null;
        }
      
        this.xAxisLabel.style.visibility = "hidden";
        this.yAxisLabel.style.visibility = "hidden";
        this.zAxisLabel.style.visibility = "hidden";
        this.xAxisLabel = null;
        this.yAxisLabel = null;
        this.zAxisLabel = null;
        this.scene = null;
        this.location = null;
        this.axisVisible = false;
        this.renderWindow = null;
        this.renderer = null;
        this.camera = null;
        this.viewportSize = null;
      }
      
      reset = function () {
        this.enableAxis(true);
      }
      
      //Helper API---------------------------------------------------------
      //1) Multiply the camera view matrix with the x,y,z point. This will return a point.
      //2) Multiply the result point from step 1 with the camera projection matrix. This will return a point.
      //3) Transofrm the point to make it 0 to 1 instead of -1 to 1. Add 1 to the x value.
      //Divide the x value by 2. Multiply the x value by the width.
      //Subtract 1 from the y value. Multiply the y value by -1. Divide the y value by 2. 
      //Multiply the y value by the height
      //Round both x and y values since pixels are whole numbers.
      //Alternate conversion:
      //Convert from 0 to 1 to -1 to 1
      //var x1 = Math.round(canvasWidth * this.x) - (canvasWidth / 2);
      //var y1 = this.y;
      //y1 *= 2;
      //y1 /= -1;
      //y1 += 1;
      //var y2 = y1 * (canvasHeight / 2);
      getScreenCoordinates = function (point) {
        var screenPosition = new THREE.Vector3(point.x, point.y, point.z).project(this.camera.getThreeJSCameraUI()); //This acomplishes steps 1 and 2
      
        var canvasWidth = this.viewportSize;
        var canvasHeight = this.viewportSize;
      
        //Convert X from [-1 Left to 1 Right] to [0 Left to 1 Right] 
        screenPosition.x += 1; //-1 now = 0, 1 now = 2
        screenPosition.x /= 2; //0 now = 0, 2 now = 1 
        screenPosition.x *= canvasWidth; //Multiply the percentage by the width to find out the x location 
        screenPosition.x = Math.round(screenPosition.x); //Rownd it to the nearest pixel
      
        //Convert Y from [1 Top to -1 Bottom] to [0 Top to 1 Bottom]
        screenPosition.y -= 1;//1 now = 0, -1 now = -2
        screenPosition.y *= -1;//0 now = 0 , -2 now = 2
        screenPosition.y /= 2; //0 now = 0, 2 now = 1
        screenPosition.y *= canvasHeight;//Multiply the percentage by the height to find out the y location
        screenPosition.y = Math.round(screenPosition.y); //Rownd it to the nearest pixel
      
        screenPosition.z = 0;
      
        return screenPosition;
      }
      
      toggleAxis = function () {
        if (this.axisVisible) {
          this.axisVisible = false;
        } else {
          this.axisVisible = true;
        }
      
        this.enableAxis(this.axisVisible);
      }
      
      enableAxis = function (value) {
        this.axisVisible = value;
      
        this.arrowX.visible = this.axisVisible;
        this.arrowY.visible = this.axisVisible;
        this.arrowZ.visible = this.axisVisible;
      }
      
      setPosition = function (x, y, z) {
        this.arrowX.position.x = x;
        this.arrowX.position.y = y;
        this.arrowX.position.z = z;
      
        this.arrowY.position.x = x;
        this.arrowY.position.y = y;
        this.arrowY.position.z = z;
      
        this.arrowZ.position.x = x;
        this.arrowZ.position.y = y;
        this.arrowZ.position.z = z;
      }
    
}

export default(axisDisplay)