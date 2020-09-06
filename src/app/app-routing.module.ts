import { NgModule } from "@angular/core";
import { PreloadAllModules, RouterModule, Routes } from "@angular/router";

const routes: Routes = [
  {
    path: "home",
    loadChildren: () =>
      import("./home/home.module").then((m) => m.HomePageModule),
  },
  {
    path: "",
    redirectTo: "home",
    pathMatch: "full",
  },
  {
    path: "list",
    loadChildren: () =>
      import("./list/list.module").then((m) => m.ListPageModule),
  },
  {
    path: "slides/:folder",
    loadChildren: () =>
      import("./slides/slides.module").then((m) => m.SlidesPageModule),
  },
  {
    path: "lyrics/:folder",
    loadChildren: () =>
      import("./lyrics/lyrics.module").then((m) => m.LyricsPageModule),
  },
  {
    path: "video/:path",
    loadChildren: () =>
      import("./video/video.module").then((m) => m.VideoPageModule),
  },
  {
    path: "page/:url",
    loadChildren: () =>
      import("./page/page.module").then((m) => m.PagePageModule),
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
