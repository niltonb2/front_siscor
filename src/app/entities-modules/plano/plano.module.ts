import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { PlanoComponent } from './plano.component';
import { SharedModule } from 'app/components/shared.module';

const routes: Routes = [
    { path: '', component: PlanoComponent }
];

@NgModule({
    declarations: [
        PlanoComponent
    ],
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        SharedModule
    ]
})

export class PlanoModule { }