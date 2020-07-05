import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { WebcamModule } from 'ngx-webcam';
//import { AuthGuard } from './auth.guard';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AttendanceModeComponent } from './attendance-mode/attendance-mode.component';
import { NgbModule, NgbDateAdapter, NgbDateNativeAdapter } from '@ng-bootstrap/ng-bootstrap';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { TokenInterceptorService } from './token-interceptor.service';
import { HomeComponent } from './home/home.component';
import { BlacklistMainComponent } from './blacklist-main/blacklist-main.component';
import { DatePipe } from '@angular/common';
import { EventCreateComponent } from './event/event-create/event-create.component';
import { EventMainComponent } from './event/event-main/event-main.component';
import { EventDetailComponent } from './event/event-detail/event-detail.component';


@NgModule({
  declarations: [
    AppComponent,
    AttendanceModeComponent,
    RegisterComponent,
    LoginComponent,
    HomeComponent,
    EventCreateComponent,
    EventMainComponent,
    BlacklistMainComponent,
    EventDetailComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    WebcamModule,
    AppRoutingModule,
    NgbModule
  ],
  providers: [AuthService, AuthGuard,DatePipe,
    {
    provide: HTTP_INTERCEPTORS,
    useClass: TokenInterceptorService,
    multi: true
  }],
  bootstrap: [AppComponent]
})
export class AppModule {
}
