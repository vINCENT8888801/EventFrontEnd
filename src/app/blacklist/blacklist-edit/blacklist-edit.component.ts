import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BlacklistService } from 'src/app/blacklist.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BlacklistDetailRequestBody } from 'src/app/httpResquestBody/blacklist-detail-request-body';
import { HttpResponseEnum } from 'src/app/class/HttpResponseEnum';
import { BlacklistDetailResponse } from 'src/app/httpResponseBody/BlacklistDetailResponse';
import { UpdateBlacklistRequestBody } from 'src/app/httpResquestBody/update-blacklist-request-body';
import { VerifyBlacklistImageResponse } from 'src/app/httpResponseBody/VerifyBlacklistImageResponse';
import { VerifyBlacklistImageRequest } from 'src/app/httpResquestBody/verify-blacklist-request-body';
import { Blacklist } from 'src/app/class/Blacklist';

@Component({
  selector: 'app-blacklist-edit',
  templateUrl: './blacklist-edit.component.html',
  styleUrls: ['./blacklist-edit.component.css']
})
export class BlacklistEditComponent implements OnInit {

  @ViewChild('content') content;
  response: BlacklistDetailResponse;
  imgString: string;
  request = new UpdateBlacklistRequestBody();
  imgChanged = false;
  loading: boolean;
  isPictureValidate = false;
  verifyBlacklistImageResponse: VerifyBlacklistImageResponse;
  verifyBlacklistImageRequest = new VerifyBlacklistImageRequest();
  updatedBlackList : Blacklist;

  constructor(
    private route: ActivatedRoute,
    private _router: Router,
    private _blacklist: BlacklistService,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
    let id = this.route.snapshot.paramMap.get('id');
    var req = new BlacklistDetailRequestBody();
    req.blackListId = id;
    this._blacklist.getBlacklistDetail(req).subscribe(res => {
      if (res.status == HttpResponseEnum.SUCCESS) {
        this.response = res;
        this.request.name = res.name;
        this.imgString = "data:image/png;base64," + res.image64bit;
        this.request.age = res.age;
        this.request.gender = res.gender;
      } else {

      }
    })

  }

 

  showModal() {
    this.modalService.open(this.content, { ariaLabelledBy: 'modal-basic-title' });
  }

  updateBlackList(){

    let request = this.request;
    request.id = this.route.snapshot.paramMap.get('id');
    request.isImgChanged = this.imgChanged;
    

    this._blacklist.updateBlacklistList(request).subscribe(
      res =>{
        if(res.status == HttpResponseEnum.SUCCESS){
          this.updatedBlackList = res.newBlacklist;
          this.showModal();
        }
      }
    )
  }



  goToMain() {
    this.modalService.dismissAll();
    this.goBackToBlacklistMain();
  }

  goBackToBlacklistMain(){
    this._router.navigate(['blacklist']);
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
            this.imgChanged = true;
            this.isPictureValidate = true;
            this.request.objToken = res.objToken;
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

}





const toBase64 = file => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => resolve(reader.result);
  reader.onerror = error => reject(error);
});