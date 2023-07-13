import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CoreConfigService } from '@core/services/config.service';
import { App } from 'app/app';
import { UserService } from 'app/auth/service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Token } from '../../../../Utils/token';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class RegisterComponent implements OnInit {
  public coreConfig: any;
  public registerForm: FormGroup;
  public loading = false;
  public submitted = false;
  public returnUrl: string;
  public error = '';
  public passwordTextType: boolean;
  public passwordConfirmTextType: boolean;

  private _unsubscribeAll: Subject<any>;

  fieldAlert: boolean = false;
  message: string = ''
  status: string = ''

    /**
   * Constructor
   *
   * @param {CoreConfigService} _coreConfigService
   */

  constructor(
    private _coreConfigService: CoreConfigService,
    private _formBuilder: FormBuilder,
    private _route: ActivatedRoute,
    private _router: Router,
    private _usuarioService: UserService
  ) {
    this._unsubscribeAll = new Subject();
    
    this._coreConfigService.config = {
      layout: {
        navbar: {
          hidden: true
        },
        menu: {
          hidden: true
        },
        footer: {
          hidden: true
        },
        customizer: false,
        enableLocalStorage: false
      }
    };
  }

  ngOnInit(): void {
    this.registerForm = this._formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(20)]],
      passwordConfirm: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(20)]]
    });

    // get return url from route parameters or default to '/'
    this.returnUrl = this._route.snapshot.queryParams['returnUrl'] || '/';

    // Subscribe to config changes
    this._coreConfigService.config.pipe(takeUntil(this._unsubscribeAll)).subscribe(config => {
      this.coreConfig = config;
    });
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  get f() {
    return this.registerForm.controls;
  }

  togglePasswordTextType() {
    this.passwordTextType = !this.passwordTextType;
  }

  togglePasswordConfirmTextType() {
    this.passwordConfirmTextType = !this.passwordConfirmTextType;
  }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.registerForm.invalid) {
      return;
    }

    if(this.registerForm.value.password != this.registerForm.value.passwordConfirm) {
      this.onAlert('As senhas precisam ser iguais', 'danger')
      return;
    }

    // Login
    this.loading = true;

    if(this.registerForm.value.password != this.registerForm.value.passwordConfirm) this.registerForm.value.passwordConfirm = false;
    
    this._usuarioService.register(this.registerForm.value)
      .subscribe({
        next: u => {
          Token.insert('token', u.token)
          App.Instance.setQtdeEstabelecimentos(u.ecs)
          App.Instance.setUserInfo(u.usuario)
          this._usuarioService.usuarioLogado.next(u.usuario)
          this._router.navigate(['/']);
        },
        error: e => this.onAlert(e.error.info, 'danger')
      })
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
