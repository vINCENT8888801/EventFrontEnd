import { Component, OnInit, OnDestroy, ViewChild, ChangeDetectorRef, Input } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import $ from 'jquery';
import { WebcamImage, WebcamInitError, WebcamUtil } from 'ngx-webcam';
import { FaceSearchSocketResponse } from '../class/face-search-socket-response';
import { Router, ActivatedRoute } from '@angular/router';
import { FaceSearchSocketRequest } from '../class/faceSearchSocketRequest';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EventService } from '../event.service';
import { EventDetailRequestBody } from '../httpResquestBody/event-detail-request-body';
import { EventDetailResponse } from '../httpResponseBody/EventDetailResponse';
import { MarkAttendanceResponse } from '../class/MarkAttendanceResponse';
import { HttpResponseEnum } from '../class/HttpResponseEnum';
import { BlacklistSearchSocketResponse } from '../class/blacklist-search-socket-response';
import { Blacklist } from '../class/Blacklist';
import { GetObjectTokenRequest } from '../class/getObjectTokenRequest';
import { GetObjectTokenResponse } from '../class/GetObjectTokenResponse';
import { RegisterWalkInRequestBody } from '../httpResquestBody/register-walk-in-request-body';
import { AuthService } from '../auth.service';
import { Ticket } from '../class/Ticket';

@Component({
  selector: 'app-attendance-mode',
  templateUrl: './attendance-mode.component.html',
  styleUrls: ['./attendance-mode.component.css']
})
export class AttendanceModeComponent implements OnInit, OnDestroy {

  constructor(private cdRef: ChangeDetectorRef,
    private router: Router,
    private modalService: NgbModal,
    private _event: EventService,
    private _auth: AuthService,
    private route: ActivatedRoute) { }


  @ViewChild('detectResponseModal') detectResponseModal;
  @ViewChild('detectBlacklistModal') detectBlacklistModal;
  @ViewChild('registerModal') registerModal;


  //Web Socket Responses
  event: EventDetailResponse;
  socketRes: FaceSearchSocketResponse;
  objTokenRes: GetObjectTokenResponse;
  blacklistRes: BlacklistSearchSocketResponse;
  attendanceResponse: MarkAttendanceResponse;



  socketReq = new FaceSearchSocketRequest();
  getObjectTokenRequest = new GetObjectTokenRequest();


  detectedPersonimgURL: String;
  private stompClient;
  private serverUrl = 'http://localhost:8080/socket';
  sendImage: any;
  registeringAttendance: boolean;
  loading: boolean;
  isSuccessfulAttendance: boolean;
  blacklist: Blacklist;
  registeringWalkingAttendance: boolean;
  uniqueName : boolean;
  uniqueEmail : boolean;
  registerWalkInData = new RegisterWalkInRequestBody();
  successRegister = false;

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
  private nextWebcam: Subject<boolean | string> = new Subject<boolean | string>();

  public ngOnInit(): void {
    this.registeringWalkingAttendance = false;
    this.uniqueName = true;
    this.uniqueEmail = true;

    var eventId = localStorage.getItem('event');
    var request = new EventDetailRequestBody();
    let id = this.route.snapshot.paramMap.get('id');
    request.eventId = id;
    this._event.getEventDetail(request).subscribe(res => {
      this.event = res;
    });

    this.socketReq.id = eventId
    //localStorage.removeItem('event');
    WebcamUtil.getAvailableVideoInputs()
      .then((mediaDevices: MediaDeviceInfo[]) => {
        this.multipleWebcamsAvailable = mediaDevices && mediaDevices.length > 1;
      });
    this.initializeWebSocketConnection();

    this.sendImage = setInterval(() => {
      this.triggerSnapshot();
      if(this.registeringWalkingAttendance){
        this.getObjectTokenFromWebSocket();
      }else{
        this.sendImageToWebSocket();
      }
    }, 5000);


  }

  ngOnDestroy(): void {

    clearInterval(this.sendImage);
    this.disconnectWebSocket();
  }


  //WebSocket
  initializeWebSocketConnection() {
    let ws = new SockJS(this.serverUrl);
    this.stompClient = Stomp.over(ws);
    let that = this;
    console.log(this.stompClient.connectHeaders);
    this.stompClient.connect(
      {
        login: "user",
        passcode: "password"
      }, function (frame) {
        that.subscribeToFaceDetectObs();
        that.subscribeToBlacklistDetectObs();
        that.subcribeToMarkAttendanceResult();
      });


  }


  subscribeToBlacklistDetectObs() {
    this.stompClient.subscribe("/result/blacklist", (message) => {
      console.log("Received");
      this.blacklistRes = JSON.parse(message.body);
      if (this.blacklistRes.blacklist.name != null) {
        this.blacklist = this.blacklistRes.blacklist;
        this.registeringAttendance = true;
        this.loading = false;
        clearInterval(this.sendImage);
        this.stompClient.unsubscribe("blacklistDetectObs");
        this.stompClient.unsubscribe("faceDetectObs");
        this.blacklistRes.image64 = "data:image/png;base64," + this.blacklistRes.image64;
        this.blacklistRes.dbImage64 = "data:image/png;base64," + this.blacklistRes.dbImage64;
        this.modalService.open(this.detectBlacklistModal, {
          ariaLabelledBy: 'modal-basic-title', backdrop: 'static', size: 'lg'
        });
      }

    }, { id: "blacklistDetectObs" });


  }

  subscribeToFaceDetectObs() {
    this.stompClient.subscribe("/result/detect", (message) => {
      console.log("Received");
      this.socketRes = JSON.parse(message.body);
      if (this.socketRes.name != null) {
        this.registeringAttendance = true;
        this.loading = false;
        clearInterval(this.sendImage);
        this.stompClient.unsubscribe("blacklistDetectObs");
        this.stompClient.unsubscribe("faceDetectObs");
        this.socketRes.imgString = "data:image/png;base64," + this.socketRes.imgString;
        this.modalService.open(this.detectResponseModal, {
          ariaLabelledBy: 'modal-basic-title', backdrop: 'static', size: 'lg'
        });
      }

    }, { id: "faceDetectObs" });
  }

  subscribeToFaceRegisterObs() {
    this.stompClient.subscribe("/result/objToken", (message) => {
      console.log("Received");
      this.objTokenRes = JSON.parse(message.body);
      if (this.objTokenRes.image64bit != null) {
        this.registeringAttendance = true;
        this.loading = false;
        clearInterval(this.sendImage);
        this.stompClient.unsubscribe("blacklistDetectObs");
        this.stompClient.unsubscribe("getObjTokenObs");
        this.objTokenRes.image64bit = "data:image/png;base64," + this.objTokenRes.image64bit;
        this.registerWalkInData.age = this.objTokenRes.age;
        this.registerWalkInData.gender = this.objTokenRes.gender;
        this.registerWalkInData.image64bit = this.objTokenRes.image64bitOriginal;
        this.modalService.open(this.registerModal, {
          ariaLabelledBy: 'modal-basic-title', backdrop: 'static', size: 'lg'
        });
      }

    }, { id: "getObjTokenObs" });
  }

  subcribeToMarkAttendanceResult() {
    this.stompClient.subscribe("/result/attendance", (message) => {
      console.log("Received");
      this.registeringAttendance = false;
      this.loading = true;
      this.attendanceResponse = JSON.parse(message.body);
      if (this.attendanceResponse.status == HttpResponseEnum.SUCCESS) {
        this.isSuccessfulAttendance = true;
      } else {
        this.isSuccessfulAttendance = false;
      }

    }, { id: "markattendanceObs" });


  }

  sendImageToWebSocket() {
    this.socketReq.imgString = this.webcamImage.imageAsBase64;
    var json = JSON.stringify(this.socketReq);
    this.sendMessage(json);
  }

  getObjectTokenFromWebSocket() {
    this.getObjectTokenRequest.imgString = this.webcamImage.imageAsBase64;
    var json = JSON.stringify(this.getObjectTokenRequest);
    this.stompClient.send("/app/send/register", {}, json);
    $('#input').val('');
  }

  sendMessage(message) {
    this.stompClient.send("/app/send/message", {}, message);
    $('#input').val('');

    // this.rxStompService.publish({destination: '/app/send/message', body: message});
  }

  disconnectWebSocket() {
    this.stompClient.disconnect();
  }

  public backToAttendance() {
    this.sendImage = setInterval(() => {
      this.triggerSnapshot();
      this.sendImageToWebSocket();

    }, 5000);
    this.subscribeToFaceDetectObs();
    this.subscribeToBlacklistDetectObs();
    this.modalService.dismissAll();
  }

  public doneWalkIn() {
    this.sendImage = setInterval(() => {
      this.triggerSnapshot();
      this.sendImageToWebSocket();

    }, 5000);
    this.subscribeToFaceRegisterObs();
    this.subscribeToBlacklistDetectObs();
    this.modalService.dismissAll();
  }

  //Camera function
  public triggerSnapshot(): void {
    this.trigger.next();
  }

  public toggleWebcam(): void {
    this.showWebcam = !this.showWebcam;
  }

  public toggleWebcamWithBool(state: boolean): void {
    this.showWebcam = state;
  }


  public handleInitError(error: WebcamInitError): void {
    this.errors.push(error);
  }

  public showNextWebcam(directionOrDeviceId: boolean | string): void {
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

  public get nextWebcamObservable(): Observable<boolean | string> {
    return this.nextWebcam.asObservable();
  }

  //Step 2
  markAttendance() {
    this.registeringAttendance = true;
    this.loading = true;
    this.stompClient.send("/app/send/attend", {}, this.socketRes.ticketId);
  }

  doneAttendance() {
    this.registeringAttendance = true;
    this.loading = false;
    this.backToAttendance();
  }

  registerWalkIn(){
    this._auth.validateUser(this.registerWalkInData).subscribe(
      res => {

        if (res.status == HttpResponseEnum.SUCCESS) {
          this.registerWalkInData.eventId = +this.route.snapshot.paramMap.get('id');
          this._event.registerWalkIn(this.registerWalkInData).subscribe(
            res => {
              if(res.status == HttpResponseEnum.SUCCESS){
                this.successRegister = true;
              }
            }
          )
        } else {
          this.uniqueEmail = res.uniqueEmail;
          this.uniqueName = res.uniqueName;
        }

      },
      err => console.log(err)
    )
  }

  switchMode(){
    console.log(this.registeringWalkingAttendance);
    if(this.registeringWalkingAttendance){
      this.stompClient.unsubscribe("faceDetectObs");
      this.subscribeToFaceRegisterObs();
    }else{
      this.stompClient.unsubscribe("getObjTokenObs");
      this.subscribeToFaceDetectObs();
    }
    clearInterval(this.sendImage);
    this.sendImage = setInterval(() => {
      this.triggerSnapshot();
      if(this.registeringWalkingAttendance){
        this.getObjectTokenFromWebSocket();
      }else{
        this.sendImageToWebSocket();
      }
    }, 5000);
  }

}
