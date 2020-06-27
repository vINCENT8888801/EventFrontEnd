import { basicHttpResponse } from './basicHttpResponse';
import { User } from '../class/User';

export interface RegisterUserResponse extends basicHttpResponse{
    newUser: User;
  }