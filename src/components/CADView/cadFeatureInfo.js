class cadFeatureInfo{
    constructor(){
        this.features = [];
        this.selectedFeature = function () { };
        this.cadLoaded = function () { };
    }
  
setFeatures = function (value) {
    this.features = value;
  }
  
  setSelectedFeature = function (value) {
    this.selectedFeature = value;
  }
  
  setCadLoaded = function (value) {
    this.cadLoaded = value;
  }
    

}
export default(cadFeatureInfo);