import * as BABYLON from 'babylonjs';

export default class GraphicsEngine {

    constructor(canvas_name, _joints){
        this.canvas = document.getElementById(canvas_name);
        this.engine = new BABYLON.Engine(this.canvas, true);
        this.x_offset = 0;
        this.y_offset = 0;
        this.x_offset_chest = 0;
        this.y_offset_chest = 0;
        this.rightShoulderAngle = 0;
        this.rightArmAngle = 0;
        this.joints = _joints;
        this.createScene();
    }

    createScene(){

        this.scene = new BABYLON.Scene(this.engine);

        var camera = new BABYLON.ArcRotateCamera("camera", 0, 1, 20, BABYLON.Vector3.Zero(), this.scene);
        camera.setTarget(new BABYLON.Vector3(0, 4, 0));
        camera.setPosition(new BABYLON.Vector3(0, 6, 12))
        camera.attachControl(this.canvas, true);

        var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), this.scene);
        light.intensity = 0.7;

        var sphere = BABYLON.MeshBuilder.CreateSphere('', { diameter: .0001 }, this.scene);
        var sphereChest = BABYLON.MeshBuilder.CreateSphere('', { diameter: .0001 }, this.scene);

        BABYLON.SceneLoader.ImportMesh("", "/dist/Scenes/Dude/", "Dude.babylon", this.scene, (newMeshes, particleSystems, skeletons) => {

            var mesh = newMeshes[0];
            var skeleton = skeletons[0];
            mesh.scaling = new BABYLON.Vector3(0.1, 0.1, 0.1);
            mesh.position = new BABYLON.Vector3(0, 0, 0);

            // var animation = scene.beginAnimation(skeletons[0], 0, 100, true, 1.0);

            var head_bone = skeleton.bones[7];
            var chest_bone = skeleton.bones[3];
            var right_shoulder_bone = skeleton.bones[13];
            var right_arm_bone = skeleton.bones[14];
            var left_shoulder_bone = skeleton.bones[32];
            var left_arm_bone = skeleton.bones[33];

            var lookAtCtl = new BABYLON.BoneLookController(mesh, head_bone, sphere.position, { adjustYaw: Math.PI * .5, adjustRoll: Math.PI * .5 });
            var lookAtCtlChest = new BABYLON.BoneLookController(mesh, chest_bone, sphereChest.position, { adjustYaw: Math.PI * .5, adjustRoll: Math.PI * .5 });

            var boneAxesViewer = new BABYLON.Debug.BoneAxesViewer(this.scene, left_shoulder_bone, mesh);

            this.scene.registerBeforeRender(() => {

                sphere.position.x = 0 + this.x_offset;
                sphere.position.y = 6 + this.y_offset;
                sphere.position.z = 5;

                lookAtCtl.update();

                sphereChest.position.x = 0 + this.x_offset_chest;
                sphereChest.position.y = 6;
                sphereChest.position.z = 5;

                lookAtCtlChest.update();

                right_shoulder_bone.rotation = new BABYLON.Vector3(0, 1.5 * this.joints.data.rightShoulder, 0);
                right_arm_bone.rotation = new BABYLON.Vector3(0, this.joints.data.rightElbow, 0);
                left_shoulder_bone.rotation = new BABYLON.Vector3(0, -1.5 * this.joints.data.leftShoulder, 0);
                left_arm_bone.rotation = new BABYLON.Vector3(0, -this.joints.data.leftElbow, 0);


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
    
    updateOffsets(x,y){
        this.x_offset = x;
        this.y_offset = y;
    }

    updateOffsetsChest(x, y) {
        this.x_offset_chest = x;
        this.y_offset_chest = y;
    }

    setCamera(){
        
    }

    toRadians(degree){
        return (Math.PI / 180) * degree;
    }

}

// const graphics_engine = new GraphicsEngine('babylon')
// graphics_engine.render()

// // Resize
// window.addEventListener("resize", function () {
//     engine.resize();
// });
