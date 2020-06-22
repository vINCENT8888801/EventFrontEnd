import { Component, OnInit } from '@angular/core';
import {Subject, Observable} from 'rxjs';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import $ from 'jquery';
import {WebcamImage, WebcamInitError, WebcamUtil} from 'ngx-webcam';
import { FaceSearchSocketResponse } from '../class/face-search-socket-response';

@Component({
  selector: 'app-attendance-mode',
  templateUrl: './attendance-mode.component.html',
  styleUrls: ['./attendance-mode.component.css']
})
export class AttendanceModeComponent implements OnInit {

  socketRes : FaceSearchSocketResponse ;
  detectedPersonimgURL : String;
  private stompClient;
  private serverUrl = 'http://localhost:8080/socket';

  // toggle webcam on/off
  public showWebcam = true;
  public allowCameraSwitch = true;
  public multipleWebcamsAvailable = false;
  public deviceId: string;
  public videoOptions: MediaTrackConstraints = {
    // width: {ideal: 1024},
    // height: {ideal: 576}
  };
  public errors: WebcamInitError[] = [];

  // latest snapshot
  public webcamImage: WebcamImage = null;

  // webcam snapshot trigger
  private trigger: Subject<void> = new Subject<void>();
  // switch to next / previous / specific webcam; true/false: forward/backwards, string: deviceId
  private nextWebcam: Subject<boolean|string> = new Subject<boolean|string>();

  public ngOnInit(): void {
    WebcamUtil.getAvailableVideoInputs()
      .then((mediaDevices: MediaDeviceInfo[]) => {
        this.multipleWebcamsAvailable = mediaDevices && mediaDevices.length > 1;
      });
    this.initializeWebSocketConnection();

    setInterval(() => { 
      this.triggerSnapshot();
      this.sendImageToWebSocket();
    }, 5000);
  }


  //WebSocket
  initializeWebSocketConnection(){
    let ws = new SockJS(this.serverUrl);
    this.stompClient = Stomp.over(ws);
    let that = this;
    this.stompClient.connect({}, function(frame) {
      that.stompClient.subscribe("/result", (message) => {
        console.log("Received")
        if(message) {
          console.log("Returned base64:" + message.body);
        }
        ;
        that.socketRes =JSON.parse(message.body);
        that.socketRes.imgString = "data:image/png;base64,"+ that.socketRes.imgString;
        

      });
    });
  }
  

  sendImageToWebSocket(){
     this.sendMessage(this.webcamImage.imageAsBase64);
     
  }

  sendMessage(message){
    this.stompClient.send("/app/send/message" , {}, message);
    $('#input').val('');
  }

  disconnectWebSocket(){
    this.stompClient.close();
  }



  //Camera function
  public triggerSnapshot(): void {
    this.trigger.next();
  }

  public toggleWebcam(): void {
    this.showWebcam = !this.showWebcam;
  }

  public handleInitError(error: WebcamInitError): void {
    this.errors.push(error);
  }

  public showNextWebcam(directionOrDeviceId: boolean|string): void {
    // true => move forward through devices
    // false => move backwards through devices
    // string => move to device with given deviceId
    this.nextWebcam.next(directionOrDeviceId);
  }

  public handleImage(webcamImage: WebcamImage): void {
    console.info('received webcam image', webcamImage);
    this.webcamImage = webcamImage;
  }
  

  public cameraWasSwitched(deviceId: string): void {
    console.log('active device: ' + deviceId);
    this.deviceId = deviceId;
  }

  public get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }

  public get nextWebcamObservable(): Observable<boolean|string> {
    return this.nextWebcam.asObservable();
  }
}
