import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { ProdutoComponent } from './produto.component';
import { SharedModule } from 'app/components/shared.module';

const routes: Routes = [
    { path: '', component: ProdutoComponent }
];

@NgModule({
    declarations: [
        ProdutoComponent
    ],
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        SharedModule
    ]
})

export class ProdutoModule { }