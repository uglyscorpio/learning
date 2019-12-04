import * as THREE from 'three'
import { defaultCipherList } from 'constants';
class webImage {
    constructor(){
        this.scene = null;
        this.x = null;
        this.y = null;
        this.width = null;
        this.height = null;
        this.sprite = null;
        this.loaded = false;
        this.spriteVisible = false;
        this.renderWindow = null;
        this.fileWidth = null;
        this.fileHeight = null;
        this.currentRotation = null;
        this.targetRotation = null;
        this.rotationSpeed = null;
        this.scaled = null;
        this.rotatedWidth = null;
        this.rotatedHeight = null;
        this.zoomValue = null;
        this.imageLocation = null; //Center=0, UL=1, UR=2, LL=3, LR=4. This applies when the image is not scaled to the window.
        this.fit = null; //Fit the image in the center of the screeen. This applies when the image is not scaled to the window and is centered.
        this.xMove = null;
        this.yMove = null;
        this.scaleToWindow = null;
        this.scaleToWindowPercent = null;    
    }

    init = function (renderWindow, scene, x, y, width, height, imageURL) {
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.spriteVisible = false;
      
        this.renderWindow = renderWindow;
      
        this.loaded = false;
        var instance = this;
      
        this.currentRotation = 0;
        this.targetRotation = 90 * (Math.PI / 180.0);
        this.rotationSpeed = 0.0001;
        this.zoomValue = 0;
      
        this.scaled = false;
        this.imageLocation = 0; //Centered
        this.fit = true;
        this.xMove = 0;
        this.yMove = 0;
      
        this.scaleToWindow = false;
        this.scaleToWindowPercent = 0.3;
      
        var image = new THREE.TextureLoader();
        image.load(imageURL, function (data) { instance.imageLoaded(data); });
      }
      
      update = function (timeToRenderFrame) {
        if (this.sprite !== null) {
          //if (this.currentRotation < this.targetRotation) {
          //  //Calculate the amount to rotate.
          //  var rotation = (this.rotationSpeed * timeToRenderFrame);
          //  //If the amount ot rotate is greater than the target, cap the rotation
          //  if ((this.currentRotation + rotation) > this.targetRotation) {
          //    rotation = this.targetRotation - rotation;
          //  }
      
          //  this.currentRotation += rotation;
          //  this.sprite.material.rotation += rotation;
          //}
        }
      }
      
      end = function () {
        if (this.sprite !== null) {
          //this.sprite.geometry.dispose();
          this.sprite.material.dispose();
          this.scene.remove(this.sprite);
          this.sprite = null;
        }
      
        this.scene = null;
        this.location = null;
        this.width = null;
        this.height = null;
        this.loaded = false;
        this.spriteVisible = false;
        this.renderWindow = null;
        this.fileWidth = null;
        this.fileHeight = null;
        this.currentRotation = null;
        this.targetRotation = null;
        this.rotationSpeed = null;
        this.rotatedWidth = null;
        this.rotatedHeight = null;
        this.zoomValue = null;
        this.imageLocation = null;
        this.fit = null;
        this.xMove = null;
        this.yMove = null;
        this.scaleToWindow = null;
        this.scaleToWindowPercent = null;
      }
      
      reset = function () {
        this.setVisible(true);
        this.scaled = false;
        this.x = 0;
        this.y = 0;
        this.zoomValue = 0;
        this.rotatedWidth = this.fileWidth;
        this.rotatedHeight = this.fileHeight;
        this.xMove = 0;
        this.yMove = 0;
        this.imageLocation = 0; //Centered
        this.fit = true;
        this.scaleWindowPercent = false;
      
        this.updateScale();
      }
      
      createImage = function (material) {
        this.sprite = new THREE.Sprite(material);
        this.scene.add(this.sprite);
      
        this.sprite.visible = this.spriteVisible;
      
        this.sprite.material.transparent = true;
        this.sprite.material.opacity = 0.9;
      
        this.loaded = true;
      
        //this.rotate(-90);
        //this.zoom(-100);
        //this.translate(-300, 0);
      
        this.scaled = false;
      
        this.rotatedWidth = this.fileWidth;
        this.rotatedHeight = this.fileHeight;
      
        this.updateScale();
      }
      
      //Helper API---------------------------------------------------------
      imageLoaded = function (data) {
        if (this.scene === null) {
          return;
        }
      
        this.fileWidth = data.image.width;
        this.fileHeight = data.image.height;
      
        var material = new THREE.SpriteMaterial();
      
        data.minFilter = THREE.LinearFilter;
        data.magFilter = THREE.LinearFilter;
      
        data.generateMipmaps = false;
        material.map = data;
      
        this.createImage(material);
      }
      
      //This function assumes the image has already been fit to the width or height of the window.
      fitToWindow = function () {
        if (this.sprite=== null) {
          return;
        }
      
        //Scale the image if part of the image does not fit
        var currentWidth = this.sprite.scale.x;
        var currentHeight = this.sprite.scale.y;
        var fixedZoom = 0;
        var zoomPercentage = 0;
      
        if (this.rotatedWidth !== this.fileWidth) {
          if (currentWidth > this.renderWindow.clientHeight) {
            fixedZoom = currentWidth - this.renderWindow.clientHeight;
            zoomPercentage = -fixedZoom / this.sprite.scale.x;
            this.sprite.scale.x += (zoomPercentage * this.sprite.scale.x);
            this.sprite.scale.y += (zoomPercentage * this.sprite.scale.y);
            return;
          }
        } else {
          if (currentHeight > this.renderWindow.clientHeight) {
            fixedZoom = currentHeight - this.renderWindow.clientHeight;
            zoomPercentage = -fixedZoom / this.sprite.scale.y;
            this.sprite.scale.x += (zoomPercentage * this.sprite.scale.x);
            this.sprite.scale.y += (zoomPercentage * this.sprite.scale.y);
            return;
          }
        }
      
        if (this.rotatedHeight !== this.fileHeight) {
          if (currentHeight > this.renderWindow.clientWidth) {
            fixedZoom = currentHeight - this.renderWindow.clientWidth;
            zoomPercentage = -fixedZoom / this.sprite.scale.y;
            this.sprite.scale.x += (zoomPercentage * this.sprite.scale.x);
            this.sprite.scale.y += (zoomPercentage * this.sprite.scale.y);
            return;
          }
        } else {
          if (currentWidth > this.renderWindow.clientWidth) {
            fixedZoom = currentWidth - this.renderWindow.clientWidth;
            zoomPercentage = -fixedZoom / this.sprite.scale.x;
            this.sprite.scale.x += (zoomPercentage * this.sprite.scale.x);
            this.sprite.scale.y += (zoomPercentage * this.sprite.scale.y);
            return;
          }
        }
      }
      
      updateScale = function () {
        if (this.sprite === null) {
          return;
        }
      
        var imageWidth = this.fileWidth;
        var imageHeight = this.fileHeight;
      
        if (this.scaled) { //Fit to window
          var w = this.renderWindow.clientWidth;
          var h = this.renderWindow.clientHeight;
      
          if (imageWidth > imageHeight) {
            if (this.rotatedWidth > this.rotatedHeight) {
              this.sprite.scale.set(w, h, 0);
            } else {
              this.sprite.scale.set(h, w, 0);
            }
          } else {
            if (this.rotatedWidth < this.rotatedHeight) {
              this.sprite.scale.set(w, h, 0);
            } else {
              this.sprite.scale.set(h, w, 0);
            }
          }
      
          //No translation or zoom for fit
      
          //this.sprite.scale.x += this.zoomValue;
          //this.sprite.scale.y += this.zoomValue;
      
          this.sprite.position.set(0, 0, 0);
          return;
        }
      
        if (this.imageLocation === 0)
        {
          if (!this.fit) {
            this.setLocationCentered();
          }
          else {
            //Fit on the width or height 
            var percentage = 1;
            if (imageWidth > imageHeight) {
              //Fit on the width and scale the height
              if (this.rotatedWidth < this.rotatedHeight) {
                percentage = (this.renderWindow.clientHeight / this.rotatedHeight);
                this.sprite.scale.set(this.renderWindow.clientHeight, this.rotatedWidth * percentage, 0);
              } else {
                percentage = (this.renderWindow.clientWidth / imageWidth);
                this.sprite.scale.set(this.renderWindow.clientWidth, imageHeight * percentage, 0);
              }
            } else {
              //Fit on the height and scale the width
              if (this.rotatedWidth > this.rotatedHeight) {
                percentage = (this.renderWindow.clientHeight / this.rotatedHeight);
                this.sprite.scale.set(this.renderWindow.clientHeight, this.rotatedWidth * percentage, 0);
              } else {
                percentage = (this.renderWindow.clientHeight / imageHeight);
                this.sprite.scale.set(imageWidth * percentage, this.renderWindow.clientHeight, 0);
              }
            }
      
            //Fitting on the width may cause the height to be taller than the window or fitting on the height
            //may cause the width to be wider than the window. This is because we maintain the aspect ratio
            //of the original image. Check and fix these cases.
            this.fitToWindow();
      
            //Scale and translate
            var zoomPercentage = this.zoomValue / this.sprite.scale.x; //100 zoom / 1000 width = 0.1 (10%). Zoom x 10% and y 10%
            this.sprite.scale.x += (zoomPercentage * this.sprite.scale.x);
            this.sprite.scale.y += (zoomPercentage * this.sprite.scale.y);
      
            this.x = 0;//(-this.renderWindow.clientWidth / 2) + (this.fileWidth / 2);
            this.y = 0;//(this.renderWindow.clientHeight / 2) - (this.fileHeight / 2);
      
            //translate
            this.x += this.xMove;
            this.y += this.yMove;
      
            this.sprite.position.set(this.x, this.y, 0);
          }
        }
       
        //Center=0, UL=1, UR=2, LL=3, LR=4. This applies when the image is not scaled to the window.
        if (this.imageLocation === 1)
        {
          this.setLocationUL();
        }
      
        if (this.imageLocation === 2) {
          this.setLocationUR();
        }
      
        if (this.imageLocation === 3) {
          this.setLocationLL();
        }
      
        if (this.imageLocation=== 4) {
          this.setLocationLR();
        }
        
        //Scale and translate
        //var zoomPercentage = this.zoomValue / this.sprite.scale.x; //100 zoom / 1000 width = 0.1 (10%). Zoom x 10% and y 10%
        //this.sprite.scale.x += (zoomPercentage * this.sprite.scale.x);
        //this.sprite.scale.y += (zoomPercentage * this.sprite.scale.y);
        //this.sprite.position.set(this.x, this.y, 0);
      }
      
      getImage = function () {
        return this.sprite;
      }
      
      getLocation = function () {
        return this.location;
      }
      
      setLocation = function (location) {
        if (this.sprite === null) {
          return;
        }
      
        this.x = location.x;
        this.y = location.y;
      
        this.sprite.position.set(this.x, this.y, 0);
      }
      
      setLocationCentered = function (value) {
        this.imageLocation = 0; //Center=0, UL=1, UR=2, LL=3, LR=4. This applies when the image is not scaled to the window.
        this.fit = value;
      
        if (this.sprite === null) {
          return;
        }
        
        if (this.scaleToWindow) {
          var renderWidth = this.renderWindow.clientWidth * this.scaleToWindowPercent;
          var percentage = (renderWidth / this.fileWidth);
          this.sprite.scale.x = this.fileWidth * percentage;
          this.sprite.scale.y = this.fileHeight * percentage;
        } else {
          this.sprite.scale.x = this.fileWidth;
          this.sprite.scale.y = this.fileHeight;
        }
      
        var zoomPercentage = this.zoomValue / this.sprite.scale.x; //100 zoom / 1000 width = 0.1 (10%). Zoom x 10% and y 10%
        this.sprite.scale.x += (zoomPercentage * this.sprite.scale.x);
        this.sprite.scale.y += (zoomPercentage * this.sprite.scale.y);
      
        this.x = 0;//(-this.renderWindow.clientWidth / 2) + (this.fileWidth / 2);
        this.y = 0;//(this.renderWindow.clientHeight / 2) - (this.fileHeight / 2);
      
        //translate
        this.x += this.xMove;
        this.y += this.yMove;
      
        this.sprite.position.set(this.x, this.y, 0);
      }
      
      setLocationUL = function () {
        this.imageLocation = 1; //Center=0, UL=1, UR=2, LL=3, LR=4. This applies when the image is not scaled to the window.
      
        if (this.sprite === null) {
          return;
        }
      
        if (this.scaleToWindow) {
          var renderWidth = this.renderWindow.clientWidth * this.scaleToWindowPercent;
          var percentage = (renderWidth / this.fileWidth);
          this.sprite.scale.x = this.fileWidth * percentage;
          this.sprite.scale.y = this.fileHeight * percentage;
        } else {
          this.sprite.scale.x = this.fileWidth;
          this.sprite.scale.y = this.fileHeight;
        }
      
        var zoomPercentage = this.zoomValue / this.sprite.scale.x; //100 zoom / 1000 width = 0.1 (10%). Zoom x 10% and y 10%
        this.sprite.scale.x += (zoomPercentage * this.sprite.scale.x);
        this.sprite.scale.y += (zoomPercentage * this.sprite.scale.y);
      
        this.x = (-this.renderWindow.clientWidth / 2) + (this.sprite.scale.x / 2);
        this.y = (this.renderWindow.clientHeight / 2) - (this.sprite.scale.y / 2);
      
        //translate
        this.x += this.xMove;
        this.y += this.yMove;
      
        this.sprite.position.set(this.x, this.y, 0);
      }
      
      setLocationUR = function () {
        this.imageLocation = 2; //Center=0, UL=1, UR=2, LL=3, LR=4. This applies when the image is not scaled to the window.
      
        if (this.sprite === null) {
          return;
        }
      
        if (this.scaleToWindow) {
          var renderWidth = this.renderWindow.clientWidth * this.scaleToWindowPercent;
          var percentage = (renderWidth / this.fileWidth);
          this.sprite.scale.x = this.fileWidth * percentage;
          this.sprite.scale.y = this.fileHeight * percentage;
        } else {
          this.sprite.scale.x = this.fileWidth;
          this.sprite.scale.y = this.fileHeight;
        }
       
        var zoomPercentage = this.zoomValue / this.sprite.scale.x; //100 zoom / 1000 width = 0.1 (10%). Zoom x 10% and y 10%
        this.sprite.scale.x += (zoomPercentage * this.sprite.scale.x);
        this.sprite.scale.y += (zoomPercentage * this.sprite.scale.y);
      
        this.x = (this.renderWindow.clientWidth / 2) - (this.sprite.scale.x / 2);
        this.y = (this.renderWindow.clientHeight / 2) - (this.sprite.scale.y / 2);
      
        //translate
        this.x += this.xMove;
        this.y += this.yMove;
      
        this.sprite.position.set(this.x, this.y, 0);
      }
      
      setLocationLR = function () {
        this.imageLocation = 4; //Center=0, UL=1, UR=2, LL=3, LR=4. This applies when the image is not scaled to the window.
      
        if (this.sprite ===null) {
          return;
        }
      
        if (this.scaleToWindow) {
          var renderWidth = this.renderWindow.clientWidth * this.scaleToWindowPercent;
          var percentage = (renderWidth / this.fileWidth);
          this.sprite.scale.x = this.fileWidth * percentage;
          this.sprite.scale.y = this.fileHeight * percentage;
        } else {
          this.sprite.scale.x = this.fileWidth;
          this.sprite.scale.y = this.fileHeight;
        }
      
        var zoomPercentage = this.zoomValue / this.sprite.scale.x; //100 zoom / 1000 width = 0.1 (10%). Zoom x 10% and y 10%
        this.sprite.scale.x += (zoomPercentage * this.sprite.scale.x);
        this.sprite.scale.y += (zoomPercentage * this.sprite.scale.y);
      
        this.x = (this.renderWindow.clientWidth / 2) - (this.sprite.scale.x / 2);
        this.y = (-this.renderWindow.clientHeight / 2) + (this.sprite.scale.y / 2);
      
        //translate
        this.x += this.xMove;
        this.y += this.yMove;
      
        this.sprite.position.set(this.x, this.y, 0);
      }
      
      setLocationLL = function () {
        this.imageLocation = 3; //Center=0, UL=1, UR=2, LL=3, LR=4. This applies when the image is not scaled to the window.
      
        if (this.sprite=== null) {
          return;
        }
      
        if (this.scaleToWindow) {
          var renderWidth = this.renderWindow.clientWidth * this.scaleToWindowPercent;
          var percentage = (renderWidth / this.fileWidth);
          this.sprite.scale.x = this.fileWidth * percentage;
          this.sprite.scale.y = this.fileHeight * percentage;
        } else {
          this.sprite.scale.x = this.fileWidth;
          this.sprite.scale.y = this.fileHeight;
        }
      
        var zoomPercentage = this.zoomValue / this.sprite.scale.x; //100 zoom / 1000 width = 0.1 (10%). Zoom x 10% and y 10%
        this.sprite.scale.x += (zoomPercentage * this.sprite.scale.x);
        this.sprite.scale.y += (zoomPercentage * this.sprite.scale.y);
      
        this.x = (-this.renderWindow.clientWidth / 2) + (this.sprite.scale.x / 2);
        this.y = (-this.renderWindow.clientHeight / 2) + (this.sprite.scale.y / 2);
      
        //translate
        this.x += this.xMove;
        this.y += this.yMove;
       
        this.sprite.position.set(this.x, this.y, 0);
          }
      
      rotate = function (value) {
        if (this.sprite !== null) {
          //Convert Degrees to Radians
          this.sprite.material.rotation += (-value * (Math.PI / 180.0));
      
          var temp = this.rotatedWidth;
          this.rotatedWidth = this.rotatedHeight;
          this.rotatedHeight = temp;
      
          this.updateScale();
        }
      }
      
      translate = function (x, y) {
        if (this.sprite !== null) {
          this.xMove += x;
          this.yMove += y;
      
          this.x += x;
          this.y += y;
      
          this.sprite.position.set(this.x, this.y, 0);
        }
      }
      
      zoom = function (value) {
        if (this.sprite !== null) {
          if (!this.scaled) {
            this.zoomValue += value;
            this.updateScale();
          }
        }
      }
      
      toggleScale = function () {
        if (this.scaled === true) {
          this.scaled = false;
        } else {
          this.scaled = true;
        }
      
        this.updateScale();
      }
      
      enableScale = function (value) {
        this.scaled = value;
        this.updateScale();
      }
      
      getScale = function () {
        return this.scaled;
      }
      
      toggleVisibility = function () {
        if (this.spriteVisible === true) {
          this.spriteVisible = false;
        }
        else {
          this.spriteVisible = true;
        }
      
        if (this.sprite !== null) {
          this.sprite.visible = this.spriteVisible;
        }
      }
      
      setVisible = function (value) {
        this.spriteVisible = value;
      
        if (this.sprite !== null) {
          this.sprite.visible = this.spriteVisible;
        }
      }
      
      isLoaded = function () {
        return this.loaded;
      }
      
      toggleScaleToWindow = function () {
        if (this.scaleToWindow === true) {
          this.scaleToWindow = false;
        } else {
          this.scaleToWindow = true;
        }
      
        this.updateScale();
      }
      
      enableScaleToWindow = function (value) {
        this.scaleToWindow = value;
        this.updateScale();
      }
      
      setScaleToWindowPercent = function (value) {
        this.scaleToWindowPercent = value;
        this.updateScale();
      }
      
      getDimensions = function () {
        if (this.sprite !== null) {
          return this.sprite.scale;
        }
      }
      
      isLoaded = function () {
        return this.loaded;
      }
}

export default(webImage);