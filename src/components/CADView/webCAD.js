import * as THREE from 'three'
import OBJLoader from '../../common/threejslibs/OBJLoader'
import JSZip from 'jszip'
import JSZipUtils from 'jszip-utils'

//OBJLoader(THREE);

class webCAD {
    constructor(){
        this.name = null;
        this.id = -1;
        this.cad = null;
        this.rotateEnabled = false;
        this.scene = null;
        this.currentPosition = null;
        this.currentScale = null;
        this.currentRotation = null;
        this.parent = null;
        this.color = null;
        this.wireframeVisible = false;
        this.transparencyVisible = false;
        this.textureVisible = false;
        this.boundingBoxMin = null;
        this.boundingBoxMax = null;
        this.boundingRadius = 0;
        this.texture = null;
        this.lineCAD = null;
        this.filename = null; 
    }

    init = function (scene, wrapper) {
        this.scene = scene;
        this.currentPosition = new THREE.Vector3(0, 0, 0);
        this.currentScale = new THREE.Vector3(1, 1, 1);
        this.currentRotation = new THREE.Vector3(0, 0, 0);
        this.parent = wrapper;
        this.boundingBoxMin = new THREE.Vector3(0, 0, 0);
        this.boundingBoxMax = new THREE.Vector3(0, 0, 0);
      
        var loader = new THREE.TextureLoader();
        console.log("[CAD Engine] Loading Texture Start");
        this.texture = loader.load("scripts/CADView/textures/metal.jpg");
        console.log("[CAD Engine] Loading Texture End");
        this.texture.mapping = THREE.SphericalReflectionMapping;
        this.lineCAD = false;
      }
      
      update = function (timeToRenderFrame) {
        if (this.cad === null) {
          return;
        }
      }
      
      end = function () {
      
        if (this.texture !== null) {
          this.texture.dispose();
          this.texture = null;
        }
      
        //this.cad = THREE.Object3D
        //--->children[] = THREE.Mesh
        //------->geometry = THREE.BufferGeometry
        //------->material
        if (this.cad !== null) {
          if (this.cad.children !== null) {
            for (var j = 0; j < this.cad.children.length; j++) {
              this.cad.children[j].geometry.dispose();
              this.cad.children[j].material.dispose();
            }
      
            this.cad.children.length = 0;
            this.cad.children = null;
          }
      
          this.scene.remove(this.cad);
          this.cad = null;
        }
      
        if (this.edges !== null) {
          this.scene.remove(this.edges);
          this.edges = null;
        }
      
        this.scene = null;
        this.name = null;
        this.id = -1;
        this.rotateEnabled = null;
        this.currentPosition = null;
        this.currentScale = null;
        this.currentRotation = null;
        this.parent = null;
        this.color = null;
        this.wireframeVisible = null;
        this.transparencyVisible = null;
        this.boundingBoxMin = null;
        this.boundingBoxMax = null;
        this.boundingRadius = 0;
        this.textureVisible = null;
        this.lineCAD = null;
        this.filename = null;
      }
      
      reset = function () {
        this.enableWireframe(false);
        this.enableTransparency(false);
        this.enableRotation(false);
        this.enableTexture(false);
      }
      
      //Helper API---------------------------------------------------------
      setScale = function (x, y, z) {
        this.currentScale.x = x;
        this.currentScale.y = y;
        this.currentScale.z = z;
      
        if (this.cad !== null) {
          this.cad.scale.x = x;
          this.cad.scale.y = y;
          this.cad.scale.z = z;
        }
      }
      
      toggleWireframe = function () {
        if (this.wireframeVisible) {
          this.wireframeVisible = false;
        } else {
          this.wireframeVisible = true;
        }
      
        this.enableWireframe(this.wireframeVisible);
      }
      
      enableWireframe = function (value) {
        this.wireframeVisible = value;
      
        if (this.cad !== null) {
          if (this.cad.children !== null) {
            for (var i = 0; i < this.cad.children.length; i++) {
              this.cad.children[i].material.wireframe = this.wireframeVisible; //Old way of wireframe where triangle edges were the wireframe.
            }
      
          }
        }
      }
      
      getTextureEnabled = function () {
        return this.textureVisible;
      }
      
      toggleTexture = function () {
        if (this.textureVisible) {
          this.textureVisible = false;
        } else {
          this.textureVisible = true;
        }
      
        this.enableTexture(this.textureVisible);
      }
      
      enableTexture = function (value) {
        this.textureVisible = value;
      
        if (this.lineCAD === true) {
          return;
        }
      
        //alert("Texture: " + this.textureVisible);
        if (this.cad !== null) {
          if (this.cad.children !== null) {
            if (this.textureVisible) {
              for (var j = 0; j < this.cad.children.length; j++) {
                this.cad.children[j].material.dispose();
                this.cad.children[j].material = new THREE.MeshPhysicalMaterial();
                this.cad.children[j].material.wireframe = false;
                this.cad.children[j].material.side = THREE.DoubleSide;
                this.cad.children[j].material.flatShading = false;
                this.cad.children[j].material.metalness = 1;//0.70;
                this.cad.children[j].material.envMap = this.texture;
                this.cad.children[j].material.needsUpdate = true;
              }
            } else {
      
              for (var j = 0; j < this.cad.children.length; j++) {
                this.cad.children[j].material.dispose();
                this.cad.children[j].material = new THREE.MeshPhongMaterial();
                this.cad.children[j].material.shininess = 200;
                this.cad.children[j].material.vertexColors = THREE.VertexColors;
                this.cad.children[j].material.wireframe = false;
                this.cad.children[j].material.side = THREE.DoubleSide;
                this.cad.children[j].material.flatShading = false;
                this.cad.children[j].material.needsUpdate = true;
              }
      
              this.setColor(this.color.getHex());
            }
          }
        }
      }
      
      setVODMaterial = function () {
        if (this.lineCAD === true) {
          return;
        }
      
        if (this.cad !== null) {
          if (this.cad.children !== null) {
            for (var j = 0; j < this.cad.children.length; j++) {
              //this.cad.children[j].material.dispose();
              //this.cad.children[j].material = new THREE.MeshLambertMaterial();
              //this.cad.children[j].material.vertexColors = THREE.VertexColors;
              //this.cad.children[j].material.wireframe = false;
              //this.cad.children[j].material.side = THREE.DoubleSide;
              //this.cad.children[j].material.flatShading = false;
              //this.cad.children[j].material.needsUpdate = true;
              this.cad.children[j].material.dispose();
              this.cad.children[j].material = new THREE.MeshPhongMaterial();
              this.cad.children[j].material.shininess = 100;
              this.cad.children[j].material.vertexColors = THREE.VertexColors;
              this.cad.children[j].material.wireframe = false;
              this.cad.children[j].material.side = THREE.DoubleSide;
              this.cad.children[j].material.flatShading = false;
              this.cad.children[j].material.needsUpdate = true;
            }
            this.setColor(0x777777);
          }
        }
      }
      
      toggleTransparency = function () {
        if (this.transparencyVisible) {
          this.transparencyVisible = false;
        } else {
          this.transparencyVisible = true;
        }
      
        this.enableTransparency(this.transparencyVisible);
      }
      
      enableTransparency = function (value) {
        this.transparencyVisible = value;
      
        if (this.cad !== null) {
          if (this.cad.children !== null) {
            for (var i = 0; i < this.cad.children.length; i++) {
              if (this.transparencyVisible) {
                this.cad.children[i].material.transparent = true;
                this.cad.children[i].material.opacity = 0.5;
              } else {
                this.cad.children[i].material.transparent = false;
                this.cad.children[i].material.opacity = 1.0;
              }
            }
          }
        }
      }
      
      getColor = function () {
        return this.color;
      }
      
      setColor = function (hexValue) {
        if (this.lineCAD === true) {
          return;
        }
      
        this.color = new THREE.Color(hexValue);//Convert the hex value to a THREE.Color object
      
        if (this.cad !== null) {
          if (this.cad.children !== null) {
            for (var i = 0; i < this.cad.children.length; i++) {
              var buffer = this.cad.children[i].geometry;
              var colors = buffer.getAttribute('color');
      
              for (var j = 0; j < colors.array.length; j += 3) {
                colors.array[j] = this.color.r;
                colors.array[j + 1] = this.color.g;
                colors.array[j + 2] = this.color.b;
              }
      
              colors.needsUpdate = true;
            }
          }
        }
      }
      
      
      getScale = function () {
        return this.currentScale;
      }
      
      setPosition = function (x, y, z) {
        this.currentPosition.x = x;
        this.currentPosition.y = y;
        this.currentPosition.z = z;
      
        if (this.cad !== null) {
          this.cad.position.x = x;
          this.cad.position.y = y;
          this.cad.position.z = z;
        }
      }
      
      translate = function (x, y, z) {
        if (this.cad !== null) {
          this.cad.translateX(x);
          this.cad.translateY(y);
          this.cad.translateZ(z);
      
          this.currentPosition.x = this.cad.position.x;
          this.currentPosition.y = this.cad.position.y;
          this.currentPosition.z = this.cad.position.z;
        }
      }
      
      getPosition = function () {
        return this.currentPosition;
      }
      
      getCAD = function () {
        return this.cad;
      }
      
      setRotation = function (xDegrees, yDegrees, zDegrees) {
        this.currentRotation.x = xDegrees;
        this.currentRotation.y = yDegrees;
        this.currentRotation.z = zDegrees;
      
        if (this.cad !== null) {
          //Convert Degrees to Radians
          var xRotation = this.currentRotation.x * (Math.PI / 180.0);
          var yRotation = this.currentRotation.y * (Math.PI / 180.0);
          var zRotation = this.currentRotation.z * (Math.PI / 180.0);
      
          this.cad.rotateOnAxis(new THREE.Vector3(1, 0, 0), xRotation);
          this.cad.rotateOnAxis(new THREE.Vector3(0, 1, 0), yRotation);
          this.cad.rotateOnAxis(new THREE.Vector3(0, 0, 1), zRotation);
        }
      }
      
      getRotation = function () {
        return this.currentRotation;
      }
      
      getBoundingBoxMin = function () {
        return this.boundingBoxMin;
      }
      
      getBoundingBoxMax = function () {
        return this.boundingBoxMax;
      }
      
      calculateBoundingBox = function () {
        var bufferInitial = this.cad.children[0].geometry;
        var verticesInitial = bufferInitial.getAttribute('position');
      
        this.boundingBoxMin.x = verticesInitial.array[0];
        this.boundingBoxMin.y = verticesInitial.array[1];
        this.boundingBoxMin.z = verticesInitial.array[2];
      
        this.boundingBoxMax.x = verticesInitial.array[0];
        this.boundingBoxMax.y = verticesInitial.array[1];
        this.boundingBoxMax.z = verticesInitial.array[2];
      
        if (this.cad !== null) {
          if (this.cad.children !== null) {
            for (var i = 0; i < this.cad.children.length; i++) {
              var buffer = this.cad.children[i].geometry;
              var vertices = buffer.getAttribute('position');
      
              for (var j = 0; j < vertices.array.length; j += 3) {
                var x = vertices.array[j];
                var y = vertices.array[j + 1];
                var z = vertices.array[j + 2];
      
                if (x < this.boundingBoxMin.x) {
                  this.boundingBoxMin.x = x;
                }
                if (x > this.boundingBoxMax.x) {
                  this.boundingBoxMax.x = x;
                }
      
                if (y < this.boundingBoxMin.y) {
                  this.boundingBoxMin.y = y;
                }
                if (y > this.boundingBoxMax.y) {
                  this.boundingBoxMax.y = y;
                }
      
                if (z < this.boundingBoxMin.z) {
                  this.boundingBoxMin.z = z;
                }
                if (z > this.boundingBoxMax.z) {
                  this.boundingBoxMax.z = z;
                }
              }
            }
          }
        }
      }
      
      getBoundingSphereRadius = function () {
        return this.boundingRadius;
      }
      
      calculateBoundingSphere = function (origin) {
        this.boundingRadius = 0;
      
        if (this.cad !== null) {
          if (this.cad.children !== null) {
            for (var i = 0; i < this.cad.children.length; i++) {
              var buffer = this.cad.children[i].geometry;
              var vertices = buffer.getAttribute('position');
      
              for (var j = 0; j < vertices.array.length; j += 3) {
                var point = new THREE.Vector3(vertices.array[j], vertices.array[j + 1], vertices.array[j + 2]);
      
                var distance = point.distanceTo(origin);
      
                if (distance > this.boundingRadius) {
                  this.boundingRadius = distance;
                }
              }
            }
          }
        }
      }
      
      objLoaded = function (cadData) {
        if (this.scene === null || cadData === null) {
          if (this.parent !== null) {
            this.parent.cadLoadCallBack(false); //Disable the progress bar
          }
          return;
        }
      
        this.cad = cadData;
        this.scene.add(this.cad);
      
        //Update these in case they were changed while the CAD was loading
        this.setScale(this.currentScale.x, this.currentScale.y, this.currentScale.z);
        this.setPosition(this.currentPosition.x, this.currentPosition.y, this.currentPosition.z);
        this.setRotation(this.currentRotation.x, this.currentRotation.y, this.currentRotation.z);
      
        //Rotate - Custom Rotation
        //console.log("[CAD Engine] CAD Loaded. Three Axis Rotation Start");
        //this.setRotation(90, 0, 0);
        //this.setRotation(0, 180, 0);
        //this.setRotation(0, 0, 180);
        //console.log("[CAD Engine] CAD Loaded. Three Axis Rotation End");
      
        this.parent.loadingCADComplete();
      }
      
      generate2DCADFromFile = function (cadData) {
        var container = new THREE.Group();
        var buffergeometry = new THREE.BufferGeometry();
      
        var totalPoints = 0;
        for (var i = 0; i < cadData.ScreenSpaceLines3D.length; i++) {
          totalPoints += cadData.ScreenSpaceLines3D[i].Points.length;
      
          if ((cadData.ScreenSpaceLines3D[i].Points.length % 2) !== 0) {
            console.log("Line Count: " + cadData.ScreenSpaceLines3D[i].Points.length);
          }
        }
      
        var v = new Float32Array(totalPoints * 3);
        var c = new Float32Array(totalPoints * 3);
      
        var index = 0;
      
        for (var i = 0; i < cadData.ScreenSpaceLines3D.length; i++) {
          var color = new THREE.Color(parseInt(cadData.ScreenSpaceLines3D[i].Color));
      
          for (var j = 0; j < cadData.ScreenSpaceLines3D[i].Points.length; j++) {
            v[index] = cadData.ScreenSpaceLines3D[i].Points[j].Point.X;
            v[index + 1] = cadData.ScreenSpaceLines3D[i].Points[j].Point.Y;
            v[index + 2] = cadData.ScreenSpaceLines3D[i].Points[j].Point.Z;
      
            c[index] = color.r;
            c[index + 1] = color.g;
            c[index + 2] = color.b;
      
            index += 3;
          }
        }
      
        //var v = new Float32Array(18);
        //var c = new Float32Array(18);
      
        ////Red line
        //r = 0xFF;
        //g = 0;
        //b = 0;
        //v[0] = 100;v[1] = 0; v[2] = 0;
        //v[3] = 0; v[4] = 100; v[5] = 0;
      
        //c[0] = r; c[1] = g; c[2] = b;
        //c[3] = r; c[4] = g; c[5] = b;
      
        ////Green Line
        //r = 0;
        //g = 0xFF;
        //b = 0;
        //v[6] = 0; v[7] = 100; v[8] = 0;
        //v[9] = -100; v[10] = 0; v[11] = 0;
      
        //c[6] = r; c[7] = g; c[8] = b;
        //c[9] = r; c[10] = g; c[11] = b;
      
        ////Blue Line
        //r = 0;
        //g = 0;
        //b = 0xFF;
        //v[12] = -100; v[13] = 0; v[14] = 0;
        //v[15] = 100; v[16] = 0; v[17] = 0;
      
        //c[12] = r; c[13] = g; c[14] = b;
        //c[15] = r; c[16] = g; c[17] = b;
      
        buffergeometry.addAttribute('position', new THREE.BufferAttribute(v, 3));
        buffergeometry.addAttribute('color', new THREE.BufferAttribute(c, 3));
      
        var materialMesh = undefined;
        materialMesh = new THREE.LineBasicMaterial();
      
        materialMesh.vertexColors = THREE.VertexColors;
      
        container.add(new THREE.LineSegments(buffergeometry, materialMesh));
      
        console.timeEnd('CAD Processing Time');
      
        return container;
      }
      
      load2DCADFileComplete = function (cadData) {
        if (this.scene === null || cadData === null) {
          if (this.parent !== null) {
            this.parent.cadLoadCallBack(false); //Disable the progress bar
          }
          return;
        }
      
        this.cad = this.generate2DCADFromFile(cadData);
        this.scene.add(this.cad);
      
        //Update these in case they were changed while the CAD was loading
        this.setScale(this.currentScale.x, this.currentScale.y, this.currentScale.z);
        this.setPosition(this.currentPosition.x, this.currentPosition.y, this.currentPosition.z);
        this.setRotation(this.currentRotation.x, this.currentRotation.y, this.currentRotation.z);
      
        console.timeEnd('2D CAD Load Time');
        this.parent.loadingCADComplete();
      }
      
      zipOpenedCallback = function (e, fileHandle) {
        var instance = this;
        //var zipLoader = new JSZip();
        var zipLoader = new JSZip(fileHandle);

      
        //Try and load the obj first. If that fails it is a json inside.
        var cadFileName = instance.filename + ".obj";
        //var file = zipLoader.file(cadFileName,fileHandle,{binary:true});
        var file = zipLoader.file(cadFileName);

        this.lineCAD = false;
        if (file === null) {
          this.lineCAD = true;
          cadFileName = instance.filename + ".json";
          file = zipLoader.file(cadFileName);
        }

        // zipLoader.loadAsync(fileHandle)
        // .then(function (zip) {
        //   file = zip;
        //     // will be called, even if content is corrupted
        // }, function (e) {
        //     // won't be called
        //     file = file;
        // });

        
      
        if (file !== null) {
          if (!this.lineCAD) {
            console.log("3D CAD Found");
            var cadLoader = new OBJLoader();
          
          //   zipLoader.file(cadFileName).async("string")
          //   .then(function (content) {
          //     cadLoader.buildCAD(content, function (cadData) { instance.objLoaded(cadData); });
          // });

            cadLoader.buildCAD(file.asText(), function (cadData) { instance.objLoaded(cadData); });
            console.timeEnd('CAD File Load Time (Zip)');
            return;
          }
          else {
            console.log("2D CAD Found");
            //var cadData = jQuery.parseJSON(file.asText());
            console.time('2D CAD Load Time');
           // instance.load2DCADFileComplete(cadData);
            console.timeEnd('CAD File Load Time (Zip)');
            return;
          }
        }
      
        console.log("[ERROR] Unable to read obj and json file contents for: " + instance.filename + ".zip");
        console.timeEnd('CAD File Load Time (Zip)');
      }
      
      loadCAD = function (shadingMode, url) {
        var path = url;
        var instance = this;
      
        //Is this a ZIP file? The zip file may have an OBJ or a JSON file inside.
        if (path.search(".zip") >= 0 || path.search(".ZIP") >= 0) { //This is a zip file
          console.time('CAD - Zip format found');
          //Search backwards to find the first /. 
          var fileNameLocation = 0;
          for (var i = path.length - 1; i > 0; i--) {
            if (path[i] === "/") {
              fileNameLocation = i;
              break;
            }
          }
      
          var start = fileNameLocation + 1; //Add 1 to get to the first character of the filename.
          var length = path.length - fileNameLocation - 5;
          this.filename = path.substr(start, length);// + ".obj";
      
          console.time('CAD File Load Time (Zip)');
          JSZipUtils.getBinaryContent(path, function (e, data) { instance.zipOpenedCallback(e, data); });
          return;
        }
      
        //Is this a JSON file?
        if (path.search(".json") >= 0 || path.search(".JSON") >= 0) {
          this.lineCAD = true;
          console.log("2D CAD Found");
          console.time('2D CAD Load Time');
         // jQuery.getJSON(url, function (data) { instance.load2DCADFileComplete(data); });
          return;
        }
      
        //Is this an OBJ file?
        if (path.search(".obj") >= 0 || path.search(".OBJ") >= 0) {
          this.lineCAD = false;
          console.log("3D CAD Found");
          var cadLoader = new OBJLoader();
          cadLoader.load(url, function (cadData) { instance.objLoaded(cadData); });
          return;
        }
      
        console.log("[ERROR] Unsupported CAD format at URL: " + url);
      }
      
      enableRotation = function (rotate) {
        this.rotateEnabled = rotate;
      }    
}

export default(webCAD);