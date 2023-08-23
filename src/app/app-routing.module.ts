import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SatFormComponent } from './sat/sat-form/sat-form.component';
import { LoginComponent } from './user/login/login.component';

const routes: Routes = [
  { path: 'sat', component: SatFormComponent },
  { path: 'login', component: LoginComponent },
  { path: '', component: LoginComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
