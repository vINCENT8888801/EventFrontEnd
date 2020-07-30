import { basicHttpResponse } from './basicHttpResponse';

export interface VerifyBlacklistImageResponse extends basicHttpResponse {

    gender: String;
    image64bit: String;
    objToken: String;
    age: number;
}