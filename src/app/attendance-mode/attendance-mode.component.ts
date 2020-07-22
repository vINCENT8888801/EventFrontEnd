import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
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

@Component({
  selector: 'app-attendance-mode',
  templateUrl: './attendance-mode.component.html',
  styleUrls: ['./attendance-mode.component.css']
})
export class AttendanceModeComponent implements OnInit, OnDestroy {

  constructor(private router: Router,
    private modalService: NgbModal,
    private _event: EventService,
    private route: ActivatedRoute) { }


  @ViewChild('detectResponseModal') detectResponseModal;
  event: EventDetailResponse;
  socketRes: FaceSearchSocketResponse;
  socketReq = new FaceSearchSocketRequest();
  detectedPersonimgURL: String;
  private stompClient;
  private serverUrl = 'http://localhost:8080/socket';
  sendImage: any;
  registeringAttendance: boolean;
  loading: boolean;
  attendanceResponse: MarkAttendanceResponse;
  isSuccessfulAttendance : boolean;



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
      this.sendImageToWebSocket();

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
        that.subcribeToMarkAttendanceResult();
      });


  }


  subscribeToFaceDetectObs() {
    this.stompClient.subscribe("/result/detect", (message) => {
      console.log("Received");
      this.socketRes = JSON.parse(message.body);
      if (this.socketRes.name != null) {
        this.registeringAttendance = true;
        this.loading = false;
        clearInterval(this.sendImage);
        this.stompClient.unsubscribe("faceDetectObs");
        this.socketRes.imgString = "data:image/png;base64," + this.socketRes.imgString;
        this.modalService.open(this.detectResponseModal, {
          ariaLabelledBy: 'modal-basic-title', backdrop: 'static', size: 'lg'
        });
      }

    }, { id: "faceDetectObs" });


  }

  subcribeToMarkAttendanceResult() {
    this.stompClient.subscribe("/result/attendance", (message) => {
      console.log("Received");
      this.registeringAttendance = false;
      this.loading = true;
      this.attendanceResponse = JSON.parse(message.body);
      if (this.attendanceResponse.status == HttpResponseEnum.SUCCESS) {
        this.isSuccessfulAttendance = true;
      }else{
        this.isSuccessfulAttendance = false;
      }

    }, { id: "markattendanceObs" });


  }

  sendImageToWebSocket() {
    this.socketReq.imgString = this.webcamImage.imageAsBase64;
    var json = JSON.stringify(this.socketReq);
    this.sendMessage(json);

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


}
