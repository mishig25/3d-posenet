export default class Joints{

    constructor(){
        this.data = {
            'rightShoulder': 0,
            'rightElbow': 0,
            'leftShoulder': 0,
            'leftElbow': 0
        }
    }

    update(joint, val){
        this.data[joint] = val;
    }

    get(joint){
        if (this.data[joint]) return this.data[joint];
        return 0;
    }
}