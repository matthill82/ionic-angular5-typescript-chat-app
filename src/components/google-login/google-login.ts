import {Component} from '@angular/core';
import { NavController, ToastController } from "ionic-angular";

import { AuthService } from "../../providers/auth/auth";
import { ChatsPage } from "../../pages/chats/chats";

/**
 * Generated class for the GoogleLoginComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'google-login',
  templateUrl: 'google-login.html'
})

export class GoogleLoginComponent {

  constructor(public navCtrl: NavController, public auth: AuthService, public toastCtrl: ToastController) {}

  private presentToast(text) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }

  loginWithGoogle() {

    this.auth.signInWithGoogle()
      .then(
        () => this.navCtrl.setRoot(ChatsPage),
        error => {
          this.presentToast(`we are having a problem at the moment ${error.message}`);
        }
      );
  }
}
