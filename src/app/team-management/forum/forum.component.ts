import { Component, OnInit } from "@angular/core";
import { Forum } from "./forum.model";
import { TeamService } from "../team.service";

@Component({
  selector: "app-forum",
  templateUrl: "./forum.component.html",
  styleUrls: ["./forum.component.scss"],
})
export class ForumComponent implements OnInit {
  public contentHeader: object;
  public data: any;
  public searchText: string = "";
  expandedIndex: number = null;

  forums: Forum[] = [];

  newForum: Forum = new Forum();

  selectedForum: any = null;
  public filteredForums: Forum[] = [];

  constructor(private teamService: TeamService) {}

  ngOnInit(): void {
    this.loadForums();
    this.expandedIndex = 0;
  }

  addForum(): void {
    this.teamService.addForum(this.newForum).subscribe(
      (forum) => {
        this.forums.push(forum);
        this.newForum = new Forum();
      },
      (error) => {
        console.error("Error adding forum post:", error);
      }
    );
  }

  selectForum(forum: any) {
    this.selectedForum = forum;
  }

  cancelEdit() {
    this.selectedForum = null;
  }
  updateForum(): void {
    if (this.selectedForum) {
      this.teamService
        .updateForum(this.selectedForum._id!, this.selectedForum)
        .subscribe(
          (updatedForum) => {
            const index = this.forums.findIndex(
              (f) => f._id === updatedForum._id
            );
            if (index !== -1) {
              this.forums[index] = updatedForum;
            }
            this.selectedForum = null;
          },
          (error) => {
            console.error("Error updating forum post:", error);
          }
        );
    }
  }

  deleteForum(forum: Forum): void {
    this.teamService.deleteForum(forum._id!).subscribe(
      () => {
        this.forums = this.forums.filter((f) => f._id !== forum._id);
        this.selectedForum = null;
      },
      (error) => {
        console.error("Error deleting forum post:", error);
      }
    );
  }
  toggleForum(index: number): void {
    this.expandedIndex = this.expandedIndex === index ? null : index;
  }

  loadForums(): void {
    this.teamService.getAllForums().subscribe(
      (forums) => {
        this.forums = forums;
        this.filteredForums = forums;
      },
      (error) => {
        console.error("Error fetching forum posts:", error);
      }
    );
  }

  filterForums() {
    if (!this.searchText.trim()) {
      return this.forums;
    }

    return this.forums.filter((forum) => {
      return forum.title
        .toLowerCase()
        .includes(this.searchText.trim().toLowerCase());
    });
  }
}
