import * as posenet from '@tensorflow-models/posenet';
import {drawKeypoints, drawSkeleton} from './demo_util';

import Transform from './tranform';

const videoWidth = 500;
const videoHeight = 500;

navigator.getUserMedia = navigator.getUserMedia ||
    navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

/**
 * Posenet class for loading posenet 
 * and running inferences on it
 */
export default class PoseNet{

  /**
   * the class constructor
   * @param {Joints} joints processes raw joints data from posenet
   * @param {GraphicsEngine} graphicsEngine to which joints data will be fed
   * @param {array} _htmlelems that will be used to present results
   */
  constructor(joints, graphicsEngine, _htmlelems){
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
      net: null,
    };
    this.htmlElements = _htmlelems;
    this.joints = joints;
    this.transform = new Transform(this.joints);
    this.graphics_engine = graphicsEngine;
    this.graphics_engine.render();
  }
  
  /** Checks whether the device is mobile or not */
  isMobile() {
    const mobile = /Android/i.test(navigator.userAgent) || /iPhone|iPad|iPod/i.test(navigator.userAgent);
    return mobile;
  }

  /** Starts webcam video */
  async loadVideo() {
    const video = await this.setupCamera();
    video.play();
    return video;
  }

  /** Sets uo webcam */
  async setupCamera() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      throw new Error(
          'Browser API navigator.mediaDevices.getUserMedia not available');
    }

    const video = this.htmlElements.video;
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

  /**
   * Detects human pse from video stream using posenet
   * @param {VideoObject} video 
   * @param {TFModel} net 
   */
  detectPoseInRealTime(video, net) {
    const canvas = this.htmlElements.output;
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

      const pose = await self.net.estimateSinglePose(
        video, imageScaleFactor, flipHorizontal, outputStride);
      poses.push(pose);

      minPoseConfidence = +self.state.singlePoseDetection.minPoseConfidence;
      minPartConfidence = +self.state.singlePoseDetection.minPartConfidence;

      ctx.clearRect(0, 0, videoWidth, videoHeight);

      ctx.save();
      ctx.scale(-1, 1);
      ctx.translate(-videoWidth, 0);
      ctx.drawImage(video, 0, 0, videoWidth, videoHeight);
      ctx.restore();

      // For each pose (i.e. person) detected in an image, loop through the poses
      // and draw the resulting skeleton and keypoints if over certain confidence
      // scores
      poses.forEach(({score, keypoints}) => {
        if (score >= minPoseConfidence) {
          self.transform.updateKeypoints(keypoints, minPartConfidence);
          const head = self.transform.head();
          const shouldMoveFarther = drawKeypoints(keypoints.slice(0, 7), minPartConfidence, ctx);
          if (shouldMoveFarther){
            ctx.font = "30px Arial";
            ctx.fillText("Please Move Farther", Math.round(videoHeight / 2) - 100, Math.round(videoWidth / 2));
          }
          drawSkeleton(keypoints, minPartConfidence, ctx);
        }
      });
      requestAnimationFrame(poseDetectionFrame);
    }

    poseDetectionFrame();
  }

  /** Loads the PoseNet model weights with architecture 0.75 */
  async loadNetwork(){
    this.net = await posenet.load();
  }

  /**
   * Starts predicting human pose from webcam
   */
  async startPrediction() {    
    let video;
    try {
      video = await this.loadVideo();
    } catch (e) {
      return false;
    }
    this.detectPoseInRealTime(video, this.net);
    return true;
  }

}