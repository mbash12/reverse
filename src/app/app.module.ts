import { NgModule } from "@angular/core";
import {
  BrowserModule,
  HammerGestureConfig,
  HAMMER_GESTURE_CONFIG,
  HammerModule,
} from "@angular/platform-browser";
import { RouteReuseStrategy } from "@angular/router";

import { IonicModule, IonicRouteStrategy } from "@ionic/angular";
import { SplashScreen } from "@ionic-native/splash-screen/ngx";
import { StatusBar } from "@ionic-native/status-bar/ngx";

import { AppComponent } from "./app.component";
import { AppRoutingModule } from "./app-routing.module";
import { IonicStorageModule } from "@ionic/Storage";
import { HttpClientModule } from "@angular/common/http";
import { DocumentViewer } from "@ionic-native/document-viewer/ngx";
import * as Hammer from "hammerjs";
import { DoubleTapDirective } from "./directives/double-tap.directive";
import { SafePipe } from "./safe.pipe";
import { NativeAudio } from "@ionic-native/native-audio/ngx";
import { InAppBrowser } from "@ionic-native/in-app-browser/ngx";

export class CustomHammerConfig extends HammerGestureConfig {
  overrides = {
    press: { time: 500 },
    pan: {
      direction: Hammer.DIRECTION_ALL,
    },
  };
}
@NgModule({
  declarations: [AppComponent, DoubleTapDirective, SafePipe],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    IonicStorageModule.forRoot(),
    HttpClientModule,
    HammerModule,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    DocumentViewer,
    NativeAudio,
    InAppBrowser,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: HAMMER_GESTURE_CONFIG, useClass: CustomHammerConfig },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
