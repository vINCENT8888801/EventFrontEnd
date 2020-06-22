import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {AppComponent} from './app.component';
import {FormsModule} from '@angular/forms';
import {WebcamModule} from 'ngx-webcam';
import { AppRoutingModule } from './app-routing.module';
import { AttendanceModeComponent } from './attendance-mode/attendance-mode.component';


@NgModule({
  declarations: [
    AppComponent,
    AttendanceModeComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    WebcamModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
