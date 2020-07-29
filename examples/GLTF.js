function createScene(engine) {
    // if you return a Promise in createScene, MapboxLayer will wait for resolve
    return BABYLON.SceneLoader.LoadAsync('https://docs.mapbox.com/mapbox-gl-js/assets/34M_17/34M_17.gltf', '', engine).then(function (scene) {
        new BABYLON.DirectionalLight("DirectionalLight", new BABYLON.Vector3(0, -70, 100), scene);
        new BABYLON.DirectionalLight("DirectionalLight2", new BABYLON.Vector3(0, 70, 100), scene);
        return scene;
    });
}
export default {
    id: 'gltf-layer',
    createScene: createScene,
    longitude: 148.9819,
    latitude: -35.39847,
    altitude: 1,
};