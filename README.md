# 3D-Posenet
### Controlling a 3D Virtual Character Through WebCam
Personal Project

#### Check out the Live Demo: [https://mishig25.github.io/3d-posenet/](https://mishig25.github.io/3d-posenet/)

<img src="https://github.com/mishig25/3d-posenet/raw/master/dist/demo.gif" width="600">

#### Description:

This web app is an experiment to combine Machine Learning and Computer Graphics through [TensorFlow.js](https://js.tensorflow.org/) and [BabylonJS](https://www.babylonjs.com/). Tensorflow.js is an official Javascript API of Google's popular machine learning framework Tensorflow, and since Tensorflow.js is a Javscript library, it provides a way to run machine learning models in browser environments. On the other hand, BabylonJS is a 3D engine that lets you create and run 3D graphics in web apps. 

### Contents of the repository:
* `app.js` - main React app
* `posenet.js` - class for running Tensorflow.js and Posenet 
* `graphics.js` - class for running BabylonJS and creating the 3D scene
* `joints.js`, `transform.js` - miscellaneous classes

### Development:
```bash
yarn
yarn watch
```

#### License
MIT
