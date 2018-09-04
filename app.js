import React from 'react';
import ReactDOM from 'react-dom';

import styles from './styles.css';

import Joints from './joints';
import GraphicsEngine from './graphics';
import PoseNet from './posenet';

class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
        }
    }

    componentDidMount() {
        this.joints = new Joints();
        this.graphics_engine = new GraphicsEngine(this.refs.babylon, this.joints);
        this.posenet = new PoseNet(this.joints, this.graphics_engine);
        this.posenet.startPrediction();
    }

    render() {
        return (
            <div id="container">
                <h2 className="text-center" id="h2">
                    Controlling Virtual Character Through WebCam
                </h2>
                <h5>
                    Note: make sure only a single person is in the scene. Otherwise, the results might be inaccurate.
                </h5>
                <div className="row"  id="row">
                    <div className="col-6">
                        <div id='main'>
                            <video id="video" playsInline/>
                            <canvas id="output" width={500} height={500} />
                        </div>
                    </div>
                    <div className="col-6">
                        <canvas ref="babylon" width={500} height={500} />
                    </div>
                </div>
                <div id="description" />
            </div>
        );
    }
}


ReactDOM.render(
    <App />,
    document.getElementById('react-container')
);