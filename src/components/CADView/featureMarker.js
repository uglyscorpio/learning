import * as THREE from 'three';
class featureMarker{
    constructor(){
        this.sphere = null;
        this.location = new THREE.Vector3();
        this.direction = new THREE.Vector3();
        this.defaultColor = null;
        this.selectedColor = null;
        this.hoverColor = null;
        this.scene = null;
        this.selected = false;
        this.camera = null;
        this.renderWindow = null;
        this.name = null;
        this.featureLabelTooltip = null;
        this.featureLocation = new THREE.Vector2();
        this.labelCustomOffset = null;
        this.labelBaseLeft = null;
        this.labelBaseTop = null;
        this.leaderLineDefaultLength = null;
        this.leaderLineSize = null;
        this.leaderLineColor = null;
        this.tooltipEnabled = null;    
    }

    init = function (name, renderWindow, scene, glCamera,
        markerLocation, markerDirection,
        markerColor, markerSize, offset,
        featureLabelTooltip,
        markerSubdivision) {
      
        this.name = name;
        this.renderWindow = renderWindow;
        this.featureLabelTooltip = featureLabelTooltip;
      
        this.location.x = markerLocation.x;
        this.location.y = markerLocation.y;
        this.location.z = markerLocation.z;
      
        this.direction.x = markerDirection.x;
        this.direction.y = markerDirection.y;
        this.direction.z = markerDirection.z;
      
        this.camera = glCamera;
      
        this.defaultColor = markerColor;
        this.selectedColor = new THREE.Color(0xffff00);
        this.hoverColor = new THREE.Color(0xff00ff);
      
        var sphereGeometry = new THREE.SphereGeometry(markerSize,
          markerSubdivision, markerSubdivision);
        sphereGeometry.computeVertexNormals();
        sphereGeometry.computeFaceNormals();
      
        var sphereMat = new THREE.MeshBasicMaterial(
        {
          color: this.defaultColor,
        });
      
        //var sphereMat = new THREE.MeshPhongMaterial();
        //sphereMat.color = this.defaultColor;
        //sphereMat.shininess = 200;
        //sphereMat.wireframe = false;
        //sphereMat.side = THREE.DoubleSide;
        //sphereMat.shading = THREE.SmoothShading;
      
        this.sphere = new THREE.Mesh(sphereGeometry, sphereMat);
      
        this.sphere.position.x = this.location.x;
        this.sphere.position.y = this.location.y;
        this.sphere.position.z = this.location.z;
      
        this.sphere.visible = true;
      
        this.scene = scene;
      
        this.scene.add(this.sphere);
      
        this.sphere.translateX(offset.x);
        this.sphere.translateY(offset.y);
        this.sphere.translateZ(offset.z);
      
        this.selected = false;
        this.labelCustomOffset = new THREE.Vector2(0, 0);
      
        this.leaderLineDefaultLength = 200;
        this.leaderLineSize = 1;
        this.leaderLineColor = 0x000000;
        this.tooltipEnabled = false;
      }
      
      update = function (timeToRenderFrame) {
        if (this.tooltipEnabled) {
          if (this.featureLabelTooltip !== null) {
            var screenLocation = this.getScreenCoordinates(this.sphere.position);
            var left = screenLocation.x;
            var top = screenLocation.y - this.featureLabelTooltip.clientHeight;
      
            this.featureLabelTooltip.style.left = left + "px";
            this.featureLabelTooltip.style.top = top + "px";
            return;
          }
        }
      }
      
      end = function () {
        if (this.sphere !== null) {
          this.sphere.geometry.dispose();
          this.sphere.material.dispose();
          this.scene.remove(this.sphere);
          this.sphere = null;
        }
      
        this.featureLabelTooltip = null;
        this.selected = false;
        this.location = null;
        this.direction = null;
        this.defaultColor = null;
        this.selectedColor = null;
        this.hoverColor = null;
        this.scene = null;
        this.camera = null;
        this.renderWindow = null;
        this.name = null;
        this.labelCustomOffset = null;
        this.leaderLineDefaultLength = null;
        this.leaderLineSize = null;
        this.leaderLineColor = null;
        this.tooltipEnabled = null;
      }
      
      reset = function () {
        this.setSelected(false);
      
        if (this.labelCustomOffset !== null) {
          this.labelCustomOffset.x = 0;
          this.labelCustomOffset.y = 0;
        }
      }
      
      //Helper API---------------------------------------------------------
      addFeatureLabelOffset = function (x, y) {
        if (this.labelCustomOffset !== null) {
          this.labelCustomOffset.x += x;
          this.labelCustomOffset.y += y;
        }
      }
      
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
        var screenPosition = new THREE.Vector3(point.x, point.y, point.z).project(this.camera); //This acomplishes steps 1 and 2
      
        var canvasWidth = this.renderWindow.clientWidth;
        var canvasHeight = this.renderWindow.clientHeight;
      
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
      
      
      setLocation = function (x, y, z) {
        this.sphere.position.x = x;
        this.sphere.position.y = y;
        this.sphere.position.z = z;
      }
      
      getLocation = function () {
        return this.sphere.position; //The sphere is translated by an offset.
      }
      
      getDirection = function () {
        return this.direction;
      }
      
      getSphere = function () {
        return this.sphere;
      }
      
      getName = function () {
        return this.name;
      }
      
      setName = function (value) {
        this.name = value;
      }
      
      setDefaultColor = function (color) {
        this.defaultColor.setHex(color);
      }
      
      setHoverColor = function (color) {
        this.hoverColor.setHex(color);
      }
      
      setSelectedColor = function (color) {
        this.selectedColor.setHex(color);
      }
      
      enableDefaultColor = function () {
        this.sphere.material.color = this.defaultColor;
      }
      
      disableTooltip = function() {
        this.featureLabelTooltip.style.visibility = "hidden";
        this.tooltipEnabled = false;
      }
      
      enableTooltip = function () {
        this.featureLabelTooltip.style.visibility = "visible";
        this.featureLabelTooltip.textContent = this.name;
        this.tooltipEnabled = true;
      }
      
      enableHoverColor = function () {
        this.sphere.material.color = this.hoverColor;
      }
      
      enableSelectedColor = function () {
        this.sphere.material.color = this.selectedColor;
      }
      
      isSelected = function () {
        return this.selected;
      }
      
      setSelected = function (value) {
        this.selected = value;
      
        if (this.selected) {
          this.disableTooltip();
        }
      }
      
      setVisible = function (value) {
        this.sphere.visible = value;
      }
      
      setLeaderLineColor = function (value) {
        this.leaderLineColor = value;
      }
      
      setLeaderLineSize = function (value) {
        this.leaderLineSize = value;
      }
      
      setLeaderLineDefaultLength = function (value) {
        this.leaderLineDefaultLength = value;
      }
}

export default(featureMarker)