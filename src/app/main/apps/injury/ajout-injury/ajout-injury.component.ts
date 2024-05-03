import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ServiceInjury } from '../service-injury.service';
import { Injury } from '../injury';
import { Router } from '@angular/router';
import { User } from 'app/auth/models';
import { Useratribute } from '../../user/Useratribute';

@Component({
  selector: 'app-ajout-injury',
  templateUrl: './ajout-injury.component.html',
  styleUrls: ['./ajout-injury.component.scss']
})
export class AjoutInjuryComponent implements OnInit {
  BlocForm: FormGroup;
  joueurs: any[];
  formSubmitted = false;
  
  constructor(
    private serviceInjury: ServiceInjury,
    private router: Router,
    private fb: FormBuilder
  ) {
    let formControls = {
      player_id: new FormControl('', [Validators.required]),
      date: new FormControl('', [Validators.required]),
      type: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required, Validators.minLength(20)]),
      recovery_status: new FormControl('In Rehabilitation', [Validators.required]),
      duration: new FormControl('', [Validators.required]),
    };
    this.BlocForm = this.fb.group(formControls);

  
  }



  ngOnInit(): void {
    this.serviceInjury.getJoueurs().subscribe(
      (joueurs) => {
        this.joueurs = joueurs;
        console.log(joueurs);

      },
      (error) => {
        console.error(error);
      }
    );
  }
 
  get player_id() { return this.BlocForm.get('player_id'); }
  get date() { return this.BlocForm.get('date'); }
  get type() { return this.BlocForm.get('type'); }
  get description() { return this.BlocForm.get('description'); }
  get recovery_status() { return this.BlocForm.get('recovery_status'); }
  get duration() { return this.BlocForm.get('duration'); }

  validateField(field: string) {
    return (
      this.BlocForm.get(field)?.invalid &&
      (this.BlocForm.get(field)?.touched || this.formSubmitted)
    );
  }

  getErrorMessage(field: string) {
    if (this.BlocForm.get(field)?.hasError('required')) {
      return 'Ce champ est obligatoire';
    }
    if (this.BlocForm.get(field)?.hasError('minlength')) {
      return 'Ce champ doit contenir au moins 20 caractères';
    }
    // Ajoutez d'autres messages d'erreur personnalisés si nécessaire
    return '';
  }

  addNewInjury() {
    this.formSubmitted = true;

    if (this.BlocForm.invalid) {
      return;
    }

    let data = this.BlocForm.value;
    console.log('Form data:', data); // Vérifier les données du formulaire dans la console
  
    console.log('Player ID from form:', data.player_id); // Ajouter cette ligne pour vérifier l'id du joueur sélectionné
  
    let selectedJoueur = this.joueurs.find(joueur => joueur._id == data.player_id);
    console.log('Selected player:', selectedJoueur); // Vérifier l'utilisateur sélectionné dans la console
  

if (selectedJoueur) {
  let newInjuryInstance: Injury = {
    player_id: selectedJoueur,
    date: data.date,
    type: data.type,
    description: data.description,
    recovery_status: data.recovery_status,
    duration: data.duration
  };

  this.serviceInjury.addInjury(newInjuryInstance).subscribe(
    res => {
      this.router.navigate(['/apps/injury/listInjury']);
    },
    err => {
      console.log(err);
    }
  );
} else {
  console.log('No player found with the provided id');
}

}
}
