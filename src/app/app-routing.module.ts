import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RegisterPage } from './register/register.page';
import { LoginPage } from './login/login.page';
import { MedicationPage } from './medication/medication.page';
import { CalendarPage } from './calendar/calendar.page';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'register', component: RegisterPage },
  { path: 'login', component: LoginPage },
  { path: 'medication', component: MedicationPage },
  { path: 'calendar', component: CalendarPage },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
