import { Component, OnInit, HostListener } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { NavController, DomController } from "@ionic/angular";
import { Platform } from "@ionic/angular";

@Component({
  selector: "app-lyrics",
  templateUrl: "./lyrics.page.html",
  styleUrls: ["./lyrics.page.scss"],
})
export class LyricsPage implements OnInit {
  private folder: string;
  private folderPath: string;
  private slideData: any;
  private slideCount: any;
  private currentSlide: number;
  private backSong;
  private vocal;
  private duration;
  private interval;
  private onMenu = true;
  private onMenuForce;
  private isPlaying = false;
  private isMute = false;
  private isHideLyrics = false;
  private progressDuration;
  private progress;
  private totalDuration;
  private pageBackground;
  private lyricFont;
  private currentTimeStamp;

  private title;
  private section;
  private singer;
  private lyrics;
  private currentLyrics;
  private highlightedLyrics;

  private currentTime;
  private displayedLyrics;
  private intervalControl;
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private httpClient: HttpClient,
    private navCtrl: NavController,
    private platform: Platform
  ) {
    this.platform.backButton.subscribeWithPriority(10, () => {
      this.stopSong();
      this.navCtrl.back();
    });
  }

  ngOnInit() {
    this.folder = this.activatedRoute.snapshot.paramMap.get("folder");
    this.getData(this.folder);
  }
  getData(folder) {
    let settingData;
    this.httpClient
      .get("/assets/contents/settings/settings.json")
      .subscribe((data) => {
        settingData = data;
        this.lyricFont = settingData.font;
      });
    this.folderPath = "/assets/contents/songlist/" + folder + "/";
    let folderData;
    this.httpClient.get(this.folderPath + "song.json").subscribe((data) => {
      folderData = data;
      this.lyrics = folderData.lyrics;
      this.slideData = folderData.data;
      this.title = this.slideData.title;
      this.backSong = new Audio();
      this.backSong.src = this.folderPath + this.slideData.backsong;
      this.backSong.load();
      this.vocal = new Audio();
      this.vocal.src = this.folderPath + this.slideData.vocal;
      this.vocal.load();

      this.pageBackground = {
        background: this.slideData.backgroundColor,
      };
      if (this.slideData.backgroundImage !== "") {
        this.pageBackground = {
          "background-image":
            "url(" + this.folderPath + this.slideData.backgroundImage + ")",
          "font-family": this.lyricFont,
          "text-align": this.slideData.alignment,
        };
      }
      this.displayControl();
      if (window.innerHeight > 720) {
        this.onMenuForce = true;
      } else {
        this.onMenuForce = false;
      }
    });
    setTimeout(() => {
      this.duration = this.backSong.duration;
      this.totalDuration = this.convertTime(this.duration, 1);
      this.currentTime = 0;
      this.playLyrics(this.currentTime, true);
      this.backSong.currentTime = 0;
      this.backSong.muted = true;
    }, 500);
  }
  @HostListener("window:resize", ["$event"])
  onResize(event) {
    if (window.innerHeight > 720) {
      this.onMenuForce = true;
    } else {
      this.onMenuForce = false;
    }
  }
  goToSection(e) {
    let current = this.progress;
    if (
      Math.ceil((current / 100) * this.duration * 1000) !=
      Math.ceil(this.currentTime)
    ) {
      this.currentTime = Math.floor((current / 100) * (this.duration * 1000));
      this.progressDuration = this.convertTimeMil(this.currentTime, 1);
      this.backSong.currentTime = (e.detail.value / 100) * this.duration;
      this.vocal.currentTime = (e.detail.value / 100) * this.duration;
      this.displayLyrics(this.getClosest(Object.entries(this.lyrics), current));
      this.highlightLyrics(this.getClosest(this.displayedLyrics, current));
    }
  }
  convertTime(data, type) {
    let result;
    if (type == 0) {
      result = Number(data.split(":")[0]) * 60 + Number(data.split(":")[1]);
    } else if (type == 1) {
      let mn;
      let sc;
      if (data >= 60) {
        mn = Math.floor(data / 60);
        sc = Math.floor(data - mn * 60);
        mn = ("0" + mn).slice(-2);
        sc = ("0" + sc).slice(-2);
      } else {
        mn = 0;
        sc = Math.floor(data - mn * 60);
        mn = ("0" + mn).slice(-2);
        sc = ("0" + sc).slice(-2);
      }
      result = mn + ":" + sc;
    }
    return result;
  }
  convertTimeMil(data, type) {
    let result;
    if (type == 0) {
      result =
        Number(data.split(":")[0]) * 60 * 1000 +
        Number(data.split(":")[1]) * 1000;
    } else if (type == 1) {
      let mn;
      let sc;
      if (data >= 60000) {
        mn = Math.floor(data / 60000);
        sc = Math.floor((data - mn * 60000) / 1000);
        mn = ("0" + mn).slice(-2);
        sc = ("0" + sc).slice(-2);
      } else {
        mn = 0;
        sc = Math.floor((data - mn * 60000) / 1000);
        mn = ("0" + mn).slice(-2);
        sc = ("0" + sc).slice(-2);
      }
      result = mn + ":" + sc;
    } else if (type == 2) {
      let mn;
      let sc;
      let ml;
      if (data >= 60000) {
        mn = Math.floor(data / 60000);
        sc = Math.floor((data - mn * 60000) / 1000);
        ml = (data - mn * 60000) / 1000 - sc;
        mn = ("0" + mn).slice(-2);
        sc = ("0" + sc).slice(-2);
        ml = ("0" + Math.floor(ml)).slice(-2);
      } else {
        mn = 0;
        sc = Math.floor(data / 1000);
        ml = data - sc * 1000;
        mn = ("0" + mn).slice(-2);
        sc = ("0" + sc).slice(-2);
        ml = ("0" + Math.floor(ml / 10)).slice(-2);
      }
      result = mn + ":" + sc + "." + ml;
    }
    return result;
  }
  back() {
    this.stopSong();
    this.navCtrl.back();
  }
  playSong() {
    this.backSong.play();
    this.vocal.play();
    this.isPlaying = true;
    this.playLyrics(this.currentTime, false);
  }
  pauseSong() {
    this.backSong.pause();
    this.vocal.pause();
    this.isPlaying = false;
    clearTimeout(this.interval);
  }
  stopSong() {
    this.backSong.pause();
    this.vocal.pause();
    this.isPlaying = false;
    this.currentTime = 0;
    this.progress = 0;
    this.progressDuration = 0;
    this.backSong.currentTime = 0;
    this.vocal.currentTime = 0;
    this.displayLyrics("00:00.0");
    this.highlightLyrics("00:00.0");
  }
  muteVocal() {
    this.isMute = true;
    this.backSong.muted = false;
    this.vocal.muted = true;
  }
  unmuteVocal() {
    this.isMute = false;
    this.backSong.muted = true;
    this.vocal.muted = false;
  }
  getClosest(array, current) {
    let closest;
    array.some((a) => {
      if (a[0] === undefined) return true;
      if (this.convertTimeMil(a[0], 0) >= this.currentTime) {
        return true;
      }
      closest = a[0];
    });
    return closest;
  }
  hideLyrics() {}
  showLyrics() {}
  playLyrics(stnc, st) {
    let sentences = this.convertTimeMil(stnc, 2);
    this.progressDuration = this.convertTimeMil(stnc, 1);
    this.displayLyrics(sentences);
    this.highlightLyrics(sentences);
    this.currentTime = this.backSong.currentTime * 1000;
    this.progress = (this.currentTime / (this.duration * 1000)) * 100;
    if (st == true) {
      return;
    }
    this.interval = setTimeout(() => {
      this.playLyrics(this.currentTime, false);
    }, 1);
  }
  highlightLyrics(sentences) {
    this.displayedLyrics.find((o, i) => {
      if (o.key === sentences) {
        if (i > 0) {
          this.displayedLyrics[i - 1].class = "inactive";
        }
        this.displayedLyrics[i].class = "active";
        return true;
      }
    });
  }
  displayLyrics(sentences) {
    if (sentences in this.lyrics) {
      this.currentTimeStamp = sentences;
      const word = Object.entries(this.lyrics[sentences]["lyrics"]);
      if (word.length > 0) {
        var sentence = [];
        word.forEach((e) => {
          sentence.push({
            key: e[0],
            value: e[1],
            class: "",
          });
        });
        this.displayedLyrics = sentence;
        this.section = this.lyrics[sentences]["section"];
        this.singer = this.lyrics[sentences]["singer"];
      }
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
  reStart() {
    this.currentTime = this.convertTimeMil(this.currentTimeStamp, 0);
    this.progress = (this.currentTime / (this.duration * 1000)) * 100;
    this.progressDuration = this.convertTimeMil(this.currentTime, 1);
    this.backSong.currentTime = this.currentTime / 1000;
    this.vocal.currentTime = this.currentTime / 1000;
    this.displayLyrics(this.currentTimeStamp);
    this.highlightLyrics(this.currentTimeStamp);
  }
  prevSection() {
    let dl = Object.entries(this.lyrics);
    let a;
    dl.forEach((e, i) => {
      if (e[0] == this.currentTimeStamp) {
        a = i;
        return true;
      }
    });

    let b = dl[a - 1];
    if (b !== undefined) {
      this.currentTime = this.convertTimeMil(b[0], 0);
      this.progress = (this.currentTime / (this.duration * 1000)) * 100;
      this.progressDuration = this.convertTimeMil(this.currentTime, 1);
      this.backSong.currentTime = this.currentTime / 1000;
      this.vocal.currentTime = this.currentTime / 1000;
      this.displayLyrics(b[0]);
      this.highlightLyrics(b[0]);
    }
  }
  nextSection() {
    let dl = Object.entries(this.lyrics);
    let a;
    dl.forEach((e, i) => {
      if (e[0] == this.currentTimeStamp) {
        a = i;
        return true;
      }
    });
    let b = dl[a + 1];
    if (b !== undefined) {
      this.currentTime = this.convertTimeMil(b[0], 0);
      this.progress = (this.currentTime / (this.duration * 1000)) * 100;
      this.progressDuration = this.convertTimeMil(this.currentTime, 1);
      this.backSong.currentTime = this.currentTime / 1000;
      this.vocal.currentTime = this.currentTime / 1000;
      this.displayLyrics(b[0]);
      this.highlightLyrics(b[0]);
    }
  }
}
