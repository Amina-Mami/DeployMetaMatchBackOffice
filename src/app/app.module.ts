import { FullCalendarModule } from "@fullcalendar/angular";
import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { RouterModule, Routes } from "@angular/router";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";

import { HttpClientInMemoryWebApiModule } from "angular-in-memory-web-api";
import { FakeDbService } from "@fake-db/fake-db.service";

import "hammerjs";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { ToastrModule } from "ngx-toastr";
import { TranslateModule } from "@ngx-translate/core";
import { ContextMenuModule } from "@ctrl/ngx-rightclick";

import { CoreModule } from "@core/core.module";
import { CoreCommonModule } from "@core/common.module";
import { CoreSidebarModule, CoreThemeCustomizerModule } from "@core/components";
import { CardSnippetModule } from "@core/components/card-snippet/card-snippet.module";

import { coreConfig } from "app/app-config";
import { AuthGuard } from "app/auth/helpers/auth.guards";
import { AppComponent } from "app/app.component";
import { LayoutModule } from "app/layout/layout.module";
import { ContentHeaderModule } from "app/layout/components/content-header/content-header.module";

import { ContextMenuComponent } from "app/main/extensions/context-menu/context-menu.component";
import { AnimatedCustomContextMenuComponent } from "./main/extensions/context-menu/custom-context-menu/animated-custom-context-menu/animated-custom-context-menu.component";
import { BasicCustomContextMenuComponent } from "./main/extensions/context-menu/custom-context-menu/basic-custom-context-menu/basic-custom-context-menu.component";
import { SubMenuCustomContextMenuComponent } from "./main/extensions/context-menu/custom-context-menu/sub-menu-custom-context-menu/sub-menu-custom-context-menu.component";
import { UserEditService } from "./main/apps/user/user-edit/user-edit.service";
import {
  GoogleLoginProvider,
  SocialAuthServiceConfig,
  SocialLoginModule,
} from "angularx-social-login";
import { TeamManagementModule } from "./team-management/team-management.module";
import { TeamManagementRoutingModule } from "./team-management/team-management-routing.module";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { CommonModule, DatePipe } from "@angular/common";

FullCalendarModule.registerPlugins([dayGridPlugin, interactionPlugin]);

const appRoutes: Routes = [
  {
    path: "dashboard",
    loadChildren: () =>
      import("./main/dashboard/dashboard.module").then(
        (m) => m.DashboardModule
      ),
  },
  {
    path: "apps",
    loadChildren: () =>
      import("./main/apps/apps.module").then((m) => m.AppsModule),
    canActivate: [AuthGuard],
  },
  {
    path: "pages",
    loadChildren: () =>
      import("./main/pages/pages.module").then((m) => m.PagesModule),
  },
  {
    path: "ui",
    loadChildren: () => import("./main/ui/ui.module").then((m) => m.UIModule),
    canActivate: [AuthGuard],
  },
  {
    path: "components",
    loadChildren: () =>
      import("./main/components/components.module").then(
        (m) => m.ComponentsModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: "extensions",
    loadChildren: () =>
      import("./main/extensions/extensions.module").then(
        (m) => m.ExtensionsModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: "forms",
    loadChildren: () =>
      import("./main/forms/forms.module").then((m) => m.FormsModule),
    canActivate: [AuthGuard],
  },
  {
    path: "tables",
    loadChildren: () =>
      import("./main/tables/tables.module").then((m) => m.TablesModule),
    canActivate: [AuthGuard],
  },
  {
    path: "charts-and-maps",
    loadChildren: () =>
      import("./main/charts-and-maps/charts-and-maps.module").then(
        (m) => m.ChartsAndMapsModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: "",
    redirectTo: "/dashboard/ecommerce",
    pathMatch: "full",
  },
  {
    path: "teams",
    loadChildren: () =>
      import("./team-management/team-management.module").then(
        (m) => m.TeamManagementModule
      ),
  },
  {
    path: "**",
    redirectTo: "/pages/miscellaneous/error", //Error 404 - Page not found
  },
];

@NgModule({
  declarations: [
    AppComponent,
    ContextMenuComponent,
    BasicCustomContextMenuComponent,
    AnimatedCustomContextMenuComponent,
    SubMenuCustomContextMenuComponent,
  ],
  imports: [
    BrowserModule,
    FullCalendarModule,
    BrowserAnimationsModule,
    HttpClientModule,
    SocialLoginModule,
    HttpClientInMemoryWebApiModule.forRoot(FakeDbService, {
      delay: 0,
      passThruUnknownUrl: true,
    }),
    RouterModule.forRoot(appRoutes, {
      scrollPositionRestoration: "enabled",
      relativeLinkResolution: "legacy",
    }),
    //RouterModule.forRoot(appRoutes),
    TeamManagementRoutingModule,
    NgbModule,
    ToastrModule.forRoot(),
    TranslateModule.forRoot(),
    ContextMenuModule,
    CoreModule.forRoot(coreConfig),
    CoreCommonModule,
    CoreSidebarModule,
    CoreThemeCustomizerModule,
    CardSnippetModule,
    LayoutModule,
    ContentHeaderModule,
    CommonModule
  ],
  providers: [
    DatePipe,
    UserEditService,
    {
      provide: "SocialAuthServiceConfig",
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              "638133119528-bjmjpq4omvs2ld2kg2vj444s1f3iuepl.apps.googleusercontent.com"
            ),
          },
        ],
      } as SocialAuthServiceConfig,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
