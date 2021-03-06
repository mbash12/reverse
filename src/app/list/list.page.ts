import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { NativeAudio } from "@ionic-native/native-audio/ngx";
import { Platform } from "@ionic/angular";
import { InAppBrowser } from "@ionic-native/in-app-browser/ngx";

@Component({
  selector: "app-list",
  templateUrl: "./list.page.html",
  styleUrls: ["./list.page.scss"],
})
export class ListPage implements OnInit {
  public isLoading = true;
  public appName;
  public slogan;
  public isTrial;
  public graphicStyle = null;
  public videoBackground = null;
  public appNameStyle;
  public sloganStyle;
  public listStyle;
  public songList;
  public graphicBackground = null;
  constructor(
    public route: ActivatedRoute,
    public router: Router,
    public httpClient: HttpClient,
    public platform: Platform,
    private nativeAudio: NativeAudio,
    private iab: InAppBrowser
  ) {
    this.platform.ready().then(() => {
      this.nativeAudio
        .preloadSimple("uniqueId1", "assets/audio/multimedia_button_click_015.mp3")
        .then(
          (success) => {
            // console.log("success");
          },
          (error) => {
            console.log(error);
          }
        );
    });
    this.route.queryParams.subscribe((params) => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.isTrial = this.router.getCurrentNavigation().extras.state.trial;
        this.getSetting(this.isTrial);
      }
    });
  }

  ngOnInit() {
    this.isLoading = false;
  }
  public getSetting(isTrial) {
    let settingPath = "../../assets/contents/settings/settings.json";
    if (isTrial == true) {
      settingPath = "../../assets/contents/settings/trial.json";
    }
    let settingData;
    this.httpClient.get(settingPath).subscribe((data) => {
      settingData = data;
      this.appName = settingData.appName;
      this.slogan = settingData.slogan;
      if (settingData.graphic !== "") {
        this.graphicStyle = {
          "background-color": settingData.backgroundColor,
          "background-image":
            "url(/assets/contents/" + settingData.graphic + ")",
          "background-position": settingData.backgroundPosition,
          opacity: settingData.backgroundOpacity,
        };
        this.graphicBackground = settingData.graphic;
      } else if (settingData.video !== "") {
        // this.graphicStyle = {
        // "background-color": settingData.backgroundColor,
        // "background-position": settingData.backgroundPosition,
        // opacity: settingData.backgroundOpacity,
        // };
        this.videoBackground = "/assets/contents/" + settingData.video;
      }
      this.appNameStyle = {
        "text-align": settingData.titleAlign,
        color: settingData.titleColor,
        "font-family": settingData.titleFont,
        "font-size": settingData.titleSize,
        height: settingData.titleHeight,
        padding: "15px",
      };
      this.sloganStyle = {
        "text-align": settingData.sloganAlign,
        color: settingData.sloganColor,
        "font-family": settingData.titleFont,
        "font-size": settingData.sloganSize,
        height: settingData.sloganHeight,
      };
      this.listStyle = {
        "text-align": settingData.listAlign,
        color: settingData.listColor,
        "font-family": settingData.listFont,
        "font-size": settingData.listSize,
        height: settingData.listHeight,
      };

      let listData;
      this.httpClient
        .get("/assets/contents/" + settingData.songList)
        .subscribe((data1) => {
          listData = data1;
          this.songList = listData;
        });
    });
  }
  public openPage(url, type) {
    this.nativeAudio.play("uniqueId1").then(
      (success) => {
        // console.log("success playing");
      },
      (error) => {
        console.log(error);
      }
    );
    setTimeout(() => {
      if (type == "page") {
        //   this.iab.create(url, "_blank");
        //   // window.open(url, "_system", "location=yes");
        console.log(type + "/" + encodeURIComponent(url));
        this.router.navigateByUrl(type + "/" + encodeURIComponent(url));
      } else {
        this.router.navigateByUrl(type + "/" + url);
      }
    }, 500);
  }
}
