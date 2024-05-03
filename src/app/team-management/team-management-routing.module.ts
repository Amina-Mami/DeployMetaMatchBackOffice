import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { SessionComponent } from "./session/session.component";
import { MatchComponent } from "./match/match.component";
import { MatchListComponent } from "./match-list/match-list.component";
import { ForumComponent } from "./forum/forum.component";
import { BlogComponent } from "./blog/blog.component";

const routes: Routes = [
  {
    path: "teams",
    children: [
      { path: "session", component: SessionComponent },
      { path: "match", component: MatchComponent },
      { path: "matches", component: MatchListComponent },
      { path: "forum", component: ForumComponent },
      { path: "blog", component: BlogComponent },
      { path: "stat", component: MatchListComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TeamManagementRoutingModule {}
