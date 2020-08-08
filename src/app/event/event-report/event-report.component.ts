import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EventService } from 'src/app/event.service';
import { EventDetailRequestBody } from 'src/app/httpResquestBody/event-detail-request-body';
import { HttpResponseEnum } from 'src/app/class/HttpResponseEnum';

@Component({
  selector: 'app-event-report',
  templateUrl: './event-report.component.html',
  styleUrls: ['./event-report.component.css']
})
export class EventReportComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private _router: Router,
    private _event: EventService,
  ) { }
  saleData:any;
  attendanceData:any;
  temperatureData : any;
  colorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  };

  ngOnInit(): void {
    let id = this.route.snapshot.paramMap.get('id');
    let req = new EventDetailRequestBody();
    req.eventId = id;
    this._event.getEventReport(req).subscribe(res =>{
      if(res.status == HttpResponseEnum.SUCCESS)
          {
            this.saleData = JSON.parse(res.genderData);
            this.attendanceData = JSON.parse(res.attendanceData);
            this.temperatureData = JSON.parse(res.temperatureData);
          }else{
            
          }
    })
  }

  


}
