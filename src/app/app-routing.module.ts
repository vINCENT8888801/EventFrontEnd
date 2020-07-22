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
    //canActivate: [AuthGuard],
    component: EventDetailComponent
  },
  {
    path: 'eventCreate',
    //canActivate: [AuthGuard],
    component: EventCreateComponent 
  },
  {
    path: 'attendance',
    //canActivate: [AuthGuard],
    component: AttendanceModeComponent
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
