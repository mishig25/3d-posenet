import * as BABYLON from 'babylonjs';

export default class GraphicsEngine {

    constructor(_canvas, _joints){
        this.canvas = _canvas;
        this.engine = new BABYLON.Engine(this.canvas, true);
        this.engine.displayLoadingUI();
        this.engine.loadingUIText = "Bablyon 3D Loading ...";
        this.joints = _joints;
        this.initScene();
        this.engine.hideLoadingUI();
    }

    initScene(){
        this.scene = new BABYLON.Scene(this.engine);
        const camera = this.setCamera();
        // this.setSkybox();
        const sphere = BABYLON.MeshBuilder.CreateSphere('', { diameter: .0001 }, this.scene);

        BABYLON.SceneLoader.ImportMesh("", "/dist/Scenes/Dude/", "Dude.babylon", this.scene, (newMeshes, particleSystems, skeletons) => {

            var mesh = newMeshes[0];
            var skeleton = skeletons[0];
            mesh.scaling = new BABYLON.Vector3(0.1, 0.1, 0.1);
            mesh.position = new BABYLON.Vector3(0, 0, 0);

            // var animation = this.scene.beginAnimation(skeletons[0], 1, 100, true, 1.0);

            var head_bone = skeleton.bones[7];
            var chest_bone = skeleton.bones[3];
            var right_shoulder_bone = skeleton.bones[13];
            var right_arm_bone = skeleton.bones[14];
            var left_shoulder_bone = skeleton.bones[32];
            var left_arm_bone = skeleton.bones[33];

            var lookAtCtl = new BABYLON.BoneLookController(mesh, head_bone, sphere.position, { adjustYaw: Math.PI * .5, adjustRoll: Math.PI * .5 });

            var boneAxesViewer = new BABYLON.Debug.BoneAxesViewer(this.scene, left_shoulder_bone, mesh);

            this.scene.registerBeforeRender(() => {

                const { data } = this.joints;

                sphere.position.x = 0 + data.head.x;
                sphere.position.y = 6 + data.head.y;
                sphere.position.z = 5;

                lookAtCtl.update();

                right_shoulder_bone.rotation = new BABYLON.Vector3(0, 1.5 * data.rightShoulder, 0);
                right_arm_bone.rotation = new BABYLON.Vector3(0, data.rightElbow, 0);
                left_shoulder_bone.rotation = new BABYLON.Vector3(0, -1.5 * data.leftShoulder, 0);
                left_arm_bone.rotation = new BABYLON.Vector3(0, -data.leftElbow, 0);


                boneAxesViewer.update();

            });
        });
    };

    render(){
        var self = this;
        this.engine.runRenderLoop(() => {
            const self = this;
            if(self.scene) self.scene.render();
        });
    }

    setCamera(){
        const camera = new BABYLON.ArcRotateCamera("camera", 0, 1, 20, BABYLON.Vector3.Zero(), this.scene);
        camera.setTarget(new BABYLON.Vector3(0, 4, 0));
        camera.setPosition(new BABYLON.Vector3(0, 6, 12))
        camera.attachControl(this.canvas, true);
        const light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), this.scene);
        light.intensity = 0.7;
        return camera;
    }

    setSkybox(){
        const skybox = BABYLON.Mesh.CreateBox("skyBox", 100.0, this.scene);
        const skyboxMaterial = new BABYLON.StandardMaterial("skyBox", this.scene);
        skyboxMaterial.backFaceCulling = false;
        skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("./dist/textures/skybox/skybox", this.scene);
        skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
        skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
        skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
        skyboxMaterial.disableLighting = true;
        skybox.material = skyboxMaterial;
    }

}