import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { AuthGuard } from './auth.guard';
import { EventMainComponent } from './event/event-main/event-main.component';
import { EventDetailComponent } from './event/event-detail/event-detail.component';
import { EventCreateComponent } from './event/event-create/event-create.component';
import { AttendanceModeComponent } from './attendance-mode/attendance-mode.component';
import { BlacklistMainComponent } from './blacklist/blacklist-main/blacklist-main.component';
import { BlacklistCreateComponent } from './blacklist/blacklist-create/blacklist-create.component';
import { BlacklistEditComponent } from './blacklist/blacklist-edit/blacklist-edit.component';
import { EventReportComponent } from './event/event-report/event-report.component';



const routes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'home',
    canActivate: [AuthGuard],
    component: HomeComponent
  },
  {
    path: 'event',
    canActivate: [AuthGuard],
    component: EventMainComponent
  },
  {
    path: 'eventDetail',
    canActivate: [AuthGuard],
    component: EventDetailComponent
  },
  {
    path: 'eventReport',
    canActivate: [AuthGuard],
    component: EventReportComponent
  },
  {
    path: 'eventCreate',
    canActivate: [AuthGuard],
    component: EventCreateComponent 
  },
  {
    path: 'attendance',
    canActivate: [AuthGuard],
    component: AttendanceModeComponent
  },
  {
    path: 'blacklist',
    canActivate: [AuthGuard],
    component: BlacklistMainComponent
  },
  {
    path: 'blacklistDetail',
    canActivate: [AuthGuard],
    component: BlacklistEditComponent
  },
  {
    path: 'blacklistCreate',
    canActivate: [AuthGuard],
    component: BlacklistCreateComponent 
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
