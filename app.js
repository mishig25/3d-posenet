import React from 'react';
import ReactDOM from 'react-dom';
import ReactLoading from 'react-loading';

import styles from './styles.css';

import Joints from './joints';
import GraphicsEngine from './graphics';
import PoseNet from './posenet';

class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: true,
        }
    }

    async componentDidMount() {
        this.joints = new Joints();
        this.graphics_engine = new GraphicsEngine(this.refs.babylon, this.joints);
        this.posenet = new PoseNet(this.joints, this.graphics_engine, this.refs);
        await this.posenet.loadNetwork();
        this.setState({loading: false});
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
                        <div style={{display:this.state.loading ? 'none' : 'block'}}>
                            <video ref="video" id="video" playsInline/>
                            <canvas ref="output" width={500} height={500} />
                        </div>
                        <div id="loader" style={{ display: !this.state.loading ? 'none' : 'block' }}>
                            <h3 id="loadTitle">Tensorflow Model loading ...</h3>
                            <ReactLoading type="cylon" color="grey" height={'20%'} width={'20%'} id="reactLoader"/>
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