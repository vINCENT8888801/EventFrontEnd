import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EventListResponse } from './httpResponseBody/EventListResponse';
import { EventListRequestBody } from './httpResquestBody/event-list-request-body';
import { HTTP_OPTIONS } from './header.config';
import { EventDetailRequestBody } from './httpResquestBody/event-detail-request-body';
import { EventDetailResponse } from './httpResponseBody/EventDetailResponse';
import { UpdateEventRequestBody } from './httpResquestBody/update-event-request-body';
import { CreateEventResponse } from './httpResponseBody/CreateEventResponse';
import { CreateEventRequestBody } from './httpResquestBody/create-event_request-body';

@Injectable({
  providedIn: 'root'
})
export class EventService {

  private _hostUrl = "http://localhost:8080";
  private _eventListUrl = this._hostUrl + "/event/list";
  private _eventDetailUrl = this._hostUrl + "/event/detail";
  private _updateEventlUrl = this._hostUrl + "/event/edit";
  private _createEventUrl =this._hostUrl + "/event/create";

  constructor(
    private http: HttpClient
  ) { }

  getEventList(request: EventListRequestBody) {
    return this.http.post<EventListResponse>(this._eventListUrl, request);
  }

  getEventDetail(request: EventDetailRequestBody) {
    return this.http.post<EventDetailResponse>(this._eventDetailUrl, request);
  }

  updateEventDetail(request: UpdateEventRequestBody) {
    return this.http.post<CreateEventResponse>(this._updateEventlUrl, request);
  }

  createEvent(request: CreateEventRequestBody) {
    return this.http.post<CreateEventResponse>(this._createEventUrl, request);
  }
}
