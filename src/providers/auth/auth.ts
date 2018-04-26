import {Injectable} from '@angular/core';
import {AngularFireAuth} from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import {DataService} from "../data/data";

/*
  Generated class for the AuthProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/

@Injectable()
export class AuthService {

  user: firebase.User;

  constructor(public afAuth: AngularFireAuth,
              private dataService: DataService) {

    afAuth.authState.subscribe(user => {
      if(user !== null) {
        console.log(user);
        this.onceGetUser(user.uid).then(snapshot => this.dataService.userData = snapshot.val());
      }
    });

  }

  private createUser(user) {

    const data = {
      id: user.uid,
      email: user.email,
      displayName: user.displayName,
      bgColour: '' + (Math.random() * 0xFFFFFF << 0).toString(16).toUpperCase()
    };

    this.userData(data);

    return firebase.database().ref(`room1/users/${user.uid}`).set(data);
  }

  private onceGetUser(uid) {
    return firebase.database().ref(`room1/users/${uid}`).once('value');
  }

  signInWithGoogle() {
    console.log('Sign in with google');
    const provider = new firebase.auth.GoogleAuthProvider();
    return this.oAuthSignIn(provider);
  }

  private oAuthSignIn(provider) {
    if (!(<any>window).cordova) {
      return this.afAuth.auth.signInWithPopup(provider);
    } else {
      return this.afAuth.auth.signInWithRedirect(provider)
        .then(() => this.afAuth.auth.getRedirectResult())
        .then((result) => {
          this.createUser(result.user);
        }).catch((error) => {
          // Handle Errors here.
          alert(error.message);
        });
    }
  }

  userData(data) {
    this.dataService.userData = data;
  }

  signOut(): Promise<void> {
    return this.afAuth.auth.signOut().then(() => {
    });
  }

}
