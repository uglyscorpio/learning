import JSZipUtils from 'jszip-utils';
import JSZip from 'jszip';
import * as THREE from 'three';
import vodFrame from './vodFrame'
class vod {
    constructor(){
        this.cadMetaDataID = null;
        this.cadMetaDataName = null;
        this.cadMetaDataURL = null;
        this.cadMetaData = null;
      
        this.frameCount = null;
        this.currentFrame = 0;
        this.vodFrameInfo = [];
        this.vodFrames = [];
      
        this.vodLoaded = false;
        this.zipEnabled = false;
      
        this.buffer = null;
        this.maxFrames = null;
      
        this.play = null;
        this.colorMapID = null;
        this.framesPerSecond = null;
        this.framesPerSecondPercent = null;
        this.frameSeekPercent = null;
        this.VODPercentageCallback = null;
        this.VODControlsDisabledCallback = null;
        this.VODFrameSliderValueCallback = null;
        this.FPSSliderValueCallback = null;
      
        this.baseColors = [];
      
        this.upperLimit = 1;
        this.lowerLimit = -1;    
    }


    init = function (geometryData) {
        this.buffer = geometryData;
        this.maxFrames = 250;
        this.framesPerSecond = 15;
        this.play = false;
        this.currentFrame = 0;
        this.colorMapID = null;
        this.framesPerSecondPercent = null;
        this.frameSeekPercent = 0.05;//5%
        this.exitRequested = false;
      
        //These are the vertex colors of the CAD that do not get set by colormap data.
        var colors = this.buffer.getAttribute('color');
        for (var i = 0; i < colors.array.length; i++) {
          this.baseColors[i] = 0x77 / 255;
        }
      }
      
      update = function (timeToRenderFrame) {
      
      }
      
      end = function () {
        console.time("Deleting VOD");
      
        this.exitRequested = true; ///Other threads can read this
      
        if (this.colorMapID !== null) {
          clearInterval(this.colorMapID);
          this.colorMapID = null;
        }
      
        if (this.framesPerSecondPercent !== null) {
          clearInterval(this.framesPerSecondPercent);
          this.framesPerSecondPercent = null;
        }
      
        if (this.vodFrames !== null) {
          for (var j = 0; j < this.vodFrames.length; j++) {
            this.vodFrames[j].end();
            this.vodFrames[j] = null;
          }
      
          this.vodFrames.length = 0;
          this.vodFrames = null;
        }
      
        if (this.vodFrameInfo !== null) {
          this.vodFrameInfo.length = 0;
          this.vodFrameInfo = null;
        }
      
        this.frameCount = null;
        this.cadMetaDataID = null;
        this.cadMetaDataName = null;
        this.cadMetaDataURL = null;
      
        if (this.cadMetaData !== null) {
          if (this.cadMetaData.vertexLocations !== null) {
            this.cadMetaData.vertexLocations.length = 0;
            this.cadMetaData.vertexLocations = null;
          }
      
          this.cadMetaData = null;
        }
      
        this.currentFrame = 0;
        this.zipEnabled = false;
        this.buffer = null;
        this.maxFrames = null;
        this.play = false;
      
        this.framesPerSecond = null;
        this.frameSeekPercent = null;
      
        this.VODPercentageCallback = null;
        this.VODControlsDisabledCallback = null;
        this.VODFrameSliderValueCallback = null;
        this.FPSSliderValueCallback = null;
      
        this.baseColors.length = 0;
        this.baseColors = null;
      
        console.timeEnd("Deleting VOD");
      }
      
      reset = function () {
        if (this.exitRequested) {
          return;
        }
      
        this.currentFrame = 0;
      }
      
      //Helper API---------------------------------------------------------
      loadVOD = function (data) {
        if (this.exitRequested) {
          return;
        }
      
        console.time('VOD Load Time');
        this.cadMetaDataID = data.cadMetaDataID;
        this.cadMetaDataName = data.cadMetaDataName;
        this.cadMetaDataURL = data.cadMetaDataURL;
      
        this.vodFrameInfo = data.frameMetaData;
        this.frameCount = this.vodFrameInfo.length;
      
        console.log("Requested VOD frames: " + this.frameCount);
        
        if (this.maxFrames < this.frameCount) {
          this.frameCount = this.maxFrames;
        }
      
        console.log("Total VOD frames to request: " + this.frameCount);
      
        //Default FPS is 15 unless there are less than 75 frames. The target is a movie no less than 5 
        //seconds or an FPS no less than 1.
        //Frames / target seconds (5) rounded
        //Frames = 1, FPS = 1
        //Frames = 2, FPS = 1
        //Frames = 3, FPS = 1
        //Frames = 5, FPS = 1
        //Frames = 6, FPS = 1
        //Frames = 10, FPS = 2
        //Frames = 15, FPS = 3
        //Frames = 20, FPS = 4
        //Frames = 50, FPS = 10
        //Frames = 75, FPS = 15
        if (this.frameCount <= 75) {
          var targetSeconds = 5;
          var calculatedFPS = Math.round(this.frameCount / targetSeconds);
      
          if (calculatedFPS < 1) {
            calculatedFPS = 1;
          }
      
          this.framesPerSecond = calculatedFPS;
          this.FPSSliderValueCallback(this.framesPerSecond);
        } else {
          this.framesPerSecond = 15;
          this.FPSSliderValueCallback(this.framesPerSecond);
        }
      
        this.currentFrame = 0;
      
        this.vodLoaded = false;
        this.zipEnabled = false;
        this.vodFrames = [];
      
        if (this.framesPerSecondPercent !== null) {
          clearInterval(this.framesPerSecondPercent);
          this.framesPerSecondPercent = null;
        }
      
        var engineInstance = this;
        this.framesPerSecondPercent = setInterval(
          function () {
            engineInstance.updateVODLoadingPercent();
          }, (1000 / 10));
      
        //Load the CAD metadata. When that is done. Start loading frames until done.
        this.loadCADMetadata();
      }
      
      updateVODLoadingPercent = function () {
        if (this.exitRequested) {
          return;
        }
      
        var loadingPercentage = Math.round((this.currentFrame / this.frameCount) * 100);
      
        if (this.VODPercentageCallback !== null) {
          this.VODPercentageCallback(loadingPercentage);
        }
      }
      
      loadCADMetadata = function () {
        if (this.exitRequested) {
          return;
        }
      
        var name = this.cadMetaDataName;
      
        var instance = this;
      
        if (name.search(".json") >= 0 || name.search(".JSON") >= 0) { //This is not a zip file
          this.zipEnabled = false;
          console.time('CAD Metadata File Load Time');
          //jQuery.getJSON(this.cadMetaDataURL, function (data) { instance.loadCADMetadataComplete(data); });
        } else {
          this.zipEnabled = true;
          console.time('CAD Metadata File Load Time (Zip)');
          var cadMetaDataCallBackHandle = function (e, fileHandle) { instance.uncompressCADMetadataComplete(e, fileHandle); };
          JSZipUtils.getBinaryContent(this.cadMetaDataURL, cadMetaDataCallBackHandle);
        }
      }
      
      loadCADMetadataComplete = function (data) {
        if (this.exitRequested) {
          return;
        }
      
        console.timeEnd('CAD Metadata File Load Time');
        this.cadMetaData = data;
      
        console.log('Number of CAD metadata vertex locations: ' + this.cadMetaData.vertexLocations.length);
      
        //The CAD metadata is now loaded. Start loading the frames.
        this.loadVODFrames();
      }
      
      uncompressCADMetadataComplete = function (e, fileHandle) {
        if (this.exitRequested) {
          return;
        }
      
        var path = this.cadMetaDataName;
        var fileName = path.substr(0, path.length - 4) + ".JSON"; //The file inside the zip file is a json file.
      
        var zipLoader = new JSZip(fileHandle);
        var file = zipLoader.file(fileName);
      
        if (file === null) { //try and load the lower case extension
          fileName = path.substr(0, path.length - 4) + ".json";
          file = zipLoader.file(fileName);
        }
      
        if (file !== null) {
          var fileContents = file.asText();
          console.timeEnd('CAD Metadata File Load Time (Zip)');
      
          if (fileContents !== null) {
            //this.cadMetaData = jQuery.parseJSON(fileContents);
            fileContents = null;
      
            console.log('Number of CAD metadata vertex locations: ' + this.cadMetaData.vertexLocations.length);
      
            //The CAD metadata is now loaded. Start loading the frames.
            console.time('VOD Load Time');
            this.loadVODFrames();
      
          } else {
            this.cadMetaData = null;
            console.log("Unable to read zip file contents for cad metadata: " + fileName);
          }
      
          zipLoader = null;
          file = null;
      
          return;
        }
      
        this.cadMetaData = null;
        console.log("Unable to read zip file contents for cad metadata: " + fileName);
        console.timeEnd('CAD Metadata File Load Time (Zip)');
      }
      
      setBaseColor = function ()
      {
        if (this.exitRequested) {
          return;
        }
      
        var colors = this.buffer.getAttribute('color');
        var color = new THREE.Color(0xB0B0B0);
      
        for (var j = 0; j < colors.array.length; j += 3) {
          colors.array[j] = color.r;
          colors.array[j + 1] = color.g;
          colors.array[j + 2] = color.b;
        }
      
        colors.needsUpdate = true;
      }
      
      loadVODFrames = function () {
        if (this.exitRequested) {
          return;
        }
      
        var instance = this;
      
        if (this.zipEnabled) {
          if (this.currentFrame < this.maxFrames) { //this.frameCount) {
            if (this.currentFrame < this.frameCount) {
              console.time('VOD Frame ' + (this.currentFrame + 1) + ' ('+ this.vodFrameInfo[this.currentFrame].url + ')' + ' Load Time (Zip)');
              var path = this.vodFrameInfo[this.currentFrame].url;
      
              var frameMetaDataCallBackHandle = function(e, fileHandle) { instance.uncompressFrameMetadataComplete(e, fileHandle); };
              JSZipUtils.getBinaryContent(path, frameMetaDataCallBackHandle);
            } else {
              console.timeEnd('VOD Load Time');
              this.vodLoaded = true;
      
              this.currentFrame = this.frameCount;
              this.updateVODLoadingPercent();
        
              if (this.framesPerSecondPercent !== null) {
                clearInterval(this.framesPerSecondPercent);
                this.framesPerSecondPercent = null;
              }
      
              this.currentFrame = 0;
              this.setBaseColor();
              this.VODControlsDisabledCallback(false);
              this.setCurrentFrame();
            }
          } else {
            console.timeEnd('VOD Load Time');
            this.vodLoaded = true;
      
            this.currentFrame = this.frameCount;
            this.updateVODLoadingPercent();
      
            if (this.framesPerSecondPercent !== null) {
              clearInterval(this.framesPerSecondPercent);
              this.framesPerSecondPercent = null;
            }
      
            this.currentFrame = 0;
            this.setBaseColor();
            this.VODControlsDisabledCallback(false);
            this.setCurrentFrame();
            //alert('VOD Loaded');
          }
        } else {
          if (this.currentFrame < this.maxFrames) { //this.frameCount) {
            if (this.currentFrame < this.frameCount) {
              console.time('VOD Frame ' + (this.currentFrame + 1) + ' (' + this.vodFrameInfo[this.currentFrame].url + ')' + ' Load Time');
              var path = this.vodFrameInfo[this.currentFrame].url;
              //jQuery.getJSON(path, function(data) { instance.loadFrameMetadataComplete(data); });
            } else {
              console.timeEnd('VOD Load Time');
              this.vodLoaded = true;
      
              this.currentFrame = this.frameCount;
              this.updateVODLoadingPercent();
      
              if (this.framesPerSecondPercent !== null) {
                clearInterval(this.framesPerSecondPercent);
                this.framesPerSecondPercent = null;
              }
      
              this.currentFrame = 0;
              this.setBaseColor();
              this.VODControlsDisabledCallback(false);
              this.setCurrentFrame();
            }
          } else {
            console.timeEnd('VOD Load Time');
            this.vodLoaded = true;
      
            this.currentFrame = this.frameCount;
            this.updateVODLoadingPercent();
      
            if (this.framesPerSecondPercent !== null) {
              clearInterval(this.framesPerSecondPercent);
              this.framesPerSecondPercent = null;
            }
      
            this.currentFrame = 0;
            this.setBaseColor();
            this.VODControlsDisabledCallback(false);
            this.setCurrentFrame();
            //alert('VOD Loaded');
          }
        }
      }
      
      loadFrameMetadataComplete = function (data) {
        if (this.exitRequested) {
          return;
        }
      
        console.timeEnd('VOD Frame ' + (this.currentFrame + 1) + ' (' + this.vodFrameInfo[this.currentFrame].url + ')' + ' Load Time');
      
        console.time('VOD Frame ' + (this.currentFrame + 1) + ' Process Time');
        var result = this.getProcessedFrame(data);
        console.timeEnd('VOD Frame ' + (this.currentFrame + 1) + ' Process Time');
      
        var frame = new vodFrame();
      
        //If metadata is stored, a future trip to the DataServer is not required if the color legend changes. However, this 
        //limits the number of frames a VOD can have (by more than 50%) since this consumes more memory.
        //frame.init(data, result); 
      
        frame.init(null, result);
        this.vodFrames.push(frame);
      
        //Load the next frame if required
        this.currentFrame++;
        this.loadVODFrames();
      }
      
      uncompressFrameMetadataComplete = function (e, fileHandle) {
        if (this.exitRequested) {
          return;
        }
      
        var path = this.vodFrameInfo[this.currentFrame].name;
        var fileName = path.substr(0, path.length - 4) + ".JSON"; //The file inside the zip file is a json file.
      
        var zipLoader = new JSZip(fileHandle);
        var file = zipLoader.file(fileName);
      
        if (file === null) { //try and load the lower case extension
          fileName = path.substr(0, path.length - 4) + ".json";
          file = zipLoader.file(fileName);
        }
      
        if (file !== null) {
          var fileContents = file.asText();
          console.timeEnd('VOD Frame ' + (this.currentFrame + 1) + ' (' + this.vodFrameInfo[this.currentFrame].url + ')' + ' Load Time (Zip)');
      
          if (fileContents !== null) {
            console.time('VOD Frame ' + (this.currentFrame + 1) + ' Process Time (Zip)');
            //--var data = jQuery.parseJSON(fileContents);
            //--var result = this.getProcessedFrame(data);
            console.timeEnd('VOD Frame ' + (this.currentFrame + 1) + ' Process Time (Zip)');
      
            var frame = new vodFrame();
      
            //If metadata is stored, a future trip to the DataServer is not required if the color legend changes. However, this 
            //limits the number of frames a VOD can have (by more than 50%) since this consumes more memory.
            //frame.init(data, result); 
      
            //--frame.init(null, result);
            this.vodFrames.push(frame);
      
            fileContents = null;
      
            //Load the next frame if required
            this.currentFrame++;
            this.loadVODFrames();
      
          } else {
            console.log("Unable to read zip file contents for VOD frame: " + fileName);
          }
      
          zipLoader = null;
          file = null;
      
          return;
        }
      
        console.log("Unable to read zip file contents for VOD frame: " + fileName);
        console.timeEnd('VOD Frame ' + (this.currentFrame + 1) + ' Load Time (Zip)');
      }
      
      getProcessedFrame = function (data) {
        console.log('Number of VOD Frame deviations: ' + data.Deviations.length);
      
        console.log('Createing VOD frame array start: ' + this.baseColors.length);
      
        //var processedData = new Float32Array(this.baseColors);
        var processedData = new Float32Array(this.baseColors.length);
        for (var v = 0; v < this.baseColors.length; v++) {
          processedData[v] = this.baseColors[v];
        }
      
        console.log('Createing VOD frame array end: ' + processedData.length);
      
        var color = new THREE.Color();
      
        console.log('Processing deviations');
      
        for (var j = 0; j < data.Deviations.length; j++) {
          var index = Number(data.Deviations[j].v);
          var dev = Number(data.Deviations[j].d);
      
          color.setHex(this.getColor(dev));
      
          var vertexLocations = this.cadMetaData.vertexLocations;
          var vertexLocationsIndex = index;
      
          if (vertexLocationsIndex + 1 <= vertexLocations.length) {
            var itemsToUpdate = vertexLocations[vertexLocationsIndex].b;
      
            if (itemsToUpdate !== undefined && itemsToUpdate.length > 0) {
              for (var j2 = 0; j2 < itemsToUpdate.length; j2++) {
      
                var location = Number(itemsToUpdate[j2].p) * 3;
      
                processedData[location] = color.r;
                processedData[location + 1] = color.g;
                processedData[location + 2] = color.b;
              }
            }
          } else {
            console.log('Bad Colormap data - Invalid index found: ' + vertexLocationsIndex);
            return null;
          }
        }
      
        console.log('Returning processedData: ' + processedData.length);
        return processedData;
      }
      
      vodIsLoaded = function () {
        return this.vodLoaded;
      }
      
      getColor = function (dev) {
        if (this.exitRequested) {
          return;
        }
      
        //this.upperLimit = 2.75;
        //this.lowerLimit = -2.75;
        var middleUpperLimit = this.upperLimit / 2; //1.375
        var middleLowerLimit = this.lowerLimit / 2; //-1.375
      
        var r, g, b = 0;
      
        if (dev > this.upperLimit) {
          return 0xff0000;
        }
      
        if (dev < this.lowerLimit) {
          return 0x0000ff;
        }
      
        //Top half of the legend - 0 to upper limit (green to red)
        if (dev >= 0 && dev <= this.upperLimit) {
          //Half way between 0 and the upplerLimit (0 to 50%)
          if (dev <= middleUpperLimit) { 
            r = (dev / middleUpperLimit) * 0xff;
            g = 0xff;
            b = 0x00;
      
            return (r << 16) | (g << 8) | b;
          }
      
          //halfway of upperLimit to upperLimit. (50% to 100%)
          if (dev > middleUpperLimit) {
            r = 0xff;
            g = 0xff - (((dev - middleUpperLimit) / middleUpperLimit) * 0xff);
            b = 0x00;
      
            return (r << 16) | (g << 8) | b;
          }
        }
      
        //Lower half of the legend - 0 to lower limit (green to blue)
        if (dev < 0 && dev >= this.lowerLimit) {
          //Half way between 0 and the uplowerLimit (0 to -50%)
          if (dev >= middleLowerLimit) {
            r = 0;
            g = 0xff;
            b = (dev / middleLowerLimit) * 0xff;
      
            return (r << 16) | (g << 8) | b;
          }
      
          //halfway of ulowerLimit to lowerLimit. (-50% to -100%)
          if (dev < middleLowerLimit) {
            r = 0x00;
            g = 0xff - (((dev - middleLowerLimit) / middleLowerLimit) * 0xff);
            b = 0xff;
      
            return (r << 16) | (g << 8) | b;
          }
        }
      
        return 0x757575;
      }
      
      updateVOD = function () {
        if (this.exitRequested) {
          return;
        }
      
        if (!this.play) {
          return;
        }
      
        if (this.play) {
          this.currentFrame++;
      
          if (this.currentFrame === this.frameCount) {
            this.currentFrame = 0;
          }
        }
      
        this.setCurrentFrame();
      }
      
      playVOD = function () {
        if (this.exitRequested) {
          return;
        }
      
        this.play = true;
      
        this.setCurrentFrame();
      
        if (this.colorMapID !== null) {
          clearInterval(this.colorMapID);
        }
      
        var engineInstance = this;
        this.colorMapID = setInterval(
          function () {
            engineInstance.updateVOD();
          }, (1000 / this.framesPerSecond));
      }
      
      pauseVOD = function () {
        if (this.exitRequested) {
          return;
        }
      
        this.play = false;
      }
      
      stopVOD = function () {
        if (this.exitRequested) {
          return;
        }
      
        this.play = false;
        this.currentFrame = 0;
      
        this.setCurrentFrame();
      
        //Stop the timer
        if (this.colorMapID !== null) {
          clearInterval(this.colorMapID);
          this.colorMapID = null;
        }
      }
      
      frameForwardVOD = function () {
        if (this.exitRequested) {
          return;
        }
      
        if (!this.play) {
          this.currentFrame++;
      
          if (this.currentFrame === this.frameCount) {
            this.currentFrame = 0;
          }
      
          this.setCurrentFrame();
        }
      }
      
      frameBackVOD = function () {
        if (this.exitRequested) {
          return;
        }
      
        if (!this.play) {
          this.currentFrame--;
      
          if (this.currentFrame < 0) {
            this.currentFrame = (this.frameCount - 1);
          }
      
          this.setCurrentFrame();
        }
      }
      
      rewindVOD = function () {
        if (this.exitRequested) {
          return;
        }
      
        var newFrame = this.currentFrame - (Math.round(this.frameSeekPercent * this.frameCount));
      
        if (newFrame < 0) {
          newFrame = 0;
        }
      
        this.currentFrame = newFrame;
        this.setCurrentFrame();
      }
      
      fastForwardVOD = function () {
        if (this.exitRequested) {
          return;
        }
      
        var newFrame = this.currentFrame + (Math.round(this.frameSeekPercent * this.frameCount));
      
        if (newFrame > (this.frameCount - 1)) {
          newFrame = this.frameCount - 1;
        }
      
        this.currentFrame = newFrame;
        this.setCurrentFrame();
      }
      
      setCurrentFrame = function () {
        if (this.exitRequested) {
          return;
        }
      
        this.VODFrameSliderValueCallback(this.currentFrame + 1);
      
        var colors = this.buffer.getAttribute('color');
        colors.array = this.vodFrames[this.currentFrame].colorData;
        colors.needsUpdate = true;
      }
      
      setVODPlaybackRate = function (value) {
        if (this.exitRequested) {
          return;
        }
      
        this.framesPerSecond = value;
      
        if (!this.vodLoaded) {
          return;
        }
      
        if (this.play) {
          this.playVOD();
        }
      }
      
      setVODLoadingPercentageCallback = function (value) {
        if (this.exitRequested) {
          return;
        }
      
        this.VODPercentageCallback = value;
      }
      
      setVODControlsDisabledCallback = function (value) {
        if (this.exitRequested) {
          return;
        }
      
        this.VODControlsDisabledCallback = value;
      }
      
      setVODFrameSliderValueCallback = function (value) {
        if (this.exitRequested) {
          return;
        }
      
        this.VODFrameSliderValueCallback = value;
      }
      
      setFPSSliderValueCallback = function (value) {
        if (this.exitRequested) {
          return;
        }
      
        this.FPSSliderValueCallback = value;
      }
      
      setVODFrame = function (value) {
        if (this.exitRequested) {
          return;
        }
      
        this.currentFrame = value;
      
        if (this.currentFrame > this.frameCount) {
          this.currentFrame = 0;
        }
      
        if (this.currentFrame < 0) {
          this.currentFrame = 0;
        }
      
        var colors = this.buffer.getAttribute('color');
        colors.array = this.vodFrames[this.currentFrame].colorData;
        colors.needsUpdate = true;
      }
      
      
      setVODUpperLimit = function (value) {
        if (this.exitRequested) {
          return;
        }
      
        this.upperLimit = value;
      }
      
      setVODLowerLimit = function (value) {
        if (this.exitRequested) {
          return;
        }
      
        this.lowerLimit = value;
      }
}
export default(vod);