var app = require("electron").remote;
var slides = {};
var path = "contents" + "/";
var presentation;
var slides1;
var current = 0;
var pathh;
var voiceDuration = 0;
var currentime = 0;
var playing;
var myVar;
let ispaused;

var isTrial = getUrlVars()["trial"];
$(document).ready(function () {
  $("#modal").hide();
  presentation = getUrlVars()["presentation"] + "/";
  pathh = path + "songlist/" + presentation;
  $.getJSON(path + "songlist/" + presentation + "slides.json", function (json) {
    slides = json;
    $("body").css({ "font-family": json.font });
    load();
  });
  setTimeout(() => {
    $("#loading").hide();
  }, 500);
  $("#page").show();
});

function load() {
  slides1 = slides.data.slides;
  changeSlide();
  $("#ps").show();
  $("#pl").hide();
  var v1 = document.getElementById("voiceover");
  $("#volume").val(v1.volume * 100);
  $("#uv").hide();
}
function getUrlVars() {
  var vars = {};
  var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (
    m,
    key,
    value
  ) {
    vars[key] = value;
  });
  return vars;
}
function back() {
  window.location.href = "list.html" + "?trial=" + isTrial;
}
function changeSlide() {
  playing = true;
  let slide = slides1[current];
  let type = slide.type;
  let content;
  pxc = slide.duration;
  px = pxc.split(":");
  p = 0;
  if (parseInt(px[0]) >= 1) {
    p = p + parseInt(px[0]) * 60;
    p = p + parseFloat(px[1]);
  } else {
    p = p + parseFloat(px[1]);
  }
  curretduration = p;
  $("#duration").html(pxc);
  voiceDuration = p;

  if (slides.data.pdf === "") {
    $("#pd").prop("disabled", true);
    $("#pd").css({ opacity: 0.5 });
  } else {
    $("#pd").prop("disabled", false);
    $("#pd").css({ opacity: 1 });
  }

  if (current === 0) {
    $("#gp").prop("disabled", true);
    $("#gp").css({ opacity: 0.5 });
  } else {
    $("#gp").prop("disabled", false);
    $("#gp").css({ opacity: 1 });
  }
  if (slides1.length <= current + 1) {
    $("#gn").prop("disabled", true);
    $("#pl").prop("disabled", true);
    $("#ps").prop("disabled", true);
    $("#gn").css({ opacity: 0.5 });
    $("#pl").css({ opacity: 0.5 });
    $("#ps").css({ opacity: 0.5 });
  } else {
    $("#gn").prop("disabled", false);
    $("#pl").prop("disabled", false);
    $("#ps").prop("disabled", false);
    $("#gn").css({ opacity: 1 });
    $("#pl").css({ opacity: 1 });
    $("#ps").css({ opacity: 1 });
  }

  if (pxc === "") {
    $("#seeker").prop("disabled", true);
    $("#pl").prop("disabled", true);
    $("#ps").prop("disabled", true);
    $("#seeker").css({ opacity: 0 });
    $("#pl").css({ opacity: 0.5 });
    $("#ps").css({ opacity: 0.5 });
  } else {
    $("#seeker").prop("disabled", false);
    $("#pl").prop("disabled", false);
    $("#ps").prop("disabled", false);
    $("#seeker").css({ opacity: 1 });
    $("#pl").css({ opacity: 1 });
    $("#ps").css({ opacity: 1 });
  }
  if (voiceDuration <= 20 || pxc === "") {
    $("#seeker").prop("disabled", true);
    $("#seeker").css({ opacity: 0 });
  } else {
    $("#seeker").prop("disabled", false);
    $("#seeker").css({ opacity: 1 });
  }
  currentime = 0;
  $("#bottombar").show();
  if (type === "youtube") {
    // $("#bottombar").hide();
    content = `<div  class="w3-animate-right"><iframe id="yt" src="${slide.content}" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope" allowfullscreen></iframe></div>`;
  } else if (type === "video") {
    content = `<div  class="w3-animate-right"><video id="vid" disablePictureInPicture><source src="${
      pathh + slide.content
    }" type="video/mp4"></video></div>`;
  } else if (type === "image") {
    content = `<div id="img" style="background:url('${
      pathh + slide.content
    }');background-size:contain;background-position:center center;background-repeat:no-repeat"  class="w3-animate-right"/></div>`;
  } else if (type === "text") {
    content = `<div id="text"  class="w3-animate-right">${slide.content}</div>`;
  } else {
    content = `<div id="html"   class="w3-animate-right">${slide.content}</div>`;
    addScript("https://sdk.canva.com/v1/embed.js");
  }
  $("#content").html(content);
  if (slide["background-color"] === "") {
    $("#content").css("background", "#FFFFFF");
  } else {
    $("#content").css("background", slide["background-color"]);
  }
  if (slide.voiceover !== "") {
    $("#voiceover").attr("src", pathh + slide.voiceover);

    if (playing === true) {
      document.getElementById("voiceover").play();
      console.log(document.getElementById("voiceover"));
    }
  } else {
    $("#voiceover").attr("src", "");
  }
  if (slides1.length <= current + 1) {
    playing = false;
  }
  if (playing === true) {
    ispaused = false;
    $("#ps").show();
    $("#pl").hide();
    document.getElementById("voiceover").play();
    runCounter();
  } else {
    $("#ps").show();
    $("#pl").hide();
    resumeCounter();
  }
}
function addScript(filename) {
  if (document.getElementById("sc")) document.getElementById("sc").remove();
  var head = document.getElementsByTagName("head")[0];
  var script = document.createElement("script");
  script.id = "sc";
  script.src = filename;
  script.type = "text/javascript";
  head.insertBefore(script, document.getElementsByTagName("script")[0]);
}
function runCounter() {
  if (playing === true && curretduration >= currentime) {
    if ($("#vid").length > 0) {
      document.getElementById("vid").play();
    }
    myVar = setTimeout(() => {
      currentime = currentime + 0.1;
      // console.log(currentime)
      var cu = currentime;
      var c = "";
      if (cu / 60 >= 1) {
        cf = parseInt(cu / 60) + ":";
        if (cf >= 10) {
          c += cf;
        } else {
          c += "0" + cf;
        }
        var cc = (cu - parseInt(cu / 60) * 60).toFixed(0);
        if (cc >= 10) {
          c += cc;
        } else {
          c += "0" + cc;
        }
      } else {
        c += "00:";
        var cc = (cu - parseInt(cu / 60) * 60).toFixed(0);
        if (cc >= 10) {
          c += cc;
        } else {
          c += "0" + cc;
        }
      }
      $("#myRange").val((cu / voiceDuration) * 1000);
      $("#time").html(c);
      runCounter();
    }, 100);
  }
  if (playing === true && curretduration <= currentime) {
    setTimeout(() => {
      next();
    }, 100);
  }
}
function resumeCounter() {
  playing = true;
  runCounter();
}
function pauseCounter() {
  playing = false;
  clearInterval(myVar);
}

$("#myRange").on("input", () => {
  currentime = ($("#myRange").val() / 1000) * voiceDuration;
  document.getElementById("voiceover").currentTime =
    ($("#myRange").val() / 1000) * voiceDuration;
  document.getElementById("vid").currentTime =
    ($("#myRange").val() / 1000) * voiceDuration;
});
function next() {
  if (current < slides1.length - 1) {
    pauseCounter();
    current += 1;
    changeSlide();
  }
}
function prev() {
  if (current > 0) {
    pauseCounter();
    current -= 1;
    changeSlide();
    $("#content .w3-animate-right").removeClass("w3-animate-right");
    $("#content>div").addClass("w3-animate-left");
  }
}
$("#volume").on("input", function () {
  var v = $("#volume").val();
  var v1 = document.getElementById("voiceover");
  v1.volume = v / 100;

  var v2 = document.getElementById("vid");
  v2.volume = v / 100;
});
function pdfBtn() {
  const { BrowserWindow } = require("electron").remote;
  const PDFWindow = require("gr-pdf-window");
  const win = new BrowserWindow({ width: 800, height: 600 });
  PDFWindow.addSupport(win);
  win.loadURL(app.app.getAppPath() + "/" + pathh + slides["data"]["pdf"]);
}

function resumeplay() {
  ispaused = false;
  if (slides1.length <= current + 1) {
    playing = false;
    $("#ps").hide();
    $("#pl").show();
  } else {
    $("#ps").show();
    $("#pl").hide();
  }
  resumeCounter();
  document.getElementById("voiceover").play();
  document.getElementById("vid").play();
}

function pauseplay() {
  ispaused = true;
  $("#ps").hide();
  $("#pl").show();
  pauseCounter();
  document.getElementById("voiceover").pause();
  document.getElementById("vid").pause();
}

$(window).keypress(function (e) {
  if (e.which == 32) {
    if (ispaused == true) resumeplay();
    else pauseplay();
  }
});
// $(document).onkeydown(function (e) {
//   if (e.keyCode == 37) {
//     prev();
//   }
//   if (e.keyCode == 39) {
//     next();
//   }
// });
$(document).keydown(function (e) {
  console.log(e.keyCode);
  if (e.keyCode == 37) {
    prev();
  }
  if (e.keyCode == 39) {
    next();
  }
});
