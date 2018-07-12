This web app is an experiment to combine Machine Learning and Computer Graphics through [TensorFlow.js](https://js.tensorflow.org/) and [BabylonJS](https://www.babylonjs.com/).

Flow of the app:

1. Get webcam input
2. Estimate human pose through TensorFlow.js. Click [here](https://medium.com/tensorflow/real-time-human-pose-estimation-in-the-browser-with-tensorflow-js-7dd0bc881cd5) to read more about it.
3. Apply human pose predictions on a rigged 3D character through BabylonJS.

Source code is available at: [https://github.com/mishig25/3d-posenet](https://github.com/mishig25/3d-posenet)