import React, { Component } from 'react';
import Webcam from 'react-webcam';
import Button from 'react-mdl/lib/Button';
import { Card, CardActions } from 'react-mdl/lib/Card';
import FontAwesome from 'react-fontawesome';
import './App.css';
import './index.css';
import 'whatwg-fetch';

class Home extends Component {
    constructor(props){
      super(props);
      this.state = {
        webcam : false,
        imageSrc: '/images/dummy.png',
        file:'',
        captured: false,
        aadhar_card:'',
        accno:'',
        result:false,
        similarityScore:'',
        message:'',
        error:'',
        webVideo:false
      }
    }
    onStop=()=>{
      console.log('hey');
    }
    setRef = (webcam) => {
      this.webcam = webcam;
    }
    srcToFile=(src, fileName, mimeType)=>{
        return (fetch(src)
            .then(function(res){return res.arrayBuffer();})
            .then(function(buf){
              return new File([buf], fileName, {type:mimeType});})
        );
    }
    onChange=(event)=>{
      if(event.target.name==='accno'){
        this.setState({
          accno:event.target.value
        })
      }
      else if(event.target.name==='aadhar_card'){
        this.setState({
          aadhar_card:event.target.value
        })
      }
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
      let form = new FormData();
      var state = this.state;
      var self = this;
      if(state.aadhar_card.length!==12&&state.accno.length!==11){
        this.setState({
          error:'Please check. Aadhaar Card Number should be 12 digits and Account Number to be 11 digits.'
        })
        return;
      }
      var imageSrcNew = this.srcToFile(this.state.imageSrc,this.state.accno+'.jpg','image/jpeg')
        .then(function(file){
      var form = new FormData();
      form.append('cap_img', file);
      form.append('cap_vid', file);

      form.append('aadhar_card', state.aadhar_card);
      form.append('accno', state.accno);

        return fetch('http://139.59.73.1:8000/predict', {
          method:'POST',
          body:form,
          'headers': {
          'contentType': 'multipart/form-data',
        }}).then(function(response){
          console.log(response);
          self.setState({
            result:true,
            message:'You were succesfully authenticated!',
            similarityScore:''
          })
          return response.json();
        }).then(function(json){
          console.log(json);
          if(json.prediction>0.5){
          self.setState({
            result:true,
            message:'You were succesfully authenticated!',
            similarityScore:json.prediction*100
          })
        }
        else{
          self.setState({
            result:true,
            message:'You couldn\'t be authenticated',
            similarityScore:json.prediction*100
          })
        }
        }).catch(function(response){
          console.log(response);
          console.log('error');
          self.setState({
            result:true,
            message:'You couldn\'t be authenticated',
            similarityScore:'N/A'
          })
        });
      })
      .then(function(response){
        console.log(response)
      })
      .catch(function(){
        console.log('error');
      });
      console.log(imageSrcNew);
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
        <span>
        {!this.state.result?
          <div className="inputFields">
            <h4 style={{textAlign:'center','margin':'auto'}}>For Accessing Admin Portal go to
              &nbsp;<a href="https://digitize-sbi-admin.surge.sh" target="_blank">
              https://digitize-sbi-admin.surge.sh</a></h4>
          <h3>Click on the camera to access it.</h3>
          <h4>We will match your photo with your bank photo ID.</h4>
          <input type="text" value={this.state.aadhar_card}
            onChange={this.onChange} name="aadhar_card" placeholder="Enter Aadhaar card number" className="customInputField" /><br/>
          <input type="text" name="accno"
            value={this.state.img}
            onChange={this.onChange} placeholder="Enter SBI Account number" className="customInputField" />
            <p>{this.state.error}</p>
          {/*}<form action="http://139.59.73.1:8000/predict" ref="form" method="POST">
            <input type="file"
            ref={(c) => { this.file = c; }}
            multiple='false'
            name="cap_img"
            value={this.state.file}
            className="hidden"
            />
            <input type="hidden" name="aadhar_card" className="hidden" value="123456789010" />
          </form>*/}
          <Card shadow={0} style={{width: '350px', background: '#fff', margin: '100px auto'}}>
                  {this.state.webcam?
                  <div
                  className='scanning'>
                  <Webcam
                    audio={false}
                    height={350}
                    ref={this.setRef}
                    onUserMedia={this.onUserMedia}
                    screenshotFormat="image/jpeg"
                    width={350}
                  /></div>:
                  <div className='dummyContainer'><img className='dummy' src={this.state.imageSrc} alt="user"/></div>}
                  {/*{this.state.webVideo ? <div>
                    <VideoRecorder
                        ref="recorder"
                        onRecordingStarted={() => console.log('Started')}
                        onRecordingFinished={(e) => console.log(e.nativeEvent.file)}
                        onCameraAccessException={() => alert('No permission for camera')}
                        onCameraFailed={() => alert('Camera failed')}
                        type="front"
                        videoEncodingBitrate={7000000}
                        videoEncodingFrameRate={30}
                      />
                    </div>:'' }*/}
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


        </div>:
        <div className="result">
          <h3>{this.state.message}</h3>
          {this.state.similarityScore!==''?
          <span>
            {this.state.similarityScore>50?<img src="checked.png" className="image" />:''}
            <h2>{this.state.similarityScore}</h2>
            <h3 className="testing">This is only for evaluation purposes and will not be shown to the user.</h3>
          </span>:''}
        </div>}
      </span>
      );
    }
}
export default Home;
