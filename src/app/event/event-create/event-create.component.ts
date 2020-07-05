import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { EventService } from 'src/app/event.service';
import { NgbDateAdapter, NgbModal, NgbDateNativeUTCAdapter, NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';
import { CreateEventRequestBody } from 'src/app/httpResquestBody/create-event_request-body';
import { HttpResponseEnum } from 'src/app/class/HttpResponseEnum';
import { CreateEventResponse } from 'src/app/httpResponseBody/CreateEventResponse';
import { Event } from 'src/app/class/Event';
import { ThrowStmt } from '@angular/compiler';

@Component({
  selector: 'app-event-create',
  templateUrl: './event-create.component.html',
  styleUrls: ['./event-create.component.css'],
  providers: [{provide: NgbDateAdapter, useClass: NgbDateNativeUTCAdapter}]
})
export class EventCreateComponent implements OnInit {
  @ViewChild('content') content;
  date : Date ;
  time  = {hour: 0, minute: 0};
  minDate : any;
  request : CreateEventRequestBody;
  createdEvent : Event;

  constructor(
    private _router: Router,
    private _event: EventService,
    private dateAdapter: NgbDateAdapter<Date>,
    private _datePipe : DatePipe,
    private modalService: NgbModal 

  ) { }

  ngOnInit(): void {
    this.request = new CreateEventRequestBody();
    var today = new Date();
    this.minDate = new NgbDate(today.getFullYear() ,today.getMonth() ,today.getUTCDate());
  }


  goBackToEventDetail(){
    this._router.navigate(['event']);
  }

  createEvent(){
    
    var request = this.request;
    var dateTime = this.date;
    console.log(this.date);
    dateTime.setHours(this.time.hour);
    dateTime.setMinutes(this.time.minute);
    request.dateTime = this._datePipe.transform(dateTime,"dd/MM/yyyy HH:mm:ss");
    if(request.unlimitedParticipant){
      request.maxAttendee = null;
    }
    console.log(request.dateTime);

    this._event.createEvent(request).subscribe(
      res =>{
        if(res.status == HttpResponseEnum.SUCCESS){
          this.createdEvent = res.newEvent;
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
