import { Component, OnInit, ViewChild } from '@angular/core';
import { CreateEventRequestBody } from 'src/app/httpResquestBody/create-event_request-body';
import { Router } from '@angular/router';
import { EventService } from 'src/app/event.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpResponseEnum } from 'src/app/class/HttpResponseEnum';
import { BlacklistService } from 'src/app/blacklist.service';
import { CreateBlacklistRequestBody } from 'src/app/httpResquestBody/create-blacklist-request-body';
import { Blacklist } from 'src/app/class/Blacklist';
import { VerifyBlacklistImageResponse } from 'src/app/httpResponseBody/VerifyBlacklistImageResponse';
import { VerifyBlacklistImageRequest } from 'src/app/httpResquestBody/verify-blacklist-request-body';
import { CreateBlacklistResponse } from 'src/app/httpResponseBody/createBlacklistResponse';

@Component({
  selector: 'app-blacklist-create',
  templateUrl: './blacklist-create.component.html',
  styleUrls: ['./blacklist-create.component.css']
})
export class BlacklistCreateComponent implements OnInit {
  @ViewChild('content') content; 
  request : CreateBlacklistRequestBody;
  createdBlackList : Blacklist;
  imgString : string;
  loading : boolean;
  isPictureValidate = false;
  verifyBlacklistImageResponse : VerifyBlacklistImageResponse;
  verifyBlacklistImageRequest = new VerifyBlacklistImageRequest();
  res : CreateBlacklistResponse;

  constructor(
    private _router: Router,
    private _blacklist : BlacklistService,
    private modalService: NgbModal 
    
  ) { }

  ngOnInit(): void {
    this.request = new CreateBlacklistRequestBody();
  }


  goBackToBlacklistMain(){
    this._router.navigate(['blacklist']);
  }

  createBlacklist(){
    let request = this.request;

    this._blacklist.createBlackList(request).subscribe(
      res =>{
        if(res.status == HttpResponseEnum.SUCCESS){
          this.res = res;
          this.createdBlackList = res.newBlacklist;
          this.showModal();
        }
      }
    )
  }

  showModal() {
    this.modalService.open(this.content, {ariaLabelledBy: 'modal-basic-title'});
  }


  async onFileChanged(event) {
    this.isPictureValidate = false;
    this.loading = true;
    const file = event.target.files[0];
    await toBase64(file).then((string: String) => {
      var base64 = string.replace('data:', '').replace(/^.+,/, '');
      console.log(base64);
      this.verifyBlacklistImageRequest.image64bit = base64;
      this._blacklist.verifyBlacklistImage(this.verifyBlacklistImageRequest).subscribe(
        res => {
          this.loading = false;
          if (res.status == HttpResponseEnum.SUCCESS) {
            this.isPictureValidate = true;
            this.request.objectToken = res.objToken;
            this.request.age = res.age;
            this.request.gender = res.gender;
            this.imgString = "data:image/png;base64," + res.image64bit;
            this.request.image64bit = base64;
          } else {
            this.isPictureValidate = false;
          }

        },
        err => console.log(err)
      );

    })


  }
  goToMain(){
    this.modalService.dismissAll();
    this.goBackToBlacklistMain();
  }

}

const toBase64 = file => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => resolve(reader.result);
  reader.onerror = error => reject(error);
});