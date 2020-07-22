import { Component, OnInit } from '@angular/core';
import { EventListRequestBody } from '../httpResquestBody/event-list-request-body';
import { EventService } from '../event.service';
import { Router } from '@angular/router';
import { HttpResponseEnum } from '../class/HttpResponseEnum';
import { Event } from '../class/Event';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  totalPage: Float64Array;
  currentPage: any;
  eventList: Array<Event>;
  ticketCode: string;

  constructor(private _event: EventService,
    private _router: Router,
  ) { }
  ngOnInit(): void {
    var req = new EventListRequestBody();
    this.currentPage = 1;
    req.pageRequested = this.currentPage - 1;
    this._event.getTodayEventList(req).subscribe(res => {
      if (res.status == HttpResponseEnum.SUCCESS) {
        this.eventList = res.eventList;
        this.totalPage = res.totalPage;
      } else {

      }
    })
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

  goToAttendance(eventId:string,event){
    localStorage.setItem('event', eventId);
    this._router.navigate(['/attendance', {id :event}]);
  }

}
