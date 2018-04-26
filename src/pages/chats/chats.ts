import {Component} from '@angular/core';
import {IonicPage, NavController, ToastController, LoadingController} from 'ionic-angular';
import {Camera, CameraOptions} from '@ionic-native/camera';
import {Observable} from "rxjs/Observable";
import {AngularFireDatabase, AngularFireList} from "angularfire2/database";
import {DataService} from "../../providers/data/data";
import * as firebase from 'firebase/app';
import 'rxjs/add/operator/map';

/**
 * Generated class for the ChatsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

interface chatObj {
  messageText: string,
  dateTimeAdded: string,
  photoUrl: string,
  user: {
    bgColour: string,
    displayName: string,
    id: string,
  }
}

@IonicPage()
@Component({
  selector: 'page-chats',
  templateUrl: 'chats.html',
})

export class ChatsPage {

  items: Observable<any>;
  itemsRef: AngularFireList<any>;
  valueOfInput: string = '';

  selectedPhoto: any; // base64
  currentImage: any;
  filePath: string;
  showSpinner: boolean = true;

  constructor(public navCtrl: NavController,
              db: AngularFireDatabase,
              private camera: Camera,
              private toastCtrl: ToastController,
              private dataService: DataService,
              public loadingCtrl: LoadingController) {

    this.itemsRef = db.list('room1/chats');

    // Use snapshotChanges().map() to store the key
    this.items = this.itemsRef.snapshotChanges().map(changes => {
      this.showSpinner = false;
      return changes.map(c => ({key: c.payload.key, ...c.payload.val()}));
    });
  }

  private presentToast(text) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 2000,
      position: 'top'
    });
    toast.present();
  }

  grabPicture() {

    const options: CameraOptions = {
      quality: 85,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    };

    this.camera.getPicture(options).then((imageData) => {
      this.selectedPhoto = this.dataURItoBlob('data:image/jpeg;base64,' + imageData);
      this.upload();
    }, (err) => {
      console.log('error', err);
    });
  }

  dataURItoBlob(dataURI) {
    // code adapted from: http://stackoverflow.com/questions/33486352/cant-upload-image-to-aws-s3-from-ionic-camera
    let binary = atob(dataURI.split(',')[1]);
    let array = [];
    for (let i = 0; i < binary.length; i++) {
      array.push(binary.charCodeAt(i));
    }
    return new Blob([new Uint8Array(array)], {type: 'image/jpeg'});
  };

  upload() {
    if (this.selectedPhoto) {
      const uploadTask = firebase.storage().ref().child(`firebase_chat_image_${ new Date().getTime() }.jpg`).put(this.selectedPhoto);
      uploadTask.then(this.onSuccess, this.onError);
    }
  }

  onSuccess = (snapshot) => {
    this.currentImage = snapshot.downloadURL;
    // this.presentToast(`You've got a great eye for detail, and your image has been accepted`)
  };

  onError = (error) => {
    this.presentToast(`Ooopsy daisy.....something has gone wrong ${error}`);
  };

  addChat(chat?: string) {

    const {bgColour, displayName, id} = this.dataService.userData;

    const chatObj = {
      messageText: chat,
      dateTimeAdded: Date.now(),
      photoUrl: this.currentImage ? this.currentImage : null,
      user: {
        bgColour,
        displayName,
        id,
      }
    };

    this.itemsRef.push(chatObj);
    this.clearSearch();

    this.currentImage = null;

  }

  displayNameInitials(initialsData) {
    const valueOfWords = /\b\w/g;
    let initials:any = initialsData.match(valueOfWords) || [];
    return initials = ((initials.shift() || '') + (initials.pop() || '')).toUpperCase();
  }

  clearSearch() {
    this.valueOfInput = null;
  }
}
