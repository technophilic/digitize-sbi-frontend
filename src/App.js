import React, { Component } from 'react';
import Button from 'react-mdl/lib/Button';
import { Card, CardActions } from 'react-mdl/lib/Card';
import FontAwesome from 'react-fontawesome';
import './App.css';
import './index.css';
import 'whatwg-fetch';
import RecordRTC from 'recordrtc';
import Webcam from './Webcam.react';
// handle user media capture

const hasGetUserMedia = !!(navigator.getUserMedia || navigator.webkitGetUserMedia ||
                        navigator.mozGetUserMedia || navigator.msGetUserMedia);

function captureUserMedia(callback) {
  var params = { audio: false, video: true };

  navigator.getUserMedia(params, callback, (error) => {

    alert(JSON.stringify(error));
  });
};
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
        webVideo:false,
        recordVideo: null,
        src: null,
        uploadSuccess: null,
        uploading: false,
        params:null,
        loading:false
      }
      this.startRecord = this.startRecord.bind(this);
      this.stopRecord = this.stopRecord.bind(this);
    }
    componentDidMount() {
      if(!hasGetUserMedia) {
        alert("Your browser cannot stream from your webcam. Please switch to Chrome or Firefox.");
        return;
      }
    }

    /*requestUserMedia() {
      console.log('called request')
      captureUserMedia((stream) => {
        this.setState({ src: window.URL.createObjectURL(stream) });
        console.log('setting state', this.state)
      });
    }*/

    startRecord() {
      this.setState({
        webcam:true,
        loading:true
      })
      captureUserMedia((stream) => {
        this.setState({ src: window.URL.createObjectURL(stream) });
        this.state.recordVideo = RecordRTC(stream, { type: 'video' });
        this.state.recordVideo.startRecording();
      });
      setTimeout(() => {
        this.setState({
          webcam:false,
          captured:true,
          loading:false
        })
        this.stopRecord();
      }, 5000);
    }

    stopRecord() {
      this.state.recordVideo.stopRecording((blob) => {
        let params = {
          type: 'video/webm',
          data: this.state.recordVideo.blob,
          id: Math.floor(Math.random()*90000) + 10000
        }

        var self = this;
        this.state.recordVideo.getDataURL(function(dataURL) {
          self.setState({
          params:dataURL,
          src:blob
        })});
        this.submitForm();

      });
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
    undo=()=>{
      this.setState({
        captured:false,
        webcam:true
      })
      this.startRecord();
    }
    srcToFile=(src, fileName, mimeType)=>{
        return (fetch(src)
            .then(function(res){return res.arrayBuffer();})
            .then(function(buf){
              return new File([buf], fileName, {type:mimeType});})
        );
    }
    submitForm=()=>{
      var state = this.state;
      var self = this;
      if(state.aadhar_card.length!==12&&state.accno.length!==11){
        this.setState({
          error:'Please check. Aadhaar Card Number should be 12 digits and Account Number to be 11 digits.'
        })
        return;
      }
      this.srcToFile(this.state.params,this.state.accno+'.webm','video/webm')
        .then(function(file){
          var form = new FormData();
          form.append('cap_vid', file);
            console.log(file);

          form.append('aadhar_card', state.aadhar_card);
          form.append('accno', state.accno);
          return fetch('https://myffcs.in/predict', {
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
          if(json.prediction>0.40){
          self.setState({
            result:true,
            message:'You were succesfully authenticated!',
            similarityScore:(json.prediction*100).toFixed(2)
          })
        }
        else{
          self.setState({
            result:true,
            message:'You couldn\'t be authenticated',
            similarityScore:(json.prediction*100).toFixed(2)
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
      });
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
          <Card shadow={0} style={{width: '350px', background: '#fff', margin: '50px auto'}}>
            <div className='dummyContainer'>
              <div className='scanning'>
                {this.state.webcam?<Webcam src={this.state.src} />:
                <div>{this.state.captured?
                <video autoPlay muted src={this.state.src} />:
                <img className='dummy' src={this.state.imageSrc} alt="user"/>}
                </div>}
              </div>
              </div>

              <CardActions border className='actions'>
                {this.state.captured?
                <span>
                  <Button onClick={this.undo} className='camera'>
                    <FontAwesome
                      className='super-crazy-colors'
                      name='undo'
                      size='2x'
                    />
                  </Button>
              </span>:<Button onClick={this.startRecord} className='camera'>
                <FontAwesome
                  className='cameraIcon'
                  name='camera'
                  size='2x'
                />
              </Button>}

            </CardActions>
          </Card>
          {this.state.loading?
            <FontAwesome
            className='super-crazy-colors'
            name='spinner'
            spin
            size='2x'
          />:''}

          <p>Please blink your eyes 3-4 times for live detection.</p>
          <div className='sbi'>
            <img src="images/SBI-logo.png" alt='sbi' />
          </div>


        </div>:
        <div className="result">
          <h3>{this.state.message}</h3>
          {this.state.similarityScore!==''?
          <span>
            {this.state.similarityScore>42?<img src="checked.png" className="image" />:''}
            <h2>{this.state.similarityScore}</h2>
            <h3 className="testing">This is only for evaluation purposes and will not be shown to the user.</h3>
          </span>:''}
        </div>}
      </span>
      );
    }
}
export default Home;
