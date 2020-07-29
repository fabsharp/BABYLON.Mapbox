function createScene(engine) {
    return BABYLON.SceneLoader.LoadAsync('https://raw.githubusercontent.com/PirateJC/assets/master/pirateFort/cannon.glb', '', engine).then(function (scene) {
        var dirLight = new BABYLON.DirectionalLight("dirLight", new BABYLON.Vector3(0.25, -1, -1), scene);
        dirLight.intensity = 1.5;
        return scene;
    });
}
export default {
    id: 'picking-layer',
    createScene: createScene,
    longitude: 148.9819,
    latitude: -35.39847,
    altitude: 1,
};