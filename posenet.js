import * as posenet from '@tensorflow-models/posenet';
import {drawKeypoints, drawSkeleton} from './demo_util';

import Joints from './joints';
import Transform from './tranform';
import GraphicsEngine from './graphics';
const joints = new Joints();


const graphics_engine = new GraphicsEngine('babylon', joints);
graphics_engine.render();


const transform = new Transform(joints);

const videoWidth = 500;
const videoHeight = 500;

navigator.getUserMedia = navigator.getUserMedia ||
    navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

export default class PoseNet{

  constructor(){
    this.state = {
      algorithm: 'single-pose',
      input: {
        outputStride: 16,
        imageScaleFactor: 0.5,
      },
      singlePoseDetection: {
        minPoseConfidence: 0.1,
        minPartConfidence: 0.5,
      },
      output: {
        showVideo: true,
      },
      net: null,
    };

  }
  
  isMobile() {
    const mobile = /Android/i.test(navigator.userAgent) || /iPhone|iPad|iPod/i.test(navigator.userAgent);
    return mobile;
  }

  setupGui(cameras, net) {
    this.state.net = net;

    if (cameras.length > 0) {
      this.state.camera = cameras[0].deviceId;
    }

  }

  async loadVideo() {
    const video = await this.setupCamera();
    video.play();

    return video;
  }

  async setupCamera() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      throw new Error(
          'Browser API navigator.mediaDevices.getUserMedia not available');
    }

    const video = document.getElementById('video');
    video.width = videoWidth;
    video.height = videoHeight;

    const mobile = this.isMobile();
    const stream = await navigator.mediaDevices.getUserMedia({
      'audio': false,
      'video': {
        facingMode: 'user',
        width: mobile ? undefined : videoWidth,
        height: mobile ? undefined : videoHeight,
      },
    });
    video.srcObject = stream;

    return new Promise((resolve) => {
      video.onloadedmetadata = () => {
        resolve(video);
      };
    });
  }

  detectPoseInRealTime(video, net) {
    const canvas = document.getElementById('output');
    const ctx = canvas.getContext('2d');
    // since images are being fed from a webcam
    const flipHorizontal = true;

    canvas.width = videoWidth;
    canvas.height = videoHeight;

    const self = this;
    async function poseDetectionFrame() {
      // Scale an image down to a certain factor. Too large of an image will slow
      // down the GPU
      const imageScaleFactor = self.state.input.imageScaleFactor;
      const outputStride = +self.state.input.outputStride;

      let poses = [];
      let minPoseConfidence;
      let minPartConfidence;

      const pose = await self.state.net.estimateSinglePose(
        video, imageScaleFactor, flipHorizontal, outputStride);
      poses.push(pose);

      minPoseConfidence = +self.state.singlePoseDetection.minPoseConfidence;
      minPartConfidence = +self.state.singlePoseDetection.minPartConfidence;

      ctx.clearRect(0, 0, videoWidth, videoHeight);

      if (self.state.output.showVideo) {
        ctx.save();
        ctx.scale(-1, 1);
        ctx.translate(-videoWidth, 0);
        ctx.drawImage(video, 0, 0, videoWidth, videoHeight);
        ctx.restore();
      }

      // For each pose (i.e. person) detected in an image, loop through the poses
      // and draw the resulting skeleton and keypoints if over certain confidence
      // scores
      poses.forEach(({score, keypoints}) => {
        if (score >= minPoseConfidence) {
          transform.updateKeypoints(keypoints, minPartConfidence);
          const head = transform.head();
          const rightShoulderAngle = transform.rotateJoint('leftShoulder', 'rightShoulder','rightElbow');
          const rightArmAngle = transform.rotateJoint('rightShoulder', 'rightElbow', 'rightWrist');
          const leftShoulderAngle = transform.rotateJoint('rightShoulder', 'leftShoulder', 'leftElbow');
          const lefArmAngle = transform.rotateJoint('leftShoulder', 'leftElbow', 'leftWrist');

          drawKeypoints(keypoints.slice(0,5), minPartConfidence, ctx);
          drawSkeleton(keypoints, minPartConfidence, ctx);
        }
      });

      requestAnimationFrame(poseDetectionFrame);
    }

    poseDetectionFrame();
  }

  async startPrediction() {
    // Load the PoseNet model weights with architecture 0.75
    const net = await posenet.load();

    document.getElementById('loading').style.display = 'none';
    document.getElementById('main').style.display = 'block';

    let video;

    try {
      video = await this.loadVideo();
    } catch (e) {
      let info = document.getElementById('info');
      info.textContent = 'this browser does not support video capture,' +
          'or this device does not have a camera';
      info.style.display = 'block';
      throw e;
    }

    this.setupGui([], net);
    this.detectPoseInRealTime(video, net);
  }

}

const pos = new PoseNet();
pos.startPrediction();