import * as THREE from 'three';
import webImage from './webImage'
class featureMarkerInfo {
    constructor(){
        this.camera = null;
        this.renderWindow = null;
        this.name = null;
        this.location = new THREE.Vector3();
        this.selected = null;
        this.featureLabelName = null;
        this.featureLabel = null;
      
        this.drawContainer = null;
        this.canvas = null;
        this.featureLabelEdit = null;
        this.mouseDownLabelHandle = null;
        this.mouseUpLabelHandle = null;
        this.mouseMoveLabelHandle = null;
        this.mouseX = null;
        this.mouseY = null;
      
        this.labelCustomOffset = null;
        this.leaderLineDefaultLength = null;
        this.leaderLineSize = null;
        this.leaderLineColor = null;
      
        this.leaderLineXDirection = null;
        this.leaderLineYDirection = null;
      
        this.labelWidth = null;
      
        this.chart = null;
        this.scene = null;
      
        this.mouseMoveHandle = null;
        this.mouseUpHandle = null;
      
        this.lineStart = null;
        this.lineEnd = null;
      
        this.featureInfoLock = null;    
    }

    init = function (id, renderWindow, scene, canvas, camera, name) {
        this.renderWindow = renderWindow;
        this.canvas = canvas;
        this.camera = camera;
        this.name = name;
        this.scene = scene;
      
        this.featureLabelName = "FeatureLabelTest" + id;
        this.featureLabel = document.createElement("div");
        this.featureLabel.id = this.featureLabelName;
        this.featureLabel.textContent = this.name;
        var parentElement = document.getElementById("CadModelContainer");
        parentElement.appendChild(this.featureLabel);
      
        this.featureLabel.style.visibility = "visible";
        this.featureLabel.style.position = "absolute";
        this.featureLabel.style.paddingLeft = "5px";
        this.featureLabel.style.paddingRight = "5px";
        this.featureLabel.style.borderColor = "black";
        this.featureLabel.style.borderStyle = "solid";
        this.featureLabel.style.borderWidth = "2px";
        this.featureLabel.style.borderRadius = "10px";
        this.featureLabel.style.width = "auto";
        this.featureLabel.style.height = "auto";
        this.featureLabel.style.color = "black";
        this.featureLabel.style.alignItems = "center";
        this.featureLabel.style.textAlign = "center";
        //this.featureLabel.style.backgroundColor = "rgb(250, 255, 189)";
        this.featureLabel.style.backgroundColor = "rgba(250, 255, 189, 0.85)";
        this.featureLabel.style.position = "absolute";
        this.featureLabel.style.fontFamily = "monospace, serif";
        this.featureLabel.style.fontSize = "20px";
        this.featureLabel.style.zIndex = 90 + id;//"90";
        this.featureLabel.textContent = this.name;
        this.featureLabel.style.left = 0 + "px";
        this.featureLabel.style.top = 0 + "px";
      
        //Sometimes the client width changes by one pixel between renders (I have no idea why). Save the initial width and use that to avoid this issue.
        this.labelWidth = this.featureLabel.clientWidth;
        this.labelHeight = this.featureLabel.clientHeight;
      
        this.labelCustomOffset = new THREE.Vector2(0, 0);
        this.leaderLineDefaultLength = 200;
        this.leaderLineSize = 1;
        this.leaderLineColor = 0x000000;
      
        this.drawContainer = document.getElementById("CadModelContainer");
        var instance = this;
      
        this.mouseUpHandle = function (data) { instance.mouseUp(data); };
        this.drawContainer.addEventListener('mouseup', this.mouseUpHandle, false);
      
        this.mouseMoveHandle = function (data) { instance.mouseMove(data); };
        this.drawContainer.addEventListener('mousemove', this.mouseMoveHandle, false);
      
        this.mouseDownLabelHandle = function (data) { instance.mouseDownLabel(data); };
        this.featureLabel.addEventListener('mousedown', this.mouseDownLabelHandle, false);
      
        this.mouseUpLabelHandle = function (data) { instance.mouseUpLabel(data); };
        this.featureLabel.addEventListener('mouseup', this.mouseUpLabelHandle, false);
      
        this.mouseMoveLabelHandle = function (data) { instance.mouseMoveLabel(data); };
        this.featureLabel.addEventListener('mousemove', this.mouseMoveLabelHandle, false);
      
        this.featureLabelEdit = false;
        this.mouseX = null;
        this.mouseY = null;
      
        this.leaderLineXDirection = 1;
        this.leaderLineYDirection = 1;
      
        this.lineStart = new THREE.Vector2(0, 0);
        this.lineEnd = new THREE.Vector2(0, 0);
      
        this.featureInfoLock = false;
      }
      
      getFeatureMarkerLocation = function () {
        var point = new THREE.Vector2();
        var screenLocation = this.getScreenCoordinates(this.location);
      
        var xDirection = this.leaderLineDefaultLength * this.leaderLineXDirection;
        var yDirection = this.leaderLineDefaultLength * this.leaderLineYDirection;
      
        if (this.leaderLineXDirection > 0) {
          xDirection /= 2;
        }
      
        if (this.leaderLineXDirection < 0) {
          xDirection /= 2;
          xDirection -= (this.labelWidth * 2.0);
        }
      
        point.x = screenLocation.x + this.labelCustomOffset.x + xDirection;
        point.y = screenLocation.y + this.labelCustomOffset.y - yDirection;
      
        return point;
      }
      
      
      getLineStart = function() {
        var point = new THREE.Vector2();
      
        return point;
      }
      
      drawFeatureInfo = function (timeToRenderFrame) {
        var screenLocation = null;
        var left = null;
        var top = null;
      
        if (this.selected) {
          if (this.featureLabel !== null) {
            if (this.chart !== null) {
              if (this.chart.isLoaded()) {
                this.featureLabel.style.backgroundColor = "rgba(250, 255, 189, 0)";
                this.featureLabel.style.borderColor = "rgba(0, 0, 0, 1)";
                this.featureLabel.style.borderRadius = "0px";
                
                this.featureLabel.style.width = this.chart.getDimensions().x + "px";
                this.featureLabel.style.height = this.chart.getDimensions().y + "px";
              }
              else {
                this.featureLabel.style.width = "auto";
                this.featureLabel.style.height = "auto";
                this.featureLabel.style.backgroundColor = "rgba(250, 255, 189, 0.85)";
                this.featureLabel.style.borderColor = "black";
                this.featureLabel.style.borderRadius = "10px";
              }
            } else {
              this.featureLabel.style.width = "auto";
              this.featureLabel.style.height = "auto";
              this.featureLabel.style.backgroundColor = "rgba(250, 255, 189, 0.85)";
              this.featureLabel.style.borderColor = "black";
              this.featureLabel.style.borderRadius = "10px";
            }
      
            this.labelWidth = this.featureLabel.clientWidth;
            this.labelHeight = this.featureLabel.clientHeight;
            //console.log("Feature this.featureLabel.clientWidth " + this.featureLabel.clientWidth);
      
            screenLocation = this.getScreenCoordinates(this.location);
      
            var xDirection = this.leaderLineDefaultLength * this.leaderLineXDirection;
            var yDirection = this.leaderLineDefaultLength * this.leaderLineYDirection;
      
            if (this.leaderLineXDirection > 0) {
              xDirection /= 2;
            }
      
            if (this.leaderLineXDirection < 0) {
              xDirection /= 2;
              xDirection =- (this.labelWidth * 2.0); //1.5 gives rounding errors every other frame
            }
      
            left = screenLocation.x + this.labelCustomOffset.x + xDirection;
            top = screenLocation.y + this.labelCustomOffset.y - yDirection;
      
            this.featureLabel.style.left = left + "px";
            this.featureLabel.style.top = top + "px";
      
            console.log("Feature this.featureLabel.style.left " + this.featureLabel.style.left);
      
            var panel = document.getElementById("Overlay");
      
            if (panel !== null) {
              var surface = panel.getContext('2d');
      
              if (surface !== null) {
                surface.strokeStyle = this.leaderLineColor;
                surface.lineWidth = this.leaderLineSize;
                surface.beginPath(); //beginPath closes the last path
      
                this.lineStart.x = screenLocation.x;
                this.lineStart.y = screenLocation.y;
      
                surface.moveTo(screenLocation.x, screenLocation.y);
      
                var stepSize = 10;
      
                var x = left;
      
                if ((left + (this.labelWidth / 2)) < screenLocation.x) {
                  x += (this.labelWidth + (stepSize + 4));
                } else {
                  x -= stepSize;
                }
      
                var y = top + ((this.labelHeight / 2));
      
                this.lineEnd.x = x;
                this.lineEnd.y = y;
      
                surface.lineTo(x, y);
      
                var reverseSide = false;
                if ((left + (this.labelWidth / 2)) < screenLocation.x) {
                  x = left + (this.labelWidth + 2);
                  reverseSide = true;
                } else {
                  x = left; // + (this.featureLabel.clientWidth / 2);
                }
      
                surface.lineTo(x, y);
                //Draw the current path
                surface.stroke();
      
                if (this.chart !== null) {
                  if (this.chart.isLoaded()) {
                    var location = new THREE.Vector2();
                    if (reverseSide) {
                      location.x = (x - (this.renderWindow.clientWidth / 2)) +
                        (this.chart.getDimensions().x / 2) -
                        this.chart.getDimensions().x;
                      location.x += 2;
                    } else {
                      location.x = (x - (this.renderWindow.clientWidth / 2)) + (this.chart.getDimensions().x / 2);
                    }
      
                    location.y = -(y - (this.renderWindow.clientHeight / 2)) -
                    (this.chart.getDimensions().y / 2) +
                    (this.labelHeight / 2);
      
                    this.chart.setLocation(location);
                  }
                }
              }
            }
          }
        }
      }
      
      update = function (timeToRenderFrame) {
          this.drawFeatureInfo(timeToRenderFrame);
      }
      
      end = function () {
        this.drawContainer.removeEventListener('mouseup', this.mouseUpHandle, false);
        this.mouseUpHandle = null;
      
        this.drawContainer.removeEventListener('mousemove', this.mouseMoveHandle, false);
        this.mouseMoveHandle = null;
      
        this.featureLabel.removeEventListener('mousedown', this.mouseDownLabelHandle, false);
        this.mouseDownLabelHandle = null;
      
        this.featureLabel.removeEventListener('mouseup', this.mouseUpLabelHandle, false);
        this.mouseUpLabelHandle = null;
      
        this.featureLabel.removeEventListener('mousemove', this.mouseMoveLabelHandle, false);
        this.mouseMoveLabelHandle = null;
      
        var parentElement = document.getElementById("CadModelContainer");
        parentElement.removeChild(this.featureLabel);
      
        if (this.chart !== null)
        {
          this.chart.end();
          this.chart = null;
        }
      
        this.camera = null;
        this.renderWindow = null;
      
        this.featureLabelName = null;
        this.featureLabel = null;
      
        this.drawContainer = null;
        this.canvas = null;
        this.featureLabelEdit = null;
        this.mouseDownLabelHandle = null;
        this.mouseUpLabelHandle = null;
        this.mouseMoveLabelHandle = null;
        this.mouseX = null;
        this.mouseY = null;
      
        this.labelCustomOffset = null;
        this.leaderLineDefaultLength = null;
        this.leaderLineSize = null;
        this.leaderLineColor = null;
        this.leaderLineXDirection = null;
        this.leaderLineYDirection = null;
        this.labelWidth = null;
        this.labelHeight = null;
        this.lineStart = null;
        this.lineEnd = null;
        this.featureInfoLock = null;
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
      
      //FeatureLabel
      mouseUp = function (data) {
        this.featureLabelEdit = false;
      }
      
      mouseMove = function (data) {
        if (!this.featureLabelEdit) {
          var box = this.canvas.getBoundingClientRect();
          this.mouseX = data.clientX - box.left;
          this.mouseY = data.clientY - box.top;
        }
        else {
          this.updateFeatureLabel(data);
        }
      }
      
      addFeatureLabelOffset = function (x, y) {
        if (this.labelCustomOffset !== null) {
          this.labelCustomOffset.x += x;
          this.labelCustomOffset.y += y;
        }
      }
      
      updateFeatureLabel = function (data) {
        //When the mouse moves (10 units to the left and 2 units up), I need to move
        //the feature label 10 units to the left and 2 units up.
        var box = this.canvas.getBoundingClientRect();
        var x = data.clientX - box.left;
        var y = data.clientY - box.top;
      
        this.addFeatureLabelOffset(x - this.mouseX, y - this.mouseY);
      
        this.mouseX = x;
        this.mouseY = y;
      }
      
      mouseDownLabel = function (data) {
        this.featureLabelEdit = true;
      }
      
      mouseUpLabel = function (data) {
        this.featureLabelEdit = false;
      }
      
      mouseMoveLabel = function (data) {
        if (!this.featureLabelEdit) {
          var box = this.canvas.getBoundingClientRect();
          this.mouseX = data.clientX - box.left;
          this.mouseY = data.clientY - box.top;
        }
        else {
          this.updateFeatureLabel(data);
        }
      }
      
      getFeatureLabelEdit = function () {
        return this.featureLabelEdit;
      }
      
      setName = function (value) {
        this.name = value;
        this.featureLabel.textContent = this.name;
      }
      
      getName = function () {
        return this.name;
      }
      
      setLocation = function (value) {
        this.location.x = value.x;
        this.location.y = value.y;
        this.location.z = value.z;
      }
      
      getLocation = function () {
        return this.location;
      }
      
      setSelected = function (value) {
        this.selected = value;
      
        if (this.featureLabel !== null) {
          if (this.chart !== null) {
            this.chart.setVisible(this.selected);
          }
      
          if (this.selected) {
            //this.disableTooltip();
            this.featureLabel.style.visibility = "visible";
            //this.featureLabel.textContent = this.name;
      
            var screenLocation = this.getScreenCoordinates(this.location);
            var canvasWidth = this.renderWindow.clientWidth;
            var canvasHeight = this.renderWindow.clientHeight;
      
            //Upper left
            if((screenLocation.x < (canvasWidth / 2)) && (screenLocation.y < (canvasHeight / 2)))
            {
              this.leaderLineXDirection = -1;
              this.leaderLineYDirection = 1;
            }
      
            //Upper right
            if ((screenLocation.x > (canvasWidth / 2)) && (screenLocation.y < (canvasHeight / 2))) {
              this.leaderLineXDirection = 1;
              this.leaderLineYDirection = 1;
            }
      
            //Lower left
            if ((screenLocation.x > (canvasWidth / 2)) && (screenLocation.y > (canvasHeight / 2))) {
              this.leaderLineXDirection = 1;
              this.leaderLineYDirection = -1;
            }
      
            //Lower left
            if ((screenLocation.x < (canvasWidth / 2)) && (screenLocation.y > (canvasHeight / 2))) {
              this.leaderLineXDirection = -1;
              this.leaderLineYDirection = -1;
            }
          } else {
            this.featureLabel.style.visibility = "hidden";
      
            //Clear the leader line
            var panel = document.getElementById("Overlay");
      
            if (panel !== null) {
              var surface = panel.getContext('2d');
      
              if (surface !== null) {
                surface.clearRect(0, 0, panel.width, panel.height);
              }
            }
      
            if (this.labelCustomOffset !== null) {
              this.labelCustomOffset.x = 0;
              this.labelCustomOffset.y = 0;
            }
          }
        }
      }
      
      getSelected = function () {
        return this.selected;
      }
      
      
      loadChart = function (url) {
        if (this.chart !== null)
        {
          this.chart.end();
          this.chart = null;
        }
      
        this.chart = new webImage();
        this.chart.init(this.renderWindow, this.scene, 0, 0, 1, 1, url);
        this.chart.setVisible(false);
      
        this.chart.setLocationCentered(false);
        this.chart.enableScaleToWindow(true);
        this.chart.setScaleToWindowPercent(0.2); //0.4 will jitter. TODO: Fix rounding issues
      }
      
      clearChart = function () {
        if (this.chart !== null) {
          this.chart.end();
          this.chart = null;
        }
      }
}

export default(featureMarkerInfo)