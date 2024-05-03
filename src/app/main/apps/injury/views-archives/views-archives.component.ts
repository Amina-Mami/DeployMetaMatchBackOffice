import { Component, OnInit } from '@angular/core';
import { Injury } from '../injury';
import { ServiceInjury } from '../service-injury.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-views-archives',
  templateUrl: './views-archives.component.html',
  styleUrls: ['./views-archives.component.scss']
})
export class ViewsArchivesComponent implements OnInit {
  injuries: Injury[] = [];
  joueurs: any[] = [];
  id : number;
  searchTerm: string = '';
  currentPage = 1; // Page actuelle de la pagination
  itemsPerPage = 5; // Nombre d'éléments par page
  displayedInjuries: Injury[] = []; // Liste des injuries affichés sur la page actuelle
  constructor(private serviceInjury: ServiceInjury, private router: Router) { }

  ngOnInit(): void {
    this.loadInjuries();
    this.loadJoueurs();

  }

  loadInjuries() {
    this.serviceInjury.getInjuries().subscribe(
      data => {
        this.injuries = data;
        this.injuries = data.filter(injury => injury.archived);
        this.applyPagination(); // Appliquer la pagination après chargement des données

        console.log('injuries:', data);
        // Initialiser les timers pour chaque blessure
        this.injuries.forEach(injury => {
        });
      },
      error => {
        console.error('Erreur lors de la récupération des injuries', error);
      }
    );
  }

  loadJoueurs() {
    this.serviceInjury.getJoueurs().subscribe(
      data => {
        this.joueurs = data;
        this.updateRecoveryStatus();


        console.log('Joueurs:', data);
      },
      error => {
        console.error('Error retrieving joueurs', error);
      }
    );
  }


  getPlayerName(playerId: number): string {
    const joueur = this.joueurs.find(user => user._id === playerId);
    return joueur ? joueur.username : 'Unknown';
  }

  getPlayerImage(playerId: number): string {
    const joueur = this.joueurs.find(user => user._id === playerId);
    return joueur ? joueur.profile : 'assets/images/avatars/1-small.png';
  }

  search() {
    if (this.searchTerm.trim() !== '') {
        this.injuries = this.injuries.filter(injury =>
            injury.type.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
            injury.description.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
            injury.date.toString().includes(this.searchTerm) 
        );
    } else {
        this.loadInjuries(); // Recharger tous les injuries si le champ de recherche est vide
    }
}

applyPagination() {
  // Calculer l'index de début et de fin pour la pagination
  const startIndex = (this.currentPage - 1) * this.itemsPerPage;
  const endIndex = startIndex + this.itemsPerPage;
  this.displayedInjuries = this.injuries.slice(startIndex, endIndex);
}

onPageChange(page: number) {
  this.currentPage = page;
  this.applyPagination(); // Appliquer la pagination lors du changement de page
}

updateRecoveryStatus() {
  const currentDate = new Date();
  this.injuries.forEach(injury => {
    const endDate = new Date(injury.duration);
    if (currentDate >= endDate) {
      injury.recovery_status = 'Recovered';
    } else if (currentDate.getDate() + 7 >= endDate.getDate()) {
      injury.recovery_status = 'In Progress';
    } else {
      injury.recovery_status = 'In Rehabilitation';
    }
  });
}


archiveInjury(injuryId: string | undefined) {
  if (injuryId === undefined) {
    console.error("Error: Invalid injuryId.");
    return;
  }
  console.log("Archiving injury with ID: ", injuryId);
  this.serviceInjury.archiveInjury(injuryId).subscribe(
    () => {
      console.log("Injury archived successfully!");
      alert("Injury archived successfully!");
      // Retirer l'injury de la liste
      this.injuries = this.injuries.filter(injury => injury.idInjury !== injuryId);
      this.loadInjuries();

    },
    (error) => {
      console.error("Error archiving injury: ", error);
    }
  );
}

}
