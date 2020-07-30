import { Component, OnInit, ViewChild } from '@angular/core';
import { BlacklistService } from 'src/app/blacklist.service';
import { BlacklistListRequestBody } from 'src/app/httpResquestBody/blacklist-list-request-body';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpResponseEnum } from 'src/app/class/HttpResponseEnum';
import { Blacklist } from 'src/app/class/Blacklist';
import { DeleteBlacklistRequestBody } from 'src/app/httpResquestBody/delete-blacklist-request-body';

@Component({
  selector: 'app-blacklist-main',
  templateUrl: './blacklist-main.component.html',
  styleUrls: ['./blacklist-main.component.css']
})
export class BlacklistMainComponent implements OnInit {
  @ViewChild("successDelete") successDelete;
  totalPage: Float64Array;
  currentPage: any;
  blacklistList: Array<Blacklist>;
  ticketCode: string;

  constructor(private _blacklist: BlacklistService,
    private _router: Router,
    private modalService: NgbModal,
  ) { }

  ngOnInit(): void {
    var req = new BlacklistListRequestBody();
    this.currentPage = 1;
    req.pageRequested = this.currentPage - 1;
    this._blacklist.getBlacklistList(req).subscribe(res => {
      if (res.status == HttpResponseEnum.SUCCESS) {
        this.blacklistList = res.blacklistList;
        this.totalPage = res.totalPage;
      } else {

      }
    })
  }

  goToDetail(id) {
    this._router.navigate(['/blacklistDetail', { id: id }]);
  }

  delete(id) {
    let req = new DeleteBlacklistRequestBody();
    req.blacklistId = id;
    this._blacklist.deleteBlacklist(req).subscribe(res => {
      if (res.status == HttpResponseEnum.SUCCESS) {
        this.modalService.open(this.successDelete, { ariaLabelledBy: 'modal-basic-title' });
        
      } else {

      }
    })
  }

  getPage() {
    var req = new BlacklistListRequestBody();
    req.pageRequested = this.currentPage - 1;
    this._blacklist.getBlacklistList(req).subscribe(res => {
      if (res.status == HttpResponseEnum.SUCCESS) {
        this.blacklistList = res.blacklistList;
        this.totalPage = res.totalPage;
      } else {

      }
    })
  }

  refreshPage(){
    location.reload();
  }
  

}
