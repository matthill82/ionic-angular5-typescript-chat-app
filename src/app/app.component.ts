import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { AuthService } from "../providers/auth/auth";
import { LoginPage } from '../pages/login/login';
import { ChatsPage } from "../pages/chats/chats";

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage;
  private platform;
  private splashScreen;

  constructor(platform: Platform, private statusBar: StatusBar, splashScreen: SplashScreen, private auth: AuthService) {
    this.platform = platform;
    this.splashScreen = splashScreen;
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });

    this.auth.afAuth.authState
      .subscribe(
        user => {
          if (user) {
            this.rootPage = ChatsPage;
          } else {
            this.rootPage = LoginPage;
          }
        },
        () => {
          this.rootPage = LoginPage;
        }
      );
  }
}

