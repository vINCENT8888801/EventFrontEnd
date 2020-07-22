import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { EventService } from 'src/app/event.service';
import { EventListRequestBody } from 'src/app/httpResquestBody/event-list-request-body';
import { HttpResponseEnum } from 'src/app/class/HttpResponseEnum';
import { Event } from 'src/app/class/Event';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GenerateTicketCodeRequestBody } from 'src/app/httpResquestBody/generate-ticket-request-body';

@Component({
  selector: 'app-event-main',
  templateUrl: './event-main.component.html',
  styleUrls: ['./event-main.component.css']
})
export class EventMainComponent implements OnInit {
  @ViewChild("loading") loading;
  @ViewChild("ticket") ticket;
  totalPage: Float64Array;
  currentPage: any;
  eventList: Array<Event>;
  ticketCode: string;

  constructor(private _event: EventService,
    private _router: Router,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
    var req = new EventListRequestBody();
    this.currentPage = 1;
    req.pageRequested = this.currentPage - 1;
    this._event.getEventList(req).subscribe(res => {
      if (res.status == HttpResponseEnum.SUCCESS) {
        this.eventList = res.eventList;
        this.totalPage = res.totalPage;
      } else {

      }
    })
  }

  goToDetail(id) {
    this._router.navigate(['/eventDetail', { id: id }]);
  }

  getPage() {
    var req = new EventListRequestBody();
    req.pageRequested = this.currentPage - 1;
    this._event.getEventList(req).subscribe(res => {
      if (res.status == HttpResponseEnum.SUCCESS) {
        this.eventList = res.eventList;
        this.totalPage = res.totalPage;
      } else {

      }
    })
  }

  GenerateTicket(id) {
    this.modalService.open(this.loading, { ariaLabelledBy: 'modal-basic-title' });
    var req = new GenerateTicketCodeRequestBody();
    req.eventId = id;
    this._event.generateTicketCode(req).subscribe(res =>{
      if (res.status == HttpResponseEnum.SUCCESS) {
        this.modalService.dismissAll();
        this.modalService.open(this.ticket, { ariaLabelledBy: 'modal-basic-title' });
        this.ticketCode = res.ticket.ticketNo;
      } else {

      }
    })

  }
}
