import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ICobranca } from '@core/types/ICobranca';
import { AuthenticationService } from 'app/auth/service';
import { PortalClienteService } from './portal-cliente.service';
import { NgbModal, ModalDismissReasons, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { CheckoutComponent } from './checkout/checkout.component';
import { DadosEstabelecimentoComponent } from './dados-estabelecimento/dados-estabelecimento.component';
import { SpinnerComponent } from 'app/components/spinner/spinner.component';

@Component({
    selector: 'app-portal',
    templateUrl: './portal.component.html',
    styleUrls: ['./portal.component.scss']
})
export class PortalComponent implements OnInit {


    fieldAlert: boolean = false;
    message: string = ''
    status: string = ''
    public loading = false;

    documentoCliente: string;
    cobrancasCliente: ICobranca[] = [];
    closeResult = '';

    constructor(
        private route: ActivatedRoute,
        private portalClienteService: PortalClienteService,
        private authenticationService: AuthenticationService,
        private modalService: NgbModal,
        config: NgbModalConfig
    ) {
        this.authenticationService.estaNoPortal.next(true);
        config.backdrop = 'static';
        config.keyboard = false;

    }

    ngOnInit(): void {

        this.inicializar();

    }

    inicializar() {
        this.spinnerOpen();

        this.route.params.subscribe({
            next: param => this.documentoCliente = param['documento']
        })

        this.portalClienteService.buscarPessoaPorDocumento(this.documentoCliente)
            .subscribe({
                next: pessoa => {
                    this.portalClienteService.nomeClienteAcesso.next(pessoa[0].nome)
                }
            })

        this.portalClienteService.buscarCobrancaPorDocumento(this.documentoCliente)
            .subscribe({
                next: cobs => {
                    this.cobrancasCliente = cobs;
                    this.spinnerClose();
                }

            })
    }

    spinnerOpen() {
        this.modalService.open(
            SpinnerComponent, {
            centered: true,
            size: 'xs'
        }).result.then(
            (result) => {

            },
            (reason) => {

            }
        )
    }

    spinnerClose() {
        this.modalService.dismissAll();
    }



    open(cobranca: ICobranca) {
        this.portalClienteService.cobrancaParaPagamento.next(cobranca)
        this.portalClienteService.idCobrancaParaPagamento = cobranca.cobranca_id
        this.modalService.open(
            CheckoutComponent,
            {
                ariaLabelledBy: 'modal-basic-title',
                centered: true,
                size: 'lg'
            }).result.then(
                (result) => {
                    /* this.onAlert('Pagamento da cobrança realizado com sucesso!', 'primary') */
                    window.location.reload()
                },
                (reason) => {
                    this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
                },
            );
    }

    openDadosEc(cobranca: ICobranca) {
        this.portalClienteService.cobrancaParaPagamento.next(cobranca)
        this.modalService.open(
            DadosEstabelecimentoComponent,
            {
                ariaLabelledBy: 'modal-basic-title',
                centered: true
            }).result.then(
                (result) => {
                    console.log(result)
                },
                (reason) => {
                    this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
                },
            );
    }


    private getDismissReason(reason: any): string {
        if (reason === ModalDismissReasons.ESC) {
            return 'by pressing ESC';
        } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
            return 'by clicking on a backdrop';
        } else {
            return `with: ${reason}`;
        }
    }

    onAlert(info: string, status: string) {
        this.loading = false;
        this.message = info
        this.status = status
        this.fieldAlert = !this.fieldAlert;
        setTimeout(() => {
            this.fieldAlert = !this.fieldAlert
        }, 3000)
    }
}