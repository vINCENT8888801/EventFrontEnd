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
import { GenerateTicketCodeRequestBody } from './httpResquestBody/generate-ticket-request-body';
import { GenerateTicketResponse } from './httpResponseBody/GenerateTicketResponse';
import { RegisterWalkInRequestBody } from './httpResquestBody/register-walk-in-request-body';
import { RegisterWalkInResponse } from './httpResponseBody/RegisterWalkInResponse';
import { EventReportResponse } from './httpResponseBody/EventReportResponse';
import { DeleteEventRequestBody } from './httpResquestBody/delete-event-request-body';
import { DeleteEventResponse } from './httpResponseBody/DeleteEventResponse';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EventService {

  private _hostUrl = environment.hostUrl;
  private _eventListUrl = this._hostUrl + "/event/list";
  private _eventDetailUrl = this._hostUrl + "/event/detail";
  private _updateEventlUrl = this._hostUrl + "/event/edit";
  private _createEventUrl =this._hostUrl + "/event/create";
  private _createTicketUrl =this._hostUrl + "/ticket/create";
  private _registerWalkInUrl =this._hostUrl + "/ticket/registerwalkin";
  private _getTodayEventURl =this._hostUrl + "/event/today";
  private _getEventReportURL =this._hostUrl + "/event/report";
  private _deleteEventURL = this._hostUrl + "/event/delete";

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

  generateTicketCode(request: GenerateTicketCodeRequestBody) {
    return this.http.post<GenerateTicketResponse>(this._createTicketUrl, request);
  }

  registerWalkIn(request: RegisterWalkInRequestBody) {
    return this.http.post<RegisterWalkInResponse>(this._registerWalkInUrl, request);
  }

  getTodayEventList(request: EventListRequestBody) {
    return this.http.post<EventListResponse>(this._getTodayEventURl, request);
  }

  getEventReport(request: EventDetailRequestBody){
    return this.http.post<EventReportResponse>(this._getEventReportURL, request);
  }

  deleteEvent(request: DeleteEventRequestBody){
    return this.http.post<DeleteEventResponse>(this._deleteEventURL, request);
  }
}
