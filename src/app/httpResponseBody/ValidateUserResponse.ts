import { basicHttpResponse } from './basicHttpResponse';
import { User } from '../class/User';

export interface ValidatedUserResponse extends basicHttpResponse {
    uniqueName: boolean;
    uniqueEmail: boolean;
}