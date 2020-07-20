var app = require("electron").remote;
const pathh = require("path");
var pth = "contents" + "/";
var url = "sing.html";
var url1 = "video.html";
var url2 = "slide.html";
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
var isTrial = getUrlVars()["trial"];
$(document).ready(function () {
  var setting = "settings/settings.json";
  if (isTrial == "true") {
    setting = "settings/trial.json";
  }
  $.getJSON(pth + setting, function (json) {
    // console.log(json);
    $("#appName").html(json.appName);
    $("#slogan").html(json.slogan);
    $("#appName").css({
      "font-size": json.titleSize,
      "text-align": json.titleAlign,
      height: json.titleHeight,
      color: json.titleColor,
      "font-family": json.titleFont,
    });
    $("#slogan").css({
      "font-size": json.sloganSize,
      "text-align": json.sloganAlign,
      height: json.sloganHeight,
      color: json.sloganColor,
      "font-family": json.titleFont,
    });
    $("body").css({ "font-family": json.font });
    if (json.logo !== "") {
      $("#footer img").attr("src", pth + json.logo);
    }
    if (json.graphic !== "") {
      $("#graphic").css({
        "background-image":
          'url("' + (pth + json.graphic).replace(/\\/g, "/") + '")',
        opacity: json.backgroundOpacity,
        "background-size": "cover",
        "background-repeat": "no-repeat",
        "background-position": json.backgroundPosition,
        "background-color": json.backgroundColor,
      });
    }

    $.getJSON(pth + json.songList, function (data) {
      setTimeout(() => {
        $("#loading").hide();
      }, 500);
      $("#list").html("");
      data.forEach((element) => {
        if (element.type == "lyrics") {
          $("#list").append(
            '<a href="' +
              url +
              "?song=" +
              element.url +
              "&trial=" +
              isTrial +
              '" style="margin-top:' +
              element.marginTop +
              ";margin-bottom:" +
              element.marginBottom +
              ';"><h2> ' +
              element.name +
              "</h2></a><br>"
          );
        } else if (element.type == "video") {
          $("#list").append(
            '<a href="' +
              url1 +
              "?song=" +
              element.url +
              "&trial=" +
              isTrial +
              '" style="margin-top:' +
              element.marginTop +
              ";margin-bottom:" +
              element.marginBottom +
              ';"><h2> ' +
              element.name +
              "</h2></a><br>"
          );
        } else if (element.type == "slides") {
          $("#list").append(
            '<a href="' +
              url2 +
              "?presentation=" +
              element.url +
              "&trial=" +
              isTrial +
              '"  style="margin-top:' +
              element.marginTop +
              ";margin-bottom:" +
              element.marginBottom +
              ';"><h2> ' +
              element.name +
              "</h2></a><br>"
          );
        }
      });
      $("#list h2").css({
        "font-size": json.listSize,
        "text-align": json.listAlign,
        height: json.listHeight,
        color: json.listColor,
        "font-family": json.listFont,
      });
    });
  });
});

// const { remote } = require('electron')
// const { Menu, MenuItem } = remote

// const menu = new Menu()
// menu.append(new MenuItem({ label: 'Update Content', click() { window.location.href = "index.html?manual=true"; } }))

// window.addEventListener('contextmenu', (e) => {
//   e.preventDefault()
//   menu.popup({ window: remote.getCurrentWindow() })
// }, false)
