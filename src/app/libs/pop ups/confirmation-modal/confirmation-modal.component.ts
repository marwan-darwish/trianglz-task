import { Component,OnInit,Inject,ViewEncapsulation, OnDestroy  } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import{MAT_DIALOG_DATA }from '@angular/material/dialog';
import { confirmationModal } from 'src/app/interfaces/confirmation.modal';
import { ModalService } from 'src/app/services/modal.service';

@Component({
  selector: 'app-confirmation-modal',
  templateUrl: './confirmation-modal.component.html',
  styleUrls: ['./confirmation-modal.component.scss'],
  encapsulation:ViewEncapsulation.None
})
export class ConfirmationModalComponent implements OnInit {
    
    constructor(  @Inject(MAT_DIALOG_DATA) public ModalData: confirmationModal,public dialogRef: MatDialogRef<ConfirmationModalComponent>,private modalService:ModalService ){

    }

    loadingSpinnerStatus:boolean=false;


    ngOnInit(): void {
      this.modalService.loadingSpinner.subscribe((res)=>{
            this.loadingSpinnerStatus=res;
      })
    }
 
   

}
