import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Router } from '@angular/router'
import { RegisterUserResponse } from './httpResponseBody/registerUserResponse';
import { LoginUserResponse } from './httpResponseBody/loginUserResponse';
import { ValidatedUserResponse } from './httpResponseBody/ValidateUserResponse';
import { ValidatePictureResponse } from './httpResponseBody/ValidatedPictureResponse';
import { ValidatePictureRequestBody } from './httpResquestBody/validate-picture-request-body';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _hostUrl = "http://localhost:8080";
  private _registerUrl = this._hostUrl + "/authenticate/register/user";
  private _loginUrl = this._hostUrl + "/authenticate/login";
  private _validateRegisterUrl = this._hostUrl + "/authenticate/register/user/validate";
  private _validatePictureUrl = this._hostUrl + "/authenticate/register/getObjToken";


  constructor(private http: HttpClient,
              private _router: Router) { }

  registerUser(user) {
    return this.http.post<RegisterUserResponse>(this._registerUrl, user)
  }

  loginUser(user) {
    return this.http.post<LoginUserResponse>(this._loginUrl, user)
  }

  validateUser(user) {
    return this.http.post<ValidatedUserResponse>(this._validateRegisterUrl, user)
  }

  validatePicture(request: ValidatePictureRequestBody) {
    return this.http.post<ValidatePictureResponse>(this._validatePictureUrl, request)
  }
  

  logoutUser() {
    localStorage.removeItem('token')
    this._router.navigate(['/login'])
  }

  getToken() {
    return localStorage.getItem('token')
  }

  loggedIn() {
    return !!localStorage.getItem('token')
  }
}
