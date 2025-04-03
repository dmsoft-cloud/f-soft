import { Component } from '@angular/core';

@Component({
    selector: 'dms-default-table-filter',
    templateUrl: './default-table-filter.component.html',
    styleUrl: './default-table-filter.component.css',
    standalone: false
})
export class DefaultTableFilterComponent {

  constructor() { }

  ngOnInit(): void {
  }

  closeModal() {
    // Chiudi la modale
    const modalBackdrop = document.querySelector('.modal-backdrop');
    modalBackdrop.parentNode.removeChild(modalBackdrop);
    const modal = document.querySelector('.modal');
    modal.parentNode.removeChild(modal);
  }

}
