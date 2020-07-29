import {MapboxLayer} from "./MapboxLayer.js";

import BasicScene from "./examples/BasicScene.js";
import GLTF from "./examples/GLTF.js";
import LightProjectedTexture from "./examples/LightProjectedTexture.js";
import Cannon from "./examples/Cannon.js";
import Materials from "./examples/Materials.js";
import PBR from "./examples/PBR.js";
import Shadow from "./examples/Shadow.js";

BABYLONDEVTOOLS.Loader.load(() => {
    let basicSceneLayer = new MapboxLayer(BasicScene);
    let gltfLayer = new MapboxLayer(GLTF);
    let lightProjectedTexture =  new MapboxLayer(LightProjectedTexture);
    let cannonLayer = new MapboxLayer(Cannon);
    let materialsLayer = new MapboxLayer(Materials);
    let pbrLayer = new MapboxLayer(PBR);
    let shadowLayer = new MapboxLayer(Shadow);

    mapboxgl.accessToken = 'pk.eyJ1IjoiZmFic2hhcnAiLCJhIjoiY2pkb2JmaHZ2MG5laTMycXV6MW9hbnR6biJ9.UMH3HUf54_y7l-2YpeE8oA';
    const center =  [148.9819, -35.3981];
    const map = (window.map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/fabsharp/ck83o029b0leg1in2dnbl7fcm',
        zoom: 18 ,
        center : center,
        pitch: 60,
        antialias: true,
        hash:true
    }));

    let currentLayer = basicSceneLayer;
    map.on("load", function() {
        map.addLayer(currentLayer);
    });

    map.on("click", (e) => {
        if(currentLayer.isReady) {
            let pickInfo = currentLayer.pick(e.point.x, e.point.y);
            if(pickInfo.pickedMesh) {
                console.log("mesh picked ", pickInfo.pickedMesh.name);
            }
        }
    });


    /** DropDown + DebugLayer **/

    const debugLayer = document.querySelector("#debug-layer");
    debugLayer.addEventListener('change', () => {
        debugLayer.checked ?  showDebugLayer() : hideDebugLayer();
    });

    document.querySelector('#scene-selector').addEventListener('change', (event) => {
        if(currentLayer) {
            hideDebugLayer();
            map.removeLayer(currentLayer.id);
        }
        switch(event.target.value) {
            case "basic-scene-layer":
                currentLayer = basicSceneLayer;
                map.addLayer(basicSceneLayer);
                break;
            case "gltf-layer":
                currentLayer = gltfLayer;
                map.addLayer(gltfLayer);
                break;
            case "light-projected-layer":
                currentLayer = lightProjectedTexture;
                map.addLayer(lightProjectedTexture);
                break;
            case "picking-layer":
                currentLayer = cannonLayer;
                map.addLayer(cannonLayer);
                break;
            case "materials-layer":
                currentLayer = materialsLayer;
                map.addLayer(materialsLayer);
                break;
            case "pbr-layer":
                currentLayer = pbrLayer;
                map.addLayer(pbrLayer);
                break;
            case "shadow-layer":
                currentLayer = shadowLayer;
                map.addLayer(shadowLayer);
                break;
        }
        if(debugLayer.checked) {
            currentLayer.ready(() => {
                showDebugLayer();
            });
        }
    });


    function showDebugLayer() {
        currentLayer.scene.debugLayer.show({
            overlay:true
        }).then(() => {
            document.querySelector("#scene-explorer-host").addEventListener("mouseenter", mouseEnter);
            document.querySelector("#inspector-host").addEventListener("mouseenter", mouseEnter);
            document.querySelector("#scene-explorer-host").addEventListener("mouseleave", mouseLeave);
            document.querySelector("#inspector-host").addEventListener("mouseleave", mouseLeave);
        })
    }

    function hideDebugLayer() {
        if(currentLayer.scene.debugLayer.isVisible()) {
            document.querySelector("#scene-explorer-host").removeEventListener("mouseenter", mouseEnter);
            document.querySelector("#inspector-host").removeEventListener("mouseenter", mouseEnter);
            document.querySelector("#scene-explorer-host").removeEventListener("mouseleave", mouseLeave);
            document.querySelector("#inspector-host").removeEventListener("mouseleave", mouseLeave);
            currentLayer.scene.debugLayer.hide();
        }
    }

    function mouseEnter() {
        map.doubleClickZoom.disable();
        map.keyboard.disable();
        map.scrollZoom.disable();
        map.dragPan.disable();
    }

    function mouseLeave() {
        map.doubleClickZoom.enable();
        map.keyboard.enable();
        map.scrollZoom.enable();
        map.dragPan.enable();
    }
});