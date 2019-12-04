import React , { Component }from 'react';
import logo from './logo.svg';

import './App.css';
import ThreeBim from './ThreeBim';
import ThreeMap from './ThreeMap';
import cadView from './components/CADView/cadView';
import cadFeatureInfo from './components/CADView/cadFeatureInfo';
import featureInfo from './components/CADView/featureInfo';
import cadInfo from './components/CADView/cadInfo';
import * as THREE from 'three';
import './styles/scss/demo.scss';
import { throwStatement } from '@babel/types';

class Demo extends Component{
constructor(props){
  super(props);
  this.state={
    cadEngine: new cadView(console),
    cFeatureInfo:new cadFeatureInfo(),
    featureList:[],
    foregroundLocation:3,
    xMove : 0,
    yMove : 0
  }
}

componentDidMount(){
  //this.cadViewStart();
  this.hood();
}
  

cadViewStart =()=> {
  var cadEngine = new cadView(console);
  var cFeatureInfo = new cadFeatureInfo();
  var featureList = [];
  var foregroundLocation = 3;

  var xMove = 0;
  var yMove = 0;

  var getThemeName = function () {
    var name = null;

    //name = '#CADEngineSettingsDark';
    name = '#CADEngineSettingsLight';

    return name;
  }

  function xPlus() {
    cadEngine.cadRotateX(45);
  }

  function xMinus() {
    cadEngine.cadRotateX(-45);
  }

  function yPlus() {
    cadEngine.cadRotateY(45);
  }

  function yMinus() { cadEngine.cadRotateY(-45); }
  function zPlus() { cadEngine.cadRotateZ(45); }
  function zMinus() { cadEngine.cadRotateZ(-45); }

  function translateBackgroundXPlus() {
    cadEngine.translateBackground(10, 0);
    xMove++;
  }
  function translateBackgroundXMinus() {
    cadEngine.translateBackground(-10, 0);
    xMove--;
  }
  function translateBackgroundYPlus() {
    cadEngine.translateBackground(0, 10);
    yMove++;
  }
  function translateBackgroundYMinus() {
    cadEngine.translateBackground(0, -10);
    yMove--;
  }

  function rotateBackgroundPlus() { cadEngine.rotateBackground(90); }
  function rotateBackgroundMinus() { cadEngine.rotateBackground(-90); }

  function toggleBackgroundScale() {
    cadEngine.toggleBackgroundScale();
  }

  function zoomBackgroundPlus() { cadEngine.zoomBackground(100); }
  function zoomBackgroundMinus() { cadEngine.zoomBackground(-100); }

  //Center=0, UL=1, UR=2, LL=3, LR=4
  function setForegroundLocation() {
    if (foregroundLocation === 0) {
      cadEngine.setForegroundLocationCentered(false);
    }

    if (foregroundLocation === 1) {
      cadEngine.setForegroundLocationUL();
    }

    if (foregroundLocation === 2) {
      cadEngine.setForegroundLocationUR();
    }

    if (foregroundLocation === 3) {
      cadEngine.setForegroundLocationLL();
    }

    if (foregroundLocation === 4) {
      cadEngine.setForegroundLocationLR();
    }

    foregroundLocation++;

    if (foregroundLocation > 4) {
      foregroundLocation = 0;
    }
  }

  
  function toggleBackground() {
    cadEngine.toggleBackground();
  }

  function toggleForeground() {
    cadEngine.toggleForeground();
  }

  
  function toggleForegroundScaleToWindow() {
    cadEngine.toggleForegroundScaleToWindow();
  }

  function loadChart() {
    //var imageURL =
    //  "/CADViewEngine/Data/Images/QDAS/WLS-VOD-HEXLIVE-VOD-POINT-1.Dir.X [Actual value chart with automatically deleted outliers].bmp";

    

    //cadEngine.loadChart(imageURL);
  }

  function clearChart() {
    //cadEngine.clearChart();
  }


  
}

hood() {
  this.state.cadEngine.end();
  this.setState({featureList : []})

  this.start('/Data/Models/3D/Hood.zip');

  this.addFeature("HOOD-POINT-02", new THREE.Vector3(-159, 213, 689));
  this.addFeature("HOOD-POINT-01", new THREE.Vector3(305, 514, 91));
  this.addFeature("R-Light-01", new THREE.Vector3(647.26, 582.26, 39.9));
  this.addFeature("R-Light-02", new THREE.Vector3(546, 569, 75));
}

addFeature(name, location) {
  var feature = new featureInfo();
  feature.setName(name);
  feature.setLocation(location);
  feature.setDirection(new THREE.Vector3(0, 0, 1));
  feature.setColor(new THREE.Color(0x00ff00));
  let featureList=[];
  featureList.push(feature);
  this.setState({featureList:featureList});
}

start(cadFile) {
  var info = new cadInfo();
  info.name = 'Demo1';
  info.url = cadFile;
  let cadEngine = this.state.cadEngine;
  cadEngine.start(info);

  

  var backgroundColor ="0xd4d4d4";
  var globalLightColor = "0xFF0000";
  var frontLightColor = "0xffffff";
  var backLightColor = "0xffffff";
  var cadColor = "0x0000ff";
  var edgeLineColor = "0x000000";
  var defaultColor = "0x00ffff";
  var hoverColor = "0xff00ff";
  var selectedColor = "0xffff00";
  var leaderLineColor = "rgb(0, 0, 0)";
  var leaderLineSize = "2";
  var leaderLineDefaultLength = "200";

  cadEngine.setGlobalLightColor(globalLightColor);
  cadEngine.setFrontLightColor(frontLightColor);
  cadEngine.setBackLightColor(backLightColor);
  cadEngine.setBackgroundColor(backgroundColor);
  cadEngine.setCADColor(cadColor);
  cadEngine.setHoverColor(hoverColor);
  cadEngine.setSelectedColor(selectedColor);
  cadEngine.setLeaderLineColor(leaderLineColor);
  cadEngine.setLeaderLineSize(leaderLineSize);
  cadEngine.setLeaderLineDefaultLength(leaderLineDefaultLength);

  cadEngine.enableFPS(true);

  var featureDistance = 80;
  let cFeatureInfo= this.state.cFeatureInfo;
  let featureList = this.state.featureList;
  cFeatureInfo.setFeatures(featureList);
  cadEngine.setFeatureInfo(cFeatureInfo);

  cadEngine.setCameraTarget("CIR1");

  

  cadEngine.setForeground("Data/Images/Hexagon_AB_Logo_Color - Small.png");
  cadEngine.setForegroundLocationUR();

  cadEngine.enableForegroundScaleToWindow(true);
  cadEngine.setForegroundScaleToWindowPercent(0.3);


}


tail() {
  this.state.cadEngine.end();
  this.setState({featureList : []});
  this.start('Data/Models/3D/Tail.zip');
}

sidePlastic() {
  this.state.cadEngine.end();
  this.setState({featureList : []});
  this.start('Data/Models/3D/Side Plastic new R.zip');	
}

rearLight() {
  this.state.cadEngine.end();
  this.setState({featureList : []});
  this.start('Data/Models/3D/Rear Light Plastic.zip');
}	

cylinderHead() {
  this.state.cadEngine.end();
  this.setState({featureList : []});

  this.start('Data/Models/3D/cyl_head_reg__exported.zip');
}

camShaft() {
  this.state.cadEngine.end();
  this.setState({featureList : []});

  this.start('Data/Models/3D/cam_shaft__.zip');
}

fPlate() {
  this.state.cadEngine.end();
  this.setState({featureList : []});

  this.start('Data/Models/3D/f_plate__.zip');
}

lCover() {
  this.state.cadEngine.end();
  this.setState({featureList : []});

  this.start('Data/Models/3D/l_cover__.zip');
}

rockerArm() {
  this.state.cadEngine.end();
  this.setState({featureList : []});

  this.start('Data/Models/3D/rocker_arm__.zip');
}

rockerArmBolt() {
  this.state.cadEngine.end();
  this.setState({featureList : []})

  this.start('Data/Models/3D/rocker_arm_bolt__.zip');
}

setTexture()
{
  this.state.cadEngine.toggleTexture();
}


toggleWireframe() {
  this.state.cadEngine.toggleWireframe();
}

toggleTransparency() {
  this.state.cadEngine.toggleTransparency();
}

setFrontView() {
  this.state.cadEngine.setFrontView();
}

setIsoView() {
  this.state.cadEngine.setIsoView();
}

setLeftView() {
  this.state.cadEngine.setLeftView();
}

setBackView() {
  this.state.cadEngine.setBackView();
}

setRightView() {
  this.state.cadEngine.setRightView();
}

setTopView() {
  this.state.cadEngine.setTopView();
}

setBottomView() {
  this.state.cadEngine.setBottomView();
}

scaleToFit() {
  this.state.cadEngine.scaleToFit();
}

saveScreenshot() {
  this.state.cadEngine.saveScreenshot();
}


//-------
xPlus() {
  this.state.cadEngine.cadRotateX(45);
}

xMinus() {
  this.state.cadEngine.cadRotateX(-45);
}

yPlus() {
  this.state.cadEngine.cadRotateY(45);
}

yMinus() { this.state.cadEngine.cadRotateY(-45); }
zPlus() { this.state.cadEngine.cadRotateZ(45); }
zMinus() { this.state.cadEngine.cadRotateZ(-45); }

translateBackgroundXPlus() {
  this.state.cadEngine.translateBackground(10, 0);
  let xMove= this.state.xMove;
  xMove++;
  this.setState({xMove:xMove});
}
translateBackgroundXMinus() {
  this.state.cadEngine.translateBackground(-10, 0);
  let xMove= this.state.xMove;
  xMove--;
  this.setState({xMove:xMove});
}

translateBackgroundYPlus() {
  this.state.cadEngine.translateBackground(0, 10);
  let yMove= this.state.yMove;
  yMove++;
  this.setState({yMove:yMove});
}

translateBackgroundYMinus() {
  this.state.cadEngine.translateBackground(0, -10);
  let yMove= this.state.yMove;
  yMove--;
  this.setState({yMove:yMove});
}

rotateBackgroundPlus() { this.state.cadEngine.rotateBackground(90); }
rotateBackgroundMinus() { this.state.cadEngine.rotateBackground(-90); }

toggleBackgroundScale() {
  this.state.cadEngine.toggleBackgroundScale();
}

zoomBackgroundPlus() { this.state.cadEngine.zoomBackground(100); }
zoomBackgroundMinus() { this.state.cadEngine.zoomBackground(-100); }

//Center=0, UL=1, UR=2, LL=3, LR=4
setForegroundLocation() {
  let foregroundLocation=this.state.foregroundLocation;

  if (foregroundLocation === 0) {
    this.state.cadEngine.setForegroundLocationCentered(false);
  }

  if (foregroundLocation === 1) {
    this.state.cadEngine.setForegroundLocationUL();
  }

  if (foregroundLocation === 2) {
    this.state.cadEngine.setForegroundLocationUR();
  }

  if (foregroundLocation === 3) {
    this.state.cadEngine.setForegroundLocationLL();
  }

  if (foregroundLocation === 4) {
    this.state.cadEngine.setForegroundLocationLR();
  }


  foregroundLocation++;

  if (this.state.foregroundLocation > 4) {
    foregroundLocation = 0;
  }
  this.setState({foregroundLocation:foregroundLocation});
}


toggleBackground() {
  this.state.cadEngine.toggleBackground();
}

toggleForeground() {
  this.state.cadEngine.toggleForeground();
}


toggleForegroundScaleToWindow() {
  this.state.cadEngine.toggleForegroundScaleToWindow();
}

loadChart() {
  //var imageURL =
  //  "/CADViewEngine/Data/Images/QDAS/WLS-VOD-HEXLIVE-VOD-POINT-1.Dir.X [Actual value chart with automatically deleted outliers].bmp";

  //cadEngine.loadChart(imageURL);
}

clearChart() {
  //cadEngine.clearChart();
}



render(){
  const style1={
      top: 10 ,
      left: 15,
      width: '100%'  ,
      marginleft: 15,
      margintop: 10,
      marginbottom: 10,
      position:'inherit'
  }

  const style2={
    top: 30 ,
    left: 15,
    width: '100%' ,
    marginleft: 15,
    margintop: 10,
    marginbottom: 10,
    position:'inherit'
  }
    
      
  

  return (
      // <div className="App">
      //   <div className="App-header">
      //     <img src={logo} className="App-logo" alt="logo" />
      //   </div>
      //   <div>
      //       <ThreeMap/>
      //       <ThreeBim/>
      //   </div>
      // </div>
   

    <div>
      <div id="CADAPI"  style = {style1}>
        <button id="HoodButton" className="btn btn-default sidebar_toggle" type="button" onClick={this.hood.bind(this)}>Hood</button>
        <button id="TailButton" className="btn btn-default sidebar_toggle" type="button" onClick={this.tail.bind(this)}>Tail</button>
        <button id="SidePlasticButton" className="btn btn-default sidebar_toggle" type="button" onClick={this.sidePlastic.bind(this)}>Side Plastic</button>
        <button id="RearLightButton" className="btn btn-default sidebar_toggle" type="button" onClick={this.rearLight.bind(this)}>Rear Light</button>
        <button id="CylinderHeadButton" className="btn btn-default sidebar_toggle" type="button" onClick={this.cylinderHead.bind(this)}>Cylinder Head Assembly</button>
        <button id="CamShaftButton" className="btn btn-default sidebar_toggle" type="button" onClick={this.camShaft.bind(this)}>Cam Shaft</button>
        <button id="FPlateButton" className="btn btn-default sidebar_toggle" type="button" onClick={this.fPlate.bind(this)}>F Plate</button>
        <button id="LCoverButton" className="btn btn-default sidebar_toggle" type="button" onClick={this.lCover.bind(this)}>L Cover</button>
        <button id="RockerArmButton" className="btn btn-default sidebar_toggle" type="button" onClick={this.rockerArm.bind(this)}>Rocker Arm</button>
        <button id="RockerArmBoltButton" className="btn btn-default sidebar_toggle" type="button" onClick={this.rockerArmBolt.bind(this)}>Rocker Arm Bolt</button>
      </div>


      <div id="CADAPI2" style = {style2}>
        <button id="WireframeButton" className="btn btn-default sidebar_toggle" type="button" onClick={this.toggleWireframe.bind(this)}>Wireframe</button>
        <button id="TransparencyButton" className="btn btn-default sidebar_toggle" type="button" onClick={this.toggleTransparency.bind(this)}>Transparency</button>
        <button id="ScaleToFitButton" className="btn btn-default sidebar_toggle" type="button" onClick={this.scaleToFit.bind(this)}>Scale</button>
        <button id="FrontButton" className="btn btn-default sidebar_toggle" type="button" onClick={this.setFrontView.bind(this)}>Front</button>
        <button id="IsoButton" className="btn btn-default sidebar_toggle" type="button" onClick={this.setIsoView.bind(this)}>Iso</button>
        <button id="LeftButton" className="btn btn-default sidebar_toggle" type="button" onClick={this.setLeftView.bind(this)}>Left</button>
        <button id="BackButton" className="btn btn-default sidebar_toggle" type="button" onClick={this.setBackView.bind(this)}>Back</button>
        <button id="RightButton" className="btn btn-default sidebar_toggle" type="button" onClick={this.setRightView.bind(this)}>Right</button>
        <button id="TopButton" className="btn btn-default sidebar_toggle" type="button" onClick={this.setTopView.bind(this)}>Top</button>
        <button id="BottomButton" className="btn btn-default sidebar_toggle" type="button" onClick={this.setBottomView.bind(this)}>Bottom</button>
        <button id="ScreenshotButton" className="btn btn-default sidebar_toggle" type="button" onClick={this.saveScreenshot.bind(this)}>Screenshot</button>
        <button id="SetTextureButton" className="btn btn-default sidebar_toggle" type="button" onClick={this.setTexture.bind(this)}>Texture</button>
      </div>

      <div id="cadModelDiv" className="col-md-6-cad">
      <div id="CadModelContainer">
      <div id="FeatureLabelContainer"></div>
      <div id="FeatureLabelTooltipContainer"></div>
      <div id="xAxisLabelContainer"></div>
      <div id="yAxisLabelContainer"></div>
      <div id="zAxisLabelContainer"></div>
      <div id="fpsLabelContainer"></div>
      <canvas id="Overlay"></canvas>
      <div id="CADEngineSettingsLight"
        data-backgroundcolor="0xd4d4d4"
        data-globallightcolor="0xFF0000"
        data-frontlightcolor="0xffffff"
        data-backlightcolor="0xffffff"
        data-cadcolor="0x0000ff"
        data-edgelinecolor="0x000000"
        data-defaultcolor="0x00ffff"
        data-hovercolor="0xff00ff"
        data-selectedcolor="0xffff00"
        data-leaderlinecolor="rgb(0, 0, 0)"
        data-leaderlinesize="2"
        data-leaderlinedefaultlength="200">
      </div>

      <div id="CADEngineSettingsDark"
        data-backgroundcolor="0x3f545a"
        data-globallightcolor="0x0000FF"
        data-frontlightcolor="0xffffff"
        data-backlightcolor="0xffffff"
        data-cadcolor="0x0000ff"
        data-edgelinecolor="0x000000"
        data-defaultcolor="0x00ffff"
        data-hovercolor="0xff00ff"
        data-selectedcolor="0xffff00"
        data-leaderlinecolor="rgb(0, 0, 0)"
        data-leaderlinesize="2"
        data-leaderlinedefaultlength="200">
      </div>
      </div>  
    </div>
  </div>
  );
  }
}

export default Demo;
