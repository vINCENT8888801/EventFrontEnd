import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { RegisterUserRequestBody } from '../httpResquestBody/register-user-request-body';
import { RegisterUserResponse } from '../httpResponseBody/registerUserResponse';
import { HttpResponseEnum } from '../class/HttpResponseEnum';
import { ValidatePictureRequestBody } from '../httpResquestBody/validate-picture-request-body';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  @ViewChild('content') content;
  @ViewChild('getPicture') getPicture;
  @ViewChild('getDetail') getDetail;

  loading = false;
  uniqueName = true;
  uniqueEmail = true;
  response: RegisterUserResponse;
  closeResult = '';
  registerUserData: RegisterUserRequestBody;
  validatePictureRequestBody = new ValidatePictureRequestBody();
  imgString: String;
  isPictureValidate = false;
  firstTime = true;

  constructor(private _auth: AuthService,
    private _router: Router,
    private modalService: NgbModal) { }

  ngOnInit() {
    this.registerUserData = new RegisterUserRequestBody();
    this.registerUserData.image64bit = "aaaa";

  }

  validateUser() {
    this._auth.validateUser(this.registerUserData)
      .subscribe(
        res => {

          if (res.status == HttpResponseEnum.SUCCESS) {
            this.showStep2();
          } else {
            this.uniqueEmail = res.uniqueEmail;
            this.uniqueName = res.uniqueName;
          }

        },
        err => console.log(err)
      )

  }

  showModal() {
    this.modalService.open(this.content, { ariaLabelledBy: 'modal-basic-title', backdrop: 'static' });
  }

  showStep2() {
    this.modalService.open(this.getPicture, { ariaLabelledBy: 'modal-basic-title', backdrop: 'static' });
  }

  goToLogin() {
    this.modalService.dismissAll();
    this._router.navigate(['/login'])
  }

  async onFileChanged(event) {
    this.loading = true;
    const file = event.target.files[0];
    await toBase64(file).then((string: String) => {
      var base64 = string.replace('data:', '').replace(/^.+,/, '');
      console.log(base64);
      this.validatePictureRequestBody.image64 = base64;
      this._auth.validatePicture(this.validatePictureRequestBody).subscribe(
        res => {
          this.firstTime = false;
          this.loading = false;
          if (res.status == HttpResponseEnum.SUCCESS) {
            this.isPictureValidate = true;
            this.registerUserData.age = res.age;
            this.registerUserData.gender = res.gender;
            this.imgString = "data:image/png;base64," + res.image64bit;
            this.registerUserData.image64bit = base64;
          } else {
            this.isPictureValidate = false;
          }

        },
        err => console.log(err)
      )

    })


  }
  
  offUniqueEmail() {
    this.uniqueEmail = true;
  }
  toRegisterDetail() {
    this.modalService.dismissAll();
    this.modalService.open(this.getDetail, { ariaLabelledBy: 'modal-basic-title', backdrop: 'static' });
  }

  registerUser() {
    this._auth.registerUser(this.registerUserData)
      .subscribe(
        res => {
          console.log("response");
          this.response = res;
          console.log(this.response);
          if (this.response.status == HttpResponseEnum.SUCCESS) {
            this.modalService.dismissAll();
            this.showModal();
          }

        },
        err => console.log(err)
      )
  }
}

const toBase64 = file => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => resolve(reader.result);
  reader.onerror = error => reject(error);
});