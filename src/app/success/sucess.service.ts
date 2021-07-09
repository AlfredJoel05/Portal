import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SucessService {
  private defMsg = new BehaviorSubject<string>('Default Error Message');
  private defIcon = new BehaviorSubject<string>('info');

	currMsg = this.defMsg.asObservable();
	currIcon = this.defIcon.asObservable();

  constructor() { }

  sendMessage(message : string){
    this.defMsg.next(message)
  }

  changeIcon(icon : string){
    this.defIcon.next(icon)
  }
}
