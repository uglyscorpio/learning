import * as THREE from "three"
class webGLManager{
    constructor(system){
        this.system = system;
        //These two objects must persits for the life of the web page.
        this.renderer = null; //for 3D graphics
        this.scene = null;
        this.sceneUI = null;
        this.scene2DBackground = null; //For 2D images
        this.scene2DForeground = null; //For 2D images
        this.initialized = false;
        this.canvas = null;
        this.renderWindow = null; //This is the canvas parent (CadModelContainer)
        this.backgroundColor = null;
    }

    getRenderer = () =>{
        return this.renderer;
    }

    getScene = function () {
        return this.scene;
    }

     getSceneUI = function () {
        return this.sceneUI;
      }
      
      getScene2DBackground = function () {
        return this.scene2DBackground;
      }
      
     getScene2DForeground = function () {
        return this.scene2DForeground;
      }
      
     getRenderWindow = function () {
        if (this.renderWindow === null) {
          this.renderWindow = document.getElementById("CadModelContainer");
        }
      
        return this.renderWindow;
      }
      
      isInitialized = function () {
        return this.initialized;
      }
      
     init = function () {
        try {
          this.renderer = new THREE.WebGLRenderer({ preserveDrawingBuffer: true, antialias : false }); //For saving screenshots
      
        } catch (exception) {
          this.system.log(exception);
          return false;
        }
      
        this.scene = new THREE.Scene();
        this.sceneUI = new THREE.Scene();
        this.scene2DBackground = new THREE.Scene();
        this.scene2DForeground = new THREE.Scene();
      
        this.renderer.autoClear = false; //Must be false to allow 2D overlay.
      
        this.updateCanvas();
      
        this.setBackgroundColor(0xc4c4c4);
      
        this.initialized = true;
        return true;
      }
      
      updateCanvas = function () {
        this.renderWindow = this.getRenderWindow();
        this.renderWindow.appendChild(this.renderer.domElement);
      }
      
      end = function () {
        this.renderWindow = null;
      
        //The renderer and scene objects are not destroyed or set to null. They need to persist.
        //All the items of the scene should be removed and destroyed. The screen
        //should be cleared to black or some neutral color. This function should be called when the
        //user leaves the Product view page.
        this.renderer.setClearColor(this.backgroundColor);
        this.renderer.clear();
      }
      
      setBackgroundColor = function (hexValue) {
        this.backgroundColor = hexValue;
        this.renderer.setClearColor(this.backgroundColor);
      }

}
export default(webGLManager);