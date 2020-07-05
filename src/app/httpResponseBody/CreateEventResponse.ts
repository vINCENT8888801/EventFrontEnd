import { basicHttpResponse } from './basicHttpResponse';
import { Event } from '../class/Event';

export interface CreateEventResponse extends basicHttpResponse {
    newEvent : Event;
}