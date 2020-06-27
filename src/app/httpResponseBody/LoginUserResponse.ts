import { basicHttpResponse } from './basicHttpResponse';

export interface LoginUserResponse extends basicHttpResponse{
    jwt: string;
  }