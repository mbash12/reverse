import { Component, OnInit } from "@angular/core";
import { Platform, NavController } from "@ionic/angular";
import { ActivatedRoute } from "@angular/router";
import { DomSanitizer } from "@angular/platform-browser";

@Component({
  selector: "app-page",
  templateUrl: "./page.page.html",
  styleUrls: ["./page.page.scss"],
})
export class PagePage implements OnInit {
  public src;
  // public src1 = "";
  constructor(
    public activatedRoute: ActivatedRoute,
    public navCtrl: NavController,
    public platform: Platform,
    public domSanitizer: DomSanitizer
  ) {
    this.platform.backButton.subscribeWithPriority(10, () => {
      this.navCtrl.navigateBack("/list");
    });
  }
  back() {
    this.navCtrl.navigateBack("/list");
  }
  ngOnInit() {
    this.src = this.domSanitizer.bypassSecurityTrustResourceUrl(
      decodeURIComponent(this.activatedRoute.snapshot.paramMap.get("url"))
    );
  }
}
