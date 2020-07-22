import { Component, OnInit, ViewChild } from '@angular/core';
import { Route } from '@angular/compiler/src/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbDateStruct, NgbDateAdapter, NgbDateNativeUTCAdapter, NgbDate, NgbTimeStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';
import { EventDetailResponse } from 'src/app/httpResponseBody/EventDetailResponse';
import { EventService } from 'src/app/event.service';
import { EventDetailRequestBody } from 'src/app/httpResquestBody/event-detail-request-body';
import { HttpResponseEnum } from 'src/app/class/HttpResponseEnum';
import { UpdateEventRequestBody } from 'src/app/httpResquestBody/update-event-request-body';

@Component({
  selector: 'app-event-detail',
  templateUrl: './event-detail.component.html',
  styleUrls: ['./event-detail.component.css'],
  providers: [{provide: NgbDateAdapter, useClass: NgbDateNativeUTCAdapter}
  ]
})

export class EventDetailComponent implements OnInit {
  @ViewChild('content') content;
  response : EventDetailResponse;
  datePickerModel: NgbDateStruct;
  date : Date;
  minDate : any;
  time = {hour: 0, minute: 0};
  check : any;
  

  constructor(
    private route: ActivatedRoute,
    private _router: Router,
    private _event: EventService,
    private dateAdapter: NgbDateAdapter<Date>,
    private _datePipe : DatePipe,
    private modalService: NgbModal 
  ) { }

  ngOnInit(): void {
    let id = this.route.snapshot.paramMap.get('id');
    var req = new EventDetailRequestBody();
    req.eventId = id;
    this._event.getEventDetail(req).subscribe(res =>{
      if(res.status == HttpResponseEnum.SUCCESS)
          {
            this.response = res;
            
            var date = new Date(res.dateTime);
            this.time =  {hour: date.getHours(), minute: date.getMinutes()};
            this.date = date;
            var today = new Date();
            
            this.minDate = new NgbDate(today.getFullYear() ,today.getMonth() ,today.getUTCDate());
          }else{
            
          }
    })

  }

  goBackToEventDetail(){
    this._router.navigate(['event']);
  }

  updateEventDetail(){
    var response = this.response;
    var dateTime =  this.date;
    var request = new UpdateEventRequestBody();
    dateTime.setHours(this.time.hour);
    dateTime.setMinutes(this.time.minute);


    request.id = response.id;
    request.name = response.name;
    request.time = this._datePipe.transform(dateTime,"dd/MM/yyyy HH:mm:ss");
    request.unlimitedParticipant = response.unlimitedParticipant;
    if(!response.unlimitedParticipant){
      request.maxAttendee = response.maxAttendee;
    }
    console.log(request.time);

    this._event.updateEventDetail(request).subscribe(
      res =>{
        if(res.status == HttpResponseEnum.SUCCESS){
          this.showModal();
        }
      }
    )
  }

  showModal() {
    this.modalService.open(this.content, {ariaLabelledBy: 'modal-basic-title'});
  }

  goToEvent(){
    this.modalService.dismissAll();
    this.goBackToEventDetail();
  }

}
