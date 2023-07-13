import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { CobrancaComponent } from './cobranca.component';
import { SharedModule } from 'app/components/shared.module';


const routes: Routes = [
  { path: '', component: CobrancaComponent }
];

@NgModule({
  declarations: [
    CobrancaComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule
  ]
})
export class CobrancaModule { }
