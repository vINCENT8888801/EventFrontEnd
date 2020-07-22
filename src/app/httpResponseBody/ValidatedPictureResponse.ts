import { basicHttpResponse } from './basicHttpResponse';

export interface ValidatePictureResponse extends basicHttpResponse {
    image64bit: string;
    objToken: string;
    age: number;
    gender : string;
}