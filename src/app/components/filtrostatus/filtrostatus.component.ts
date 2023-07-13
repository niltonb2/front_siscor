import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { DashboardService } from 'app/main/home/dashboard.service';

@Component({
  selector: 'app-filtrostatus',
  templateUrl: './filtrostatus.component.html',
  styleUrls: ['./filtrostatus.component.scss']
})
export class FiltrostatusComponent implements OnInit, OnDestroy {

  @Input() quantidadePagos: number;
  @Input() quantidadeEmAberto: number;
  @Input() quantidadePendentes: number;
  @Input() quantidadeVencidos: number;

  constructor(
    private dashboardService: DashboardService
  ) { }
  ngOnInit(): void {
  }

  ngOnDestroy(): void {
  }

}
