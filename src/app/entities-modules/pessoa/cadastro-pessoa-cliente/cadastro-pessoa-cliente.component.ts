import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ICliente } from '@core/types/ICliente';
import { IContato } from '@core/types/IContato';
import { IEndereco } from '@core/types/IEndereco';
import { DadosService } from 'app/entities-modules/dados/dados.service';
import { EstabelecimentoService } from 'app/entities-modules/estabelecimento/cadastro-estabelecimento/estabelecimento.service';
import { ButtonAlertService } from 'app/layout/components/button-alert/button-alert.service';
import { ClienteService } from '../cadastro-cliente/cliente.service';
import { NgbModal, ModalDismissReasons, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { SpinnerComponent } from 'app/components/spinner/spinner.component';

@Component({
  selector: 'app-cadastro-pessoa-cliente',
  templateUrl: './cadastro-pessoa-cliente.component.html',
  styleUrls: ['./cadastro-pessoa-cliente.component.scss']
})
export class CadastroPessoaClienteComponent implements OnInit { 
  
  public submitted = false;
  public loading = false;
  public tipoPessoa: string = 'F';
  public cliente: ICliente;
  public contato: IContato;
  public endereco: IEndereco;
  public idEntidadeParaCadastroDeDados: number;
  public salvarMaisNovoCadastro: boolean = false;

  @Output() cadastroClienteEvento = new EventEmitter<any>();

  estadosBrasileiros: string[] = [
    "Acre",
    "Alagoas",
    "Amapá",
    "Amazonas",
    "Bahia",
    "Ceará",
    "Distrito Federal",
    "Espírito Santo",
    "Goiás",
    "Maranhão",
    "Mato Grosso",
    "Mato Grosso do Sul",
    "Minas Gerais",
    "Pará",
    "Paraíba",
    "Paraná",
    "Pernambuco",
    "Piauí",
    "Rio de Janeiro",
    "Rio Grande do Norte",
    "Rigo Grande do Sul",
    "Rondônia",
    "Roraima",
    "Santa Catarina",
    "São Paulo",
    "Sergipe",
    "Tocantins"
  ];

  ufs: string[] = [
    "AC",
    "AL",
    "AP",
    "AM",
    "BA",
    "CE",
    "DF",
    "ES",
    "GO",
    "MA",
    "MT",
    "MS",
    "MG",
    "PA",
    "PB",
    "PR",
    "PE",
    "PI",
    "RJ",
    "RN",
    "RS",
    "RO",
    "RR",
    "SC",
    "SP",
    "SE",
    "TO"
  ]

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
    private clienteService: ClienteService,
    private buttonAlertService: ButtonAlertService,
    private dadosService: DadosService,
    private estabelecimentoService: EstabelecimentoService,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
  }

  get f_cliente() {
    return this.formularioCliente.controls;
  }

  fecharTelaCadastroCliente(){
    this.cadastroClienteEvento.emit();
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

  cadastrarCliente(){
    this.submitted = true;

    if (this.formularioCliente.invalid) {
      return;
    }

    this.spinnerOpen();

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

    this.clienteService.cadastrar(this.cliente)
      .subscribe({
        next: res => {
          this.idEntidadeParaCadastroDeDados = res.idPessoa
          this.cadastrarContato(this.contato, this.endereco)
        },
        error: e => {
          this.loading = false;
          this.spinnerClose();
          this.onAlert(e.error.info, 'danger')
        }
      })
  }

  cadastrarContato(contato: IContato, endereco: IEndereco){
    this.dadosService.cadastrarContato('pessoa', this.idEntidadeParaCadastroDeDados, contato)
      .subscribe({
        next: res => {
          this.cadastrarEndereco(endereco)
        },
        error: e => {
          this.loading = false;
          this.spinnerClose();
          this.onAlert(e.error.info, 'danger')
          return;
        }
      })
  }

  cadastrarEndereco(endereco: IEndereco){
    this.dadosService.cadastrarEndereco('pessoa', this.idEntidadeParaCadastroDeDados, endereco)
      .subscribe({
        next: res => {
          this.onAlert('Cadastro realizado com sucesso.', 'primary')
          this.submitted = false;
          if(this.salvarMaisNovoCadastro){
            this.formularioCliente.reset();
            this.informarNovoCadastro();
            this.spinnerClose();
          }else{
            this.spinnerClose();
            this.clienteService.mostrarCadastroCliente.next(false);
          }
        },
        error: e => {
          this.loading = false;
          this.spinnerClose();
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

  informarNovoCadastro(){
    this.salvarMaisNovoCadastro = !this.salvarMaisNovoCadastro
    
  }

  verificarTipoPessoa(e){
    if(this.formularioCliente.value.documento.length > 11) {
      this.tipoPessoa = 'J' 
    }else{
      this.tipoPessoa = 'F'
    }
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

}
