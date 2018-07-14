export default class Joints{

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

    update(joint, val){
        this.data[joint] = val;
    }

    get(joint){
        return this.data[joint];
    }
}