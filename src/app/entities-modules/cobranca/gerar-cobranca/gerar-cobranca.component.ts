import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import Stepper from 'bs-stepper';
import { IUserEc } from '@core/types/IUserEc';
import { UserService } from 'app/auth/service';
import { Subscription } from 'rxjs';
import { ClienteService } from 'app/entities-modules/pessoa/cadastro-cliente/cliente.service';
import { ICliente } from '@core/types/ICliente';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ICobranca } from '@core/types/ICobranca';
import { App } from 'app/app';
import { CobrancaService } from '../cobranca.service';

@Component({
  selector: 'app-gerar-cobranca',
  templateUrl: './gerar-cobranca.component.html',
  styleUrls: ['./gerar-cobranca.component.scss']
})
export class GerarCobrancaComponent implements OnInit {

  public data_vencimento: NgbDateStruct;
  public submitted = false;
  public loading = false;
  public valorFinal: number;
  public dataVencimentoFinal: string;

  @Output() gerarCobrancaEvento = new EventEmitter<any>();
  @Output() cadastrarClienteEvento = new EventEmitter<any>();
  private verticalWizardStepper: Stepper;

  estabelecimentosPorUsuario: IUserEc[] = [];
  clientesPorEstabelecimentos: ICliente[] = [];
  subs: Subscription[] = [];

  formularioCobranca = new FormGroup({
    valor: new FormControl({ value: '', disabled: true }, Validators.required),
    valor_original: new FormControl('', Validators.required),
    estabelecimento: new FormControl('', Validators.required),
    pessoa: new FormControl('', Validators.required),
    observacao: new FormControl(''),
    metadados_descricao: new FormControl(''),
    metadados_valor: new FormControl('')
  })

  constructor(
    private _userService: UserService,
    private clienteService: ClienteService,
    private cobrancaService: CobrancaService
  ) { }

  ngOnInit(): void {
    this.verticalWizardStepper = new Stepper(document.querySelector('#cadastroEstabelecimento'), {
      linear: false,
      animation: true
    });

    this.data_vencimento

    const sub = this._userService.getQtdeEcsByUser()
      .subscribe({
        next: ecs => {
          this.estabelecimentosPorUsuario = ecs
        },
        error: e => console.log(e)
      })

    this.subs.push(sub)
  }

  get f_cobranca() {
    return this.formularioCobranca.controls;
  }

  get f_cobranca_value() {
    return this.formularioCobranca.value;
  }

  gerarCobranca() {

    this.submitted = true;

    if (this.formularioCobranca.invalid) {
      return;
    }

    this.loading = true;

    if(this.f_cobranca.valor.status == 'DISABLED'){
      this.f_cobranca.valor.enable()
      this.f_cobranca.valor.setValue(this.f_cobranca_value.valor_original)
    }

    const data_vencimento = `${this.data_vencimento?.day}/${this.data_vencimento?.month}/${this.data_vencimento?.year}`

    const cob: ICobranca = {
      ...this.f_cobranca_value,
      tipo: 1,
      status: 'aberto',
      usuario: App.Instance.userInfo.id,
      data_vencimento
    }
    
    this.cobrancaService.gerarCobranca(cob)
      .subscribe({
        next: res => {
          this.cobrancaService.mostrarTelaCobranca.next(false);

        },
        error: e => {
          console.log(e)
        }
      })
  }

  onChange(idEstabelecimento: number) {
    this.formularioCobranca.controls.pessoa.setValue('');
    this.clienteService.buscarClientesCobranca(idEstabelecimento)
      .subscribe({
        next: array => this.clientesPorEstabelecimentos = array,
        error: e => console.log(e)
      })
  }

  buscaCliente(event){
    /* setTimeout(() => {
      console.log(event.term)
    }, 500) */
  }

  onCheck() {
    if (this.formularioCobranca.controls.valor.status == 'DISABLED') {
      this.formularioCobranca.controls.valor.enable();
    } else {
      this.formularioCobranca.controls.valor.disable();
    }
  }

  eventoGerarCobranca() {
    this.gerarCobrancaEvento.emit();
  }

  cadastrarNovoCliente() {
    this.cadastrarClienteEvento.emit();
  }

  verticalWizardNext() {
    this.submitted = true;

    const data_vencimento = `${this.data_vencimento?.day}/${this.data_vencimento?.month}/${this.data_vencimento?.year}`
    this.dataVencimentoFinal = data_vencimento;

    if (this.formularioCobranca.invalid) {
      return;
    }
    this.f_cobranca.valor.status != 'DISABLED' ? this.valorFinal = this.f_cobranca_value.valor : this.valorFinal = this.f_cobranca_value.valor_original
    this.verticalWizardStepper.next();
  }

  verticalWizardPrevious() {
    this.verticalWizardStepper.previous();
  }

}
