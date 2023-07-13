import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ButtonAlertService {

  fieldAlert = new BehaviorSubject<boolean>(false);
  message = new BehaviorSubject<string>('');
  status = new BehaviorSubject<string>('');

  constructor() { }
}
