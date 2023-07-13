import { Component, OnDestroy, OnInit, ViewEncapsulation, ElementRef, ViewChild } from '@angular/core';

import { Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { CoreConfigService } from '@core/services/config.service';
import { ButtonAlertService } from '../components/button-alert/button-alert.service';
import { ModalSelectComponent } from 'app/components/modal-select/modal-select.component';
import { Router } from '@angular/router';

@Component({
  selector: 'vertical-layout',
  templateUrl: './vertical-layout.component.html',
  styleUrls: ['./vertical-layout.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class VerticalLayoutComponent implements OnInit, OnDestroy {
  coreConfig: any;

  public fieldAlert: boolean = false;
  public message: string = ''
  public status: string = ''

  subs: Subscription[] = [];

  // Private
  private _unsubscribeAll: Subject<any>;

  /**
   * Constructor
   *
   * @param {CoreConfigService} _coreConfigService
   */
  constructor(
    private _coreConfigService: CoreConfigService,
    private _elementRef: ElementRef,
    private buttonAlertService: ButtonAlertService,
    private router: Router    
    ) {
    // Set the private defaults
    this._unsubscribeAll = new Subject();
  }

  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    // Subscribe to config changes
    this._coreConfigService.config.pipe(takeUntil(this._unsubscribeAll)).subscribe(config => {
      this.coreConfig = config;
    });

    const sub1 = this.buttonAlertService.fieldAlert.subscribe({next: v => this.fieldAlert = v})
    const sub2 = this.buttonAlertService.status.subscribe({next: v => this.status = v})
    const sub3 = this.buttonAlertService.message.subscribe({next: v => this.message = v})

    this.subs.push(sub1, sub2, sub3)

  }

  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
    this.subs.forEach(sub => sub.unsubscribe());
  }

  onAlert(info: string, status: string) {
    this.message = info
    this.status = status
    this.fieldAlert = !this.fieldAlert;
    setTimeout(() => {
      this.fieldAlert = !this.fieldAlert
    }, 3000)
  }
}
