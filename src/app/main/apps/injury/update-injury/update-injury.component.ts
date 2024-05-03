import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ServiceInjury } from '../service-injury.service';
import { Injury } from '../injury';
import { Router,ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-update-injury',
  templateUrl: './update-injury.component.html',
  styleUrls: ['./update-injury.component.scss']
})
export class UpdateInjuryComponent implements OnInit {
  id: number;
  BlocForm: FormGroup;
  formSubmitted = false;
  joueurs: any[];
  
  constructor(
    private datePipe: DatePipe,
    private services: ServiceInjury,
    private router: Router,
    private fb: FormBuilder,
    private route: ActivatedRoute
  ) {
    let formControls = {
      date: new FormControl('', [Validators.required]),
      type: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required, Validators.minLength(20)]),
      recovery_status: new FormControl('', [Validators.required]),
      duration: new FormControl('', [Validators.required]),
    };
    this.BlocForm = this.fb.group(formControls);
  }

  get player_id() { return this.BlocForm.get('player_id'); }
  get date() { return this.BlocForm.get('date'); }
  get type() { return this.BlocForm.get('type'); }
  get description() { return this.BlocForm.get('description'); }
  get recovery_status() { return this.BlocForm.get('recovery_status'); }
  get duration() { return this.BlocForm.get('duration'); }


 ngOnInit(): void {
  this.services.getJoueurs().subscribe((joueurs) => {
    this.joueurs = joueurs;
  });
    let id = this.route.snapshot.params['idInjury'];
    if (id) {
      this.id = id;
      console.log('ID:', id);
  
      this.services.findInjuryById(id).subscribe((result) => {
        let event = result;
        console.log(event);
        this.BlocForm.patchValue({
          player_id: event.player_id?.username,
          date: this.datePipe.transform(event.date, 'yyyy-MM-dd'),
          type: event.type,
          description: event.description,
          recovery_status: event.recovery_status,
          duration: this.datePipe.transform(event.duration, 'yyyy-MM-dd'),
        });
      });
    } else {
      console.log('ID is undefined');
    }
  }




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
      return 'Ce champ doit contenir au moins 4 caractères';
    }
    // Ajoutez d'autres messages d'erreur personnalisés si nécessaire
    return '';
  }

  
  updateInjury(): void {
    this.services.getJoueurs().subscribe((joueurs) => {
      this.joueurs = joueurs;
    });
    let data = this.BlocForm.value;
  
    if (this.BlocForm.invalid) {
      return;
    }
    let injury: Injury = {
      player_id: data.player_id?.name,
      date: data.date,
      type: data.type,
      description: data.description,
      recovery_status: data.recovery_status,
      duration: data.duration,
    };
    console.log(injury);
    console.log(data);
    this.services.updateInjury(this.id.toString(), injury).subscribe((res) => {
      console.log("updatteeeeee");
      console.log(res);
      this.router.navigate(['/apps/injury/listInjury']);
    });
  }
}