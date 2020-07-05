import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EventService } from 'src/app/event.service';
import { EventListRequestBody } from 'src/app/httpResquestBody/event-list-request-body';
import { HttpResponseEnum } from 'src/app/class/HttpResponseEnum';
import { Event } from 'src/app/class/Event';

@Component({
  selector: 'app-event-main',
  templateUrl: './event-main.component.html',
  styleUrls: ['./event-main.component.css']
})
export class EventMainComponent implements OnInit {

  totalPage: Number;
  currentPage: Number;
  eventList: Array<Event>;

  constructor(private _event: EventService,
    private _router: Router) { }

  ngOnInit(): void {
    var req = new EventListRequestBody();
    this.currentPage = 0;
    req.pageRequested = this.currentPage;
    this._event.getEventList(req).subscribe(res =>{
      if(res.status == HttpResponseEnum.SUCCESS)
          {
            this.eventList = res.eventList;
          }else{
            
          }
    })
  }

  goToDetail(id){
    this._router.navigate(['/eventDetail', { id: id }]);
  }
}
