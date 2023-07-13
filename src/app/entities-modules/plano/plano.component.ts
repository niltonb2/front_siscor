import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { PlanoService } from './plano.service';

@Component({
    selector: 'app-plano',
    templateUrl: './plano.component.html',
    styleUrls: ['./plano.component.scss']
})
export class PlanoComponent implements OnInit, OnDestroy {

    cadastroPlano: boolean = false;
    subs: Subscription[] = [];
    edicaoPlano: boolean = false;

    constructor(
        private planoService: PlanoService
    ) { }

    ngOnInit(): void {
        const sub1 = this.planoService.mostrarTelaPlano.subscribe({ next: v => this.cadastroPlano = v })
        const sub2 = this.planoService.mostrarTelaPlanoEditar.subscribe({ next: v => this.edicaoPlano = v })
        this.subs.push(sub1, sub2)
    }

    ngOnDestroy(): void {
        this.subs.forEach(sub => sub.unsubscribe());
        this.planoService.mostrarTelaPlano.next(false);
    }

    mostrarTelaCadastro() {
        this.planoService.mostrarTelaPlano.next(true);
    }

    fecharTelaCadastro() {
        this.planoService.mostrarTelaPlano.next(false);
    }

    fecharTelaEdicao(){
        this.planoService.mostrarTelaPlanoEditar.next(false);
    }

}