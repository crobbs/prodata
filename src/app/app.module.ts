import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SatFormComponent } from './sat/sat-form/sat-form.component';
import { MaterialModule } from './material/material.module';
import { MatRippleModule } from '@angular/material/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { LoginComponent } from './user/login/login.component';
import { FormsModule } from '@angular/forms';
import { HttpConfigInterceptor } from './interceptor/httpconfig.interceptor';
import { DynamicDialogComponent } from './utils/DynamicDialogComponent'
@NgModule({
  declarations: [
    AppComponent,
    SatFormComponent,
    DynamicDialogComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    MaterialModule,
    MatDialogModule,
    MatButtonModule,
    MatRippleModule,
    AppRoutingModule,
    FlexLayoutModule,
    HttpClientModule,
    BrowserAnimationsModule
  ],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: HttpConfigInterceptor, multi: true }, LoginComponent],

  bootstrap: [AppComponent]
})
export class AppModule { }
