import { Component, OnInit } from "@angular/core";
import { TeamService } from "../team.service";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { NgxChartsModule } from "@swimlane/ngx-charts";
import Chart from "chart.js";

@Component({
  selector: "app-match-list",
  templateUrl: "./match-list.component.html",
  styleUrls: ["./match-list.component.scss"],
})
export class MatchListComponent implements OnInit {
  scrapedMatches: any[];
  matchData$: Observable<any>;
  matchData: any;

  donutChart: Chart;

  barChart: Chart;
  yearStats: any[] = [];
  selectedYear: number;

  constructor(private teamService: TeamService) {}

  ngOnInit(): void {
    this.scrapeMatches();
    this.matchData$ = this.teamService.getMatchDistribution();
    this.matchData$.subscribe((data) => console.log(data));
    this.fetchMatchData();
  }

  scrapeMatches(): void {
    this.teamService.scrapeMatches().subscribe(
      (matches) => {
        this.scrapedMatches = matches;
      },
      (error) => {
        console.error("Error scraping matches:", error);
      }
    );
  }

  formatData(matchData: any): any[] {
    const groupedData = Object.entries(matchData).reduce(
      (acc, [date, count]) => {
        const month = date.slice(0, 7); // Extract year and month from date
        acc[month] = (acc[month] || 0) + count;
        return acc;
      },
      {}
    );

    return Object.entries(groupedData).map(([month, count]) => ({
      name: month,
      value: count,
    }));
  }

  formatPieData(data: any): any[] {
    return Object.keys(data).map((month) => ({
      name: month,
      value: data[month],
    }));
  }
  fetchMatchData(): void {
    this.teamService.getMatchDistribution().subscribe(
      (data) => {
        this.matchData = data;
        this.createCharts();
      },
      (error) => {
        console.error("Error fetching match data:", error);
      }
    );
  }

  createCharts(): void {
    this.createBarChart();
    this.createPieChart();
  }

  createBarChart(): void {
    const ctx = document.getElementById("barChart") as HTMLCanvasElement;
    this.barChart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: Object.keys(this.matchData.matchesByDate), // Use dates as labels
        datasets: [
          {
            label: "Number of Matches",
            data: Object.values(this.matchData.matchesByDate).map(
              (count) => count as number
            ), // Use match counts as data
            backgroundColor: "rgba(54, 162, 235, 0.7)",
            borderColor: "rgba(54, 162, 235, 1)",
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true,
              },
            },
          ],
        },
      },
    });
  }
  fetchYearStats(): void {
    // this.teamService.getMatchDistributionByYear(this.selectedYear).subscribe(
    //   (data) => {
    //     this.yearStats = data || [];
    //     this.createLineChart();
    //   },
    //   (error) => {
    //     console.error('Error fetching year stats:', error);
    //   }
    // );
  }

  createLineChart(): void {
    // if (!this.yearStats || this.yearStats.length === 0) {
    //   console.warn('No data available for year stats.');
    //   return;
    // }
    // const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    // const dataByMonth = monthNames.map((month, index) => {
    //   const monthStats = this.yearStats.find(stat => stat.month === index + 1);
    //   const monthlyCounts = monthStats ? monthStats.count : 0;
    //   return { month, monthlyCounts };
    // });
    // const ctx = document.getElementById('lineChart') as HTMLCanvasElement;
    // this.lineChart = new Chart(ctx, {
    //   type: 'line',
    //   data: {
    //     labels: dataByMonth.map(stat => stat.month),
    //     datasets: [{
    //       label: `Number of matches in ${this.selectedYear}`,
    //       data: dataByMonth.map(stat => stat.monthlyCounts),
    //       fill: false,
    //       borderColor: 'rgb(75, 192, 192)',
    //       tension: 0.1
    //     }]
    //   },
    //   options: {
    //     responsive: true,
    //     maintainAspectRatio: false,
    //     scales: {
    //       yAxes: [{
    //         ticks: {
    //           beginAtZero: true
    //         }
    //       }]
    //     }
    //   }
    // });
  }

  createPieChart(): void {
    // Create pie chart using Chart.js
  }
}
