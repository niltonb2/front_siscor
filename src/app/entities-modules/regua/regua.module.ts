import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { ReguaComponent } from './regua.component';


const routes: Routes = [
  { path: '', component: ReguaComponent }
];

@NgModule({
  declarations: [
    ReguaComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class ReguaModule { }
