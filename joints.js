/**
 * Joints class for storing 
 * joints data from posenet
 */
export default class Joints{

    /** the class constructor */
    constructor(){
        this.data = {
            'rightShoulder': 0,
            'rightElbow': 0,
            'leftShoulder': 0,
            'leftElbow': 0,
            'head': {
                'x': 0, 'y': 0
            }
        }
    }

    /** joint data setter */
    update(joint, val){
        this.data[joint] = val;
    }

    /** joint data getter */
    get(joint){
        return this.data[joint];
    }
}