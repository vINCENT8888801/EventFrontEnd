import { basicHttpResponse } from './basicHttpResponse';
import { Event } from '../class/Event';
import { Blacklist } from '../class/Blacklist';

export interface CreateBlacklistResponse extends basicHttpResponse {
    newBlacklist: Blacklist;
    image64bit: string;
}