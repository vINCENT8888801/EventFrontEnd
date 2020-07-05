import {Component, OnInit} from '@angular/core';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(public _authService: AuthService,
    private _router: Router){}

  
    openNav() {
    document.getElementById("mySidenav").style.width = "250px";
  }
  
   closeNav() {
    document.getElementById("mySidenav").style.width = "0"; 
  }

  navBarRedirect(link){
    console.log(link);
    this.closeNav();
    this._router.navigate([link]);
  }
}
