
/** https://docs.mapbox.com/mapbox-gl-js/api/#customlayerinterface **/
export class MapboxLayer {
    constructor(options) {
        this.options = options;
        this.isReady = false;
        this._callbacks = [];
        this.id = options.id;
        this.renderingMode = "3d";
        this.type = "custom";
        this.mercatorCoordinate = mapboxgl.MercatorCoordinate.fromLngLat([this.options.longitude, this.options.latitude], this.options.altitude);
        this.rotationMatrix = BABYLON.Matrix.RotationX(Math.PI / 2);
        this.translateMatrix = BABYLON.Matrix.Identity().setTranslationFromFloats(this.mercatorCoordinate.x, this.mercatorCoordinate.y, this.mercatorCoordinate.z);
        let scaleFactor = this.mercatorCoordinate.meterInMercatorCoordinateUnits();
        this.scaleMatrix = BABYLON.Matrix.Scaling(scaleFactor, scaleFactor, scaleFactor);
        this.worldMatrix = this.scaleMatrix.multiply(this.rotationMatrix.multiply(this.translateMatrix));
    }

    _setupScene(scene) {
        scene.activeCamera = new BABYLON.Camera("mapbox-Camera", new BABYLON.Vector3(), scene);
        scene.autoClear = false;
        scene.detachControl();
        return scene;
    }
    _createScene(callback) {
        let res = callback.call(this, this.engine);
        if (typeof res.then === 'function') {
            res.then( (scene) => {
                this.scene = this._setupScene(scene);
                this.isReady = true;
                this._callbacks.forEach( (callback) => {
                    callback.call(this, this.scene, this.map);
                });
                this._callbacks.length = 0;
            });
        }
        else {
            this.scene = this._setupScene(res);
            this.isReady = true;
            this._callbacks.forEach( (callback) => {
                callback.call(this, this.scene, this.map);
            });
            this._callbacks.length = 0;
        }
    }

    ready(callback) {
        if (this.isReady) {
            callback.call(this, this.scene);
        }
        else {
            this._callbacks.push(callback);
        }
    }

    whenReadyAsync () {
        return new Promise( (resolve) => {
            this.ready(function () {
                resolve(this.scene);
            });
        });
    };

    pick(x, y) {
        // https://docs.mapbox.com/mapbox-gl-js/api/events/#mapmouseevent
        if (this.isReady) {
            let ray = this.scene.createPickingRay(x, y, BABYLON.Matrix.Identity(), this.scene.activeCamera);
            return this.scene.pickWithRay(ray);
        }
        else {
            throw new Error('MapboxLayer.pick() - scene is not ready');
        }
    };

    /** Mapbox Custom Layer **/

    /**
     * Called when the layer has been added to the Map. (https://docs.mapbox.com/mapbox-gl-js/api/#customlayerinterface#onadd)
     * @param map The Map this custom layer was just added to.
     * @param gl The gl context for the map.
     */
     onAdd(map, gl) {
        this.map = map;
        this.engine = new BABYLON.Engine(gl, true);
        // the only way i found to resize the engine correctly...
        window.dispatchEvent(new Event('resize'));
        this._createScene(this.options.createScene);
    };

    /**
     * Called during a render frame allowing the layer to draw into the GL context. (https://docs.mapbox.com/mapbox-gl-js/api/#customlayerinterface#render)
     * @param gl The gl context for the map
     * @param matrix The map's camera matrix. It projects spherical mercator coordinates to gl coordinates.
     */
    render(gl, matrix) {
        if (this.scene) {
            var projection = BABYLON.Matrix.FromArray(matrix);
            // @ts-ignore
            projection._m = matrix; // https://forum.babylonjs.com/t/mapbox-gl-to-babylon-camera-projection/9972/16?u=sharp
            this.projectionMatrix = this.worldMatrix.multiply(projection);
            this.scene.activeCamera.freezeProjectionMatrix(this.projectionMatrix);
            this.scene.render(false);
            this.engine.wipeCaches(true);
        }
        // https://docs.mapbox.com/mapbox-gl-js/api/#map#triggerrepaint
        this.map.triggerRepaint();
    };
}