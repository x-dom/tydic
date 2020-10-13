import * as THREE from '../../../build/three.module.js';
import { OBJLoader2 } from "../../jsm/loaders/OBJLoader2.js";
import { MtlObjBridge } from "../../jsm/loaders/obj2/bridge/MtlObjBridge.js";
import { MTLLoader } from "../../jsm/loaders/MTLLoader.js";
import { FBXLoader } from '../../jsm/loaders/FBXLoader.js';
import { GLTFLoader } from '../../jsm/loaders/GLTFLoader.js';
import { OBJLoader } from '../../jsm/loaders/OBJLoader.js';
import { Group } from "../../../build/Three.js";

var bbudata = [
  {
    name:"ABX/BBU1234",
    EQUIPMENT_COMPANY:"BBU12345678",
    BUSINESS_CENTER:"LR1303_D23_E00202",
    type:"故障",
    status:"2010-2-1",
    ENB_TYPE:"华为",
    ENB_LEVEL:"2010-2-1",
    isover:false
  },
]
//加载房间里面的模型
function loadObj(scene) {
  //加载机柜
  let objLoader = new OBJLoader2();
  let gltFloader = new GLTFLoader();
  let mtlLoader = new MTLLoader();
  let callbackOnLoad = function ( object3d ) {
    var group = new Group();
    group.name="jixiang";
    object3d.children.splice(0,16);
    // object3d.children[0].rotateY(-Math.PI/2);
    // object3d.children[0].scale.multiplyScalar(10);
    // group.add(object3d.children[0]);
    var edges = new THREE.EdgesGeometry( object3d.children[0].geometry );
    var material = new THREE.LineDashedMaterial( { color: 0x0081cf,dashSize: 0.1, gapSize:0.1} );
    var line = new THREE.LineSegments( edges, material);
    line.computeLineDistances();
    line.scale.multiplyScalar(10);
    line.rotateY(-Math.PI/2);
    group.add( line );
     //加载服务器
    gltFloader.load('./expamle/test/testglb/BBU.glb',(gltf) => {
      var model1 = gltf.scene;
      for(var i=0;i<8;i++){
        var val = model1.children[2].clone();
        var edges = new THREE.EdgesGeometry( val.geometry );
        if(bbudata[i] && bbudata[i].isover == false){
          var line = new THREE.LineSegments( edges,new THREE.LineBasicMaterial( { color: 0xf51504} ));
        }else{
          var line = new THREE.LineSegments( edges,new THREE.LineBasicMaterial( { color: 0x0af3f9} ));
        }
        line.position.set(2,10+6*i,0);
        line.rotateY(Math.PI/2);
        line.name="bbu";
        line.bbudata = bbudata[i] || "";
        line.scale.multiplyScalar(5);
        group.add(line);
      }
      group.position.set(410,2,398);
      darwDoor(scene,group);
    })
  };
  let onLoadMtl = function ( mtlParseResult ) {
    // objLoader.setLogging( true, true );
    objLoader.addMaterials( MtlObjBridge.addMaterialsFromMtlLoader( mtlParseResult ), true );
    objLoader.load( './expamle/test/testglb/model/rack.obj', callbackOnLoad, null, null, null );
  };
  mtlLoader.load( './expamle/test/testglb/model/rack.mtl', onLoadMtl );
  //加载灭火器
  loadFireAnnihilator(scene);
  //加载空调
  loadairConditioning(scene);
  //加载机架
  loadRackmeshine(scene) ;
  //加载开关
  loadSwitch(scene)
}
//画机柜门
function darwDoor(scene,groupAll){
  let objLoader = new OBJLoader2();
  let mtlLoader = new MTLLoader();
  var group = new Group();
  let callbackOnLoad = function ( object3d ) {
    object3d.scale.multiplyScalar(0.7);
    object3d.position.set(-13,5,0);
    group.add(object3d);
    groupAll.add(group);
    var groupClone = groupAll.clone();
    groupClone.position.set(435,2,398);
    scene.add(groupAll);
    scene.add(groupClone);
  }
  let onLoadMtl = function ( mtlParseResult ) {
    // objLoader.setLogging( true, true );
    objLoader.addMaterials( MtlObjBridge.addMaterialsFromMtlLoader( mtlParseResult ), true );
    objLoader.load( './expamle/test/testglb/doorkonb.obj', callbackOnLoad, null, null, null );
  };
  mtlLoader.load( './expamle/test/testglb/doorkonb.mtl', onLoadMtl );
  var material = new THREE.MeshBasicMaterial({
    color : 0x111111,
    transparent : true,
    opacity : 0.4
  });
  var geometry1 = new THREE.BoxBufferGeometry( 16, 50, 1 );
  var mesh1 = new THREE.Mesh( geometry1, material );
  mesh1.position.set(-8,0,0);
  group.add(mesh1);
  group.position.set(8,26,10);
  group.name="galssDoor";
}
//加载灭火器
function loadFireAnnihilator(scene) {
  let objLoader = new OBJLoader2();
  let mtlLoader = new MTLLoader();
  let callbackOnLoad = function ( object3d ) {
    var model = object3d.children[0];
    for(var i=0;i<3;i++){
      var val = model.clone();
      val.position.set(300,2,405+i*10);
      val.rotateX(-Math.PI/2);
      val.scale.multiplyScalar(0.3);
      val.name="miehuoqi";
      val.material = new THREE.MeshPhongMaterial( { color: 0xff0000 } );
      scene.add(val);
      // var edges = new THREE.EdgesGeometry( val.geometry );
      // var line = new THREE.LineSegments( edges,new THREE.LineDashedMaterial( { color: 0x0081cf,dashSize: 5, gapSize:3} ));
      // line.computeLineDistances();
      // line.position.set(300,2,405+i*10);
      // line.rotateX(-Math.PI/2);
      // line.scale.multiplyScalar(0.3);
      // line.name="miehuoqi";
      // scene.add(line);
    }
    
  }
  let onLoadMtl = function ( mtlParseResult ) {
    // objLoader.setLogging( true, true );
    objLoader.addMaterials( MtlObjBridge.addMaterialsFromMtlLoader( mtlParseResult ), true );
    objLoader.load( './expamle/test/testglb/model/fire.obj', callbackOnLoad, null, null, null );
  };
  mtlLoader.load( './expamle/test/testglb/model/fire.mtl', onLoadMtl );
}
//加载空调
function loadairConditioning(scene) {
  let objLoader = new OBJLoader2();
  let mtlLoader = new MTLLoader();
  let callbackOnLoad = function ( object3d ) {
    var group = new THREE.Group();
    var model = object3d;
    model.name="kongtiao";
    for(var i=0;i<model.children.length;i++){
      var edges = new THREE.EdgesGeometry( model.children[i].geometry );
      var material = new THREE.LineDashedMaterial( { color: 0x0081cf,dashSize: 5, gapSize: 3} );
      var line = new THREE.LineSegments( edges, material);
      line.computeLineDistances();
      group.add( line );
    }
    group.rotateX(-Math.PI/2);
    group.position.set(300,4,350);
    group.scale.multiplyScalar(1);
    scene.add(group);
  }
  let onLoadMtl = function ( mtlParseResult ) {
    // objLoader.setLogging( true, true );
    objLoader.addMaterials( MtlObjBridge.addMaterialsFromMtlLoader( mtlParseResult ), true );
    objLoader.load( './expamle/test/testglb/model/aircon.obj', callbackOnLoad, null, null, null );
  };
  mtlLoader.load( './expamle/test/testglb/model/aircon.mtl', onLoadMtl );
}
//加载开关
function loadSwitch(scene) {
  let objLoader = new OBJLoader();
  objLoader.load( './expamle/test/testglb/model/switch.obj', function ( obj ) {
    obj.scale.multiplyScalar(3);
    obj.rotateX(Math.PI/2);
    obj.rotateZ(Math.PI/2);
    obj.position.set(445,50,430);
    obj.name="kaiguan";
    var model = obj.clone();
    model.position.set(445,50,435);
    scene.add(obj);
    scene.add(model);
  });
  let loader = new GLTFLoader();
      loader.load('./expamle/test/testglb/battery.glb',(gltf) => {
        var group = new THREE.Group();
        for(var i=0;i<gltf.scene.children.length;i++){
          var model = gltf.scene.children[i];
          model.name="xudian";
          var edges = new THREE.EdgesGeometry( model.geometry );
          var line = new THREE.LineSegments( edges,new THREE.LineBasicMaterial( { color: 0x0081cf} ));
          group.add(line);
        }
        group.scale.multiplyScalar(15);
        group.position.set(355,8,435);
        var modelone = group.clone();
        modelone.position.set(400,8,435);
        scene.add(modelone);
        scene.add(group);
      })
}
//加载机架以及服务器
function loadRackmeshine(scene) {
  //var loader = new FBXLoader();
  let gltFloader = new GLTFLoader();
  // loader.load( './expamle/test/testglb/storageRack.fbx', function ( object ) {
  //   console.log(object)
  //   var model = object.children[4];
  //   model.name="jijia";
  //   model.scale.multiplyScalar(0.10);
  //   model.rotateY(-Math.PI/2);
  //   model.position.set(380,13,405);
  //   var obj = model.clone();
  //   obj.position.set(380,33,405);
  //   scene.add(obj);
  //   scene.add( model );
  //   //加载服务器
  //   gltFloader.load('./expamle/test/testglb/BBU.glb',(gltf) => {
  //     var model1 = gltf.scene;
  //     for(var i=0;i<3;i++){
  //       var val = model1.children[2].clone();
  //       var edges = new THREE.EdgesGeometry( val.geometry );
  //       var line = new THREE.LineSegments( edges,new THREE.LineBasicMaterial( { color: 0x0af3f9} ));
  //       line.position.set(382,20+10*i,405);
  //       line.rotateY(Math.PI/2);
  //       line.name="bbu";
  //       line.bbudata = bbudata[i] || "";
  //       line.scale.multiplyScalar(5);
  //       scene.add(line);
  //     }
  //   })
  //   gltFloader.load('./expamle/test/testglb/2t2r_rru.glb',(gltf) => {
  //     var model = gltf.scene;
  //     model.name="chuanshu"
  //     var edges = new THREE.EdgesGeometry( model.children[0].geometry );
  //     var line = new THREE.LineSegments( edges,new THREE.LineBasicMaterial( { color: 0x0af3f9} ));
  //     line.scale.multiplyScalar(1.5);
  //     line.rotateZ(-Math.PI/2);
  //     line.position.set(373,7,405);
  //     scene.add( line );
  //   })
  // })
  let objLoader = new OBJLoader2();
  let mtlLoader = new MTLLoader();
  let onLoadMtl = function ( mtlParseResult ) {
    // objLoader.setLogging( true, true );
    objLoader.addMaterials( MtlObjBridge.addMaterialsFromMtlLoader( mtlParseResult ), true );
    objLoader.load( './expamle/test/testglb/model/rack.obj', callbackOnLoad, null, null, null );
  };
  mtlLoader.load( './expamle/test/testglb/model/rack.mtl', onLoadMtl );
  let callbackOnLoad = function ( object3d ) {
    object3d.children.splice(0,16);
    var edges = new THREE.EdgesGeometry( object3d.children[0].geometry );
    var material = new THREE.LineDashedMaterial( { color: 0x0081cf,dashSize: 0.1, gapSize:0.1} );
    var line = new THREE.LineSegments( edges, material);
    line.computeLineDistances();
    line.scale.multiplyScalar(9);
    line.name="jixiang";
    line.rotateY(-Math.PI/2);
    line.position.set(380,0,405);
    scene.add( line );
    //加载服务器
    gltFloader.load('./expamle/test/testglb/BBU.glb',(gltf) => {
      var model1 = gltf.scene;
      for(var i=0;i<3;i++){
        var val = model1.children[2].clone();
        var edges = new THREE.EdgesGeometry( val.geometry );
        var line = new THREE.LineSegments( edges,new THREE.LineBasicMaterial( { color: 0x0af3f9} ));
        line.position.set(382,20+10*i,405);
        line.rotateY(Math.PI/2);
        line.name="bbu";
        line.bbudata = bbudata[i] || "";
        line.scale.multiplyScalar(5);
        scene.add(line);
      }
    })
    gltFloader.load('./expamle/test/testglb/2t2r_rru.glb',(gltf) => {
      var model = gltf.scene;
      model.name="chuanshu";
      var edges = new THREE.EdgesGeometry( model.children[2].geometry );
      var line = new THREE.LineSegments( edges,new THREE.LineBasicMaterial( { color: 0x0af3f9} ));
      line.scale.multiplyScalar(1.5);
      line.rotateZ(-Math.PI/2);
      line.position.set(375,7,405);
      scene.add( line );
    })
  }
}

export {loadObj}