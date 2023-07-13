import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from 'app/components/shared.module';
import { AssinaturaComponent } from './assinatura.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';

const routes: Routes = [
    { path: '', component: AssinaturaComponent }
];

@NgModule({
    declarations: [
        AssinaturaComponent
    ],
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        SharedModule,
        ReactiveFormsModule,
        FormsModule,
        NgSelectModule
    ]
})

export class AssinaturaModule { }