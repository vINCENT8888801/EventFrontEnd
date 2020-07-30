import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { WebcamModule } from 'ngx-webcam';
//import { AuthGuard } from './auth.guard';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgxChartsModule }from '@swimlane/ngx-charts';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AttendanceModeComponent } from './attendance-mode/attendance-mode.component';
import { NgbModule, NgbDateAdapter, NgbDateNativeAdapter } from '@ng-bootstrap/ng-bootstrap';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { TokenInterceptorService } from './token-interceptor.service';
import { HomeComponent } from './home/home.component';
import { DatePipe } from '@angular/common';
import { EventCreateComponent } from './event/event-create/event-create.component';
import { EventMainComponent } from './event/event-main/event-main.component';
import { EventDetailComponent } from './event/event-detail/event-detail.component';
import { InjectableRxStompConfig, RxStompService, rxStompServiceFactory } from '@stomp/ng2-stompjs';
import { myRxStompConfig } from './RxStompService';
import { BlacklistMainComponent } from './blacklist/blacklist-main/blacklist-main.component';
import { BlacklistCreateComponent } from './blacklist/blacklist-create/blacklist-create.component';
import { BlacklistEditComponent } from './blacklist/blacklist-edit/blacklist-edit.component';
import { BlacklistService } from './blacklist.service';
import { EventReportComponent } from './event/event-report/event-report.component';


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
    EventDetailComponent,
    BlacklistCreateComponent,
    BlacklistEditComponent,
    EventReportComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    NgxChartsModule,
    HttpClientModule,
    FormsModule,
    WebcamModule,
    AppRoutingModule,
    NgbModule
  ],
  providers: [AuthService, AuthGuard, DatePipe,BlacklistService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptorService,
      multi: true
    }, {
      provide: InjectableRxStompConfig,
      useValue: myRxStompConfig
    },
    {
      provide: RxStompService,
      useFactory: rxStompServiceFactory,
      deps: [InjectableRxStompConfig]
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
