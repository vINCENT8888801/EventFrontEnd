import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { RegisterUserRequestBody } from '../httpResquestBody/register-user-request-body';
import { RegisterUserResponse } from '../httpResponseBody/registerUserResponse';
import { HttpResponseEnum } from  '../class/HttpResponseEnum';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'] 
})
export class RegisterComponent implements OnInit {
  @ViewChild('content') content;
  response: RegisterUserResponse;
  closeResult = '';
  registerUserData = new RegisterUserRequestBody();
  constructor(private _auth: AuthService, 
              private _router: Router,
              private modalService: NgbModal) { }

  ngOnInit() {
    this.registerUserData.image64bit = "aaaa";
  }

  registerUser() {
    this._auth.registerUser(this.registerUserData)
    .subscribe(
      res => {
        console.log("response");
        this.response = res;
        console.log(this.response);
        if(this.response.status == HttpResponseEnum.SUCCESS){
          this.showModal();
        }
        
      },
      err => console.log(err)
    )      
  }

  showModal() {
    this.modalService.open(this.content, {ariaLabelledBy: 'modal-basic-title'});
  }

  goToLogin(){
    this.modalService.dismissAll();
    this._router.navigate(['/login'])
  }



}