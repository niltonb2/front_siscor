import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { PessoaComponent } from './pessoa.component';
import { SharedModule } from 'app/components/shared.module';

const routes: Routes = [
  { path: '', component: PessoaComponent }
];

@NgModule({
  declarations: [
    PessoaComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule
  ]
})
export class PessoaModule { }
