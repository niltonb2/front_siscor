import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Stepper from 'bs-stepper';
import { ButtonAlertService } from 'app/layout/components/button-alert/button-alert.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ClienteService } from './cliente.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { DadosService } from '../../dados/dados.service';

@Component({
  selector: 'app-cadastro-cliente',
  templateUrl: './cadastro-cliente.component.html',
  styleUrls: ['./cadastro-cliente.component.scss']
})
export class CadastroClienteComponent implements OnInit, OnDestroy {

  public submitted = false;
  public loading = false;
  public fieldAlert: boolean = false;
  public message: string = '';
  public status: string = '';
  public proximoCadastro: boolean = false;
  public idEntidadeParaCadastroDeDados: number;

  private modernWizardStepper: Stepper;

  formularioCliente = new FormGroup({
    nome: new FormControl('', Validators.required),
    documento: new FormControl('', Validators.required),
  })

  formularioContato = new FormGroup({
    telefone: new FormControl(''),
    celular: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    telefone_comercial: new FormControl(''),
  })

  formularioEndereco = new FormGroup({
    cep: new FormControl('', Validators.required),
    numero: new FormControl(''),
    complemento: new FormControl(''),
    estado: new FormControl('', Validators.required)
  })

  logradouro: string;
  bairro: string;
  cidade: string;
  uf: string;

  @Output() cadastroClienteEvento = new EventEmitter<any>();

  subs: Subscription[] = [];

  constructor(
    private modalService: NgbModal,
    private buttonAlertService: ButtonAlertService,
    private clienteService: ClienteService,
    private dadosService: DadosService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.modernWizardStepper = new Stepper(document.querySelector('#stepper3'), {
      linear: false,
      animation: true
    });

    this.dadosEnderecoSubjects();
  }

  ngOnDestroy(): void {
    this.subs.forEach(sub => {
      sub.unsubscribe();
    })
  }

  nextToSubmit(proximo: boolean){
    this.proximoCadastro = proximo
  }

  get f_cliente() {
    return this.formularioCliente.controls;
  }

  get f_contato() {
    return this.formularioContato.controls;
  }

  get f_endereco() {
    return this.formularioEndereco.controls;
  }

  cadastroPessoa(){

    this.submitted = true;

    if (this.formularioCliente.invalid) {
      return;
    }

    this.loading = true;

    this.clienteService.cadastrar(this.formularioCliente.value)
      .subscribe({
        next: value => {
          this.onAlert(value.info, 'primary')
          if(this.proximoCadastro){
            this.idEntidadeParaCadastroDeDados = value.idPessoa;
            this.submitted = false;
            this.modernWizardStepper.next();
            return;
          }
          this.formularioCliente.reset();
          this.clienteService.mostrarCadastroCliente.next(false);
        },
        error: e => {
          this.loading = false;
          this.onAlert(e.error.info, 'danger')
        }
      })
  }

  cadastroContato(){
    this.submitted = true;

    if (this.formularioContato.invalid) {
      return;
    }

    this.loading = true;

    this.dadosService.cadastrarContato('pessoa', this.idEntidadeParaCadastroDeDados, this.formularioContato.value)
      .subscribe({
        next: value => {
          this.onAlert('Cadastro realizado com sucesso.', 'primary')
          if(this.proximoCadastro){
            this.submitted = false;
            this.modernWizardStepper.next();
            return;
          }
          this.formularioContato.reset();
          this.clienteService.mostrarCadastroCliente.next(false);
        },
        error: e => {
          this.loading = false;
          this.onAlert(e.error.info, 'danger')
        }
      })
  }

  cadastroEndereco(){
    this.submitted = true;

    if (this.formularioEndereco.invalid) {
      return;
    }

    const { cep, numero, complemento, estado } = this.formularioEndereco.value

    const dadosEndereco = {
      "tipo_endereco": "P",
      "cep": cep,
      "cidade": this.cidade,
      "uf": this.uf,
      "logradouro": this.logradouro,
      "numero": numero,
      "bairro": this.bairro,
      "complemento": complemento,
      "estado": estado
    }

    this.loading = true;

    this.dadosService.cadastrarEndereco('pessoa', this.idEntidadeParaCadastroDeDados, dadosEndereco)
    .subscribe({
      next: value => {
        this.onAlert('Cadastro realizado com sucesso.', 'primary')
        this.submitted = false;
        this.formularioContato.reset();
        this.clienteService.mostrarCadastroCliente.next(false);
      },
      error: e => {
        this.loading = false;
        this.onAlert(e.error.info, 'danger')
      }
    })
  }

  consultaCep(){
    this.clienteService.buscarEnderecoPeloCep(this.formularioEndereco.value.cep)
      .subscribe({
        next: endereco => {
          this.clienteService.bairro.next(endereco.bairro)
          this.clienteService.cidade.next(endereco.localidade)
          this.clienteService.logradouro.next(endereco.logradouro)
          this.clienteService.uf.next(endereco.uf)
        },
        error: e => console.log(e)
      })
  }

  dadosEnderecoSubjects(){
    const sub1 = this.clienteService.bairro.subscribe({next: v => this.bairro = v})
    const sub2 = this.clienteService.cidade.subscribe({next: v => this.cidade = v})
    const sub3 = this.clienteService.logradouro.subscribe({next: v => this.logradouro = v})
    const sub4 = this.clienteService.uf.subscribe({next: v => this.uf = v})

    this.subs.push(sub1, sub2, sub3, sub4);
  }

  modernHorizontalPrevious() {
    this.modernWizardStepper.previous();
  }

  fecharTelaCadastroCliente(){
    this.cadastroClienteEvento.emit();
  }

  onAlert(info: string, status: string) {
    this.buttonAlertService.fieldAlert.next(true)
    this.buttonAlertService.status.next(status)
    this.buttonAlertService.message.next(info)
    setTimeout(() => {
      this.buttonAlertService.fieldAlert.next(false)
    }, 3000)
  }

}