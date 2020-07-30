import { basicHttpResponse } from './basicHttpResponse';

export interface BlacklistDetailResponse extends basicHttpResponse {
    name: string;
    gender: string;
    image64bit: string;
    objToken: string;
    age : Number;
}