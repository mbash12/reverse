import { Component } from "@angular/core";
import { Router, NavigationExtras } from "@angular/router";
import { Storage } from "@ionic/Storage";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";

@Component({
  selector: "app-home",
  templateUrl: "home.page.html",
  styleUrls: ["home.page.scss"],
})
export class HomePage {
  public appName = "uk.co.rhythmstix.bandlabbegin";
  public logo = "../../assets/assets/logo.png";
  public isActivating = false;
  public isActivated = false;
  public isFailed = false;
  public isTrial = false;
  public trial = 0;
  public code = "";
  public licenceStatus = "none";
  public isLoading = true;
  constructor(
    public router: Router,
    public storage: Storage,
    public httpClient: HttpClient
  ) {
    this.checkActivation();
  }
  public checkActivation() {
    this.storage.get("licence").then((data) => {
      this.isLoading = false;
      if (data == null) {
        this.licenceStatus = "none";
        return;
      }
      let licence = window.atob(data).split("|");
      if (new Date(licence[4]) < new Date()) {
        this.licenceStatus = "expired";
        return;
      }
      if (licence[0] == "trial") {
        this.licenceStatus = "trial";
        this.trial = Math.floor(
          (new Date(licence[4]).getTime() - new Date().getTime()) /
            (1000 * 60 * 60 * 24)
        );
        return;
      }
      if (licence[0] == "full") {
        this.licenceStatus = "full";
        let navigationExtras: NavigationExtras = {
          state: {
            trial: false,
          },
        };
        this.router.navigate(["list"], navigationExtras);
        return;
      }
    });
  }
  public activate() {
    this.isActivated = false;
    this.isFailed = false;
    this.licenceStatus = "none";
    this.isActivating = true;
    let url = "https://rhythmstix.co.uk/licences/check.php";
    let httpHeaders = new HttpHeaders().set(
      "Content-Type",
      "application/x-www-form-urlencoded"
    );
    let options = {
      headers: httpHeaders,
    };
    const body = new HttpParams()
      .set("code", this.code)
      .set("app_code", this.appName);
    let licence;
    this.httpClient.post(url, body.toString(), options).subscribe((data) => {
      this.isActivating = false;
      licence = data;
      if (data == null) {
        this.isFailed = true;
        return;
      } else {
        let encrypted = "";
        let lc = licence;
        let dac = lc.applied_date;
        let dex = lc.expired_date;
        let ddu = lc.duration;
        if (dex !== null) {
          ddu = Math.floor(
            (new Date(dex).getTime() - new Date().getTime()) /
              (1000 * 60 * 60 * 24)
          );
        } else {
          dac = new Date();
          dex = new Date(dac.setDate(dac.getDate() + ddu));
        }
        if (ddu <= 0) {
          this.isFailed = true;
          return;
        }
        this.trial = ddu;
        encrypted = window.btoa(
          "" + lc.type + "|" + lc.code + "|" + ddu + "|" + dac + "|" + dex + ""
        );
        this.storage.set("licence", encrypted);
        this.isActivated = true;
      }
    });
  }
  public continue() {
    let navigationExtras: NavigationExtras = {
      state: {
        trial: this.isTrial,
      },
    };
    this.router.navigate(["list"], navigationExtras);
  }
  public continueTrial() {
    let navigationExtras: NavigationExtras = {
      state: {
        trial: this.isTrial,
      },
    };
    this.router.navigate(["list"], navigationExtras);
  }
}
