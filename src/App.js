import React, { Component } from 'react';
import Webcam from 'react-webcam';
import Button from 'react-mdl/lib/Button';
import { Card, CardActions } from 'react-mdl/lib/Card';
import FontAwesome from 'react-fontawesome';
import './App.css';
import './index.css';

class Home extends Component {
    constructor(props){
      super(props);
      this.state = {
        webcam : false,
        imageSrc: '/images/dummy.png',
        captured: false
      }
    }
    setRef = (webcam) => {
      this.webcam = webcam;
    }

    capture = () => {
      if(this.state.webcam){
        const imageSrc = this.webcam.getScreenshot();
        this.setState({
          imageSrc:imageSrc,
          webcam:false,
          captured:true
        })
      }
    };
    undo=()=>{
      this.setState({
        captured:false,
        webcam:true
      })
    }
    submitForm=()=>{
      console.log('send data');
    }
    startCam = () => {
      if(this.state.webcam===true){
        const imageSrc = this.webcam.getScreenshot();
        this.setState({
          imageSrc:imageSrc,
          webcam:false,
          captured:true
        })
      }
      else{
        this.setState({
          webcam:true
        })
      }
    }
    render() {
      return (
        <div>
          <h3>Click on the camera to access it.</h3>
          <h4>We will match your photo with your bank photo ID.</h4>
          <Card shadow={0} style={{width: '350px', background: '#fff', margin: '100px auto'}}>
                  {this.state.webcam?
                  <div
                  className='scanning'>
                  <Webcam
                    audio={false}
                    height={350}
                    ref={this.setRef}
                    screenshotFormat="image/jpeg"
                    width={350}
                  /></div>:
                  <div className='dummyContainer'><img className='dummy' src={this.state.imageSrc} alt="user"/></div>}
                  <CardActions border className='actions'>
                    {this.state.captured?<span>
                      <Button onClick={this.undo} className='camera'>
                        <FontAwesome
                          className='super-crazy-colors'
                          name='undo'
                          size='2x'
                        />
                      </Button>
                      <Button onClick={this.submitForm} className='camera'>
                        <FontAwesome
                          className='super-crazy-colors'
                          name='check'
                          size='2x'
                        />
                    </Button>
                  </span>:<Button onClick={this.startCam} className='camera'>
                    <FontAwesome
                      className='cameraIcon'
                      name='camera'
                      size='2x'
                    />
                  </Button>}
                  </CardActions>
          </Card>
          <div className='sbi'>
            <img src="images/SBI-logo.png" alt='sbi' />
          </div>


        </div>
      );
    }
}
export default Home;
