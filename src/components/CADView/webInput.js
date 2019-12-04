import * as THREE from 'three'
//import TrackballControls from 'three-trackballcontrols'
import {TrackballControls}  from './../../common/threejslibs/TrackballControls'
class webInput{
    constructor(){
        this.exit = false; //Declare and initialize a property
        this.inputHandler = null;
       
        this.mouseMoveHandle = null;
        this.mouseDownHandle = null;
        this.mouseUpHandle = null;
        this.mouseWheelHandle = null;
      
        //Feature Label
        //this.featureLabelEdit = null;
        //this.mouseDownLabelHandle = null;
        //this.mouseUpLabelHandle = null;
        //this.mouseMoveLabelHandle = null;
        //this.mouseX = null;
        //this.mouseY = null;
      
        this.parent = null;
        this.canvas = null;
      
        this.panel = null;
        this.drawContainer = null;
      
        this.enableControls = null;
        this.lockHorizontalRotation = false;
        this.lockVerticalRotation = false;    
    }


    init = function (parent, camera, canvas, graphics) {
        this.parent = parent;
        this.canvas = canvas;
        //Pass in the threeJSWrapper object to the input controller. The input controller will pan the cad instead of the camera.
        this.inputHandler = new TrackballControls(camera, this.canvas, graphics);
        this.inputHandler.target.set(0, 0, 0);
      
        this.drawContainer = document.getElementById("CadModelContainer");
      
        var instance = this;
      
        this.mouseMoveHandle = function (data) { instance.mouseMove(data); };
        this.drawContainer.addEventListener('mousemove', this.mouseMoveHandle, false);
      
        this.mouseDownHandle = function (data) { instance.mouseDown(data); };
        this.drawContainer.addEventListener('mousedown', this.mouseDownHandle, false);
      
        this.mouseUpHandle = function (data) { instance.mouseUp(data); };
        this.drawContainer.addEventListener('mouseup', this.mouseUpHandle, false);
      
        this.mouseWheelHandle = function (data) { instance.mouseWheel(data); };
        this.drawContainer.addEventListener('wheel', this.mouseWheelHandle, false);
      
        //Feature Label
        //this.featureLabel = document.getElementById("FeatureLabelContainer");
      
        //if (this.featureLabel !== null) {
        //  this.mouseDownLabelHandle = function (data) { instance.mouseDownLabel(data); };
        //  this.featureLabel.addEventListener('mousedown', this.mouseDownLabelHandle, false);
      
        //  this.mouseUpLabelHandle = function (data) { instance.mouseUpLabel(data); };
        //  this.featureLabel.addEventListener('mouseup', this.mouseUpLabelHandle, false);
      
        //  this.mouseMoveLabelHandle = function (data) { instance.mouseMoveLabel(data); };
        //  this.featureLabel.addEventListener('mousemove', this.mouseMoveLabelHandle, false);
        //}
      
        //this.featureLabelEdit = false;
        //this.mouseX = null;
        //this.mouseY = null;
      
        this.enableControls = true;
      
        this.lockHorizontalRotation = false;
        this.lockVerticalRotation = false;
      }
      
      update = function (timeToRenderFrame) {
        //this.featureLabelEdit = true;
        //check if exit requested
        //this.inputHandler.update(); //Only call update when something changes
      }
      
      end = function () {
        this.drawContainer.removeEventListener('mousemove', this.mouseMoveHandle, false);
        this.mouseMoveHandle = null;
      
        this.drawContainer.removeEventListener('mousedown', this.mouseDownHandle, false);
        this.mouseDownHandle = null;
      
        this.drawContainer.removeEventListener('mouseup', this.mouseUpHandle, false);
        this.mouseUpHandle = null;
      
        this.drawContainer.removeEventListener('wheel', this.mouseWheelHandle, false);
        this.mouseWheelHandle = null;
      
        //Feature
        //this.featureLabel.removeEventListener('mousedown', this.mouseDownLabelHandle, false);
        //this.mouseDownLabelHandle = null;
      
        //this.featureLabel.removeEventListener('mouseup', this.mouseUpLabelHandle, false);
        //this.mouseUpLabelHandle = null;
      
        //this.featureLabel.removeEventListener('mousemove', this.mouseMoveLabelHandle, false);
        //this.mouseMoveLabelHandle = null;
      
        //this.featureLabelEdit = null;
      
        this.panel = null;
        this.drawContainer = null;
      
        this.canvas = null;
      
        this.exit = false;
        this.inputHandler = null;
        this.parent = null;
        //this.mouseX = null;
        //this.mouseY = null;
      
        this.enableControls = null;
      
        this.lockHorizontalRotation = false;
        this.lockVerticalRotation = false;
      }
      
      reset = function () {
        if (this.inputHandler !== null) {
          this.inputHandler.reset();
        }
      }
      
      resize = function () {
        if (this.inputHandler !== null) {
          this.inputHandler.handleResize();
        }
      }
      
      //Helper API---------------------------------------------------------
      enableCADControls = function (value) {
        this.enableControls = value;
      
        if (this.inputHandler !== null) {
          this.inputHandler.enableCADControls(value);
        }
      }
      
      getView = function () {
        if (this.inputHandler !== null) {
          return this.inputHandler.getView();
        }
      
        return null;
      }
      
      setView = function (value) {
        if (this.inputHandler !== null) {
          this.inputHandler.setView(value);
        }
      }
      
      //updateFeatureLabel = function (data) {
      //  //When the mouse moves (10 units to the left and 2 units up), I need to move
      //  //the feature label 10 units to the left and 2 units up.
      //  var box = this.canvas.getBoundingClientRect();
      //  var x = data.clientX - box.left;
      //  var y = data.clientY - box.top;
      
      //  //this.parent.addFeatureLabelOffset(x - this.mouseX, y - this.mouseY);
      
      //  this.mouseX = x;
      //  this.mouseY = y;
      //}
      
      mouseMove = function (data) {
        if (!this.parent.getFeatureLabelEdit()) {
          this.inputHandler.mousemove(data);
          //var box = this.canvas.getBoundingClientRect();
          //this.mouseX = data.clientX - box.left;
          //this.mouseY = data.clientY - box.top;
        }
        //else {
        //  this.updateFeatureLabel(data);
        //}
      }
      
      mouseDown = function (data) {
        if (!this.parent.getFeatureLabelEdit()) {
          //this.inputHandler.onMouseDown(data);
          this.inputHandler.mousedown(data);
        }
      }
      
      mouseUp = function (data) {
        //this.featureLabelEdit = false;
        //this.inputHandler.onMouseUp(data);
        this.inputHandler.mouseup(data);
      }
      
      mouseWheel = function (data) {
        if (!this.parent.getFeatureLabelEdit()) {
          //this.inputHandler.onMouseWheel(data);
          this.inputHandler.mousewheel(data);
        }
      }
      
      exitRequested = function () {
        return this.exit;
      }
      
      toggleHorizontalRotationLock = function () {
        if (this.lockHorizontalRotation) {
          this.lockHorizontalRotation = false;
        } else {
          this.lockHorizontalRotation = true;
        }
      
        this.inputHandler.setHorizontalRotationLock(this.lockHorizontalRotation);
      }
      
      toggleVerticalRotationLock = function () {
        if (this.lockVerticalRotation) {
          this.lockVerticalRotation = false;
        } else {
          this.lockVerticalRotation = true;
        }
      
        this.inputHandler.setVerticalRotationLock(this.lockVerticalRotation);
      }
}
export default(webInput);
