import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
@Injectable({
  providedIn:'root'
})
export class ModalService {

  constructor() { }
  loadingSpinner:Subject<boolean>=new Subject();
  
}
