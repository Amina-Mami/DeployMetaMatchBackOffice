import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit,
} from "@angular/core";
import { PerformanceServiceService } from "../../performance-service.service";

import { Router } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Chart } from "chart.js";
import { Form } from "../../model/Form";
import { parse as csvParse } from "papaparse";

@Component({
  selector: "app-analysis-form",
  templateUrl: "./analysis-form.component.html",
  styleUrls: ["./analysis-form.component.scss"],
})
export class AnalysisFormComponent implements OnInit {
  passesChart: any;
  videoUrl: any;
  passesData: any;
  passesData1: any;
  //showPlayersList: boolean = true;
  showFormsList: boolean = false;
  showPerformance: boolean = false;

  joueurs!: any[];
  showAddForm: boolean = false; // Ajout de la variable pour contrôler l'affichage du formulaire
  form: FormGroup;
  showPlayersList: boolean = true;
  forms: Form[] = [];
  selectedForm: Form | null = null;
  formUpdate: FormGroup;
  showStats: boolean = false;
  statsData: any[] = [];
  formsCsv: Form[] = [];
  selectedFormC: Form | null = null;
  notification: string | null = null;
  @ViewChild("playerStatsChart")
  playerStatsChart!: ElementRef<HTMLCanvasElement>;

  constructor(
    private formBuilder: FormBuilder,
    private Service: PerformanceServiceService,
    private router: Router
  ) {
    this.Service.notification$.subscribe((message) => {
      this.notification = message;
      setTimeout(() => (this.notification = null), 6000); // Masque le message après 3 secondes
    });
  }

  ngOnInit(): void {
    this.getJoueurs();
    this.initForm();
    this.loadForms();
    // Initialisez form dans le OnInit
    this.formUpdate = this.formBuilder.group({
      playerInformation: this.formBuilder.group({
        playerName: [""],
        team: [""],
        position: [""],
      }),
      performanceMetrics: this.formBuilder.group({
        passing: this.formBuilder.group({
          totalPasses: [""],
          successfulPasses: [""],
          passingAccuracy: [""],
          keyPasses: [""],
        }),
        shooting: this.formBuilder.group({
          totalShots: [""],
          shotsOnTarget: [""],
          goalsScored: [""],
          shotAccuracy: [""],
        }),
        defending: this.formBuilder.group({
          tackles: [""],
          interceptions: [""],
          clearances: [""],
          blocks: [""],
        }),
        physical: this.formBuilder.group({
          distanceCovered: [""],
          sprints: [""],
          duelsWon: [""],
          aerialDuelsWon: [""],
        }),
        creativity: this.formBuilder.group({
          assists: [""],
          crossesCompleted: [""],
          throughBallsCompleted: [""],
          dribblesCompleted: [""],
        }),
        discipline: this.formBuilder.group({
          yellowCards: [""],
          redCards: [""],
          foulsCommitted: [""],
          foulsSuffered: [""],
        }),
        overallAssessment: this.formBuilder.group({
          rating: [""],
          comments: [""],
        }),
      }),
      additionalObservations: [""],
    });
  }

  getJoueurs(): void {
    this.Service.getJoueurs().subscribe((joueurs) => (this.joueurs = joueurs));
  }
  importCSV(event: any): void {
    const file = event.target.files[0];
    if (!file) {
      console.warn("No file selected.");
      window.alert("No file selected.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e: any) => {
      const csvContent = e.target.result;

      csvParse(csvContent, {
        header: true,
        skipEmptyLines: true,
        complete: (result) => {
          if (result.errors.length > 0) {
            console.error("ERROR IN CSV FILE", result.errors);
            window.alert(
              "Error in CSV file: " +
                result.errors.map((err) => err.message).join(", ")
            );
            return;
          }

          const newForms = result.data
            .map((data: any) => ({
              _id: data._id,
              playerInformation: {
                playerName: data.playerName,
                team: data.team,
                position: data.position,
              },
              performanceMetrics: {
                passing: {
                  totalPasses: data.totalPasses,
                  successfulPasses: data.successfulPasses,
                  passingAccuracy: data.passingAccuracy,
                  keyPasses: data.keyPasses,
                },
                shooting: {
                  totalShots: data.totalShots,
                  shotsOnTarget: data.shotsOnTarget,
                  goalsScored: data.goalsScored,
                  shotAccuracy: data.shotAccuracy,
                },
                defending: {
                  tackles: data.tackles,
                  interceptions: data.interceptions,
                  clearances: data.clearances,
                  blocks: data.blocks,
                },
                physical: {
                  distanceCovered: data.distanceCovered,
                  sprints: data.sprints,
                  duelsWon: data.duelsWon,
                  aerialDuelsWon: data.aerialDuelsWon,
                },
                creativity: {
                  assists: data.assists,
                  crossesCompleted: data.crossesCompleted,
                  throughBallsCompleted: data.throughBallsCompleted,
                  dribblesCompleted: data.dribblesCompleted,
                },
                discipline: {
                  yellowCards: data.yellowCards,
                  redCards: data.redCards,
                  foulsCommitted: data.foulsCommitted,
                  foulsSuffered: data.foulsSuffered,
                },
                overallAssessment: {
                  rating: data.rating,
                  comments: data.comments,
                },
              },
              additionalObservations: data.additionalObservations,
            }))
            .filter((form): form is Form => form !== null);

          this.formsCsv = [...this.formsCsv, ...newForms];

          console.log("CSV data successfully imported:", this.formsCsv);
          window.alert("CSV data successfully imported."); // Ajout de cette ligne pour vérifier le contenu
        },
        error: (error) => {
          console.error("Error during CSV parsing:", error);
          window.alert("Error during CSV parsing: " + error.message);
        },
      });
    };

    reader.readAsText(file);
  }

  /*viewForm(playerName: string): void {
    const normalizedPlayerName = playerName.trim().toLowerCase(); // Normaliser le nom
    const form = this.formsCsv.find(
      (f) => f.playerInformation.playerName.trim().toLowerCase() === normalizedPlayerName
    );
  
    if (form) {
      console.log(`Form found for the player : ${playerName}`); // Message de débogage
      this.selectedForm = form;
    } else {
      console.warn(`Form not found for the player: ${playerName}`);
    }
  }*/
  viewForm(playerName: string): void {
    const normalizedPlayerName = playerName.trim().toLowerCase();
    const form = this.formsCsv.find(
      (f) =>
        f.playerInformation.playerName.trim().toLowerCase() ===
        normalizedPlayerName
    );

    if (form) {
      this.Service.notify(`Form found for the player: ${playerName}`);
      this.selectedForm = form;
    } else {
      this.Service.notify(`Form not found for the player: ${playerName}`);
    }
  }
  hideForm(): void {
    this.selectedForm = null;
  }

  toggleAddForm(playerName: string): void {
    this.showAddForm = !this.showAddForm; // Inverser la valeur de la variable pour afficher ou masquer le formulaire
    if (this.showAddForm) {
      this.form.patchValue({
        playerInformation: {
          playerName: playerName,
        },
      });
    }
  }
  initForm(): void {
    this.form = this.formBuilder.group({
      playerInformation: this.formBuilder.group({
        playerName: ["", Validators.required],
        team: ["", Validators.required],
        position: ["", Validators.required],
      }),
      performanceMetrics: this.formBuilder.group({
        passing: this.formBuilder.group({
          totalPasses: [null, Validators.required],
          successfulPasses: [null, Validators.required],
          passingAccuracy: [null, Validators.required],
          keyPasses: [null, Validators.required],
        }),
        shooting: this.formBuilder.group({
          totalShots: [null, Validators.required],
          shotsOnTarget: [null, Validators.required],
          goalsScored: [null, Validators.required],
          shotAccuracy: [null, Validators.required],
        }),
        defending: this.formBuilder.group({
          tackles: [null, Validators.required],
          interceptions: [null, Validators.required],
          clearances: [null, Validators.required],
          blocks: [null, Validators.required],
        }),
        physical: this.formBuilder.group({
          distanceCovered: [null, Validators.required],
          sprints: [null, Validators.required],
          duelsWon: [null, Validators.required],
          aerialDuelsWon: [null, Validators.required],
        }),
        creativity: this.formBuilder.group({
          assists: [null, Validators.required],
          crossesCompleted: [null, Validators.required],
          throughBallsCompleted: [null, Validators.required],
          dribblesCompleted: [null, Validators.required],
        }),
        discipline: this.formBuilder.group({
          yellowCards: [null, Validators.required],
          redCards: [null, Validators.required],
          foulsCommitted: [null, Validators.required],
          foulsSuffered: [null, Validators.required],
        }),
        overallAssessment: this.formBuilder.group({
          rating: [null, Validators.required],
          comments: [""],
        }),
      }),
      additionalObservations: [""],
    });
  }

  onSubmit(): void {
    if (this.form.valid) {
      const formData = this.form.value;
      this.Service.addForm(formData).subscribe(
        (response) => {
          console.log("Form added successfully:", response);
          // Réinitialiser le formulaire après l'ajout
          this.form.reset();
          // Masquer à nouveau le formulaire
          this.showAddForm = false;
        },
        (error) => {
          console.error("Error adding form:", error);
        }
      );
    } else {
      console.error("Invalid form data. Please check the fields.");
    }
  }
  /*toggleView(): void {
  this.showPlayersList = !this.showPlayersList;
}*/
  toggleView(view: string): void {
    this.showPlayersList = view === "players";
    this.showFormsList = view === "forms";
    this.showPerformance = view === "performance";
  }
  loadForms(): void {
    this.Service.getForms().subscribe(
      (forms: Form[]) => {
        this.forms = forms;
      },
      (error) => {
        console.error("Error loading forms:", error);
      }
    );
  }

  deleteForms(form: Form): void {
    const formId = form._id; // Récupérer l'identifiant unique du formulaire
    this.Service.deleteForm(formId).subscribe(
      () => {
        // Supprimer le formulaire du tableau des formulaires après la suppression réussie
        this.forms = this.forms.filter((f) => f._id !== formId);
        console.log("Form deleted successfully");
      },
      (error) => {
        console.error("Error deleting form:", error);
      }
    );
  }

  updateForm(form: Form): void {
    // Copiez les données du formulaire sélectionné dans le formulaire
    this.formUpdate.patchValue({
      playerInformation: {
        playerName: form.playerInformation.playerName,
        team: form.playerInformation.team,
        position: form.playerInformation.position,
      },
      performanceMetrics: {
        passing: {
          totalPasses: form.performanceMetrics.passing.totalPasses,
          successfulPasses: form.performanceMetrics.passing.successfulPasses,
          passingAccuracy: form.performanceMetrics.passing.passingAccuracy,
          keyPasses: form.performanceMetrics.passing.keyPasses,
        },
        shooting: {
          totalShots: form.performanceMetrics.shooting.totalShots,
          shotsOnTarget: form.performanceMetrics.shooting.shotsOnTarget,
          goalsScored: form.performanceMetrics.shooting.goalsScored,
          shotAccuracy: form.performanceMetrics.shooting.shotAccuracy,
        },
        defending: {
          tackles: form.performanceMetrics.defending.tackles,
          interceptions: form.performanceMetrics.defending.interceptions,
          clearances: form.performanceMetrics.defending.clearances,
          blocks: form.performanceMetrics.defending.blocks,
        },
        physical: {
          distanceCovered: form.performanceMetrics.physical.distanceCovered,
          sprints: form.performanceMetrics.physical.sprints,
          duelsWon: form.performanceMetrics.physical.duelsWon,
          aerialDuelsWon: form.performanceMetrics.physical.aerialDuelsWon,
        },
        creativity: {
          assists: form.performanceMetrics.creativity.assists,
          crossesCompleted: form.performanceMetrics.creativity.crossesCompleted,
          throughBallsCompleted:
            form.performanceMetrics.creativity.throughBallsCompleted,
          dribblesCompleted:
            form.performanceMetrics.creativity.dribblesCompleted,
        },
        discipline: {
          yellowCards: form.performanceMetrics.discipline.yellowCards,
          redCards: form.performanceMetrics.discipline.redCards,
          foulsCommitted: form.performanceMetrics.discipline.foulsCommitted,
          foulsSuffered: form.performanceMetrics.discipline.foulsSuffered,
        },
        overallAssessment: {
          rating: form.performanceMetrics.overallAssessment.rating,
          comments: form.performanceMetrics.overallAssessment.comments,
        },
      },
      additionalObservations: form.additionalObservations,
    });

    // Mettez à jour selectedForm avec le formulaire sélectionné
    this.selectedForm = { ...form };
  }

  submitUpdateForm(): void {
    if (this.selectedForm) {
      this.Service.updateForm(this.selectedForm).subscribe(
        () => {
          console.log("Form updated successfully");
          // Rechargez la liste des formulaires après la mise à jour réussie
          this.loadForms();
          this.selectedForm = null; // Réinitialiser selectedForm après la mise à jour réussie
        },
        (error) => {
          console.error("Error updating form:", error);
        }
      );
    }
  }

  showPlayerStats(formId: string): void {
    this.Service.getPlayerStatistics(formId).subscribe(
      (statistics) => {
        console.log(statistics); // Affichez les statistiques dans la console pour vérifier
        this.generateChart(statistics);
      },
      (error) => {
        console.error("Error fetching player statistics:", error);
      }
    );
  }
  generateChart(statistics: any[]): void {
    const labels = statistics.map((stat) => stat.playerName);
    const blocksData = statistics.map((stat) => stat.defending.blocks);
    const clearancesData = statistics.map((stat) => stat.defending.clearances);
    const interceptionsData = statistics.map(
      (stat) => stat.defending.interceptions
    );
    const tacklesData = statistics.map((stat) => stat.defending.tackles);

    const foulsCommittedData = statistics.map(
      (stat) => stat.discipline.foulsCommitted
    );
    const foulsSufferedData = statistics.map(
      (stat) => stat.discipline.foulsSuffered
    );
    const redCardsData = statistics.map((stat) => stat.discipline.redCards);
    const yellowCardsData = statistics.map(
      (stat) => stat.discipline.yellowCards
    );

    const ctx = document.getElementById(
      "playerStatsChart"
    ) as HTMLCanvasElement;
    const ctxDiscipline = document.getElementById(
      "playerStatsChartDiscipline"
    ) as HTMLCanvasElement;

    if (!ctx || !ctxDiscipline) {
      console.error("Chart canvas element not found.");
      return;
    }

    new Chart(ctx, {
      type: "bar",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Blocks",
            data: blocksData,
            backgroundColor: "rgba(255, 99, 132, 0.2)",
            borderColor: "rgba(255, 99, 132, 1)",
            borderWidth: 1,
          },
          {
            label: "Clearances",
            data: clearancesData,
            backgroundColor: "rgba(54, 162, 235, 0.2)",
            borderColor: "rgba(54, 162, 235, 1)",
            borderWidth: 1,
          },
          {
            label: "Interceptions",
            data: interceptionsData,
            backgroundColor: "rgba(255, 206, 86, 0.2)",
            borderColor: "rgba(255, 206, 86, 1)",
            borderWidth: 1,
          },
          {
            label: "Tackles",
            data: tacklesData,
            backgroundColor: "rgba(75, 192, 192, 0.2)",
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 1,
          },
        ],
      },
      options: {
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

    new Chart(ctxDiscipline, {
      type: "bar",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Fouls Committed",
            data: foulsCommittedData,
            backgroundColor: "rgba(255, 99, 132, 0.2)",
            borderColor: "rgba(255, 99, 132, 1)",
            borderWidth: 1,
          },
          {
            label: "Fouls Suffered",
            data: foulsSufferedData,
            backgroundColor: "rgba(54, 162, 235, 0.2)",
            borderColor: "rgba(54, 162, 235, 1)",
            borderWidth: 1,
          },
          {
            label: "Red Cards",
            data: redCardsData,
            backgroundColor: "rgba(255, 206, 86, 0.2)",
            borderColor: "rgba(255, 206, 86, 1)",
            borderWidth: 1,
          },
          {
            label: "Yellow Cards",
            data: yellowCardsData,
            backgroundColor: "rgba(75, 192, 192, 0.2)",
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 1,
          },
        ],
      },
      options: {
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
  //match
  viewPassesChart(): void {
    this.Service.getPassesChart().subscribe(
      (data: Blob) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          this.passesChart = reader.result;
        };
        reader.readAsDataURL(data);
      },
      (error) => {
        console.error("Error fetching passes chart:", error);
      }
    );
  }

  viewPassesVideo(): void {
    this.Service.getPassesVideo().subscribe(
      (data: Blob) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          this.videoUrl = reader.result;
        };
        reader.readAsDataURL(data);
      },
      (error) => {
        console.error("Error fetching passes video:", error);
      }
    );
  }

  viewPlayerPosition() {
    this.Service.getPassesData().subscribe((data) => {
      this.passesData = data;
    });
  }

  getData() {
    this.Service.getData().subscribe(
      (response) => {
        this.passesData1 = response;
        console.log("Passes data:", this.passesData1);
      },
      (error) => {
        console.error("Error fetching passes data:", error);
      }
    );
  }
}
