function createScene(engine) {
    // the engine will be created by the MapboxLayer
    var scene = new BABYLON.Scene(engine);
    var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);
    light.intensity = 0.7;
    var sphere = BABYLON.Mesh.CreateSphere("sphere1", 16, 2, scene);
    sphere.position.y = 1;
    var ground = BABYLON.Mesh.CreateGround("ground1", 6, 6, 2, scene);
    return scene;
}
export default {
    id: 'basic-scene-layer',
    createScene: createScene,
    longitude: 148.9819,
    latitude: -35.39847,
    altitude: 1,
};