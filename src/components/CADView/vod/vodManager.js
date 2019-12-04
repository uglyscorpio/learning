import vod from './vod'
class vodManager{
    constructor(){
        this.vod = null;   
    }

    init = function (geometryData) {
        this.vod = new vod();
        this.vod.init(geometryData);
      }
      
      update = function (timeToRenderFrame) {
        if (this.vod !== null) {
          this.vod.update(timeToRenderFrame);
        }
      }
      
      end = function () {
        if (this.vod !== null) {
          this.vod.end();
          this.vod = null;
        }
      }
      
      reset = function () {
        if (this.vod !== null) {
          this.vod.reset();
        }
      }
      
      //Helper API---------------------------------------------------------
      loadVOD = function (data) {
        if (this.vod !== null) {
          this.vod.loadVOD(data);
        }
      }
      
      playVOD = function () {
        if (this.vod !== null) {
          if (this.vod.vodIsLoaded()) {
            this.vod.playVOD();
          }
        } 
      }
      
      pauseVOD = function () {
        if (this.vod !== null) {
          if (this.vod.vodIsLoaded()) {
            this.vod.pauseVOD();
          }
        }
      }
      
      stopVOD = function () {
        if (this.vod !== null) {
          if (this.vod.vodIsLoaded()) {
            this.vod.stopVOD();
          }
        }
      }
      
      frameBackVOD = function () {
        if (this.vod !== null) {
          if (this.vod.vodIsLoaded()) {
            this.vod.frameBackVOD();
          }
        }
      }
      
      frameForwardVOD = function () {
        if (this.vod !== null) {
          if (this.vod.vodIsLoaded()) {
            this.vod.frameForwardVOD();
          }
        }
      }
      
      rewindVOD = function () {
        if (this.vod !== null) {
          if (this.vod.vodIsLoaded()) {
            this.vod.rewindVOD();
          }
        }
      }
      
      fastForwardVOD = function () {
        if (this.vod !== null) {
          if (this.vod.vodIsLoaded()) {
            this.vod.fastForwardVOD();
          }
        }
      }
      
      setVODPlaybackRate = function (value) {
        if (this.vod !== null) {
          //if (this.vod.vodIsLoaded()) {
            this.vod.setVODPlaybackRate(value);
         // }
        }
      }
      
      setVODLoadingPercentageCallback = function (value) {
        if (this.vod !== null) {
          this.vod.setVODLoadingPercentageCallback(value);
        }
      }
      
      setVODControlsDisabledCallback = function (value) {
        if (this.vod !== null) {
          this.vod.setVODControlsDisabledCallback(value);
        }
      }
      
      setVODFrameSliderValueCallback = function (value) {
        if (this.vod !== null) {
          this.vod.setVODFrameSliderValueCallback(value);
        }
      }
      
      setFPSSliderValueCallback = function (value) {
        if (this.vod !== null) {
          this.vod.setFPSSliderValueCallback(value);
        }
      }
      
      unloadVOD = function () {
        this.end();
      }
      
      setVODFrame = function (value) {
        if (this.vod !== null) {
          if (this.vod.vodIsLoaded()) {
            this.vod.setVODFrame(value);
         }
        }
      }
      
      setVODUpperLimit = function (value) {
        if (this.vod !== null) {
          this.vod.setVODUpperLimit(value);
        }
      }
      
      setVODLowerLimit = function (value) {
        if (this.vod !== null) {
          this.vod.setVODLowerLimit(value);
        }
      }
}
export default(vodManager);