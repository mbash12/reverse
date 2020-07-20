import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { HttpClient } from "@angular/common/http";

@Component({
  selector: "app-list",
  templateUrl: "./list.page.html",
  styleUrls: ["./list.page.scss"],
})
export class ListPage implements OnInit {
  private isLoading = true;
  private appName;
  private slogan;
  private isTrial;
  private graphicStyle;
  private appNameStyle;
  private sloganStyle;
  private listStyle;
  private songList;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private httpClient: HttpClient
  ) {
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
  private getSetting(isTrial) {
    let settingPath = "../../assets/contents/settings/settings.json";
    if (isTrial == true) {
      settingPath = "../../assets/contents/settings/trial.json";
    }
    let settingData;
    this.httpClient.get(settingPath).subscribe((data) => {
      settingData = data;
      this.appName = settingData.appName;
      this.slogan = settingData.slogan;
      this.graphicStyle = {
        "background-color": settingData.backgroundColor,
        "background-image": "url(/assets/contents/" + settingData.graphic + ")",
        "background-position": settingData.backgroundPosition,
        opacity: settingData.backgroundOpacity,
      };
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
  private openPage(url, type) {
    this.router.navigateByUrl(type + "/" + url);
  }
}
