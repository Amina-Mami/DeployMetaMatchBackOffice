import { FullCalendarModule } from "@fullcalendar/angular";
import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";

import { TeamManagementRoutingModule } from "./team-management-routing.module";
import { SessionComponent } from "./session/session.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { CoreCommonModule } from "@core/common.module";
import { CardSnippetModule } from "@core/components/card-snippet/card-snippet.module";
import { ContentHeaderModule } from "app/layout/components/content-header/content-header.module";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { DatePipe } from "@angular/common";
//import { formatIsoTimeString } from "@fullcalendar/core/internal";
import { MatchComponent } from "./match/match.component";
import { EventTooltipComponent } from "./event-tooltip/event-tooltip.component";
import { BlogComponent } from "./blog/blog.component";
import { ForumComponent } from "./forum/forum.component";
import { MatchListComponent } from "./match-list/match-list.component";
import { ChartModule } from "app/main/charts-and-maps/charts/charts.module";
import { BrowserModule } from "@angular/platform-browser";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { NgxChartsModule } from "@swimlane/ngx-charts";

FullCalendarModule.registerPlugins([dayGridPlugin, interactionPlugin]);
@NgModule({
  declarations: [
    SessionComponent,
    MatchComponent,
    EventTooltipComponent,
    BlogComponent,
    ForumComponent,
    MatchListComponent,
  ],
  imports: [
    FullCalendarModule,

    CommonModule,

    HttpClientModule,
    TeamManagementRoutingModule,

    ReactiveFormsModule,
    FormsModule,
    CardSnippetModule,
    ContentHeaderModule,
    CoreCommonModule,
    NgbModule,
    NgxChartsModule,
  ],
  providers: [DatePipe],
})
export class TeamManagementModule {}
