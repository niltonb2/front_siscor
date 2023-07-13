import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { EstabelecimentoComponent } from './estabelecimento.component';
import { SharedModule } from 'app/components/shared.module';



const routes: Routes = [
  { path: '', component: EstabelecimentoComponent }
];

@NgModule({
  declarations: [
    EstabelecimentoComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule
  ]
})
export class EstabelecimentoModule { }
