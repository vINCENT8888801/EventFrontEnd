import { basicHttpResponse } from './basicHttpResponse';
import { Event } from '../class/Event';
import { Ticket } from '../class/Ticket';

export interface GenerateTicketResponse extends basicHttpResponse {
    eventId : string;
    ticket : Ticket;
}