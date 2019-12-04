import threeJSWrapper from './threeJSWrapper'

class webGraphics{
    constructor(){
        this.graphicsHandler = null;
    }


   init = function (renderWindow, renderer, scene, sceneUI, scene2DBackground, scene2DForeground, cadInfo) {
        if (this.graphicsHandler == null) {
          this.graphicsHandler = new threeJSWrapper();
        }
      
        this.graphicsHandler.init(renderWindow, renderer, scene, sceneUI, scene2DBackground, scene2DForeground, cadInfo);
      }
      
      update = function (timeToRenderFrame) {
        this.graphicsHandler.update(timeToRenderFrame);
      }
      
      end = function () {
        if (this.graphicsHandler !== null) {
          this.graphicsHandler.end();
          this.graphicsHandler = null;
        }
      
        this.fps = 0;
      
        var panel = document.getElementById("Overlay");
      
        if (panel !== null) {
          var surface = panel.getContext('2d');
      
          if (surface !== null) {
            surface.clearRect(0, 0, panel.width, panel.height);
          }
        }
      }
      
      
      reset = function () {
        if (this.graphicsHandler !== null) {
          this.graphicsHandler.reset();
        }
      }
      
      //Helper API---------------------------------------------------------
      addFeatureLabelOffset = function (x, y) {
        if (this.graphicsHandler !== null) {
          this.graphicsHandler.addFeatureLabelOffset(x, y);
        }
      }
      
      getFPS = function () {
        return this.graphicsHandler.getFPS();
      }
      
      getCamera3D = function () {
        if (this.graphicsHandler == null) {
          return null;
        } else {
          return this.graphicsHandler.getCamera3D();
        }
      }
      
      getCanvas = function () {
        if (this.graphicsHandler == null) {
          return null;
        } else {
          return this.graphicsHandler.getCanvas();
        }
      }
      
      cadRotateX = function (value) {
        if (this.graphicsHandler !== null) {
          this.graphicsHandler.cadRotateX(value);
        }
      }
      
      cadRotateY = function (value) {
        if (this.graphicsHandler !== null) {
          this.graphicsHandler.cadRotateY(value);
        }
      }
      
      cadRotateZ = function (value) {
        if (this.graphicsHandler !== null) {
          this.graphicsHandler.cadRotateZ(value);
        }
      }
      
      scaleToFit = function () {
        if (this.graphicsHandler !== null) {
          this.graphicsHandler.scaleToFit();
        }
      }
      
      setFrontView = function () {
        if (this.graphicsHandler !== null) {
          this.graphicsHandler.setFrontView();
        }
      }
      
      setBackView = function () {
        if (this.graphicsHandler !== null) {
          this.graphicsHandler.setBackView();
        }
      }
      
      setLeftView = function () {
        if (this.graphicsHandler !== null) {
          this.graphicsHandler.setLeftView();
        }
      }
      
      setRightView = function () {
        if (this.graphicsHandler !== null) {
          this.graphicsHandler.setRightView();
        }
      }
      
      setTopView = function () {
        if (this.graphicsHandler !== null) {
          this.graphicsHandler.setTopView();
        }
      }
      
      setBottomView = function () {
        if (this.graphicsHandler !== null) {
          this.graphicsHandler.setBottomView();
        }
      }
      
      setIsoView = function () {
        if (this.graphicsHandler !== null) {
          this.graphicsHandler.setIsoView();
        }
      }
      
      toggleBackgroundScale = function () {
        if (this.graphicsHandler !== null) {
          this.graphicsHandler.toggleBackgroundScale();
        }
      }
      
      enableBackgroundScale = function (value) {
        if (this.graphicsHandler !== null) {
          this.graphicsHandler.enableBackgroundScale(value);
        }
      }
      
      toggleForegroundScale = function () {
        if (this.graphicsHandler !== null) {
          this.graphicsHandler.toggleForegroundScale();
        }
      }
      
      enableForegroundScale = function (value) {
        if (this.graphicsHandler !== null) {
          this.graphicsHandler.enableForegroundScale(value);
        }
      }
      
      toggleWireframe = function () {
        if (this.graphicsHandler !== null) {
          this.graphicsHandler.toggleWireframe();
        }
      }
      
      enableWireframe = function (value) {
        if (this.graphicsHandler !== null) {
          this.graphicsHandler.enableWireframe(value);
        }
      }
      
      toggleBackground = function () {
        if (this.graphicsHandler !== null) {
          this.graphicsHandler.toggleBackground();
        }
      }
      
      enableBackground = function (value) {
        if (this.graphicsHandler !== null) {
          this.graphicsHandler.enableBackground(value);
        }
      }
      
      toggleForeground = function () {
        if (this.graphicsHandler !== null) {
          this.graphicsHandler.toggleForeground();
        }
      }
      
      enableForeground = function (value) {
        if (this.graphicsHandler !== null) {
          this.graphicsHandler.enableForeground(value);
        }
      }
      
      toggleTransparency = function () {
        if (this.graphicsHandler !== null) {
          this.graphicsHandler.toggleTransparency();
        }
      }
      
      enableTransparency = function (value) {
        if (this.graphicsHandler !== null) {
          this.graphicsHandler.enableTransparency(value);
        }
      }
      
      
      toggleAxis = function () {
        if (this.graphicsHandler !== null) {
          this.graphicsHandler.toggleAxis();
        }
      }
      
      enableAxis = function (value) {
        if (this.graphicsHandler !== null) {
          this.graphicsHandler.enableAxis(value);
        }
      }
      
      toggleAnimation = function () {
        if (this.graphicsHandler !== null) {
          this.graphicsHandler.toggleAnimation();
        }
      }
      
      enableAnimation = function (value) {
        if (this.graphicsHandler !== null) {
          this.graphicsHandler.enableAnimation(value);
        }
      }
      
      toggleGrid = function () {
        if (this.graphicsHandler !== null) {
          this.graphicsHandler.toggleGrid();
        }
      }
      
      enableGrid = function (value) {
        if (this.graphicsHandler !== null) {
          this.graphicsHandler.enableGrid(value);
        }
      }
      
      toggleTexture = function () {
        if (this.graphicsHandler !== null) {
          this.graphicsHandler.toggleTexture();
        }
      }
      
      enableTexture = function (value) {
        if (this.graphicsHandler !== null) {
          this.graphicsHandler.enableTexture(value);
        }
      }
      
      setCameraTarget = function (name, location) {
        if (this.graphicsHandler !== null) {
          this.graphicsHandler.setCameraTarget(name, location);
        }
      }
      
      isCADLoaded = function () {
        if (this.graphicsHandler !== null) {
          return this.graphicsHandler.isCADLoaded();
        } else {
          return false;
        }
      }
      
      resize = function () {
        if (this.graphicsHandler !== null) {
          this.graphicsHandler.resizeViewport();
        }
      }
      
      saveScreenshot = function (fileName) {
        if (this.graphicsHandler !== null) {
          this.graphicsHandler.saveScreenshot(fileName);
        }
      }
      
      //Color API
      setGlobalLightColor = function (hexValue) {
        if (this.graphicsHandler !== null) {
          this.graphicsHandler.setGlobalLightColor(hexValue);
        }
      }
      
      setFrontLightColor = function (hexValue) {
        if (this.graphicsHandler !== null) {
          this.graphicsHandler.setFrontLightColor(hexValue);
        }
      }
      
      setBackLightColor = function (hexValue) {
        if (this.graphicsHandler !== null) {
          this.graphicsHandler.setBackLightColor(hexValue);
        }
      }
      
      setCADColor = function (hexValue) {
        if (this.graphicsHandler !== null) {
          this.graphicsHandler.setCADColor(hexValue);
        }
      }
      
      
      setDefaultColor = function (hexValue) {
        if (this.graphicsHandler !== null) {
          this.graphicsHandler.setDefaultColor(hexValue);
        }
      }
      
      setHoverColor = function (hexValue) {
        if (this.graphicsHandler !== null) {
          this.graphicsHandler.setHoverColor(hexValue);
        }
      }
      
      setSelectedColor = function (hexValue) {
        if (this.graphicsHandler !== null) {
          this.graphicsHandler.setSelectedColor(hexValue);
        }
      }
      
      setLeaderLineColor = function (value) {
        if (this.graphicsHandler !== null) {
          this.graphicsHandler.setLeaderLineColor(value);
        }
      }
      
      setLeaderLineSize = function (value) {
        if (this.graphicsHandler !== null) {
          this.graphicsHandler.setLeaderLineSize(value);
        }
      }
      
      setLeaderLineDefaultLength = function (value) {
        if (this.graphicsHandler !== null) {
          this.graphicsHandler.setLeaderLineDefaultLength(value);
        }
      }
      
      setFeatureInfo = function (value) {
        if (this.graphicsHandler == null) {
          this.graphicsHandler = new threeJSWrapper();
        }
      
        this.graphicsHandler.setFeatureInfo(value);
      }
      
      loadVOD = function (value) {
        if (this.graphicsHandler !== null) {
          this.graphicsHandler.loadVOD(value);
        }
      }
      
      playVOD = function () {
        if (this.graphicsHandler !== null) {
          this.graphicsHandler.playVOD();
        }
      }
      
      pauseVOD = function () {
        if (this.graphicsHandler !== null) {
          this.graphicsHandler.pauseVOD();
        }
      }
      
      stopVOD = function () {
        if (this.graphicsHandler !== null) {
          this.graphicsHandler.stopVOD();
        }
      }
      
      frameBackVOD = function () {
        if (this.graphicsHandler !== null) {
          this.graphicsHandler.frameBackVOD();
        }
      }
      
      frameForwardVOD = function () {
        if (this.graphicsHandler !== null) {
          this.graphicsHandler.frameForwardVOD();
        }
      }
      
      rewindVOD = function () {
        if (this.graphicsHandler !== null) {
          this.graphicsHandler.rewindVOD();
        }
      }
      
      fastForwardVOD = function () {
        if (this.graphicsHandler !== null) {
          this.graphicsHandler.fastForwardVOD();
        }
      }
      
      setVODPlaybackRate = function (value) {
        if (this.graphicsHandler !== null) {
          this.graphicsHandler.setVODPlaybackRate(value);
        }
      }
      
      setVODLoadingPercentageCallback = function (value) {
        if (this.graphicsHandler !== null) {
          this.graphicsHandler.setVODLoadingPercentageCallback(value);
        }
      }
      
      setVODControlsDisabledCallback = function (value) {
        if (this.graphicsHandler !== null) {
          this.graphicsHandler.setVODControlsDisabledCallback(value);
        }
      }
      
      setVODFrameSliderValueCallback = function (value) {
        if (this.graphicsHandler !== null) {
          this.graphicsHandler.setVODFrameSliderValueCallback(value);
        }
      }
      
      setFPSSliderValueCallback = function (value) {
        if (this.graphicsHandler !== null) {
          this.graphicsHandler.setFPSSliderValueCallback(value);
        }
      }
      
      unloadVOD = function () {
        if (this.graphicsHandler !== null) {
          this.graphicsHandler.unloadVOD();
        }
      }
      
      setVODFrame = function (value) {
        if (this.graphicsHandler !== null) {
          this.graphicsHandler.setVODFrame(value);
        }
      }
      
      setVODUpperLimit = function (value) {
        if (this.graphicsHandler !== null) {
          this.graphicsHandler.setVODUpperLimit(value);
        }
      }
      
      setVODLowerLimit = function (value) {
        if (this.graphicsHandler !== null) {
          this.graphicsHandler.setVODLowerLimit(value);
        }
      }
      
      getGraphicsHandler = function () {
        return this.graphicsHandler;
      }
      
      setBackground = function (value) {
        if (this.graphicsHandler !== null) {
          this.graphicsHandler.setBackground(value);
        }
      }
      
      translateBackground = function (x, y) {
        if (this.graphicsHandler !== null) {
          this.graphicsHandler.translateBackground(x, y);
        }
      }
      
      rotateBackground = function (value) {
        if (this.graphicsHandler !== null) {
          this.graphicsHandler.rotateBackground(value);
        }
      }
      
      zoomBackground = function (value) {
        if (this.graphicsHandler !== null) {
          this.graphicsHandler.zoomBackground(value);
        }
      }
      
      setForeground = function (value) {
        if (this.graphicsHandler !== null) {
          this.graphicsHandler.setForeground(value);
        }
      }
      
      translateForeground = function (x, y) {
        if (this.graphicsHandler !== null) {
          this.graphicsHandler.translateForeground(x, y);
        }
      }
      
      rotateForeground = function (value) {
        if (this.graphicsHandler !== null) {
          this.graphicsHandler.rotateForeground(value);
        }
      }
      
      zoomForeground = function (value) {
        if (this.graphicsHandler !== null) {
          this.graphicsHandler.zoomForeground(value);
        }
      }
      
      setForegroundLocationCentered = function (value) {
        if (this.graphicsHandler !== null) {
          this.graphicsHandler.setForegroundLocationCentered(value);
        }
      }
      
      setBackgroundLocationCentered = function (value) {
        if (this.graphicsHandler !== null) {
          this.graphicsHandler.setBackgroundLocationCentered(value);
        }
      }
      
      setForegroundLocationUL = function () {
        if (this.graphicsHandler !== null) {
          this.graphicsHandler.setForegroundLocationUL();
        }
      }
      
      setBackgroundLocationUL = function () {
        if (this.graphicsHandler !== null) {
          this.graphicsHandler.setBackgroundLocationUL();
        }
      }
      
      setForegroundLocationUR = function () {
        if (this.graphicsHandler !== null) {
          this.graphicsHandler.setForegroundLocationUR();
        }
      }
      
      setBackgroundLocationUR = function () {
        if (this.graphicsHandler !== null) {
          this.graphicsHandler.setBackgroundLocationUR();
        }
      }
      
      setForegroundLocationLR = function () {
        if (this.graphicsHandler !== null) {
          this.graphicsHandler.setForegroundLocationLR();
        }
      }
      
      setBackgroundLocationLR = function () {
        if (this.graphicsHandler !== null) {
          this.graphicsHandler.setBackgroundLocationLR();
        }
      }
      
      setForegroundLocationLL = function () {
        if (this.graphicsHandler !== null) {
          this.graphicsHandler.setForegroundLocationLL();
        }
      }
      
      setBackgroundLocationLL = function () {
        if (this.graphicsHandler !== null) {
          this.graphicsHandler.setBackgroundLocationLL();
        }
      }
      
      toggleBackgroundScaleToWindow = function () {
        if (this.graphicsHandler !== null) {
          this.graphicsHandler.toggleBackgroundScaleToWindow();
        }
      }
      
      enableBackgroundScaleToWindow = function (value) {
        if (this.graphicsHandler !== null) {
          this.graphicsHandler.enableBackgroundScaleToWindow(value);
        }
      }
      
      setBackgroundScaleToWindowPercent = function (value) {
        if (this.graphicsHandler !== null) {
          this.graphicsHandler.setBackgroundScaleToWindowPercent(value);
        }
      }
      
      toggleForegroundScaleToWindow = function () {
        if (this.graphicsHandler !== null) {
          this.graphicsHandler.toggleForegroundScaleToWindow();
        }
      }
      
      enableForegroundScaleToWindow = function (value) {
        if (this.graphicsHandler !== null) {
          this.graphicsHandler.enableForegroundScaleToWindow(value);
        }
      }
      
      setForegroundScaleToWindowPercent = function (value) {
        if (this.graphicsHandler !== null) {
          this.graphicsHandler.setForegroundScaleToWindowPercent(value);
        }
      }
      
      getFeatureLabelEdit = function () {
        if (this.graphicsHandler !== null) {
          return this.graphicsHandler.getFeatureLabelEdit();
        }
      
        return false;
      }
      
      loadChart = function (value) {
        if (this.graphicsHandler !== null) {
          this.graphicsHandler.loadChart(value);
        }
      }
      
      clearChart = function () {
        if (this.graphicsHandler !== null) {
          this.graphicsHandler.clearChart();
        }
      }

}

export default(webGraphics);