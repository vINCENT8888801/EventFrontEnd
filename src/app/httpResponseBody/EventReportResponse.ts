import { Event } from '../class/Event';
import { basicHttpResponse } from './basicHttpResponse';

export interface EventReportResponse extends basicHttpResponse {
  genderData: string;
  attendanceData: string;
  temperatureData: string;
}