import * as THREE from 'three';
class webCameraState{
  constructor(){
    this.position = new THREE.Vector3();
    this.target = new THREE.Vector3();
    this.orientation = new THREE.Quaternion();
  }

  setPosition = function (value) {
    this.position = value;
  }
  
  getPosition = function () {
    return this.position;
  }
  
  setTarget = function (value) {
    this.target = value;
  }
  
  getTarget = function () {
    return this.target;
  }
  
  setOrientation = function (value) {
    this.orientation = value;
  }
  
  getOrientation = function () {
    return this.orientation;
  }
  
}
export default(webCameraState);