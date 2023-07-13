import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from 'app/components/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ConfiguracoesComponent } from './configuracoes.component';

const routes: Routes = [
    { path: '', component: ConfiguracoesComponent }
];

@NgModule({
    declarations: [
        ConfiguracoesComponent
    ],
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        SharedModule,
        FormsModule,
        ReactiveFormsModule

    ]
})

export class ConfiguracoesModule { }