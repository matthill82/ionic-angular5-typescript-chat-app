import { NgModule } from '@angular/core';

import { IonicModule } from 'ionic-angular';
import { CommonModule } from '@angular/common';
import { GoogleLoginComponent } from './google-login/google-login';
import { SpinnerComponent } from './spinner/spinner';

@NgModule({
	declarations: [GoogleLoginComponent, SpinnerComponent,
    SpinnerComponent],
	imports: [CommonModule, IonicModule],
	exports: [GoogleLoginComponent, SpinnerComponent,
    SpinnerComponent]
})

export class ComponentsModule {}
