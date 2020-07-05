import { basicHttpResponse } from './basicHttpResponse'
import { Time } from '@angular/common'



export interface EventDetailResponse extends basicHttpResponse {
    id: string;
    name: string;
    unlimitedParticipant: boolean;
    maxAttendee: Number;
    dateTime: Date,
    currentParticipant: Number;
}