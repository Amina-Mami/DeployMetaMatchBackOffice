import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListInjuryComponent } from './list-injury/list-injury.component';
import { AjoutInjuryComponent } from './ajout-injury/ajout-injury.component';
import { UpdateInjuryComponent } from './update-injury/update-injury.component';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { Ng2FlatpickrModule } from 'ng2-flatpickr';

import { CoreCommonModule } from '@core/common.module';
import { CoreDirectivesModule } from '@core/directives/directives';
import { CorePipesModule } from '@core/pipes/pipes.module';
import { CoreSidebarModule } from '@core/components';
import { ChartsModule } from 'ng2-charts';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';

import { DatePipe } from '@angular/common';
import { ViewBackendInjuryCoachComponent } from './view-backend-injury-coach/view-backend-injury-coach.component';
import { ListInjuryPhysoComponent } from './list-injury-physo/list-injury-physo.component';
import { ViewsArchivesComponent } from './views-archives/views-archives.component';
import { StatsInjuryComponent } from './stats-injury/stats-injury.component';
import { PredictionComponent } from './prediction/prediction.component';


// routing
const routes: Routes = [
  {
    path: 'listInjury',
    component: ListInjuryComponent,
    
    data: { animation: 'ListInjuryComponent' }
  },
  {
    path: 'addInjury',
    component: AjoutInjuryComponent,
   
    
    data: { path: 'addInjury', animation: 'AjoutInjuryComponent' }
  },
  {
    path: 'editInjury/:idInjury', 
    component: UpdateInjuryComponent,
    data: { animation: 'UpdateInjuryComponent' }
  },
  {
    path: 'editInjury',
    component: UpdateInjuryComponent,
   
    data: { animation: 'UpdateInjuryComponent' }
  },
  {
    path: 'coachInjuryBack',
    component: ViewBackendInjuryCoachComponent,
   
    data: { animation: 'ViewBackendInjuryCoachComponent' }
  },{
    path: 'physoInjuryBack',
    component: ListInjuryPhysoComponent,
   
    data: { animation: 'ListInjuryPhysoComponent' }
  },{
    path: 'injuryArchives',
    component: ViewsArchivesComponent,
   
    data: { animation: 'ViewsArchivesComponent' }
  },{
    path: 'statsInjury',
    component: StatsInjuryComponent,
   
    data: { animation: 'StatsInjuryComponent' }
  },
  {
    path: 'prediction',
    component: PredictionComponent,
   
    data: { animation: 'PredictionComponent' }
  }
];
@NgModule({
  declarations: [ListInjuryComponent, AjoutInjuryComponent, UpdateInjuryComponent, ViewBackendInjuryCoachComponent, ListInjuryPhysoComponent, ViewsArchivesComponent, StatsInjuryComponent, PredictionComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    NgbModule,
    NgSelectModule,
    NgxDatatableModule,
    Ng2FlatpickrModule,
    CoreCommonModule,
    CoreDirectivesModule,
    CorePipesModule,
    CoreSidebarModule,
    ChartsModule,
    NgbPaginationModule
  ],
  providers: [DatePipe],

  exports: []
})
export class InjuryModule {}