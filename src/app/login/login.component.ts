import { Component, OnInit } from '@angular/core';

import { AuthService } from '../auth.service';
import { Router } from '@angular/router'
import { LoginUserRequestBody } from '../httpResquestBody/login-user-request-body';
import { HttpResponseEnum } from '../class/HttpResponseEnum';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginUserData = new LoginUserRequestBody();
  invalidCredential = false;

  constructor(
    private _auth: AuthService,
    private _router: Router) { }

  ngOnInit() {
  }

  loginUser() {
    this._auth.loginUser(this.loginUserData)
      .subscribe(
        res => {
          if(res.status == HttpResponseEnum.SUCCESS)
          {
            localStorage.setItem('token', res.jwt);
            this._router.navigate(['/home']);
          }else{
            this.invalidCredential = true;
          }
        },
        err => console.log(err)
      )
  }

}