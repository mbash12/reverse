import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { NavController, Platform } from "@ionic/angular";
import { Gesture, GestureController } from "@ionic/angular";
import {
  DocumentViewer,
  DocumentViewerOptions,
} from "@ionic-native/document-viewer/ngx";

@Component({
  selector: "app-slides",
  templateUrl: "./slides.page.html",
  styleUrls: ["./slides.page.scss"],
})
export class SlidesPage implements OnInit {
  @ViewChild("vidContent") myVideo: ElementRef;
  // @ViewChild("content") myContent: ElementRef;
  private slideState;
  private folder;
  private pdf;
  private voiceOver;
  private slideData;
  private slideCount;
  private currentSlide;
  private currentSlideContent;
  private currentSlideDuration;
  private currentTime = 0;
  private progress;
  private isPlaying;
  private audioPlaying = false;
  private hasVoiceOver;
  private hasVideo;
  private interval;
  private intervalControl;
  private folderPath;
  private onMenu = false;
  private totalDuration;
  private progressDuration;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private httpClient: HttpClient,
    private navCtrl: NavController,
    private platform: Platform,
    private gestureCtrl: GestureController,
    private document: DocumentViewer
  ) {
    this.platform.backButton.subscribeWithPriority(10, () => {
      this.pauseSlide();
      this.navCtrl.back();
    });
  }
  figureOutFile(file: string) {
    if (this.platform.is("ios")) {
      const baseUrl = location.href.replace("/index.html", "");
      return baseUrl + `${file}`;
    }
    if (this.platform.is("android")) {
      return `file:///android_asset/www${file}`;
    }
  }
  viewPdf() {
    this.pauseSlide();
    const options: DocumentViewerOptions = {
      title: this.folder,
    };
    this.document.viewDocument(
      this.figureOutFile(this.pdf),
      "application/pdf",
      options
    );
  }
  ngOnInit() {
    setTimeout(() => {
      this.folder = this.activatedRoute.snapshot.paramMap.get("folder");
      this.getData(this.folder);
      // const gesture: Gesture = this.gestureCtrl.create({
      //   el: this.myContent.nativeElement,
      //   threshold: 15,
      //   gestureName: "my-gesture",
      //   onEnd: (ev) => this.swipe(ev),
      // });
      // gesture.enable();
    }, 1000);
  }
  // private swipe(detail) {
  //   console.log(detail);
  //   this.displayControl();
  //   if (detail.deltaX >= 50) {
  //     this.prevSlide();
  //   }
  //   if (detail.deltaX <= -50) {
  //     this.nextSlide();
  //   }
  // }
  handleSwipe(e) {
    if (e.deltaX >= 50) {
      this.prevSlide();
    }
    if (e.deltaX <= -50) {
      this.nextSlide();
    }
  }
  getData(folder) {
    this.folderPath = "/assets/contents/songlist/" + folder + "/";
    let folderData;
    this.httpClient.get(this.folderPath + "slides.json").subscribe((data) => {
      folderData = data;
      this.slideData = folderData.data;
      this.pdf = this.folderPath + this.slideData.pdf;
      this.slideCount = this.slideData.slides.length;
      this.currentSlide = 0;
      this.loadContent();
      this.displayControl();
    });
  }
  back() {
    this.pauseSlide();
    this.navCtrl.back();
  }

  loadContent() {
    this.currentSlideContent = this.slideData.slides[this.currentSlide];
    let t = this.currentSlideContent.duration;
    this.totalDuration = t || "00:00";
    this.currentSlideDuration =
      Number(t.split(":")[0]) * 60 * 1000 + Number(t.split(":")[1]) * 1000;
    if (this.currentSlide == 0) {
      this.slideState = "first";
    } else if (this.currentSlide + 1 == this.slideCount) {
      this.slideState = "last";
    } else {
      this.slideState = "";
    }
    this.progress = 0;
    this.progressDuration = "00:00";
    if (this.slideData.slides[this.currentSlide].type == "video") {
      this.hasVideo = true;
    } else {
      this.hasVideo = false;
    }
    if (this.slideData.slides[this.currentSlide].voiceover !== "") {
      this.hasVoiceOver = true;
      this.voiceOver = new Audio();
      this.voiceOver.src =
        this.folderPath + this.slideData.slides[this.currentSlide].voiceover;
      this.voiceOver.load();
    } else {
      this.hasVoiceOver = false;
    }
    if (!isNaN(this.currentSlideDuration || t == "00:00")) {
      this.currentTime = 0;
      this.playSlide();
      this.isPlaying = true;
    } else {
      this.pauseSlide();
      this.isPlaying = false;
    }
  }
  goToSection(e) {
    if (
      Math.floor((e.detail.value / 100) * this.currentSlideDuration) !=
      this.currentTime
    ) {
      this.currentTime = Math.floor(
        (e.detail.value / 100) * this.currentSlideDuration
      );
      if (this.hasVoiceOver == true) {
        this.voiceOver.currentTime = this.currentTime / 1000;
      }
      if (this.hasVideo == true) {
        this.myVideo.nativeElement.currentTime = this.currentTime / 1000;
      }
    }
  }
  playAudio() {
    if (this.audioPlaying == false) {
      if (this.hasVoiceOver == true) {
        setTimeout(() => {
          this.voiceOver.play();
        }, 100);
      }
      if (this.hasVideo == true) {
        setTimeout(() => {
          this.myVideo.nativeElement.play();
        }, 100);
      }
      this.audioPlaying = true;
    }
  }
  pauseAudio() {
    if (this.audioPlaying == true) {
      if (this.hasVoiceOver == true) {
        this.voiceOver.pause();
      }
      if (this.hasVideo == true) {
        this.myVideo.nativeElement.pause();
      }
      this.audioPlaying = false;
    }
  }
  playSlide() {
    if (this.currentTime < this.currentSlideDuration) {
      this.playAudio();
      this.isPlaying = true;
      this.interval = setTimeout(() => {
        this.currentTime = this.currentTime + 100;
        if (this.currentTime >= this.currentSlideDuration) {
          this.nextSlide();
        } else {
          let x;
          let y;
          let z = this.currentTime / 1000;
          if (z >= 60) {
            x = z / 60;
            y = Math.floor(z - x);
            x = ("0" + x).slice(-2);
            y = ("0" + y).slice(-2);
          } else {
            x = 0;
            y = Math.floor(z - x);
            x = ("0" + x).slice(-2);
            y = ("0" + y).slice(-2);
          }
          this.progressDuration = x + ":" + y;
          this.progress = (this.currentTime / this.currentSlideDuration) * 100;
          this.playSlide();
        }
      }, 100);
    }
  }
  pauseSlide() {
    this.pauseAudio();
    clearTimeout(this.interval);
    this.isPlaying = false;
  }
  prevSlide() {
    if (this.currentSlide > 0) {
      clearTimeout(this.interval);
      this.currentSlide = this.currentSlide - 1;
      this.pauseAudio();
      this.loadContent();
    }
  }
  nextSlide() {
    if (this.currentSlide < this.slideCount - 1) {
      clearTimeout(this.interval);
      if (this.hasVoiceOver == true) {
        this.voiceOver.pause();
      }
      this.currentSlide = this.currentSlide + 1;
      this.pauseAudio();
      this.loadContent();
    }
  }
  displayControl() {
    if (this.onMenu == false) {
      this.onMenu = true;
      this.intervalControl = setTimeout(() => {
        this.onMenu = false;
      }, 3000);
    } else {
      clearTimeout(this.intervalControl);
      this.onMenu = false;
    }
  }
}
