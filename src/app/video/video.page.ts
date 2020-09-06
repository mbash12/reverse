import { Component, OnInit } from "@angular/core";
import { Platform, NavController } from "@ionic/angular";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-video",
  templateUrl: "./video.page.html",
  styleUrls: ["./video.page.scss"],
})
export class VideoPage implements OnInit {
  videoPath: any;
  constructor(
    public platform: Platform,
    public navCtrl: NavController,
    public activatedRoute: ActivatedRoute
  ) {
    this.platform.backButton.subscribeWithPriority(10, () => {
      this.navCtrl.back();
    });
  }

  ngOnInit() {
    this.videoPath = decodeURIComponent(
      this.activatedRoute.snapshot.paramMap.get("path")
    );
  }
}
