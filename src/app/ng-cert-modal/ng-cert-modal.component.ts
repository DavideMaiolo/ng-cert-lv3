import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-ng-cert-modal',
  templateUrl: './ng-cert-modal.component.html',
  styleUrls: ['./ng-cert-modal.component.css'],
})
export class NgCertModalComponent {
  @ViewChild('modalDialog') modalDialogRef:
    | ElementRef<HTMLDialogElement>
    | undefined;

  showModal(): void {
    const modalDialog = this.modalDialogRef?.nativeElement;
    modalDialog?.showModal();
  }

  closeModal(): void {
    const modalDialog = this.modalDialogRef?.nativeElement;
    modalDialog?.close();
  }
}
