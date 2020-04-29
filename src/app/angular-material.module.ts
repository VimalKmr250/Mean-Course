import { NgModule } from '@angular/core';

import { MatExpansionModule } from '@angular/material/expansion';
import{ MatButtonModule } from '@angular/material/button';
import{ MatPaginatorModule } from '@angular/material/paginator'
import{ MatCardModule } from '@angular/material/card';
import{ MatToolbarModule } from '@angular/material/toolbar';
import{ MatInputModule } from '@angular/material/input';
import{MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import{MatDialogModule} from '@angular/material/dialog';


@NgModule({
  exports:[
  MatInputModule,
  MatCardModule,
  MatButtonModule,
  MatToolbarModule,
  MatDialogModule,
  MatExpansionModule,
  MatPaginatorModule,
  MatProgressSpinnerModule,
]
})
export class AngularMaterialModule{

}
