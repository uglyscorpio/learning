import * as THREE from "three";
import webImage from "./webImage";
import webCamera from "./webCamera";
import cadScreenshot from './cadScreenshot';
import axisDisplay from './axisDisplay';
import featureMarkerInfo from './featureMarkerInfo';
import featureMarker from './featureMarker';
import vodFrameMetaData from './vod/vodFrameMetaData';
import vodMetaData from './vod/vodMetaData';
import vodManager from './vod/vodManager';
import webCAD from './webCAD';


class threeJSWrapper{
    constructor(){
        this.renderer = null;
        this.scene = null;
        this.sceneUI = null;
        this.scene2DBackground = null;
        this.scene2DForeground = null;
        this.camera = null;
        this.currentWidth = null;
        this.currentHeight = null;
        this.axis = null;
        this.grid = null;
        this.cadList = [];
        this.globalLight = null;
        this.frontLight = null;
        this.backLight = null;
        this.resizeHandle = null;
        this.mouseMoveHandle = null;
        this.mouseUpHandle = null;
        this.cadInfo = null;
        this.cadFeatureInfo = null;
      
        this.featureMarkerList = [];
        //this.featureLabel = null;
        this.featureLabelTooltip = null;
        this.renderWindow = null;
        this.cadOffset = null;
        this.cadLoaded = false;
        this.featureMarkersLoaded = false;
        this.cadRadius = null;
      
        this.currentFeatureMarkerIndex = null;
        this.sphereTemp = null;
        this.sphereTempList = [];
        this.featureMarkerMeshList = [];
        this.featureMarkerSelectionMeshList = [];
        this.featureMarkerScene = null;
        this.featureImage = null;
        this.featureMarkerLocationList = [];
        this.activeHoverFeatureMarker = null;
        this.activeSelectedFeatureMarker = null;
      
        //These can only be applied when the cad is loaded. They must be stored if they are set before the cad is loaded.
        this.cadColor = null;
        this.edgeLineColor = null;
        this.defaultColor = null;
        this.hoverColor = null;
        this.selectedColor = null;
        this.leaderLineDefaultLength = null;
        this.leaderLineSize = null;
        this.leaderLineColor = null;
        this.ambientColor = null;
        this.frontColor = null;
        this.backColor = null;
      
        this.markerSubdivision = null; //How smooth are the feature markers and collision markers
      
        this.vodControl = null;
      
        this.baseAddress = null; //Testing loading vod files from disk
      
        this.VODPercentageCallback = null;
        this.VODControlsDisabledCallback = null;
        this.VODFrameSliderValueCallback = null;
        this.vodUpperLimit = 1;
        this.vodLowerLimit = -1;
        this.FPSSliderValueCallback = null;
      
        this.textureEnabled = null;
        this.cadPanOffset = null;
        this.fps = 0;
      
        this.background = null;
        this.foreground = null; 
    }


    init = function (renderWindow, renderer, scene, sceneUI, scene2DBackground, scene2DForeground, cadInfo) {
        this.renderer = renderer;
        this.renderWindow = renderWindow;
        this.scene = scene;
        this.sceneUI = sceneUI;
        this.scene2DBackground = scene2DBackground;
        this.scene2DForeground = scene2DForeground;
        this.cadInfo = cadInfo;
      
        this.camera = new webCamera();
        this.camera.init(this.renderWindow);
      
        this.cadColor = 0x0077ff; //Default is blue
        this.edgeLineColor = 0xffffff; //Default is white
        this.hoverColor = 0xff00ff; //Default is pink
        this.leaderLineDefaultLength = 200;
        this.leaderLineSize = 1;
        this.leaderLineColor = 0x000000;
      
        //this.featureLabel = document.getElementById("FeatureLabelContainer");
        this.featureLabelTooltip = document.getElementById("FeatureLabelTooltipContainer");
      
        //if (this.featureLabel !== null) {
        //  this.featureLabel.style.visibility = "hidden";
        //}
      
        this.featureMarkerScene = new THREE.Scene();
        this.featureImage = new THREE.WebGLRenderTarget(1, 1); //Correct dimensions get set in the resize function below.
        this.featureImage.texture.minFilter = THREE.LinearFilter;
        this.featureImage.texture.generateMipmaps = false;
      
        if (this.cadInfo !== null) {
          if (this.cadInfo.url !== null) {
      
            var cad = new webCAD();
            this.cadList.push(cad);
      
            var wrapperInstance = this;
            cad.init(this.scene, wrapperInstance);
            cad.loadCAD(2, this.cadInfo.url);
            cad.rotateEnabled = false;
          } else {
            this.cadLoadCallBack(false); //Disable the progress bar
          }
        } else { //Should there be a default grid and axis if nothing is selected?
          //this.setupGrid(10, -0.5);
          //this.setCameraInitialLocation(10, 0.10);
          this.cadLoadCallBack(false); //Disable the progress bar
        }
      
        var instance = this;
        this.resizeHandle = function () { instance.resizeViewport(); };
        window.addEventListener('resize', this.resizeHandle, false);
      
        this.resizeViewport();
        this.cadPanOffset = new THREE.Vector3(0, 0, 0);
        this.fps = 0;
      }
      
      update = function (timeToRenderFrame) {
        this.fps++;
      
        for (var i = 0; i < this.cadList.length; i++) {
          this.cadList[i].update(timeToRenderFrame);
        }
      
        if (this.axis !== null) {
          this.axis.update(timeToRenderFrame);
        }
      
        var panel = document.getElementById("Overlay");
      
        if (panel !== null) {
          var surface = panel.getContext('2d');
      
          if (surface !== null) {
            surface.clearRect(0, 0, panel.width, panel.height);
          }
        }
      
        for (var j = 0; j < this.featureMarkerLocationList.length; j++) {
          this.featureMarkerLocationList[j].update(timeToRenderFrame);
        }
      
        for (var j = 0; j < this.featureMarkerList.length; j++) {
          this.featureMarkerList[j].update(timeToRenderFrame);
        }
      
        if (this.activeHoverFeatureMarker !== null) {
          this.activeHoverFeatureMarker.update(timeToRenderFrame);
        }
      
        if (this.activeSelectedFeatureMarker !== null) {
          this.activeSelectedFeatureMarker.update(timeToRenderFrame);
        }
      
        if (this.vodControl !== null) {
          this.vodControl.update(timeToRenderFrame);
        }
      
        this.camera.update(timeToRenderFrame);
      
        if (this.background !== null) {
          this.background.update(timeToRenderFrame);
        }
      
        if (this.foreground !== null) {
          this.foreground.update(timeToRenderFrame);
        }
      
        this.drawScreen();
      }
      
      drawScreen = function () {
        //this.renderer.clear();
        //this.renderer.render(this.scene, this.camera.getThreeJSCamera3D());
        //this.renderer.clearDepth();
        //this.renderer.render(this.sceneUI, this.camera.getThreeJSCameraUI());
      
      
        this.renderer.clear();
        //Draw items behind the CAD
        this.renderer.render(this.scene2DBackground, this.camera.getThreeJSCamera2D());
        this.renderer.clearDepth();
        //Draw the CAD
        this.renderer.render(this.scene, this.camera.getThreeJSCamera3D());
        //Draw the items in front of the CAD
      
        if (this.axis !== null) {
          this.renderer.clearDepth();
          this.axis.update();
        }
      
        this.renderer.render(this.scene2DForeground, this.camera.getThreeJSCamera2D());
      }
      
      end = function () {
        window.removeEventListener('resize', this.resizeHandle, false);
        this.resizeHandle = null;
      
        this.renderer.domElement.parentElement.removeEventListener('mousemove', this.mouseMoveHandle, false);
        this.mouseMoveHandle = null;
      
        this.renderer.domElement.parentElement.removeEventListener('mouseup', this.mouseUpHandle, false);
        this.mouseUpHandle = null;
      
        this.currentWidth = null;
        this.currentHeight = null;
      
        if (this.cadInfo !== null) {
          for (var i = 0; i < this.cadList.length; i++) {
            this.cadList[i].end();
            this.cadList[i] = null;
          }
      
          this.cadList.length = 0;
          this.cadList = null;
        }
      
        if (this.vodControl !== null) {
          this.vodControl.end();
          this.vodControl = null;
        }
      
        if (this.grid !== null) {
          this.scene.remove(this.grid);
          this.grid = null;
        }
      
        if (this.axis !== null) {
          this.axis.end();
          this.axis = null;
        }
      
        if (this.featureMarkerMeshList !== null) {
          for (var k = 0; k < this.featureMarkerMeshList.length; k++) {
            this.featureMarkerMeshList[k].geometry.dispose();
            this.featureMarkerMeshList[k].material.dispose();
      
            this.scene.remove(this.featureMarkerMeshList[k]);
          }
      
          this.featureMarkerMeshList.length = 0;
          this.featureMarkerMeshList = null;
        }
      
        if (this.featureMarkerSelectionMeshList !== null) {
          for (var l = 0; l < this.featureMarkerSelectionMeshList.length; l++) {
            this.featureMarkerSelectionMeshList[l].geometry.dispose();
            this.featureMarkerSelectionMeshList[l].material.dispose();
      
            this.featureMarkerScene.remove(this.featureMarkerSelectionMeshList[l]);
          }
      
          this.featureMarkerSelectionMeshList.length = 0;
          this.featureMarkerSelectionMeshList = null;
        }
      
        this.featureMarkerScene = null;
        this.featureImage = null;
      
        if (this.featureMarkerList !== null) {
          for (var j = 0; j < this.featureMarkerList.length; j++) {
            this.featureMarkerList[j].end();
            this.featureMarkerList[j] = null;
          }
      
          this.featureMarkerList.length = 0;
          this.featureMarkerList = null;
        }
      
        if (this.activeHoverFeatureMarker !== null) {
          this.activeHoverFeatureMarker.end();
          this.activeHoverFeatureMarker = null;
        }
      
        if (this.activeSelectedFeatureMarker !== null) {
          this.activeSelectedFeatureMarker.end();
          this.activeSelectedFeatureMarker = null;
        }
      
        if (this.featureMarkerLocationList !== null) {
          for (var j = 0; j < this.featureMarkerLocationList.length; j++) {
            this.featureMarkerLocationList[j].end();
            this.featureMarkerLocationList[j] = null;
          }
      
          this.featureMarkerLocationList.length = 0;
          this.featureMarkerLocationList = null;
        }
      
        this.currentFeatureMarkerIndex = null;
        this.sphereTemp = null;
      
        if (this.sphereTempList !== null) {
          for (var k2 = 0; k2 < this.sphereTempList.length; k2++) {
            this.sphereTempList[k2] = null;
          }
      
          this.sphereTempList.length = 0;
          this.sphereTempList = null;
        }
      
        //if (this.featureLabel !== null) {
        //  this.featureLabel.style.visibility = "hidden";
        //  this.featureLabel = null;
        //}
      
        if (this.featureLabelTooltip !== null) {
          this.featureLabelTooltip.style.visibility = "hidden";
          this.featureLabelTooltip = null;
        }
      
        this.camera.end();
        this.camera = null;
      
        if (this.globalLight !== null) {
          this.scene.remove(this.globalLight);
          this.globalLight = null;
        }
      
        if (this.frontLight !== null) {
          this.scene.remove(this.frontLight);
          this.frontLight = null;
        }
      
        if (this.backLight !== null) {
          this.scene.remove(this.backLight);
          this.backLight = null;
        }
      
        this.renderWindow = null;
      
        if (this.background !== null) {
          this.background.end();
          this.background = null;
        }
      
        if (this.foreground !== null) {
          this.foreground.end();
          this.foreground = null;
        }
      
        this.cadInfo = null;
        this.cadFeatureInfo = null;
        this.renderer = null;
        this.scene = null;
        this.sceneUI = null;
        this.scene2DBackground = null;
        this.scene2DForeground = null;
        this.cadOffset = null;
        this.cadLoaded = false;
        this.featureMarkersLoaded = false;
        this.cadColor = null;
        this.edgeLineColor = null;
        this.defaultColor = null;
        this.hoverColor = null;
        this.selectedColor = null;
        this.leaderLineDefaultLength = null;
        this.leaderLineSize = null;
        this.leaderLineColor = null;
        this.ambientColor = null;
        this.frontColor = null;
        this.backColor = null;
        this.cadRadius = null;
        this.markerSubdivision = null;
        this.VODPercentageCallback = null;
        this.VODControlsDisabledCallback = null;
        this.VODFrameSliderValueCallback = null;
        this.vodUpperLimit = 1;
        this.vodLowerLimit = -1;
        this.FPSSliderValueCallback = null;
        this.textureEnabled = null;
        this.cadPanOffset = null;
        this.fps = 0;
      }
      
      reset = function () {
        if (this.cadList !== null) {
          for (var i = 0; i < this.cadList.length; i++) {
            this.cadList[i].reset();
          }
        }
      
        if (this.axis !== null) {
          this.axis.reset();
        }
      
        if (this.featureMarkerList !== null) {
          for (var j = 0; j < this.featureMarkerList.length; j++) {
            this.featureMarkerList[j].reset();
          }
        }
      
        if (this.camera !== null) {
          this.camera.reset();
        }
      
        if (this.background !== null) {
          this.background.reset();
        }
      
        if (this.foreground !== null) {
          this.foreground.reset();
        }
      
        this.enableGrid(false);
      
        if (this.vodControl !== null) {
          this.vodControl.reset();
        }
      
        this.resetCAD();
        this.fps = 0;
      }
      
      //Helper API---------------------------------------------------------
      
      setBackground = function (value) {
        if (this.background !== null) {
          this.background.end();
          this.background = null;
        }
      
        this.background = new webImage();
        this.background.init(this.renderWindow, this.scene2DBackground, 0, 0, 1, 1, value);
        this.background.setVisible(true);
      }
      
      setForeground = function (value) {
        if (this.foreground !== null) {
          this.foreground.end();
          this.foreground = null;
        }
      
        this.foreground = new webImage();
        this.foreground.init(this.renderWindow, this.scene2DForeground, 0, 0, 1, 1, value);
        this.foreground.setVisible(true);
      }
      
      addFeatureLabelOffset = function (x, y) {
        if (this.activeSelectedFeatureMarker !== null) {
          if (this.activeSelectedFeatureMarker.isSelected()) {
            this.activeSelectedFeatureMarker.addFeatureLabelOffset(x, y);
          }
        }
      }
      
      saveScreenshot = function (fileName) {
        this.currentWidth = this.renderWindow.clientWidth;
        this.currentHeight = this.renderWindow.clientHeight;
      
        if (this.featureMarkerList !== null) {
          for (var j = 0; j < this.featureMarkerList.length; j++) {
            this.featureMarkerList[j].setVisible(false);
          }
        }
      
        this.enableAxis(false);
      
        this.update(0);
      
        var screenshot = new cadScreenshot();
        screenshot.init(this.currentWidth, this.currentHeight, this.renderer.domElement);
        screenshot.save(fileName);
      
        if (this.featureMarkerList !== null) {
          for (var j = 0; j < this.featureMarkerList.length; j++) {
            this.featureMarkerList[j].setVisible(true);
          }
        }
      
        this.enableAxis(true);
      }
      
      getCamera3D = function () {
        return this.camera.getThreeJSCamera3D();
      }
      
      getFPS = function () {
        var ret = this.fps;
        this.fps = 0;
        return ret;
      }
      
      getCamera2D = function () {
        return this.camera.getThreeJSCamera2D();
      }
      
      getCanvas = function () {
        return this.renderer.domElement;
      }
      
      addLight = function (color, x, y, z) {
        var light = new THREE.PointLight(color, 0.90);
        light.position.set(x, y, z);
        this.scene.add(light);
        return light;
      }
      
      setupLighting = function (distance) {
        //Global light
        this.globalLight = new THREE.AmbientLight(0x303030);
        this.scene.add(this.globalLight);
      
        //Point lights (one in front and one in back)
        this.backLight = this.addLight(0xffffff, distance, distance, distance);
        this.frontLight = this.addLight(0xffffff, -distance, -distance, -distance);
      
      }
      
      setupGrid = function (size, yLocation) {
        var gridSize = size;
        var gridSections = Math.round(gridSize * 0.1); //10 percent of the size gives 10 sections of the grid in each half
      
        if (gridSections <= 0) {
          gridSections = 1;
        }
      
        this.grid = new THREE.GridHelper(gridSections * 10, gridSections);
        this.grid.position.y = yLocation;
        this.scene.add(this.grid);
      }
      
      setupAxis = function () {
        this.axis = new axisDisplay();
        this.axis.init(this.sceneUI, this.renderWindow, this.renderer, this.camera);
      }
      
      createFeatureMarkerGeometry = function (size, offset) {
        console.log("[CAD Engine] Feature Marker Creation Start");
        var featureMarkerCount = this.cadFeatureInfo.features.length;
      
        if (featureMarkerCount === 0) {
          return;
        }
      
        var meshSize = 500; //How many feature markers will be in each THREE.Mesh.
        var meshCount = 0;
      
        if (featureMarkerCount < meshSize) {
          meshCount = 1;
        } else {
          //How many groups of 500 are there
          meshCount = Math.round(featureMarkerCount / meshSize);
      
          //If there is any left over add another mesh
          if ((featureMarkerCount % meshSize) > 0) {
            meshCount++;
          }
        }
      
        var tempCount = featureMarkerCount;
        var selectionColor = 0;
        var currentMarker = 0;
      
        for (var current = 0; current < meshCount; current++) {
          var featureMarkerGeometry = new THREE.Geometry();
          var featureMarkerSelectionGeometry = new THREE.Geometry();
      
          var featureMarkerMaterial = new THREE.MeshBasicMaterial();
          //var featureMarkerMaterial = new THREE.MeshPhongMaterial();
          //featureMarkerMaterial.shininess = 200;
      
          var featureMarkerSelectionMaterial = new THREE.MeshBasicMaterial();
      
          //Use the face color to color each vertex instead of the color property of the material. 
          featureMarkerMaterial.vertexColors = THREE.FaceColors;
      
          featureMarkerSelectionMaterial.vertexColors = THREE.FaceColors;
      
          var markerCount = 0;
      
          if (tempCount > meshSize) {
            markerCount = meshSize;
          } else {
            markerCount = tempCount;
          }
      
          var sphereGeometryTemp = new THREE.SphereGeometry(size, this.markerSubdivision, this.markerSubdivision);
          this.sphereTemp = new THREE.Mesh(sphereGeometryTemp, featureMarkerMaterial);
          this.sphereTemp.position.x = 0;
          this.sphereTemp.position.y = 0;
          this.sphereTemp.position.z = 0;
      
          //this.sphereTempList = [];
      
          for (var i = 0; i < markerCount; i++) {
            var sphereGeometry = new THREE.SphereGeometry(size, this.markerSubdivision, this.markerSubdivision);
      
            //Set the face color for this marker
            for (var j = 0; j < sphereGeometry.faces.length; j++) {
              sphereGeometry.faces[j].color.setHex(this.cadFeatureInfo.features[currentMarker].color.getHex());
            }
      
            var sphere = new THREE.Mesh(sphereGeometry, featureMarkerMaterial);
      
            sphere.position.x = this.cadFeatureInfo.features[currentMarker].location.x;
            sphere.position.y = this.cadFeatureInfo.features[currentMarker].location.y;
            sphere.position.z = this.cadFeatureInfo.features[currentMarker].location.z;
      
            sphere.translateX(offset.x);
            sphere.translateY(offset.y);
            sphere.translateZ(offset.z);
      
            //Let THREE.js set the matrix
            sphere.updateMatrix();
      
            //Merge this sphere with all the other spheres in a single THREE.mesh
            featureMarkerGeometry.merge(sphere.geometry, sphere.matrix);
            sphereGeometry = null;
      
            var sphereGeometrySelection = new THREE.SphereGeometry(size, this.markerSubdivision, this.markerSubdivision);
      
      
            //Set the face color for this marker
            for (var k = 0; k < sphereGeometrySelection.faces.length; k++) {
              sphereGeometrySelection.faces[k].color.setHex(selectionColor); //Map the color value to the index in the 
            }
      
            var markerInfo = new featureMarkerInfo();
            markerInfo.init(i, this.renderWindow, this.scene2DForeground, this.renderer.domElement, this.getCamera3D(), this.cadFeatureInfo.features[currentMarker].name);
            markerInfo.setName(this.cadFeatureInfo.features[currentMarker].name);
            markerInfo.setLocation(new THREE.Vector3(sphere.position.x, sphere.position.y, sphere.position.z));
            markerInfo.setSelected(false);
      
            //if (i == 0) {
            //markerInfo.loadChart("/CADViewEngine/Data/Images/QDAS/WLS-VOD-HEXLIVE-VOD-POINT-1.Dir.X [Actual value chart with automatically deleted outliers].bmp");
            //}
      
            //if (i == 1) {
            //  markerInfo.loadChart("/CADViewEngine/Data/Images/QDAS/WLS-VOD-HEXLIVE-VOD-POINT-1.Dir.X [Value].bmp");
            //}
      
            //if (i == 2) {
            //  markerInfo.loadChart("/CADViewEngine/Data/Images/QDAS/WLS-VOD-HEXLIVE-VOD-POINT-1.Dir.X [Tolerance capacity].bmp");
            //}
      
            //if (i == 3) {
            //  markerInfo.loadChart("/CADViewEngine/Data/Images/QDAS/WLS-VOD-HEXLIVE-VOD-POINT-1.Dir.X [Value plot Individuals].bmp");
            //}
      
            //if (i == 4) {
            //  markerInfo.loadChart("/CADViewEngine/Data/Images/QDAS/WLS-VOD-HEXLIVE-VOD-POINT-1.Dir.X [Value].bmp");
            //}
      
            //if (i > 4) {
            //  markerInfo.loadChart("/CADViewEngine/Data/Images/QDAS/WLS-VOD-HEXLIVE-VOD-POINT-1.Dir.X [Value].bmp");
            //}
      
            this.featureMarkerLocationList.push(markerInfo);
            selectionColor++;
      
            var sphereSelection = new THREE.Mesh(sphereGeometrySelection, featureMarkerMaterial);
      
            sphereSelection.position.x = sphere.position.x;
            sphereSelection.position.y = sphere.position.y;
            sphereSelection.position.z = sphere.position.z;
      
            sphereSelection.updateMatrix();
      
            featureMarkerSelectionGeometry.merge(sphereSelection.geometry, sphereSelection.matrix);
            sphereGeometrySelection = null;
      
            //Rotate
            var sphereGeometrySelectionTemp = new THREE.SphereGeometry(size * 1.5, 2, 2);
            var sphereSelectionTemp = new THREE.Mesh(sphereGeometrySelectionTemp, featureMarkerMaterial);
      
            sphereSelectionTemp.position.x = sphere.position.x;
            sphereSelectionTemp.position.y = sphere.position.y;
            sphereSelectionTemp.position.z = sphere.position.z;
      
      
            sphereSelectionTemp.updateMatrix();
      
            this.sphereTemp.add(sphereSelectionTemp);
            sphereGeometrySelectionTemp = null;
            this.sphereTempList.push(sphereSelectionTemp);
      
            currentMarker++;
          }
      
          tempCount -= meshSize;
      
          //this.setRotation(90, 0, 0);
          //this.setRotation(0, 180, 0);
          //this.setRotation(0, 0, 180);
          //Rotate - Custom Rotation
          //console.log("[CAD Engine] Feature Marker (1 of 3) Three Axis Rotation Start");
          //sphereTemp.rotateOnAxis(new THREE.Vector3(1, 0, 0), 90 * (Math.PI / 180.0));
          //sphereTemp.rotateOnAxis(new THREE.Vector3(0, 1, 0), 180 * (Math.PI / 180.0));
          //sphereTemp.rotateOnAxis(new THREE.Vector3(0, 0, 1), 180 * (Math.PI / 180.0));
          //console.log("[CAD Engine] Feature Marker (1 of 3) Three Axis Rotation End");
      
          this.scene.add(this.sphereTemp);
      
          //this.renderer.render(this.scene, this.camera.getThreeJSCamera3D()); //This updates the position of the feature markers after the rotate.
          this.drawScreen();
      
          for (var i = 0; i < markerCount; i++) {
            this.featureMarkerLocationList[i].setLocation(new THREE.Vector3(this.sphereTempList[i].getWorldPosition().x,
              this.sphereTempList[i].getWorldPosition().y, this.sphereTempList[i].getWorldPosition().z));
          }
      
          this.scene.remove(this.sphereTemp);
          //sphereTemp = null;
      
          featureMarkerMaterial.wireframe = false;
          var featureMarkerMesh = new THREE.Mesh(featureMarkerGeometry, featureMarkerMaterial);
          this.scene.add(featureMarkerMesh);
          this.featureMarkerMeshList.push(featureMarkerMesh);
      
          //Rotate - Custom Rotation
          //console.log("[CAD Engine] Feature Marker (2 of 3) Three Axis Rotation Start");
          //featureMarkerMesh.rotateOnAxis(new THREE.Vector3(1, 0, 0), 90 * (Math.PI / 180.0));
          //featureMarkerMesh.rotateOnAxis(new THREE.Vector3(0, 1, 0), 180 * (Math.PI / 180.0));
          //featureMarkerMesh.rotateOnAxis(new THREE.Vector3(0, 0, 1), 180 * (Math.PI / 180.0));
          //console.log("[CAD Engine] Feature Marker (2 of 3) Three Axis Rotation End");
      
      
          featureMarkerSelectionMaterial.wireframe = false;
          var featureMarkerSelectionMesh = new THREE.Mesh(featureMarkerSelectionGeometry, featureMarkerSelectionMaterial);
          this.featureMarkerScene.add(featureMarkerSelectionMesh);
          this.featureMarkerSelectionMeshList.push(featureMarkerSelectionMesh);
      
          //Rotate - Custom Rotation
          //console.log("[CAD Engine] Feature Marker (3 of 3) Three Axis Rotation Start");
          //featureMarkerSelectionMesh.rotateOnAxis(new THREE.Vector3(1, 0, 0), 90 * (Math.PI / 180.0));
          //featureMarkerSelectionMesh.rotateOnAxis(new THREE.Vector3(0, 1, 0), 180 * (Math.PI / 180.0));
          //featureMarkerSelectionMesh.rotateOnAxis(new THREE.Vector3(0, 0, 1), 180 * (Math.PI / 180.0));
          //console.log("[CAD Engine] Feature Marker (3 of 3) Three Axis Rotation End");
      
          console.log("[CAD Engine] Feature Marker Creation End");
        }
      }
      
      //Rotate these: sphereTempList
      //Rotate these: this.featureMarkerMeshList
      //Rotate these: this.featureMarkerSelectionMeshList
      
      loadingCADComplete = function () {
        this.cadList[0].calculateBoundingBox();
      
        //Get the bounding box for the CAD
        //var box = this.cadList[0].cad.children[0].geometry.boundingBox;
        var boxMin = this.cadList[0].getBoundingBoxMin();
        var boxMax = this.cadList[0].getBoundingBoxMax();
      
        //Determine the center point of the bounding box
        var xCenter = boxMin.x + ((boxMax.x - boxMin.x) / 2);
        var yCenter = boxMin.y + ((boxMax.y - boxMin.y) / 2);
        var zCenter = boxMin.z + ((boxMax.z - boxMin.z) / 2);
      
        //Calculate from the calculated origin of the geometry
        this.cadList[0].calculateBoundingSphere(new THREE.Vector3(xCenter, yCenter, zCenter));
      
        //Move the CAD to 0, 0, 0 - Change the world position in world coordinates.
        //this.cadList[0].translate(-xCenter, -yCenter, -zCenter);
      
        //Move the origin of the CAD geometry to be at the center of the geometry. The
        //CAD is already at world 0,0,0 where the camera is. So it will rotate around world 0,0,0
        //instead of the local origin the CAD has when it is imported. translate the geometry 
        //in local CAD coordinate space instead of the entire object in world coordinate space.
        this.cadList[0].cad.children[0].geometry.translate(-xCenter, -yCenter, -zCenter);
      
      
        this.cadRadius = this.cadList[0].getBoundingSphereRadius();
        var cadDiameter = this.cadRadius * 2;
      
        this.setupLighting(cadDiameter);
      
        var size = cadDiameter * 0.1;
        var location = new THREE.Vector3(0, ((boxMax.y - boxMin.y) / 2) + 0.5);
      
      
      
        this.setupAxis();
      
        this.setupGrid(Math.round(this.cadRadius * 5), -((boxMax.y - boxMin.y) / 2));
        this.enableGrid(false);
      
        var viewDistance = cadDiameter * 1.6;
        this.camera.setDefaultViewDistance(viewDistance);
        this.setIsoView();
        //this.setFrontView(); //Upside down
      
      
        this.camera.setCameraSpeed(this.cadRadius * 0.005); //Speed is based on the size of the object
        this.camera.enableAnimation(true);
      
        this.cadOffset = new THREE.Vector3(-xCenter, -yCenter, -zCenter);
      
        var instance = this;
        this.mouseMoveHandle = function (data) { instance.mouseMove(data); };
        this.renderer.domElement.parentElement.addEventListener('mousemove', this.mouseMoveHandle, false);
      
        this.mouseUpHandle = function (data) { instance.mouseUp(data); };
        this.renderer.domElement.parentElement.addEventListener('mouseup', this.mouseUpHandle, false);
      
        //These need to be called because they could have changed since the request to load the cad occured.
        this.setCADColor(this.cadColor);
        //this.setDefaultColor(this.defaultColor);
        this.setHoverColor(this.hoverColor);
        this.setSelectedColor(this.selectedColor);
        this.setLeaderLineColor(this.leaderLineColor);
        this.setLeaderLineSize(this.leaderLineSize);
        this.setLeaderLineDefaultLength(this.leaderLineDefaultLength);
        this.setGlobalLightColor(this.ambientColor);
        this.setFrontLightColor(this.frontColor);
        this.setBackLightColor(this.backColor);
      
        if (this.cadFeatureInfo !== null) {
          this.loadFeatureMarkers();
        }
      
        this.enableTexture(true);
      
        this.cadLoadCallBack(true);
      }
      
      getCAD = function () {
        if (this.cadLoaded) {
          return this.cadList[0].cad;
        } else {
          return null;
        }
      }
      
      loadFeatureMarkers = function () {
        var markerSize = 0.0075 * this.cadRadius;
      
        var offset = new THREE.Vector3(this.cadOffset.x, this.cadOffset.y, this.cadOffset.z);
      
        if (this.cadFeatureInfo.features.length < 100) {
          this.markerSubdivision = 32;
        }
        else if (this.cadFeatureInfo.features.length >= 100 &&
          this.cadFeatureInfo.features.length < 500) {
          this.markerSubdivision = 16; //How smooth are the feature markers and collision markers
        }
        else {
          this.markerSubdivision = 12;
        }
      
        this.createFeatureMarkerGeometry(markerSize, offset);
      
        this.activeHoverFeatureMarker = new featureMarker();
        this.activeHoverFeatureMarker.init(
            "",
            this.renderWindow, this.scene,
            this.camera.getThreeJSCamera3D(),
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(0, 1, 0),
            new THREE.Color(0xff0000),
            markerSize * 1.05, offset,
            this.featureLabelTooltip,
            this.markerSubdivision);
        this.activeHoverFeatureMarker.setVisible(false);
      
        this.activeSelectedFeatureMarker = new featureMarker();
        this.activeSelectedFeatureMarker.init(
            "",
            this.renderWindow, this.scene,
            this.camera.getThreeJSCamera3D(),
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(0, 1, 0),
            new THREE.Color(0xff0000),
            markerSize * 1.05, offset,
            this.featureLabelTooltip,
            this.markerSubdivision);
        this.activeSelectedFeatureMarker.setVisible(false);
      
        this.featureMarkersLoaded = true;
      
        if (this.cadLoaded) {
          if (this.cadFeatureInfo !== null) {
            if (this.cadFeatureInfo.setCadLoaded !== null) {
              if (typeof this.cadFeatureInfo.setCadLoaded === "function") {
                this.cadFeatureInfo.cadLoaded(true);
              }
            }
          }
        }
      
      }
      
      cadLoadCallBack = function (cadLoaded) {
        this.cadLoaded = cadLoaded;
      
        if (this.cadInfo !== null) {
          if (this.cadInfo.setCadLoaded !== null) {
            if (typeof this.cadInfo.setCadLoaded === "function") {
              this.cadInfo.cadLoaded(cadLoaded);
            }
          }
        }
      }
      
      isCADLoaded = function () {
        return this.cadLoaded;
      }
      
      mouseMove = function (data) {
        //return;
      
        if (!this.cadLoaded || !this.featureMarkersLoaded) {
          return;
        }
      
        //data.preventDefault();
      
        var box = this.renderWindow.getBoundingClientRect();
        var x = data.clientX - box.left;
        var y = data.clientY - box.top;
      
        var mouse = new THREE.Vector2();
        //X needs to be -1 (Left) to 1 (Right), Y needs to be 1 (Top) to -1 (Bottom)
        mouse.x = ((x / this.renderWindow.clientWidth) * 2) - 1;
        mouse.y = ((-(y / this.renderWindow.clientHeight)) * 2) + 1;
      
        /*
        two lists: render and color
        each render item has a location.
        create a color item at the render location in 3D space. the color is the i counter.
        add an item to a list with render location. 
        The first item has a color of 0, will be at position 0 in the list, and will have the render1 location.
        The second item has a color of 1, will have a position of 1, and will have the render2 location.
        The third item has a color of 2, will have a position of 2, and will have the render3 location.
        When a user picks an item of color 2, use that color value as the index value into this list.
        position 0 will have position of render1
        position 1 will have position of render2
        position 2 will have position of render3
        The color item is paired with a render item by having the color of the items (0, 1, 2,3, etc) be the index values of this render list (which has the positions).
        */
      
        this.renderer.render(this.featureMarkerScene, this.camera.getThreeJSCamera3D(), this.featureImage, true);
        var resultBuffer = new Uint8Array(4);
        //x - small left to big right
        //y large top to small bottom
      
        y = this.featureImage.height - y;
        this.renderer.readRenderTargetPixels(this.featureImage, x, y, 1, 1, resultBuffer);
      
        var found = false;
      
        if (resultBuffer[3] ===255) { //One of the spheres is under the mouse.
          var color = (resultBuffer[0] << 16) | (resultBuffer[1] << 8) | (resultBuffer[2]); //Get the RGB value
      
          if (color >= 0 && color < this.featureMarkerLocationList.length) { //Is this one of the valid sphere locations?
            //Use the color value as an index into the featureMarkerLocationList list.
            this.activeHoverFeatureMarker.setLocation(
              this.featureMarkerLocationList[color].getLocation().x,
              this.featureMarkerLocationList[color].getLocation().y,
              this.featureMarkerLocationList[color].getLocation().z);
      
            this.activeHoverFeatureMarker.setName(this.featureMarkerLocationList[color].getName());
      
            this.activeHoverFeatureMarker.enableHoverColor();
            this.activeHoverFeatureMarker.setVisible(true);
      
            //only enable the tooltip if this feature marker is not selected
            if (!this.featureMarkerLocationList[color].getSelected()) {
              if (this.activeHoverFeatureMarker.getName() !==
                this.activeSelectedFeatureMarker.getName()) {
                this.activeHoverFeatureMarker.enableTooltip();
                found = true;
              } else {
                if (!this.activeSelectedFeatureMarker.isSelected()) {
                  this.activeHoverFeatureMarker.enableTooltip();
                  found = true;
                }
              }
            }
          }
        }
      
        if (!found) {
          this.activeHoverFeatureMarker.setVisible(false);
          this.activeHoverFeatureMarker.disableTooltip();
        }
      
        //this.renderer.clear();
        //this.renderer.render(this.scene, this.camera.getThreeJSCamera3D());
        //this.renderer.clearDepth();
        //this.renderer.render(this.sceneUI, this.camera.getThreeJSCameraUI());
        this.drawScreen();
      }
      
      mouseUp = function (data) {
        if (!this.cadLoaded || !this.featureMarkersLoaded) {
          return;
        }
      
        //data.preventDefault();
      
        var box = this.renderWindow.getBoundingClientRect();
        var x = data.clientX - box.left;
        var y = data.clientY - box.top;
      
        var mouse = new THREE.Vector2();
        //X needs to be -1 (Left) to 1 (Right), Y needs to be 1 (Top) to -1 (Bottom)
        mouse.x = ((x / this.renderWindow.clientWidth) * 2) - 1;
        mouse.y = ((-(y / this.renderWindow.clientHeight)) * 2) + 1;
      
        /*
        two lists: render and color
        each render item has a location.
        create a color item at the render location in 3D space. the color is the i counter.
        add an item to a list with render location. 
        The first item has a color of 0, will be at position 0 in the list, and will have the render1 location.
        The second item has a color of 1, will have a position of 1, and will have the render2 location.
        The third item has a color of 2, will have a position of 2, and will have the render3 location.
        When a user picks an item of color 2, use that color value as the index value into this list.
        position 0 will have position of render1
        position 1 will have position of render2
        position 2 will have position of render3
        The color item is paired with a render item by having the color of the items (0, 1, 2,3, etc) be the index values of this render list (which has the positions).
        */
      
        this.renderer.render(this.featureMarkerScene, this.camera.getThreeJSCamera3D(), this.featureImage, true);
        var resultBuffer = new Uint8Array(4);
        //x - small left to big right
        //y large top to small bottom
      
        y = this.featureImage.height - y;
        this.renderer.readRenderTargetPixels(this.featureImage, x, y, 1, 1, resultBuffer);
      
        var found = false;
      
        if (resultBuffer[3] === 255) { //One of the spheres is under the mouse.
          var color = (resultBuffer[0] << 16) | (resultBuffer[1] << 8) | (resultBuffer[2]); //Get the RGB value
      
          if (color >= 0 && color < this.featureMarkerLocationList.length) { //Is this one of the valid sphere locations?
            var currentLocation = new THREE.Vector3(
              this.activeSelectedFeatureMarker.getLocation().x,
              this.activeSelectedFeatureMarker.getLocation().y,
              this.activeSelectedFeatureMarker.getLocation().z);
      
            var newLocation = new THREE.Vector3(
              this.featureMarkerLocationList[color].getLocation().x,
              this.featureMarkerLocationList[color].getLocation().y,
              this.featureMarkerLocationList[color].getLocation().z);
      
            //is this a different feature marker? If so, change the location to the new feature marker location.
            if ((currentLocation.x !== newLocation.x) ||
            (currentLocation.y !== newLocation.y) ||
            (currentLocation.z !== newLocation.z)) {
              if (this.featureMarkerLocationList[color].getSelected()) {
                //Remove it from the enabled features list.
                this.featureMarkerLocationList[color].setSelected(false);
              }
              else {
                found = true;
                //Add it to the enabled features list.
                this.featureMarkerLocationList[color].setSelected(true);
              }
            } else { //Otherwise, it is the same position and the selection marker/label should be turned off.
              if (this.activeSelectedFeatureMarker.isSelected()) {
                this.activeSelectedFeatureMarker.reset(); //Turn the selected feature marker off.
                this.activeSelectedFeatureMarker.setVisible(false);
      
                //Remove it from the enabled features list.
                this.featureMarkerLocationList[color].setSelected(false);
              } else {
                found = true; //Turn the feature marker on
      
                //Add it to the enabled features list.
                this.featureMarkerLocationList[color].setSelected(true);
              }
            }
      
            if (found) {
              this.currentFeatureMarkerIndex = color; //Needed if the CAD is rotated. This needs to be updated.
      
              this.activeSelectedFeatureMarker.reset();
      
              this.activeSelectedFeatureMarker.setLocation(newLocation.x, newLocation.y, newLocation.z);
      
              this.activeSelectedFeatureMarker.setName(this.featureMarkerLocationList[color].getName());
      
              this.activeSelectedFeatureMarker.setSelected(true);
              this.activeSelectedFeatureMarker.enableSelectedColor();
              this.activeSelectedFeatureMarker.setVisible(true);
      
              if (this.cadFeatureInfo !== null) {
                if (this.cadFeatureInfo.setSelectedFeature !== null) {
                  if (typeof this.cadFeatureInfo.setSelectedFeature === "function") {
                    var name = this.featureMarkerLocationList[color].getName();
      
                    if (name !== null) {
                      console.log("[CAD Engine] Selected Feature Name: " + name);
                    } else {
                      console.log("[CAD Engine] [ERROR] Selected Feature Name is null");
                    }
      
                    this.cadFeatureInfo.selectedFeature(name);
                  }
                }
              }
            }
          }
        }
      }
      
      resizeViewport = function () {
        this.currentWidth = this.renderWindow.clientWidth;
        this.currentHeight = this.renderWindow.clientHeight;
      
        if (this.currentWidth === 0 || this.currentHeight === 0) {
          return;
        }
      
        var aspectRatio = this.currentWidth / this.currentHeight;
      
        var camera3D = this.camera.getThreeJSCamera3D();
      
        if (camera3D !== null) {
          camera3D.aspect = aspectRatio;
          camera3D.updateProjectionMatrix();
        }
      
        var cameraUI = this.camera.getThreeJSCameraUI();
      
        if (cameraUI !== null) {
          cameraUI.aspect = 1;//aspectRatio;
          cameraUI.updateProjectionMatrix();
        }
      
        var leftSide = -(this.currentWidth / 2);
        var rightSide = this.currentWidth / 2;
        var topSide = this.currentHeight / 2;
        var bottomSide = -(this.currentHeight / 2);
      
        var camera2D = this.camera.getThreeJSCamera2D();
      
        if (camera2D !== null) {
          camera2D.left = leftSide;
          camera2D.right = rightSide;
          camera2D.top = topSide;
          camera2D.bottom = bottomSide;
          camera2D.updateProjectionMatrix();
        }
      
        if (this.background !== null) {
          this.background.updateScale();
        }
      
        if (this.foreground !== null) {
          this.foreground.updateScale();
        }
      
        var panel = document.getElementById("Overlay");
      
        if (panel !== null) {
          panel.width = this.currentWidth;
          panel.height = this.currentHeight;
          panel.style.width = panel.width;
          panel.style.height = panel.height;
        }
      
        this.renderer.setSize(this.currentWidth, this.currentHeight);
      
        //This must be destroyed and recreated if the size changes.
        this.featureImage = null;
        this.featureImage = new THREE.WebGLRenderTarget(this.currentWidth, this.currentHeight);
        this.featureImage.texture.minFilter = THREE.LinearFilter;
        this.featureImage.texture.generateMipmaps = false;
      }
      
      scaleToFit = function () {
        this.resetCAD();
        this.camera.scaleToFit();
      }
      
      cadRotate = function (axis, angle) {
        var rotValue = angle * (Math.PI / 180.0); //Convert Degrees to Radians.
        this.cadList[0].cad.rotateOnWorldAxis(axis, rotValue); //Rotate the CAD
      
        if (this.sphereTemp !== null) {
          //Rotate the Feature markers and selection geometry
          this.sphereTemp.rotateOnWorldAxis(axis, rotValue);
      
          //Temporarilly add to the scene and render it. This will apply all the math transformations we need below.
          this.scene.add(this.sphereTemp);
      
          //this.renderer.render(this.scene, this.camera.getThreeJSCamera3D()); //This updates the position of the feature markers after the rotate.
          this.drawScreen();
      
          //Update the feature marker locations with the new poisitions after rotation.
          for (var i = 0; i < this.sphereTempList.length; i++) {
            this.featureMarkerLocationList[i].setLocation(new THREE.Vector3(this.sphereTempList[i].getWorldPosition().x,
              this.sphereTempList[i].getWorldPosition().y,
              this.sphereTempList[i].getWorldPosition().z));
          }
      
          //No longer need to draw this temp geometry.
          this.scene.remove(this.sphereTemp);
      
          //If a feature is selected, we need to determine the location of the new selected feature marker.
          if (this.activeSelectedFeatureMarker.isSelected()) {
            var newLocation = new THREE.Vector3(
              this.featureMarkerLocationList[this.currentFeatureMarkerIndex].getLocation().x,
              this.featureMarkerLocationList[this.currentFeatureMarkerIndex].getLocation().y,
              this.featureMarkerLocationList[this.currentFeatureMarkerIndex].getLocation().z);
      
            this.activeSelectedFeatureMarker.setLocation(newLocation.x, newLocation.y, newLocation.z);
          }
      
          this.featureMarkerMeshList[0].rotateOnWorldAxis(axis, rotValue);
          this.featureMarkerSelectionMeshList[0].rotateOnWorldAxis(axis, rotValue);
        }
      }
      
      resetCAD = function () {
        this.cadPan(new THREE.Vector3(-this.cadPanOffset.x, -this.cadPanOffset.y, -this.cadPanOffset.z));
      
        this.cadPanOffset.x = 0;
        this.cadPanOffset.y = 0;
        this.cadPanOffset.z = 0;
      }
      
      cadPan = function (pan) {
        if (this.cadLoaded) {
          this.cadPanOffset.x += pan.x;
          this.cadPanOffset.y += pan.y;
          this.cadPanOffset.z += pan.z;
      
          this.cadList[0].cad.position.add(pan);
      
          //Pan the Feature markers if they exist
          if (this.sphereTemp !== null) {
            //Rotate the Feature markers and selection geometry
            this.sphereTemp.position.add(pan);
      
            //Temporarilly add to the scene and render it. This will apply all the math transformations we need below.
            this.scene.add(this.sphereTemp);
      
            //this.renderer.render(this.scene, this.camera.getThreeJSCamera3D()); //This updates the position of the feature markers after the rotate.
            this.drawScreen();
      
            //Update the feature marker locations with the new poisitions after rotation.
            for (var i = 0; i < this.sphereTempList.length; i++) {
              this.featureMarkerLocationList[i].setLocation(new THREE.Vector3(this.sphereTempList[i].getWorldPosition().x,
                this.sphereTempList[i].getWorldPosition().y,
                this.sphereTempList[i].getWorldPosition().z));
            }
      
            //No longer need to draw this temp geometry.
            this.scene.remove(this.sphereTemp);
      
            //If a feature is selected, we need to determine the location of the new selected feature marker.
            if (this.activeSelectedFeatureMarker.isSelected()) {
              var newLocation = new THREE.Vector3(
                this.featureMarkerLocationList[this.currentFeatureMarkerIndex].getLocation().x,
                this.featureMarkerLocationList[this.currentFeatureMarkerIndex].getLocation().y,
                this.featureMarkerLocationList[this.currentFeatureMarkerIndex].getLocation().z);
      
              this.activeSelectedFeatureMarker.setLocation(newLocation.x, newLocation.y, newLocation.z);
            }
      
            this.featureMarkerMeshList[0].position.add(pan);
            this.featureMarkerSelectionMeshList[0].position.add(pan);
          }
        }
      }
      
      cadRotateX = function (value) {
        console.log("[CAD Engine] CAD Rotate X: " + value);
        this.cadRotate(new THREE.Vector3(1, 0, 0), value);
      }
      
      cadRotateY = function (value) {
        console.log("[CAD Engine] CAD Rotate Y: " + value);
        this.cadRotate(new THREE.Vector3(0, 1, 0), value);
      }
      
      cadRotateZ = function (value) {
        console.log("[CAD Engine] CAD Rotate Z: " + value);
        this.cadRotate(new THREE.Vector3(0, 0, 1), value);
      }
      
      setFrontView = function () {
        this.resetCAD();
        var cam = this.camera.getThreeJSCamera3D();
        cam.up = new THREE.Vector3(0, 1, 0);
        this.camera.setFrontView();
      }
      
      setBackView = function () {
        this.resetCAD();
        var cam = this.camera.getThreeJSCamera3D();
        cam.up = new THREE.Vector3(0, 1, 0);
        this.camera.setBackView();
      }
      
      setLeftView = function () {
        this.resetCAD();
        var cam = this.camera.getThreeJSCamera3D();
        cam.up = new THREE.Vector3(0, 1, 0);
        this.camera.setLeftView();
      }
      
      setRightView = function () {
        this.resetCAD();
        var cam = this.camera.getThreeJSCamera3D();
        cam.up = new THREE.Vector3(0, 1, 0);
        this.camera.setRightView();
      }
      
      setTopView = function () {
        this.resetCAD();
        var cam = this.camera.getThreeJSCamera3D();
        cam.up = new THREE.Vector3(0, 0, 1);
        this.camera.setTopView();
      }
      
      setBottomView = function () {
        this.resetCAD();
        var cam = this.camera.getThreeJSCamera3D();
        cam.up = new THREE.Vector3(0, 0, 1);
        this.camera.setBottomView();
      }
      
      setIsoView = function () {
        this.resetCAD();
        var cam = this.camera.getThreeJSCamera3D();
        cam.up = new THREE.Vector3(0, 1, 0);
        this.camera.setIsoView();
      }
      
      updateCamera2DSize = function () {
        this.currentWidth = this.renderWindow.clientWidth;
        this.currentHeight = this.renderWindow.clientHeight;
      
        var leftSide = -(this.currentWidth / 2);
        var rightSide = this.currentWidth / 2;
        var topSide = this.currentHeight / 2;
        var bottomSide = -(this.currentHeight / 2);
      
        var camera2D = this.camera.getThreeJSCamera2D();
      
        if (camera2D !== null) {
          camera2D.left = leftSide;
          camera2D.right = rightSide;
          camera2D.top = topSide;
          camera2D.bottom = bottomSide;
          camera2D.updateProjectionMatrix();
        }
      }
      
      toggleBackgroundScale = function () {
        this.background.toggleScale();
        this.updateCamera2DSize();
      }
      
      toggleForegroundScale = function () {
        this.foreground.toggleScale();
        this.updateCamera2DSize();
      }
      
      enableBackgroundScale = function (value) {
        this.background.enableScale(value);
        this.updateCamera2DSize();
      }
      
      enableForegroundScale = function (value) {
        this.foreground.enableScale(value);
        this.updateCamera2DSize();
      }
      
      toggleWireframe = function () {
        for (var i = 0; i < this.cadList.length; i++) {
          this.cadList[i].toggleWireframe();
        }
      }
      
      enableWireframe = function (value) {
        for (var i = 0; i < this.cadList.length; i++) {
          this.cadList[i].enableWireframe(value);
        }
      }
      
      toggleBackground = function () {
        this.background.toggleVisibility();
      }
      
      enableBackground = function (value) {
        this.background.setVisible(value);
      }
      
      toggleForeground = function () {
        this.foreground.toggleVisibility();
      }
      
      enableForeground = function (value) {
        this.foreground.setVisible(value);
      }
      
      toggleTransparency = function () {
        for (var i = 0; i < this.cadList.length; i++) {
          this.cadList[i].toggleTransparency();
        }
      }
      
      enableTransparency = function (value) {
        for (var i = 0; i < this.cadList.length; i++) {
          this.cadList[i].enableTransparency(value);
        }
      }
      
      
      toggleAxis = function () {
        this.axis.toggleAxis();
      }
      
      enableAxis = function (value) {
        this.axis.enableAxis(value);
      }
      
      toggleAnimation = function () {
        this.camera.toggleAnimation();
      }
      
      enableAnimation = function (value) {
        this.camera.enableAnimation(value);
      }
      
      toggleGrid = function () {
        if (this.grid.visible) {
          this.grid.visible = false;
        } else {
          this.grid.visible = true;
        }
      }
      
      enableGrid = function (value) {
        this.grid.visible = value;
      }
      
      toggleTexture = function () {
        for (var i = 0; i < this.cadList.length; i++) {
          this.cadList[i].toggleTexture();
        }
      
        this.textureEnabled = this.cadList[0].getTextureEnabled();
      }
      
      enableTexture = function (value) {
        for (var i = 0; i < this.cadList.length; i++) {
          this.cadList[i].enableTexture(value);
        }
      
        this.textureEnabled = value;
      }
      
      setCameraTarget = function (name) {
        //Find the feature marker and set it selected
        this.activeSelectedFeatureMarker.reset();
        this.activeSelectedFeatureMarker.setVisible(false);
      
        for (var i = 0; i < this.featureMarkerLocationList.length; i++) {
          if (this.featureMarkerLocationList[i].getName() === name) {
            this.resetCAD();
      
            this.currentFeatureMarkerIndex = i; //Needed if the CAD is rotated. This needs to be updated.
            this.featureMarkerLocationList[i].setSelected(true);
      
            var offsetLocation = new THREE.Vector3(
              this.featureMarkerLocationList[i].getLocation().x,
              this.featureMarkerLocationList[i].getLocation().y,
              this.featureMarkerLocationList[i].getLocation().z);
      
            var direction = new THREE.Vector3(offsetLocation.x, offsetLocation.y, offsetLocation.z);
            direction.normalize();
      
            this.camera.setCustomView(direction, offsetLocation, 1.0);
      
            this.activeSelectedFeatureMarker.setLocation(
              this.featureMarkerLocationList[i].getLocation().x,
              this.featureMarkerLocationList[i].getLocation().y,
              this.featureMarkerLocationList[i].getLocation().z);
      
            this.activeSelectedFeatureMarker.setName(this.featureMarkerLocationList[i].getName());
      
            this.activeSelectedFeatureMarker.setSelected(true);
            this.activeSelectedFeatureMarker.enableSelectedColor();
            this.activeSelectedFeatureMarker.setVisible(true);
      
            return;
          }
        }
      }
      
      //Color API
      setGlobalLightColor = function (hexValue) {
        this.ambientColor = hexValue;
      
        if (this.globalLight !== null) {
          this.globalLight.color.setHex(this.ambientColor);
        }
      }
      
      setFrontLightColor = function (hexValue) {
        this.frontColor = hexValue;
      
        if (this.frontLight !== null) {
          this.frontLight.color.setHex(this.frontColor);
        }
      }
      
      setBackLightColor = function (hexValue) {
        this.backColor = hexValue;
      
        if (this.backLight !== null) {
          this.backLight.color.setHex(this.backColor);
        }
      }
      
      setBackgroundColor = function (hexValue) {
        this.renderer.setClearColor(hexValue);
      }
      
      setCADColor = function (hexValue) {
        this.cadColor = hexValue;
      
        for (var i = 0; i < this.cadList.length; i++) {
          this.cadList[i].setColor(hexValue);
        }
      }
      
      
      setDefaultColor = function (hexValue) {
        this.defaultColor = hexValue;
      
        if (this.featureMarkerList !== null) {
          for (var i = 0; i < this.featureMarkerList.length; i++) {
            this.featureMarkerList[i].setDefaultColor(this.defaultColor);
          }
        }
      }
      
      setHoverColor = function (hexValue) {
        this.hoverColor = hexValue;
      
        if (this.featureMarkerList !== null) {
          for (var i = 0; i < this.featureMarkerList.length; i++) {
            this.featureMarkerList[i].setHoverColor(this.hoverColor);
          }
        }
      }
      
      setSelectedColor = function (hexValue) {
        this.selectedColor = hexValue;
      
        if (this.featureMarkerList !== null) {
          for (var i = 0; i < this.featureMarkerList.length; i++) {
            this.featureMarkerList[i].setSelectedColor(this.selectedColor);
          }
        }
      }
      
      setLeaderLineColor = function (value) {
        this.leaderLineColor = value;
      
        if (this.featureMarkerList !== null) {
          for (var i = 0; i < this.featureMarkerList.length; i++) {
            this.featureMarkerList[i].setLeaderLineColor(this.leaderLineColor);
          }
        }
      }
      
      setLeaderLineSize = function (value) {
        this.leaderLineSize = value;
      
        if (this.featureMarkerList !== null) {
          for (var i = 0; i < this.featureMarkerList.length; i++) {
            this.featureMarkerList[i].setLeaderLineSize(this.leaderLineSize);
          }
        }
      }
      
      setLeaderLineDefaultLength = function (value) {
        this.leaderLineDefaultLength = value;
      
        if (this.featureMarkerList !== null) {
          for (var i = 0; i < this.featureMarkerList.length; i++) {
            this.featureMarkerList[i].setLeaderLineDefaultLength(this.leaderLineDefaultLength);
          }
        }
      }
      
      setFeatureInfo = function (cFeatureInfo) {
        this.cadFeatureInfo = cFeatureInfo;
      
        //If the CAD is loaded, create the markers now. Otherwise create the markers when the cad is loaded.
        if (this.cadLoaded) {
          this.loadFeatureMarkers();
        }
      }
      
      loadVOD = function (value) {
        var data = value;
      
        var vodData = new vodMetaData();
      
        vodData.setCADMetaDataID(value.cadId);
        vodData.setCADMetaDataName(value.cadMetaDataName);
        vodData.setCADMetaDataURL(value.cadMetaDataURL); //only for testing local file system
      
        for (var i = 0; i < value.vodFrames.length; i++) {
          var frame = new vodFrameMetaData();
          frame.id = 0;
          frame.name = value.vodFrames[i].name;
          frame.url = value.vodFrames[i].frameId;
          vodData.getFrameMetaData().push(frame);
        }
      
        //Once we build the object from what is passed in from the  C# code on cadEngine.load(data) we do this.
        if (this.vodControl !== null) {
          this.setCADColor(this.cadColor);
          this.vodControl.end();
          this.vodControl = null;
        }
      
        this.vodControl = new vodManager();
        this.vodControl.init(this.cadList[0].cad.children[0].geometry);
      
        this.vodControl.setVODLoadingPercentageCallback(this.VODPercentageCallback);
        this.vodControl.setVODControlsDisabledCallback(this.VODControlsDisabledCallback);
        this.vodControl.setVODFrameSliderValueCallback(this.VODFrameSliderValueCallback);
        this.vodControl.setFPSSliderValueCallback(this.FPSSliderValueCallback);
      
        this.vodControl.setVODUpperLimit(this.vodUpperLimit);
        this.vodControl.setVODLowerLimit(this.vodLowerLimit);
      
        this.textureEnabled = this.cadList[0].getTextureEnabled();
        //if (this.textureEnabled) {
        //  this.cadList[0].enableTexture(false);
        //}
        this.cadList[0].setVODMaterial();
        this.globalLight.color.setHex(0x777777);
      
        this.vodControl.loadVOD(vodData);
      }
      
      playVOD = function () {
        if (this.vodControl !== null) {
          this.vodControl.playVOD();
        }
      }
      
      pauseVOD = function () {
        if (this.vodControl !== null) {
          this.vodControl.pauseVOD();
        }
      }
      
      stopVOD = function () {
        if (this.vodControl !== null) {
          this.vodControl.stopVOD();
        }
      }
      
      frameBackVOD = function () {
        if (this.vodControl !== null) {
          this.vodControl.frameBackVOD();
        }
      }
      
      frameForwardVOD = function () {
        if (this.vodControl !== null) {
          this.vodControl.frameForwardVOD();
        }
      }
      
      rewindVOD = function () {
        if (this.vodControl !== null) {
          this.vodControl.rewindVOD();
        }
      }
      
      fastForwardVOD = function () {
        if (this.vodControl !== null) {
          this.vodControl.fastForwardVOD();
        }
      }
      
      setVODPlaybackRate = function (value) {
        if (this.vodControl !== null) {
          this.vodControl.setVODPlaybackRate(value);
        }
      }
      
      setVODUpperLimit = function (value) {
        this.vodUpperLimit = value;
      }
      
      setVODLowerLimit = function (value) {
        this.vodLowerLimit = value;
      }
      
      setVODLoadingPercentageCallback = function (value) {
        this.VODPercentageCallback = value;
      }
      
      setVODControlsDisabledCallback = function (value) {
        this.VODControlsDisabledCallback = value;
      }
      
      setVODFrameSliderValueCallback = function (value) {
        this.VODFrameSliderValueCallback = value;
      }
      
      setFPSSliderValueCallback = function (value) {
        this.FPSSliderValueCallback = value;
      }
      
      
      unloadVOD = function () {
        if (this.vodControl !== null) {
          this.cadList[0].enableTexture(this.textureEnabled);
      
          this.vodControl.unloadVOD();
      
          this.setGlobalLightColor(this.ambientColor);
          this.setCADColor(this.cadColor);
        }
      }
      
      setVODFrame = function (value) {
        if (this.vodControl !== null) {
          this.vodControl.setVODFrame(value);
        }
      }
      
      translateBackground = function (x, y) {
        if (this.background !== null) {
          this.background.translate(x, y);
        }
      }
      
      rotateBackground = function (value) {
        if (this.background !== null) {
          this.background.rotate(value);
        }
      }
      
      zoomBackground = function (value) {
        if (this.background !== null) {
          this.background.zoom(value);
        }
      }
      
      translateForeground = function (x, y) {
        if (this.foreground !== null) {
          this.foreground.translate(x, y);
        }
      }
      
      rotateForeground = function (value) {
        if (this.foreground !== null) {
          this.foreground.rotate(value);
        }
      }
      
      zoomForeground = function (value) {
        if (this.foreground !== null) {
          this.foreground.zoom(value);
        }
      }
      
      setForegroundLocationCentered = function (value) {
        if (this.foreground !== null) {
          this.foreground.setLocationCentered(value);
        }
      }
      
      setBackgroundLocationCentered = function (value) {
        if (this.background !== null) {
          this.background.setLocationCentered(value);
        }
      }
      
      setForegroundLocationUL = function () {
        if (this.foreground !== null) {
          this.foreground.setLocationUL();
        }
      }
      
      setBackgroundLocationUL = function () {
        if (this.background !== null) {
          this.background.setLocationUL();
        }
      }
      
      setForegroundLocationUR = function () {
        if (this.foreground !== null) {
          this.foreground.setLocationUR();
        }
      }
      
      setBackgroundLocationUR = function () {
        if (this.background !== null) {
          this.background.setLocationUR();
        }
      }
      
      setForegroundLocationLR = function () {
        if (this.foreground !== null) {
          this.foreground.setLocationLR();
        }
      }
      
      setBackgroundLocationLR = function () {
        if (this.background !== null) {
          this.background.setLocationLR();
        }
      }
      
      setForegroundLocationLL = function () {
        if (this.foreground !== null) {
          this.foreground.setLocationLL();
        }
      }
      
      setBackgroundLocationLL = function () {
        if (this.background !== null) {
          this.background.setLocationLL();
        }
      }
      
      toggleBackgroundScaleToWindow = function () {
        if (this.background !== null) {
          this.background.toggleScaleToWindow();
        }
      }
      
      enableBackgroundScaleToWindow = function (value) {
        if (this.background !== null) {
          this.background.enableScaleToWindow(value);
        }
      }
      
      setBackgroundScaleToWindowPercent = function (value) {
        if (this.background !== null) {
          this.background.setScaleToWindowPercent(value);
        }
      }
      
      toggleForegroundScaleToWindow = function () {
        if (this.foreground !== null) {
          this.foreground.toggleScaleToWindow();
        }
      }
      
      enableForegroundScaleToWindow = function (value) {
        if (this.foreground !== null) {
          this.foreground.enableScaleToWindow(value);
        }
      }
      
      setForegroundScaleToWindowPercent = function (value) {
        if (this.foreground !== null) {
          this.foreground.setScaleToWindowPercent(value);
        }
      }
      
      getFeatureLabelEdit = function () {
        if (this.featureMarkerLocationList == null) {
          return false;
        }
      
        for (var j = 0; j < this.featureMarkerLocationList.length; j++) {
          if (this.featureMarkerLocationList[j].getFeatureLabelEdit()) {
            return true;
          }
        }
      
        return false;
      }
      
      loadChart = function (value) {
        if (this.activeSelectedFeatureMarker !== null) {
          if (this.activeSelectedFeatureMarker.isSelected()) {
            this.featureMarkerLocationList[this.currentFeatureMarkerIndex].loadChart(value);
            this.featureMarkerLocationList[this.currentFeatureMarkerIndex].setSelected(true);
          }
        }
      }
      clearChart = function () {
        if (this.activeSelectedFeatureMarker !== null) {
          if (this.activeSelectedFeatureMarker.isSelected()) {
            this.featureMarkerLocationList[this.currentFeatureMarkerIndex].clearChart();
          }
        }
      }

}

export default(threeJSWrapper);