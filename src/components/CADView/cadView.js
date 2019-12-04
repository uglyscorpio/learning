import webGLManager from "./webGLManager"
import webGraphics from "./webGraphics"
import webInput from './webInput'
class cadView{
    constructor(system){
        this.system = system;
        this.webGL = new webGLManager(system);
    
        this.fpsUpdateID = null;
        this.webGLUpdateID = null;
        this.running = false;
        this.graphics = null;
        this.input = null;
        this.previousFrameTime = 0;
        this.timeToRenderFrame = 16.66666666666667; //Default for 60FPS (1000ms / 60FPS = 16.66666666666667ms)
        this.errorString = null;
        this.featureMarkerInfo = null;
        this.webGLSupported = false;
        this.fpsLabel = null;
        this.fpsEnabled = null;
    }



    init = (cadInfo) => {
        try {
            this.errorString = "CAD Engine Error: ";
        
            this.system.log("[CAD Engine] System Initialize Start");
            if (!this.webGL.isInitialized()) {
              this.system.log("[CAD Engine] Initialize WebGL Start");
              this.webGLSupported = this.webGL.init();
              this.system.log("[CAD Engine] Initialize WebGL End");
            } else {
              this.system.log("[CAD Engine] WebGL already initialized");
              this.webGL.updateCanvas();
              this.webGLSupported = true;
            }
        
            if (!this.webGLSupported) {
              this.system.log(this.errorString + 'WebGL is not supported on this device.');
              return;
            }
        
            //this.end(); //Make sure everything is in a clean state
        
            if (this.graphics === null) {
              this.graphics = new webGraphics();
            }
        
            //Graphics must come before input
            var renderWindow = this.webGL.getRenderWindow();
            var renderer = this.webGL.getRenderer();
            var scene = this.webGL.getScene();
            var sceneUI = this.webGL.getSceneUI();
            var scene2DBackground = this.webGL.getScene2DBackground();
            var scene2DForeground = this.webGL.getScene2DForeground();
            this.system.log("[CAD Engine] Graphics System Init Start");
            this.graphics.init(renderWindow, renderer, scene, sceneUI, scene2DBackground, scene2DForeground, cadInfo);
            this.system.log("[CAD Engine] Graphics System Init End");
        
            this.input = new webInput();
            this.system.log("[CAD Engine] Input System Init Start");
            this.input.init(this, this.graphics.getCamera3D(),
              this.graphics.getCanvas(), this.graphics.getGraphicsHandler());
            this.system.log("[CAD Engine] Input System Init End");
        
            this.running = true;
        
            this.fpsLabel = document.getElementById("fpsLabelContainer");
            this.fpsLabel.style.visibility = "hidden";
            this.fpsLabel.textContent = "60.0";
            this.fpsEnabled = false;
        
            this.enableFPS(false); //Debug
        
            var engineInstance = this;
            this.fpsUpdateID = setInterval(
              function () {
                engineInstance.updateFPS();
              }, 1000);
        
            //Start the rendering loop
            this.engineUpdate();
            this.system.log("[CAD Engine] System Initialize End");
          }
          catch (exception) {
            this.system.log(this.errorString + exception);
            alert(this.errorString + exception);
            this.end();
          }

    }

    update = function (currentTime) {
        try {
          if (!this.webGLSupported) {
            return;
          }
      
          if (this.input !== null && this.graphics !== null) {
            //The time it took to render the current frame can be used for computer independent 
            //animation speed and for calculating the frames per second.
            if (this.previousFrameTime !== 0) {
              this.timeToRenderFrame = currentTime - this.previousFrameTime;
            }
      
            this.previousFrameTime = currentTime;
      
            this.input.update(this.timeToRenderFrame);
      
            if (this.input.exitRequested()) {
              this.end();
              return;
            }
      
            this.graphics.update(this.timeToRenderFrame);
          }
        }
        catch (exception) {
          this.system.log(this.errorString + exception);
          alert(this.errorString + exception);
          this.end();
        }
      }
      
      end = function () {
        try {
          if (!this.webGLSupported) {
            return;
          }
      
          //Stop updating the FPS counter
          clearInterval(this.fpsUpdateID);
      
          //Stop drawing graphics
          cancelAnimationFrame(this.webGLUpdateID);
      
          //Do not detroy the webGLManager. Only destroy the sub-components by calling end()
          //so that CAD files, lights, etc. are destroyed and memory is freed.
          if (this.webGL !== null) {
            this.webGL.end();
          }
      
          if (this.graphics !== null) {
            this.graphics.end();
            this.graphics = null;
          }
      
          if (this.input !== null) {
            this.input.end();
            this.input = null;
          }
      
          this.fpsUpdateID = null;
          this.webGLUpdateID = null;
          this.running = false;
          this.previousFrameTime = 0;
          this.timeToRenderFrame = 16.66666666666667;
          this.featureMarkerInfo = null;
          this.webGLSupported = false;
      
          this.fpsLabel.style.visibility = "hidden";
          this.fpsLabel = null;
          this.fpsEnabled = null;
        }
        catch (exception) {
          this.system.log(this.errorString + exception);
          alert(this.errorString + exception);
        }
      }
      
      reset = function () {
        try {
          if (!this.webGLSupported) {
            return;
          }
      
          if (this.graphics !== null) {
            this.graphics.reset();
          }
      
          if (this.input !== null) {
            this.input.reset();
          }
        }
        catch (exception) {
          this.system.log(this.errorString + exception);
          alert(this.errorString + exception);
          this.end();
        }
      }
      
      //Helper API---------------------------------------------------------
      getFeatureLabelEdit = function () {
        try {
          if (!this.webGLSupported) {
            return false;
          }
      
          if (this.graphics !== null) {
            return this.graphics.getFeatureLabelEdit();
          }
      
          return false;
        }
        catch (exception) {
          this.system.log(this.errorString + exception);
          alert(this.errorString + exception);
          this.end();
        }
      }
      
      engineUpdate = function (currentTime) {
        try {
          if (!this.webGLSupported) {
            return;
          }
      
          if (this.isRunning()) {
            this.update(currentTime);
            var engineInstance = this;
            this.webGLUpdateID = requestAnimationFrame(function(time) {
               engineInstance.engineUpdate(time);
            });
          } else {
            this.end();
          }
        }
        catch (exception) {
          this.system.log(this.errorString + exception);
          alert(this.errorString + exception);
          this.end();
        }
      }
      
      updateFPS = function () {
        if (!this.webGLSupported) {
          return;
        }
      
        if (!this.fpsEnabled) {
          return;
        }
      
        if (this.fpsLabel !== null) {
          if (this.graphics.isCADLoaded()) {
            var fpsValue = this.getFPS();
            if (fpsValue > 0) {
              this.fpsLabel.style.visibility = "visible";
              this.fpsLabel.textContent = "FPS: " + Math.round(fpsValue);
      
              var left = this.webGL.getRenderWindow().clientWidth - 100;
              var top = this.webGL.getRenderWindow().clientHeight - 30;
      
              this.fpsLabel.style.left = left + "px";
              this.fpsLabel.style.top = top + "px";
            }
          }
        }
      }
      
      enableFPS = function (value) {
        if (!this.webGLSupported) {
          return;
        }
      
        this.fpsEnabled = value;
      }
      
      start = function (cadInfo) {
        try {
          this.init(cadInfo);
        }
        catch (exception) {
          this.system.log(this.errorString + exception);
          alert(this.errorString + exception);
          this.end();
        }
      }
      
      setFeatureInfo = function (value) {
        try {
          if (!this.webGLSupported) {
            return;
          }
      
          if (this.graphics === null) {
            this.graphics = new webGraphics();
          }
      
          this.graphics.setFeatureInfo(value);
        }
        catch (exception) {
          this.system.log(this.errorString + exception);
          alert(this.errorString + exception);
          this.end();
        }
      }
      
      stop = function () {
        try {
          this.end();
        }
        catch (exception) {
          this.system.log(this.errorString + exception);
          alert(this.errorString + exception);
          this.end();
        }
      }
      
      isRunning = function () {
        try {
          return this.running;
        }
        catch (exception) {
          this.system.log(this.errorString + exception);
          alert(this.errorString + exception);
          this.end();
          return null;
        }
      }
      
      getFPS = function () {
        try {
          if (this.graphics !== null) {
            return this.graphics.getFPS();
          } else {
            return -1;
          }
        }
        catch (exception) {
          this.system.log(this.errorString + exception);
          alert(this.errorString + exception);
          this.end();
          return null;
        }
      }
      
      scaleToFit = function () {
        try {
          if (!this.webGLSupported) {
            return;
          }
      
          if (this.graphics !== null) {
            this.graphics.scaleToFit();
          }
        }
        catch (exception) {
          this.system.log(this.errorString + exception);
          alert(this.errorString + exception);
          this.end();
        }
      }
      
      toggleHorizontalRotationLock = function () {
        try {
          if (!this.webGLSupported) {
            return;
          }
      
          if (this.input !== null) {
            this.input.toggleHorizontalRotationLock();
          }
        }
        catch (exception) {
          this.system.log(this.errorString + exception);
          alert(this.errorString + exception);
          this.end();
        }
      }
      
      toggleVerticalRotationLock = function () {
        try {
          if (!this.webGLSupported) {
            return;
          }
      
          if (this.input !== null) {
            this.input.toggleVerticalRotationLock();
          }
        }
        catch (exception) {
          this.system.log(this.errorString + exception);
          alert(this.errorString + exception);
          this.end();
        }
      }
      
      cadRotateX = function (value) {
        try {
          if (!this.webGLSupported) {
            return;
          }
      
          if (this.graphics !== null) {
            this.graphics.cadRotateX(value);
          }
        }
        catch (exception) {
          this.system.log(this.errorString + exception);
          alert(this.errorString + exception);
          this.end();
        }
      }
      
      cadRotateY = function (value) {
        try {
          if (!this.webGLSupported) {
            return;
          }
      
          if (this.graphics !== null) {
            this.graphics.cadRotateY(value);
          }
        }
        catch (exception) {
          this.system.log(this.errorString + exception);
          alert(this.errorString + exception);
          this.end();
        }
      }
      
      cadRotateZ = function (value) {
        try {
          if (!this.webGLSupported) {
            return;
          }
      
          if (this.graphics !== null) {
            this.graphics.cadRotateZ(value);
          }
        }
        catch (exception) {
          this.system.log(this.errorString + exception);
          alert(this.errorString + exception);
          this.end();
        }
      }
      
      setFrontView = function () {
        try {
          if (!this.webGLSupported) {
            return;
          }
      
          if (this.input !== null && this.graphics !== null) {
            this.input.reset();
            this.graphics.setFrontView();
          }
        }
        catch (exception) {
          this.system.log(this.errorString + exception);
          alert(this.errorString + exception);
          this.end();
        }
      }
      
      setBackView = function () {
        try {
          if (!this.webGLSupported) {
            return;
          }
      
          if (this.input !== null && this.graphics !== null) {
            this.input.reset();
            this.graphics.setBackView();
          }
        }
        catch (exception) {
          this.system.log(this.errorString + exception);
          alert(this.errorString + exception);
          this.end();
        }
      }
      
      setLeftView = function () {
        try {
          if (!this.webGLSupported) {
            return;
          }
      
          if (this.input !== null && this.graphics !== null) {
            this.input.reset();
            this.graphics.setLeftView();
          }
        }
        catch (exception) {
          this.system.log(this.errorString + exception);
          alert(this.errorString + exception);
          this.end();
        }
      }
      
      setRightView = function() {
        try {
          if (!this.webGLSupported) {
            return;
          }
      
          if (this.input !== null && this.graphics !== null) {
            this.input.reset();
            this.graphics.setRightView();
          }
        } catch (exception) {
          this.system.log(this.errorString + exception);
          alert(this.errorString + exception);
          this.end();
        }
      }
      
      setTopView = function () {
        try {
          if (!this.webGLSupported) {
            return;
          }
      
          if (this.input !== null && this.graphics !== null) {
            this.input.reset();
            this.graphics.setTopView();
          }
        }
        catch (exception) {
          this.system.log(this.errorString + exception);
          alert(this.errorString + exception);
          this.end();
        }
      }
      
      setBottomView = function () {
        try {
          if (!this.webGLSupported) {
            return;
          }
      
          if (this.input !== null && this.graphics !== null) {
            this.input.reset();
            this.graphics.setBottomView();
          }
        }
        catch (exception) {
          this.system.log(this.errorString + exception);
          alert(this.errorString + exception);
          this.end();
        }
      }
      
      setIsoView = function () {
        try {
          if (!this.webGLSupported) {
            return;
          }
      
          if (this.input !== null && this.graphics !== null) {
            this.input.reset();
            this.graphics.setIsoView();
          }
        }
        catch (exception) {
          this.system.log(this.errorString + exception);
          alert(this.errorString + exception);
          this.end();
        }
      }
      
      toggleBackgroundScale = function () {
        try {
          if (!this.webGLSupported) {
            return;
          }
      
          if (this.graphics !== null) {
            this.graphics.toggleBackgroundScale();
          }
        }
        catch (exception) {
          this.system.log(this.errorString + exception);
          alert(this.errorString + exception);
          this.end();
        }
      }
      
      enableBackgroundScale = function (value) {
        try {
          if (!this.webGLSupported) {
            return;
          }
      
          if (this.graphics !== null) {
            this.graphics.enableBackgroundScale(value);
          }
        }
        catch (exception) {
          this.system.log(this.errorString + exception);
          alert(this.errorString + exception);
          this.end();
        }
      }
      
      toggleForegroundScale = function () {
        try {
          if (!this.webGLSupported) {
            return;
          }
      
          if (this.graphics !== null) {
            this.graphics.toggleForegroundScale();
          }
        }
        catch (exception) {
          this.system.log(this.errorString + exception);
          alert(this.errorString + exception);
          this.end();
        }
      }
      
      enableForegroundScale = function (value) {
        try {
          if (!this.webGLSupported) {
            return;
          }
      
          if (this.graphics !== null) {
            this.graphics.enableForegroundScale(value);
          }
        }
        catch (exception) {
          this.system.log(this.errorString + exception);
          alert(this.errorString + exception);
          this.end();
        }
      }
      
      toggleWireframe = function () {
        try {
          if (!this.webGLSupported) {
            return;
          }
      
          if (this.graphics !== null) {
            this.graphics.enableTransparency(false);
            this.graphics.toggleWireframe();
          }
        }
        catch (exception) {
          this.system.log(this.errorString + exception);
          alert(this.errorString + exception);
          this.end();
        }
      }
      
      enableWireframe = function (value) {
        try {
          if (!this.webGLSupported) {
            return;
          }
      
          if (this.graphics !== null) {
            this.graphics.enableWireframe(value);
          }
        }
        catch (exception) {
          this.system.log(this.errorString + exception);
          alert(this.errorString + exception);
          this.end();
        }
      }
      
      toggleBackground = function () {
        try {
          if (!this.webGLSupported) {
            return;
          }
      
          if (this.graphics !== null) {
            this.graphics.toggleBackground();
          }
        }
        catch (exception) {
          this.system.log(this.errorString + exception);
          alert(this.errorString + exception);
          this.end();
        }
      }
      
      enableBackground = function (value) {
        try {
          if (!this.webGLSupported) {
            return;
          }
      
          if (this.graphics !== null) {
            this.graphics.enableBackground(value);
          }
        }
        catch (exception) {
          this.system.log(this.errorString + exception);
          alert(this.errorString + exception);
          this.end();
        }
      }
      
      toggleForeground = function () {
        try {
          if (!this.webGLSupported) {
            return;
          }
      
          if (this.graphics !== null) {
            this.graphics.toggleForeground();
          }
        }
        catch (exception) {
          this.system.log(this.errorString + exception);
          alert(this.errorString + exception);
          this.end();
        }
      }
      
      enableForeground = function (value) {
        try {
          if (!this.webGLSupported) {
            return;
          }
      
          if (this.graphics !== null) {
            this.graphics.enableForeground(value);
          }
        }
        catch (exception) {
          this.system.log(this.errorString + exception);
          alert(this.errorString + exception);
          this.end();
        }
      }
      
      toggleTransparency = function () {
        try {
          if (!this.webGLSupported) {
            return;
          }
      
          if (this.graphics !== null) {
            this.graphics.enableWireframe(false);
            this.graphics.toggleTransparency();
          }
        }
        catch (exception) {
          this.system.log(this.errorString + exception);
          alert(this.errorString + exception);
          this.end();
        }
      }
      
      enableTransparency = function (value) {
        try {
          if (!this.webGLSupported) {
            return;
          }
      
          if (this.graphics !== null) {
            this.graphics.enableTransparency(value);
          }
        }
        catch (exception) {
          this.system.log(this.errorString + exception);
          alert(this.errorString + exception);
          this.end();
        }
      }
      
      
      toggleAxis = function () {
        try {
          if (!this.webGLSupported) {
            return;
          }
      
          if (this.graphics !== null) {
            this.graphics.toggleAxis();
          }
        }
        catch (exception) {
          this.system.log(this.errorString + exception);
          alert(this.errorString + exception);
          this.end();
        }
      }
      
      enableAxis = function (value) {
        try {
          if (!this.webGLSupported) {
            return;
          }
      
          if (this.graphics !== null) {
            this.graphics.enableAxis(value);
          }
        }
        catch (exception) {
          this.system.log(this.errorString + exception);
          alert(this.errorString + exception);
          this.end();
        }
      }
      
      toggleAnimation = function () {
        try {
          if (!this.webGLSupported) {
            return;
          }
      
          if (this.graphics !== null) {
            this.graphics.toggleAnimation();
          }
        }
        catch (exception) {
          this.system.log(this.errorString + exception);
          alert(this.errorString + exception);
          this.end();
        }
      }
      
      enableAnimation = function (value) {
        try {
          if (!this.webGLSupported) {
            return;
          }
      
          if (this.graphics !== null) {
            this.graphics.enableAnimation(value);
          }
        }
        catch (exception) {
          this.system.log(this.errorString + exception);
          alert(this.errorString + exception);
          this.end();
        }
      }
      
      toggleGrid = function () {
        try {
          if (!this.webGLSupported) {
            return;
          }
      
          if (this.graphics !== null) {
            this.graphics.toggleGrid();
          }
        }
        catch (exception) {
          this.system.log(this.errorString + exception);
          alert(this.errorString + exception);
          this.end();
        }
      }
      
      enableGrid = function (value) {
        try {
          if (!this.webGLSupported) {
            return;
          }
      
          if (this.graphics !== null) {
            this.graphics.enableGrid(value);
          }
        }
        catch (exception) {
          this.system.log(this.errorString + exception);
          alert(this.errorString + exception);
          this.end();
        }
      }
      
      toggleTexture = function () {
        try {
          if (!this.webGLSupported) {
            return;
          }
      
          if (this.graphics !== null) {
            this.graphics.toggleTexture();
          }
        }
        catch (exception) {
          this.system.log(this.errorString + exception);
          alert(this.errorString + exception);
          this.end();
        }
      }
      
      enableTexture = function (value) {
        try {
          if (!this.webGLSupported) {
            return;
          }
      
          if (this.graphics !== null) {
            this.graphics.enableTexture(value);
          }
        }
        catch (exception) {
          this.system.log(this.errorString + exception);
          alert(this.errorString + exception);
          this.end();
        }
      }
      
      setCameraTarget = function (name) {
        try {
          if (!this.webGLSupported) {
            return;
          }
      
          if (this.graphics !== null && this.input !== null) {
            if (this.graphics.isCADLoaded()) {
              this.input.reset();
              this.graphics.setCameraTarget(name);
            }
          }
        }
        catch (exception) {
          this.system.log(this.errorString + exception);
          alert(this.errorString + exception);
          this.end();
        }
      }
      
      resize = function () {
        try {
          if (!this.webGLSupported) { //webGL may not be supported or the system was not initalized because there is no CAD
            var renderWindow = this.webGL.getRenderWindow();
            var renderer = this.webGL.getRenderer();
            renderer.setSize(renderWindow.clientWidth, renderWindow.clientHeight);
            return;
          }
      
          if (this.graphics !== null) {
            this.input.resize();
            this.graphics.resize();
          }
        }
        catch (exception) {
          this.system.log(this.errorString + exception);
          alert(this.errorString + exception);
          this.end();
        }
      }
      
      saveScreenshot = function (fileName) {
        try {
          if (!this.webGLSupported) {
            return;
          }
      
          if (this.graphics !== null && this.input !== null) {
            if (this.graphics.isCADLoaded()) {
              this.graphics.saveScreenshot(fileName);
            }
          }
        }
        catch (exception) {
          this.system.log(this.errorString + exception);
          alert(this.errorString + exception);
          this.end();
        }
      }
      
      //Color API
      setGlobalLightColor = function (hexValue) {
        try {
          if (!this.webGLSupported) {
            return;
          }
      
          if (this.graphics !== null) {
            this.graphics.setGlobalLightColor(hexValue);
          }
        }
        catch (exception) {
          this.system.log(this.errorString + exception);
          alert(this.errorString + exception);
          this.end();
        }
      }
      
      setFrontLightColor = function (hexValue) {
        try {
          if (!this.webGLSupported) {
            return;
          }
      
          if (this.graphics !== null) {
            this.graphics.setFrontLightColor(hexValue);
          }
        }
        catch (exception) {
          this.system.log(this.errorString + exception);
          alert(this.errorString + exception);
          this.end();
        }
      }
      
      setBackLightColor = function (hexValue) {
        try {
          if (!this.webGLSupported) {
            return;
          }
      
          if (this.graphics !== null) {
            this.graphics.setBackLightColor(hexValue);
          }
        }
        catch (exception) {
          this.system.log(this.errorString + exception);
          alert(this.errorString + exception);
          this.end();
        }
      }
      
      setBackgroundColor = function (hexValue) {
        try {
          if (!this.webGLSupported) {
            return;
          }
      
          if (this.webGL !== null) {
            this.webGL.setBackgroundColor(hexValue);
          }
        }
        catch (exception) {
          this.system.log(this.errorString + exception);
          alert(this.errorString + exception);
          this.end();
        }
      }
      
      setCADColor = function (hexValue) {
        try {
          if (!this.webGLSupported) {
            return;
          }
      
          if (this.graphics !== null) {
            this.graphics.setCADColor(hexValue);
          }
        }
        catch (exception) {
          this.system.log(this.errorString + exception);
          alert(this.errorString + exception);
          this.end();
        }
      }
      
      
      setDefaultColor = function (hexValue) {
        try {
          if (!this.webGLSupported) {
            return;
          }
      
          if (this.graphics !== null) {
            this.graphics.setDefaultColor(hexValue);
          }
        }
        catch (exception) {
          this.system.log(this.errorString + exception);
          alert(this.errorString + exception);
          this.end();
        }
      }
      
      setHoverColor = function (hexValue) {
        try {
          if (!this.webGLSupported) {
            return;
          }
      
          if (this.graphics !== null) {
            this.graphics.setHoverColor(hexValue);
          }
        }
        catch (exception) {
          this.system.log(this.errorString + exception);
          alert(this.errorString + exception);
          this.end();
        }
      }
      
      setSelectedColor = function (hexValue) {
        try {
          if (!this.webGLSupported) {
            return;
          }
      
          if (this.graphics !== null) {
            this.graphics.setSelectedColor(hexValue);
          }
        }
        catch (exception) {
          this.system.log(this.errorString + exception);
          alert(this.errorString + exception);
          this.end();
        }
      }
      
      setLeaderLineColor = function (value) {
        try {
          if (!this.webGLSupported) {
            return;
          }
      
          if (this.graphics !== null) {
            this.graphics.setLeaderLineColor(value);
          }
        }
        catch (exception) {
          this.system.log(this.errorString + exception);
          alert(this.errorString + exception);
          this.end();
        }
      }
      
      setLeaderLineSize = function (value) {
        try {
          if (!this.webGLSupported) {
            return;
          }
      
          if (this.graphics !== null) {
            this.graphics.setLeaderLineSize(value);
          }
        }
        catch (exception) {
          this.system.log(this.errorString + exception);
          alert(this.errorString + exception);
          this.end();
        }
      }
      
      setLeaderLineDefaultLength = function (value) {
        try {
          if (!this.webGLSupported) {
            return;
          }
      
          if (this.graphics !== null) {
            this.graphics.setLeaderLineDefaultLength(value);
          }
        }
        catch (exception) {
          this.system.log(this.errorString + exception);
          alert(this.errorString + exception);
          this.end();
        }
      }
      
      loadVOD = function (value) {
        try {
          if (!this.webGLSupported) {
            return;
          }
      
          if (this.graphics !== null) {
            this.graphics.loadVOD(value);
          }
        }
        catch (exception) {
          this.system.log(this.errorString + exception);
          alert(this.errorString + exception);
          this.end();
        }
      }
      
      playVOD = function () {
        try {
          if (!this.webGLSupported) {
            return;
          }
      
          if (this.graphics !==null) {
            this.graphics.playVOD();
          }
        }
        catch (exception) {
          this.system.log(this.errorString + exception);
          alert(this.errorString + exception);
          this.end();
        }
      }
      
      pauseVOD = function () {
        try {
          if (!this.webGLSupported) {
            return;
          }
      
          if (this.graphics !== null) {
            this.graphics.pauseVOD();
          }
        }
        catch (exception) {
          this.system.log(this.errorString + exception);
          alert(this.errorString + exception);
          this.end();
        }
      }
      
      stopVOD = function () {
        try {
          if (!this.webGLSupported) {
            return;
          }
      
          if (this.graphics !== null) {
            this.graphics.stopVOD();
          }
        }
        catch (exception) {
          this.system.log(this.errorString + exception);
          alert(this.errorString + exception);
          this.end();
        }
      }
      
      frameBackVOD = function () {
        try {
          if (!this.webGLSupported) {
            return;
          }
      
          if (this.graphics !== null) {
            this.graphics.frameBackVOD();
          }
        }
        catch (exception) {
          this.system.log(this.errorString + exception);
          alert(this.errorString + exception);
          this.end();
        }
      }
      
      frameForwardVOD = function () {
        try {
          if (!this.webGLSupported) {
            return;
          }
      
          if (this.graphics !== null) {
            this.graphics.frameForwardVOD();
          }
        }
        catch (exception) {
          this.system.log(this.errorString + exception);
          alert(this.errorString + exception);
          this.end();
        }
      }
      
      rewindVOD = function () {
        try {
          if (!this.webGLSupported) {
            return;
          }
      
          if (this.graphics !== null) {
            this.graphics.rewindVOD();
          }
        }
        catch (exception) {
          this.system.log(this.errorString + exception);
          alert(this.errorString + exception);
          this.end();
        }
      }
      
      fastForwardVOD = function () {
        try {
          if (!this.webGLSupported) {
            return;
          }
      
          if (this.graphics !== null) {
            this.graphics.fastForwardVOD();
          }
        }
        catch (exception) {
          this.system.log(this.errorString + exception);
          alert(this.errorString + exception);
          this.end();
        }
      }
      
      setVODPlaybackRate = function (value) {
        try {
          if (!this.webGLSupported) {
            return;
          }
      
          if (this.graphics !== null) {
            this.graphics.setVODPlaybackRate(value);
          }
        }
        catch (exception) {
          this.system.log(this.errorString + exception);
          alert(this.errorString + exception);
          this.end();
        }
      }
      
      setVODUpperLimit = function (value) {
        try {
          if (!this.webGLSupported) {
            return;
          }
      
          if (this.graphics !== null) {
            this.graphics.setVODUpperLimit(value);
          }
        }
        catch (exception) {
          this.system.log(this.errorString + exception);
          alert(this.errorString + exception);
          this.end();
        }
      }
      
      setVODLowerLimit = function (value) {
        try {
          if (!this.webGLSupported) {
            return;
          }
      
          if (this.graphics !== null) {
            this.graphics.setVODLowerLimit(value);
          }
        }
        catch (exception) {
          this.system.log(this.errorString + exception);
          alert(this.errorString + exception);
          this.end();
        }
      }
      
      setVODLoadingPercentageCallback = function (value) {
        try {
          if (!this.webGLSupported) {
            return;
          }
      
          if (this.graphics !== null) {
            this.graphics.setVODLoadingPercentageCallback(value);
          }
        }
        catch (exception) {
          this.system.log(this.errorString + exception);
          alert(this.errorString + exception);
          this.end();
        }
      }
      
      setVODControlsDisabledCallback = function (value) {
        try {
          if (!this.webGLSupported) {
            return;
          }
      
          if (this.graphics !== null) {
            this.graphics.setVODControlsDisabledCallback(value);
          }
        }
        catch (exception) {
          this.system.log(this.errorString + exception);
          alert(this.errorString + exception);
          this.end();
        }
      }
      
      setVODFrameSliderValueCallback = function (value) {
        try {
          if (!this.webGLSupported) {
            return;
          }
      
          if (this.graphics !== null) {
            this.graphics.setVODFrameSliderValueCallback(value);
          }
        }
        catch (exception) {
          this.system.log(this.errorString + exception);
          alert(this.errorString + exception);
          this.end();
        }
      }
      
      setFPSSliderValueCallback = function (value) {
        try {
          if (!this.webGLSupported) {
            return;
          }
      
          if (this.graphics !== null) {
            this.graphics.setFPSSliderValueCallback(value);
          }
        }
        catch (exception) {
          this.system.log(this.errorString + exception);
          alert(this.errorString + exception);
          this.end();
        }
      }
      
      unloadVOD = function () {
        try {
          if (!this.webGLSupported) {
            return;
          }
      
          if (this.graphics !== null) {
            this.graphics.unloadVOD();
          }
        }
        catch (exception) {
          this.system.log(this.errorString + exception);
          alert(this.errorString + exception);
          this.end();
        }
      }
      
      setVODFrame = function (value) {
        try {
          if (!this.webGLSupported) {
            return;
          }
      
          if (this.graphics !== null) {
            this.graphics.setVODFrame(value);
          }
        }
        catch (exception) {
          this.system.log(this.errorString + exception);
          alert(this.errorString + exception);
          this.end();
        }
      }
      
      enableCADControls = function (value) {
        try {
          if (!this.webGLSupported) {
            return;
          }
      
          if (this.input !== null) {
            this.input.enableCADControls(value);
          }
        }
        catch (exception) {
          this.system.log(this.errorString + exception);
          alert(this.errorString + exception);
          this.end();
        }
      }
      
      getView = function () {
        try {
          if (!this.webGLSupported) {
            return;
          }
      
          if (this.input !== null) {
            return this.input.getView();
          }
      
          return null;
        }
        catch (exception) {
          this.system.log(this.errorString + exception);
          alert(this.errorString + exception);
          this.end();
          return null;
        }
      }
      
      setView = function (value) {
        try {
          if (!this.webGLSupported) {
            return;
          }
      
          if (this.input !== null) {
            this.input.setView(value);
          }
        }
        catch (exception) {
          this.system.log(this.errorString + exception);
          alert(this.errorString + exception);
          this.end();
        }
      }
      
      getWebGLSupported = function () {
        return this.webGLSupported;
      }
      
      setBackground = function (value) {
        try {
          if (!this.webGLSupported) {
            return;
          }
      
          if (this.graphics !== null) {
            this.graphics.setBackground(value);
          }
        }
        catch (exception) {
          this.system.log(this.errorString + exception);
          alert(this.errorString + exception);
          this.end();
        }
      }
      
      translateBackground = function (x, y) {
        try {
          if (!this.webGLSupported) {
            return;
          }
      
          if (this.graphics !== null) {
            this.graphics.translateBackground(x, y);
          }
        }
        catch (exception) {
          this.system.log(this.errorString + exception);
          alert(this.errorString + exception);
          this.end();
        }
      }
      
      rotateBackground = function (value) {
        try {
          if (!this.webGLSupported) {
            return;
          }
      
          if (this.graphics !== null) {
            this.graphics.rotateBackground(value);
          }
        }
        catch (exception) {
          this.system.log(this.errorString + exception);
          alert(this.errorString + exception);
          this.end();
        }
      }
      
      zoomBackground = function (value) {
        try {
          if (!this.webGLSupported) {
            return;
          }
      
          if (this.graphics !== null) {
            this.graphics.zoomBackground(value);
          }
        }
        catch (exception) {
          this.system.log(this.errorString + exception);
          alert(this.errorString + exception);
          this.end();
        }
      }
      
      setForeground = function (value) {
        try {
          if (!this.webGLSupported) {
            return;
          }
      
          if (this.graphics !== null) {
            this.graphics.setForeground(value);
          }
        }
        catch (exception) {
          this.system.log(this.errorString + exception);
          alert(this.errorString + exception);
          this.end();
        }
      }
      
      translateForeground = function (x, y) {
        try {
          if (!this.webGLSupported) {
            return;
          }
      
          if (this.graphics !== null) {
            this.graphics.translateForeground(x, y);
          }
        }
        catch (exception) {
          this.system.log(this.errorString + exception);
          alert(this.errorString + exception);
          this.end();
        }
      }
      
      rotateForeground = function (value) {
        try {
          if (!this.webGLSupported) {
            return;
          }
      
          if (this.graphics !== null) {
            this.graphics.rotateForeground(value);
          }
        }
        catch (exception) {
          this.system.log(this.errorString + exception);
          alert(this.errorString + exception);
          this.end();
        }
      }
      
      zoomForeground = function (value) {
        try {
          if (!this.webGLSupported) {
            return;
          }
      
          if (this.graphics !== null) {
            this.graphics.zoomForeground(value);
          }
        }
        catch (exception) {
          this.system.log(this.errorString + exception);
          alert(this.errorString + exception);
          this.end();
        }
      }
      
      setForegroundLocationCentered = function (value) {
        try {
          if (!this.webGLSupported) {
            return;
          }
      
          if (this.graphics !== null) {
            this.graphics.setForegroundLocationCentered(value);
          }
        }
        catch (exception) {
          this.system.log(this.errorString + exception);
          alert(this.errorString + exception);
          this.end();
        }
      }
      
      setBackgroundLocationCentered = function (value)  {
        try {
          if (!this.webGLSupported) {
            return;
          }
      
          if (this.graphics !== null) {
            this.graphics.setBackgroundLocationCentered(value);
          }
        }
        catch (exception) {
          this.system.log(this.errorString + exception);
          alert(this.errorString + exception);
          this.end();
        }
      }
      
      setForegroundLocationUL = function () {
        try {
          if (!this.webGLSupported) {
            return;
          }
      
          if (this.graphics !== null) {
            this.graphics.setForegroundLocationUL();
          }
        }
        catch (exception) {
          this.system.log(this.errorString + exception);
          alert(this.errorString + exception);
          this.end();
        }
      }
      
      setBackgroundLocationUL = function () {
        try {
          if (!this.webGLSupported) {
            return;
          }
      
          if (this.graphics !== null) {
            this.graphics.setBackgroundLocationUL();
          }
        }
        catch (exception) {
          this.system.log(this.errorString + exception);
          alert(this.errorString + exception);
          this.end();
        }
      }
      
      setForegroundLocationUR = function ()  {
        try {
          if (!this.webGLSupported) {
            return;
          }
      
          if (this.graphics !== null) {
            this.graphics.setForegroundLocationUR();
          }
        }
        catch (exception) {
          this.system.log(this.errorString + exception);
          alert(this.errorString + exception);
          this.end();
        }
      }
      
      setBackgroundLocationUR = function () {
        try {
          if (!this.webGLSupported) {
            return;
          }
      
          if (this.graphics !== null) {
            this.graphics.setBackgroundLocationUR();
          }
        }
        catch (exception) {
          this.system.log(this.errorString + exception);
          alert(this.errorString + exception);
          this.end();
        }
      }
      
      setForegroundLocationLR = function () {
        try {
          if (!this.webGLSupported) {
            return;
          }
      
          if (this.graphics !== null) {
            this.graphics.setForegroundLocationLR();
          }
        }
        catch (exception) {
          this.system.log(this.errorString + exception);
          alert(this.errorString + exception);
          this.end();
        }
      }
      
      setBackgroundLocationLR = function () {
        try {
          if (!this.webGLSupported) {
            return;
          }
      
          if (this.graphics !== null) {
            this.graphics.setBackgroundLocationLR();
          }
        }
        catch (exception) {
          this.system.log(this.errorString + exception);
          alert(this.errorString + exception);
          this.end();
        }
      }
      
      setForegroundLocationLL = function () {
        try {
          if (!this.webGLSupported) {
            return;
          }
      
          if (this.graphics !== null) {
            this.graphics.setForegroundLocationLL();
          }
        }
        catch (exception) {
          this.system.log(this.errorString + exception);
          alert(this.errorString + exception);
          this.end();
        }
      }
      
      setBackgroundLocationLL = function () {
        try {
          if (!this.webGLSupported) {
            return;
          }
      
          if (this.graphics !== null) {
            this.graphics.setBackgroundLocationLL();
          }
        }
        catch (exception) {
          this.system.log(this.errorString + exception);
          alert(this.errorString + exception);
          this.end();
        }
      }
      
      toggleBackgroundScaleToWindow = function () {
        try {
          if (!this.webGLSupported) {
            return;
          }
      
          if (this.graphics !== null) {
            this.graphics.toggleBackgroundScaleToWindow();
          }
        }
        catch (exception) {
          this.system.log(this.errorString + exception);
          alert(this.errorString + exception);
          this.end();
        }
      }
      
      enableBackgroundScaleToWindow = function (value) {
        try {
          if (!this.webGLSupported) {
            return;
          }
      
          if (this.graphics !== null) {
            this.graphics.enableBackgroundScaleToWindow(value);
          }
        }
        catch (exception) {
          this.system.log(this.errorString + exception);
          alert(this.errorString + exception);
          this.end();
        }
      }
      
      setBackgroundScaleToWindowPercent = function (value) {
        try {
          if (!this.webGLSupported) {
            return;
          }
      
          if (this.graphics !== null) {
            this.graphics.setBackgroundScaleToWindowPercent(value);
          }
        }
        catch (exception) {
          this.system.log(this.errorString + exception);
          alert(this.errorString + exception);
          this.end();
        }
      }
      
      toggleForegroundScaleToWindow = function () {
        try {
          if (!this.webGLSupported) {
            return;
          }
      
          if (this.graphics !== null) {
            this.graphics.toggleForegroundScaleToWindow();
          }
        }
        catch (exception) {
          this.system.log(this.errorString + exception);
          alert(this.errorString + exception);
          this.end();
        }
      }
      
      enableForegroundScaleToWindow = function (value) {
        try {
          if (!this.webGLSupported) {
            return;
          }
      
          if (this.graphics !== null) {
            this.graphics.enableForegroundScaleToWindow(value);
          }
        }
        catch (exception) {
          this.system.log(this.errorString + exception);
          alert(this.errorString + exception);
          this.end();
        }
      }
      
      setForegroundScaleToWindowPercent = function (value) {
        try {
          if (!this.webGLSupported) {
            return;
          }
      
          if (this.graphics !== null) {
            this.graphics.setForegroundScaleToWindowPercent(value);
          }
        }
        catch (exception) {
          this.system.log(this.errorString + exception);
          alert(this.errorString + exception);
          this.end();
        }
      }
      
      loadChart = function (value) {
        try {
          if (!this.webGLSupported) {
            return;
          }
      
          if (this.graphics !== null) {
            this.graphics.loadChart(value);
          }
        }
        catch (exception) {
          this.system.log(this.errorString + exception);
          alert(this.errorString + exception);
          this.end();
        }
      }
      
      clearChart = function () {
        try {
          if (!this.webGLSupported) {
            return;
          }
      
          if (this.graphics !== null) {
            this.graphics.clearChart();
          }
        }
        catch (exception) {
          this.system.log(this.errorString + exception);
          alert(this.errorString + exception);
          this.end();
        }
      }
}

export default(cadView)