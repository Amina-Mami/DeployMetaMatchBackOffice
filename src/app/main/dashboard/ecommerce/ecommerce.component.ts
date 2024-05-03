// ecommerce.component.ts
import { Component, OnInit } from '@angular/core';
import {UserService} from "../../../auth/service";


@Component({
  selector: 'app-ecommerce',
  templateUrl: './ecommerce.component.html',
  styleUrls: ['./ecommerce.component.scss']
})
export class EcommerceComponent implements OnInit {
  public userStats: any = {};

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadUserStatistics();
  }

  loadUserStatistics(): void {
    this.userService.getUserStatistics().subscribe({
      next: (stats) => {
        this.userStats = stats;
      },
      error: (e) => console.error(e)
    });
  }
}
