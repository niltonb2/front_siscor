import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { DashboardService } from 'app/main/home/dashboard.service';
import { SpinnerComponent } from '../spinner/spinner.component';
import { NgbModal, ModalDismissReasons, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { ChartDashComponent } from '../chart-dash/chart-dash.component';

@Component({
  selector: 'app-datafromto',
  templateUrl: './datafromto.component.html',
  styleUrls: ['./datafromto.component.scss']
})
export class DatafromtoComponent implements OnInit {

  public data_vencimento_from: NgbDateStruct;
  public data_vencimento_to: NgbDateStruct;


  filtroDataMesAtual;
  filtroDataHoje;
  filtroData7Dias;
  filtroData30Dias;
  filtroData3Meses;

  mesAtualValidador: boolean;

  filtro1: boolean = false;

  @ViewChild('btn1') btnMesAtual;
  @ViewChild('btn2') btnHoje;
  @ViewChild('btn3') btn7Dias;
  @ViewChild('btn4') btn30Dias;
  @ViewChild('btn5') btn3Meses;

  @ViewChild('chartDashComponent')
  chartDashComponent: ChartDashComponent;

  constructor(
    private dashboardService: DashboardService,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
    const hoje = new Date();
    const formated = (new Intl.DateTimeFormat('pt-br')).format(hoje);
    const dataNumbers = formated.split('/')
    const dataReqInicial = `${dataNumbers[2]}-${dataNumbers[1]}-${dataNumbers[0]}`
    this.data_vencimento_from = { year: parseInt(dataNumbers[2]), month: parseInt(dataNumbers[1]), day: parseInt(dataNumbers[0]) }
    this.data_vencimento_to = { year: parseInt(dataNumbers[2]), month: parseInt(dataNumbers[1]), day: parseInt(dataNumbers[0]) }

    this.dashboardService.getDadosDashboard(dataReqInicial, dataReqInicial)
      .subscribe({
        next: cobs => {
          this.dashboardService.dadosCobrancaDashboard.next(cobs)
        },
        error: e => {
          console.log(e)
        }
      })
  }

  selectFiltro(btn: string, dias: number, mesAtual: boolean) {
    this.resetClasses();

    if (mesAtual) this.mesAtualValidador = true;

    switch (btn) {
      case 'btn1':
        this.btnMesAtual.nativeElement.className = 'btn btn-primary';
        break;
      case 'btn2':
        this.btnHoje.nativeElement.className = 'btn btn-primary';
        break;
      case 'btn3':
        this.btn7Dias.nativeElement.className = 'btn btn-primary';
        break;
      case 'btn4':
        this.btn30Dias.nativeElement.className = 'btn btn-primary';
        break;
      case 'btn5':
        this.btn3Meses.nativeElement.className = 'btn btn-primary';
        break;

      default:
        break;
    }

    this.aplicarFiltroPreDefinido(dias)
  }

  aplicarFiltroPersonalizado(dataFrom?, dataTo?) {

    //this.resetClasses();

    this.spinnerOpen();

    let data_from;
    let data_to;

    if(dataFrom && dataTo){
      data_from = dataFrom;
      data_to = dataTo;
    }else{
      data_from = `${this.data_vencimento_from.year}-${this.data_vencimento_from.month}-${this.data_vencimento_from.day}`
      data_to = `${this.data_vencimento_to.year}-${this.data_vencimento_to.month}-${this.data_vencimento_to.day}`
    }

    this.dashboardService.getDadosDashboard(data_from, data_to)
      .subscribe({
        next: cobs => {
          this.dashboardService.dadosCobrancaDashboard.next(cobs)
          this.spinnerClose();
          if (this.chartDashComponent) this.chartDashComponent.inicializar();
        },
        error: e => {
          console.log(e);
          this.spinnerClose();
        }
      })
  }

  aplicarFiltroPreDefinido(n: number) {
    this.spinnerOpen();
    const data = this.calcularDataFiltroPreDefinido(n)
    const data_to = `${this.data_vencimento_to.year}-${this.data_vencimento_to.month}-${this.data_vencimento_to.day}`

    this.setarDataNoCalendario(data, data_to)

    this.aplicarFiltroPersonalizado(data, data_to)

/*     this.dashboardService.getDadosDashboard(data, data_to)
      .subscribe({
        next: cobs => {
          this.dashboardService.dadosCobrancaDashboard.next(cobs)
          if (this.chartDashComponent) this.chartDashComponent.inicializar();
          this.spinnerClose();
          this.mesAtualValidador = false;
        },
        error: e => {
          console.log(e);
          this.spinnerClose();
          this.mesAtualValidador = false;
        }
      }) */
  }

  setarDataNoCalendario(data1, data2) {

    const dataFormatada1 = data1.split('-')
    const dataFormatada2 = data2.split('-')
    this.data_vencimento_from = { year: parseInt(dataFormatada1[0]), month: parseInt(dataFormatada1[1]), day: parseInt(dataFormatada1[2]) }
    this.data_vencimento_to = { year: parseInt(dataFormatada2[0]), month: parseInt(dataFormatada2[1]), day: parseInt(dataFormatada2[2]) }
  }

  calcularDataFiltroPreDefinido(n: number) {
    const hoje = new Date();
    const formated = (new Intl.DateTimeFormat('pt-br')).format(hoje);
    const dataNumbers = formated.split('/')

    if (this.mesAtualValidador) {
      const filtroProntoMesAtual = `${dataNumbers[2]}-${dataNumbers[1]}-01`
      this.mesAtualValidador = false;
      return filtroProntoMesAtual
    } else {
      const dataFiltrosPre = new Date(`${dataNumbers[1]}-${dataNumbers[0]}-${dataNumbers[2]}`)
      const novaData = new Date();
      novaData.setDate(dataFiltrosPre.getDate() - n)
      const filtroFormatado = (new Intl.DateTimeFormat('pt-br')).format(novaData)
      const filtroArray = filtroFormatado.split('/')
      const filtroPronto = `${filtroArray[2]}-${filtroArray[1]}-${filtroArray[0]}`
      return filtroPronto
    }
  }

  onCheckFiltroPersonalizado() {
    this.resetClasses();
    this.btnHoje.nativeElement.className = 'btn-filtro-pre-definido btn btn-primary waves-effect waves-float waves-light';
    const btns = document.querySelectorAll('.btn-filtro-pre-definido')
    btns.forEach(btn => btn.setAttribute('disabled', ''))

    const checkboxInputs = document.querySelectorAll('.checkbox-input')
    checkboxInputs.forEach(checkbox => checkbox.removeAttribute('disabled'))
  }

  onCheckFiltroPreDefinido() {
    this.resetClasses();
    this.btnHoje.nativeElement.className = 'btn-filtro-pre-definido btn btn-primary waves-effect waves-float waves-light';
    const checkboxInputs = document.querySelectorAll('.checkbox-input')
    checkboxInputs.forEach(checkbox => checkbox.setAttribute('disabled', ''))

    const btns = document.querySelectorAll('.btn-filtro-pre-definido')
    btns.forEach(btn => btn.removeAttribute('disabled'))
  }

  resetClasses() {
    this.btnMesAtual.nativeElement.className = 'btn-filtro-pre-definido btn btn-outline-secondary waves-effect';
    this.btnHoje.nativeElement.className = 'btn-filtro-pre-definido btn btn-outline-secondary waves-effect';
    this.btn7Dias.nativeElement.className = 'btn-filtro-pre-definido btn btn-outline-secondary waves-effect';
    this.btn30Dias.nativeElement.className = 'btn-filtro-pre-definido btn btn-outline-secondary waves-effect';
    this.btn3Meses.nativeElement.className = 'btn-filtro-pre-definido btn btn-outline-secondary waves-effect';
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
