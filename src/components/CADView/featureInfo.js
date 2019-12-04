import * as THREE from 'three';
class featureInfo{
    constructor(){
        this.name = null;
        this.location = new THREE.Vector3();
        this.direction = new THREE.Vector3();
        this.color = null;       
    }

    setName = function (value) {
        this.name = value;
      }
      
      setLocation = function (value) {
        this.location.x = value.x;
        this.location.y = value.y;
        this.location.z = value.z;
      }
      
      setDirection = function (value) {
        this.direction.x = value.x;
        this.direction.y = value.y;
        this.direction.z = value.z;
      }
      
      setColor = function (value) {
        this.color = value;
      }
}
export default(featureInfo);