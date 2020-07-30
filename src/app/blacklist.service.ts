import { Injectable } from '@angular/core';
import { CreateBlacklistRequestBody } from './httpResquestBody/create-blacklist-request-body';
import { HttpClient } from '@angular/common/http';
import { CreateBlacklistResponse } from './httpResponseBody/createBlacklistResponse';
import { VerifyBlacklistImageRequest } from './httpResquestBody/verify-blacklist-request-body';
import { VerifyBlacklistImageResponse } from './httpResponseBody/VerifyBlacklistImageResponse';
import { BlacklistListRequestBody } from './httpResquestBody/blacklist-list-request-body';
import { BlacklistListResponse } from './httpResponseBody/BlacklistListResponse';
import { DeleteBlacklistRequestBody } from './httpResquestBody/delete-blacklist-request-body';
import { DeleteBlacklistResponse } from './httpResponseBody/DeleteBlacklistResponse';
import { BlacklistDetailRequestBody } from './httpResquestBody/blacklist-detail-request-body';
import { BlacklistDetailResponse } from './httpResponseBody/BlacklistDetailResponse';
import { UpdateBlacklistRequestBody } from './httpResquestBody/update-blacklist-request-body';

@Injectable({
  providedIn: 'root'
})
export class BlacklistService {

  private _hostUrl = "http://localhost:8080";
  private _createBlackListURL = this._hostUrl + "/blacklist/create";
  private _verifyBlacklistImageURL = this._hostUrl + "/blacklist/verify";
  private _updateBlacklistURL = this._hostUrl + "/blacklist/edit";
  private _blacklistListUrl = this._hostUrl + "/blacklist/list";
  private _blacklisttDetailUrl = this._hostUrl + "/blacklist/detail";
  private _deleteBlacklistUrl = this._hostUrl + "/blacklist/delete";

  constructor(
    private http : HttpClient
  ) { }

  deleteBlacklist(request: DeleteBlacklistRequestBody) {
    return this.http.post<DeleteBlacklistResponse>(this._deleteBlacklistUrl, request);
  }

  getBlacklistList(request: BlacklistListRequestBody) {
    return this.http.post<BlacklistListResponse>(this._blacklistListUrl, request);
  }

  updateBlacklistList(request: UpdateBlacklistRequestBody) {
    return this.http.post<CreateBlacklistResponse>(this._updateBlacklistURL, request);
  }

  getBlacklistDetail(request: BlacklistDetailRequestBody) {
    return this.http.post<BlacklistDetailResponse>(this._blacklisttDetailUrl, request);
  }

  createBlackList(request: CreateBlacklistRequestBody){
    return this.http.post<CreateBlacklistResponse>(this._createBlackListURL,request);
  }

  verifyBlacklistImage(request: VerifyBlacklistImageRequest){
    return this.http.post<VerifyBlacklistImageResponse>(this._verifyBlacklistImageURL,request);
  }
}
