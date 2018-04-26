import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LoginPage } from './login';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
    LoginPage,
  ],
  imports: [
    IonicPageModule.forChild(LoginPage),
    CommonModule,
  ],
  exports: [
    LoginPage
  ]
})

export class LoginPageModule {}
