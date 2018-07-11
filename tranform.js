export default class Transform{

    constructor(_joints){
        this.joints = _joints;
    }

    updateKeypoints(_keypoints, treshHoldScore){
        this.keypoints = {};
        _keypoints.forEach(({ score, part, position }) => {
            if (score > treshHoldScore) this.keypoints[part] = position;
        });
        this.distance = null;
        this.headCenter = null;
        this.shoulderCenter = null;
        this.calibrate();
    };

    calibrate(){
        if (this.keypoints['leftEye'] && this.keypoints['rightEye']){

            var left_x = this.keypoints['leftEye'].x; 
            var left_y = this.keypoints['leftEye'].y; 
            var right_x = this.keypoints['rightEye'].x; 
            var right_y = this.keypoints['rightEye'].y;

            this.distance = Math.sqrt(Math.pow(left_x - right_x, 2) + Math.pow(left_y - right_y, 2));
            this.headCenter = {'x':(left_x + right_x) / 2.0, 'y':(left_y + right_y) / 2.0};
        }
        if (this.keypoints['leftShoulder'] && this.keypoints['rightShoulder']) {

            var left_x = this.keypoints['leftShoulder'].x;
            var left_y = this.keypoints['leftShoulder'].y;
            var right_x = this.keypoints['rightShoulder'].x;
            var right_y = this.keypoints['rightShoulder'].y;

            this.shoulderCenter = { 'x': (left_x + right_x) / 2.0, 'y': (left_y + right_y) / 2.0 };
        }
    }

    head(){
        if(this.keypoints['nose'] && this.headCenter && this.shoulderCenter){
            var nose_x = this.keypoints['nose'].x;
            var nose_y = this.keypoints['nose'].y;
            // get nose relative points from origin
            nose_x = (this.headCenter.x - nose_x)/(this.distance/15);
            nose_y = this.shoulderCenter.y - nose_y;
            // normalize (i.e. scale it)
            nose_y = this.map(nose_y,this.distance*1.5,this.distance*2.8,-2,2);
            // console.log(140/this.distance,260/this.distance);
            return {'x':nose_x, 'y':nose_y};
        }
    }

    leftArm(){
        if (this.keypoints['leftShoulder'] && this.keypoints['rightShoulder'] && this.keypoints['rightElbow']){
            // calculate the angle
            const angle = this.findAngle(this.keypoints['leftShoulder'], this.keypoints['rightShoulder'], this.keypoints['rightElbow']);
            return angle;
        }
        return 0;
    }

    rotateJoint(jointA, jointB, jointC){
        if (this.keypoints[jointA] && this.keypoints[jointB] && this.keypoints[jointC]){
            const angle = this.findAngle(this.keypoints[jointA], this.keypoints[jointB], this.keypoints[jointC]);
            const sign = (this.keypoints[jointC].y > this.keypoints[jointB].y) ? 1 : -1;
            this.joints.update(jointB, sign * angle);
            return angle;
        }
    }

    map(original, in_min, in_max, out_min, out_max) {
        return (original - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
    }

    findAngle(p1,p2,p3){

        var p12 = Math.sqrt(Math.pow((p1.x - p2.x), 2) + Math.pow((p1.y - p2.y), 2));
        var p13 = Math.sqrt(Math.pow((p1.x - p3.x), 2) + Math.pow((p1.y - p3.y), 2));
        var p23 = Math.sqrt(Math.pow((p2.x - p3.x), 2) + Math.pow((p2.y - p3.y), 2));

        //angle in radians
        var resultRadian = Math.acos(((Math.pow(p12, 2)) + (Math.pow(p13, 2)) - (Math.pow(p23, 2))) / (2 * p12 * p13));

        //angle in degrees
        var resultDegree = Math.acos(((Math.pow(p12, 2)) + (Math.pow(p13, 2)) - (Math.pow(p23, 2))) / (2 * p12 * p13)) * 180 / Math.PI;

        return resultRadian;
    }

}