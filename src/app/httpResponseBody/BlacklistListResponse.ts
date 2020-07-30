import { basicHttpResponse } from './basicHttpResponse';
import { Blacklist } from '../class/Blacklist';

export interface BlacklistListResponse extends basicHttpResponse {
    blacklistList: Array<Blacklist>;
    error: string;
    totalPage: Float64Array;
  }