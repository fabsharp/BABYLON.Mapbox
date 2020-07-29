// https://playground.babylonjs.com/#CQNGRK#0
function createScene(engine) {
    var scene = new BABYLON.Scene(engine);
    var light = new BABYLON.HemisphericLight("dir01", new BABYLON.Vector3(0, 1, 0), scene);
    light.intensity = 0.1;
    // spot
    var spotLight = new BABYLON.SpotLight("spot02", new BABYLON.Vector3(30, 40, 30), new BABYLON.Vector3(-1, -2, -1), 1.1, 16, scene);
    spotLight.projectionTexture = new BABYLON.Texture("textures/co.png", scene);
    spotLight.setDirectionToTarget(BABYLON.Vector3.Zero());
    spotLight.intensity = 1.5;
    // Ground
    var ground = BABYLON.Mesh.CreateGroundFromHeightMap("ground", "textures/heightMap.png", 100, 100, 100, 0, 10, scene, false);
    var groundMaterial = new BABYLON.StandardMaterial("ground", scene);
    groundMaterial.diffuseTexture = new BABYLON.Texture("textures/ground.jpg", scene);
    // @ts-ignore
    groundMaterial.diffuseTexture.uScale = 6;
    // @ts-ignore
    groundMaterial.diffuseTexture.vScale = 6;
    groundMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
    ground.position.y = -2.05;
    ground.material = groundMaterial;
    // Animations
    var alpha = 0;
    scene.registerBeforeRender(function () {
        spotLight.position = new BABYLON.Vector3(Math.cos(alpha) * 60, 40, Math.sin(alpha) * 60);
        spotLight.setDirectionToTarget(BABYLON.Vector3.Zero());
        alpha += 0.01;
    });
    return scene;
}
export default {
    id: 'light-projected-layer',
    createScene: createScene,
    longitude: 148.9819,
    latitude: -35.39847,
    altitude: 1
};