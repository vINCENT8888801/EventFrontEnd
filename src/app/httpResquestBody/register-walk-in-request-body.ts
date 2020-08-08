import { EventDetailComponent } from '../event/event-detail/event-detail.component';

export class RegisterWalkInRequestBody {

    constructor(
    ) { }

    public eventId: number;
    public email: String;
    public name: String;
    public password: String;
    public image64bit: String;
    public age: number;
    public gender: String;
    public objToken: String;
    public temperature: number;
}