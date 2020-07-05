import { Event } from '../class/Event';
import { basicHttpResponse } from './basicHttpResponse';

export interface EventListResponse extends basicHttpResponse{
    eventList: Array<Event>;
    error: string;
    errorMessage : string;
  }