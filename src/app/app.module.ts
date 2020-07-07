import { NgModule, LOCALE_ID } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { Camera } from '@ionic-native/camera/ngx';
import { CallNumber } from '@ionic-native/call-number/ngx';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { LaunchNavigator } from '@ionic-native/launch-navigator/ngx';
import { HttpClientModule } from '@angular/common/http';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { FileTransfer } from '@ionic-native/file-transfer/ngx';
import { File } from '@ionic-native/file/ngx';
import { Diagnostic } from '@ionic-native/diagnostic/ngx';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
import { Network } from '@ionic-native/network/ngx';
import { registerLocaleData } from '@angular/common';
import ptBr from '@angular/common/locales/pt';
import { LottieSplashScreen } from '@ionic-native/lottie-splash-screen/ngx';
registerLocaleData(ptBr);

export const FirebaseConfig = {
  apiKey: "AIzaSyBONv-bjEld3nVSezNW3h-fchV2GEPmc6o",
  authDomain: "rotas-sip.firebaseapp.com",
  databaseURL: "https://rotas-sip.firebaseio.com",
  projectId: "rotas-sip",
  storageBucket: "rotas-sip.appspot.com",
  messagingSenderId: "1031452850804",
  appId: "1:1031452850804:web:176c09ff93482f4a7cef21",
  measurementId: "G-31DF3RTL8E"
}
@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(), 
    BrowserAnimationsModule,
    AppRoutingModule, 
    AngularFireModule.initializeApp(FirebaseConfig),
    AngularFirestoreModule,
    AngularFireStorageModule,
    AngularFireAuthModule,
    HttpClientModule 
  ],
  providers: [
    Geolocation,
    LaunchNavigator,
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    Camera,
    CallNumber,
    SocialSharing,
    NativeStorage,
    FileTransfer,
    File,
    Diagnostic,
    LocationAccuracy,
    Network,
    LottieSplashScreen,
    { provide: LOCALE_ID, useValue: 'pt' }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
