import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { App } from 'app/app';
import { PortalClienteService } from 'app/main/portal/portal-cliente.service';

@Component({
  selector: 'app-acesso-cliente',
  templateUrl: './acesso-cliente.component.html',
  styleUrls: ['./acesso-cliente.component.scss']
})
export class AcessoClienteComponent implements OnInit {

  fieldAlert: boolean = false;
  message: string = ''
  status: string = ''
  public loading = false;
  public submitted = false;
  public returnUrl: string;
  public error = '';
  public passwordTextType: boolean;
  public acessoForm = new FormGroup({
    documento: new FormControl('', Validators.required)
  });

  constructor(
    private router: Router,
    private portalClienteService: PortalClienteService
    ) { }

  ngOnInit(): void {
  }

  onSubmit() {
    this.portalClienteService.buscarPessoaPorDocumento(this.acessoForm.value.documento)
      .subscribe({
        next: pessoa => {
          //this.router.navigate([`/portal/${pessoa[0].documento}`])
          window.location.href = `/portal/${pessoa[0].documento}`;
        },
        error: e => {
          this.onAlert(e.error.info, 'danger')
        }
      })
  }

  get f_acesso () {
    return this.acessoForm.controls;
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
