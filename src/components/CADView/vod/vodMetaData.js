class vodMetaData {
    constructor(){
        this.cadMetaDataID = null;
        this.cadMetaDataName = null;
        this.cadMetaDataURL = null; //only for testing on local filesystem
        this.frameMetaData = [];   
    }

    end = function () {
        this.cadMetaDataID = null;
        this.cadMetaDataName = null;
        this.cadMetaDataURL = null; //only for testing on local filesystem
      
        if (this.frameMetaData !== null) {
          this.frameMetaData.length = 0;
          this.frameMetaData = null;
        }
      }
      
      //Helper API---------------------------------------------------------
      getCADMetaDataID = function () {
        return this.cadMetaDataID;
      }
      
      getCADMetaDataName = function () {
        return this.cadMetaDataName;
      }
      
      getCADMetaDataURL = function () {
        return this.cadMetaDataURL;
      }
      
      getFrameMetaData = function () {
        return this.frameMetaData;
      }
      
      setCADMetaDataID = function (val) {
        this.cadMetaDataID = val;
      }
      
      setCADMetaDataName = function (val) {
        this.cadMetaDataName = val;
      }
      
      setCADMetaDataURL = function (val) {
        this.cadMetaDataURL = val;
      }
      
      setFrameMetaData = function (val) {
        this.frameMetaData = val;
      }
}

export default(vodMetaData);