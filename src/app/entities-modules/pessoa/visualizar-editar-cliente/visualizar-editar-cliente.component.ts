import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DadosService } from 'app/entities-modules/dados/dados.service';
import { ButtonAlertService } from 'app/layout/components/button-alert/button-alert.service';
import { ClienteService } from '../cadastro-cliente/cliente.service';
import Stepper from 'bs-stepper';
import { Subscription } from 'rxjs';
import { ICliente } from '@core/types/ICliente';
import { IContato } from '@core/types/IContato';
import { IEndereco } from '@core/types/IEndereco';
import { EstabelecimentoService } from 'app/entities-modules/estabelecimento/cadastro-estabelecimento/estabelecimento.service';
import { AssinaturaService } from 'app/entities-modules/assinatura/assinatura.service';
import { IAssinatura } from '@core/types/IAssinatura';

@Component({
  selector: 'app-visualizar-editar-cliente',
  templateUrl: './visualizar-editar-cliente.component.html',
  styleUrls: ['./visualizar-editar-cliente.component.scss']
})
export class VisualizarEditarClienteComponent implements OnInit, OnDestroy {

  public submitted = false;
  public loading = false;
  public tipoPessoa: string = 'F';
  public cliente: ICliente;
  public contato: IContato;
  public endereco: IEndereco;
  public idEntidadeParaCadastroDeDados: number;

  idCliente: number;
  assinaturasListar: IAssinatura[];

  subs: Subscription[] = [];

  @Output() edicaoClienteEvento = new EventEmitter<any>();

  formularioCliente = new FormGroup({
    nome: new FormControl('', Validators.required),
    documento: new FormControl('', Validators.required),
    celular: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    cep: new FormControl('', Validators.required),
    numero: new FormControl(''),
    complemento: new FormControl(''),
    logradouro: new FormControl('', Validators.required),
    bairro: new FormControl('', Validators.required),
    cidade: new FormControl('', Validators.required),
    uf: new FormControl('', Validators.required)
  })

  constructor(
    private buttonAlertService: ButtonAlertService,
    private clienteService: ClienteService,
    private dadosService: DadosService,
    private estabelecimentoService: EstabelecimentoService,
    private assinaturaService: AssinaturaService
  ) { }

  ngOnInit(): void {
    const sub1 = this.clienteService.clienteParaEditar.subscribe({
      next: cliente => {
        this.formularioCliente.controls.nome.setValue(cliente.nome)
        this.formularioCliente.controls.documento.setValue(cliente.documento)
        this.formularioCliente.controls.celular.setValue(cliente.celular)
        this.formularioCliente.controls.email.setValue(cliente.email)
        this.formularioCliente.controls.cep.setValue(cliente.cep)
        this.formularioCliente.controls.logradouro.setValue(cliente.logradouro)
        this.formularioCliente.controls.numero.setValue(cliente.numero)
        this.formularioCliente.controls.complemento.setValue(cliente.complemento)
        this.formularioCliente.controls.bairro.setValue(cliente.bairro)
        this.formularioCliente.controls.uf.setValue(cliente.uf)
        this.formularioCliente.controls.cidade.setValue(cliente.cidade)
      }
    })

    this.idCliente = this.clienteService.idClienteEditar;

    this.assinaturaService.buscarAssinatura(this.idCliente)
      .subscribe({
        next: assinaturas => {
          this.assinaturasListar = assinaturas;
        },
        error: e => console.log(e)
      })

    this.subs.push(sub1)
  }

  get f_cliente() {
    return this.formularioCliente.controls;
  }

  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe());
    this.clienteService.mostrarEdicaoCliente.next(false);
  }

  fecharTelaCadastroCliente(){
    this.edicaoClienteEvento.emit();
  }

  consultaCep(){
    this.clienteService.buscarEnderecoPeloCep(this.formularioCliente.value.cep)
      .subscribe({
        next: endereco => {
          this.formularioCliente.controls.logradouro.setValue(endereco.logradouro)
          this.formularioCliente.controls.bairro.setValue(endereco.bairro)
          this.formularioCliente.controls.cidade.setValue(endereco.localidade)
          this.formularioCliente.controls.uf.setValue(endereco.uf)
        },
        error: e => this.onAlert('Erro na pesquisa de endereço', 'danger')
      })
  }

  consultaCnpj() {
    this.estabelecimentoService.buscarDadosEmpresa(this.formularioCliente.value.documento)
      .subscribe({
        next: empresa => {
          this.formularioCliente.controls.nome.setValue(empresa.nome)
          this.formularioCliente.controls.celular.setValue(empresa.telefone)
          this.formularioCliente.controls.email.setValue(empresa.email)
          this.formularioCliente.controls.cep.setValue(empresa.cep)
          this.formularioCliente.controls.logradouro.setValue(empresa.logradouro)
          this.formularioCliente.controls.numero.setValue(empresa.numero)
          this.formularioCliente.controls.complemento.setValue(empresa.complemento)
          this.formularioCliente.controls.bairro.setValue(empresa.bairro)
          this.formularioCliente.controls.uf.setValue(empresa.uf)
          this.formularioCliente.controls.cidade.setValue(empresa.localidade)
        },
        error: error => this.onAlert('Erro na pesquisa de CNPJ', 'danger')
      })
  }

  editarCliente(){
    this.submitted = true;

    if (this.formularioCliente.invalid) {
      return;
    }

    this.loading = true;

    this.cliente = {
      nome: this.formularioCliente.value.nome,
      documento: this.formularioCliente.value.documento
    }

    this.contato = {
      celular: this.formularioCliente.value.celular,
      email: this.formularioCliente.value.email
    }

    this.endereco = {
      tipo_endereco: "P",
      cep: this.formularioCliente.value.cep,
      logradouro: this.formularioCliente.value.logradouro,
      bairro: this.formularioCliente.value.bairro,
      cidade: this.formularioCliente.value.cidade,
      uf: this.formularioCliente.value.uf,
      numero: this.formularioCliente.value.numero,
      complemento: this.formularioCliente.value.complemento
    }

    this.clienteService.editar(this.cliente)
      .subscribe({
        next: res => {
          this.editarContato(this.contato, this.endereco)
        },
        error: e => {
          this.loading = false;
          this.onAlert(e.error.info, 'danger')
        }
      })
  }

  editarContato(contato: IContato, endereco: IEndereco){
    this.dadosService.editarContato(contato)
      .subscribe({
        next: res => {
          this.editarEndereco(endereco)
        },
        error: e => {
          this.loading = false;
          this.onAlert(e.error.info, 'danger')
          return;
        }
      })
  }

  editarEndereco(endereco: IEndereco){
    this.dadosService.editarEndereco(endereco)
      .subscribe({
        next: res => {
          this.onAlert('Cadastro alterado com sucesso.', 'primary')
          this.submitted = false;
          this.clienteService.mostrarEdicaoCliente.next(false);
        },
        error: e => {
          this.loading = false;
          this.onAlert(e.error.info, 'danger')
        }
      })
  }

  onAlert(info: string, status: string) {
    this.buttonAlertService.fieldAlert.next(true)
    this.buttonAlertService.status.next(status)
    this.buttonAlertService.message.next(info)
    setTimeout(() => {
      this.buttonAlertService.fieldAlert.next(false)
    }, 3000)
  }

  verificarTipoPessoa(e){
    if(this.formularioCliente.value.documento.length > 11) {
      this.tipoPessoa = 'J' 
    }else{
      this.tipoPessoa = 'F'
    }
  }

}