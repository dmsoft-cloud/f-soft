import { Component, ElementRef, EventEmitter, Input, Output, ViewChild, ViewEncapsulation} from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';




@Component({
  selector: 'dms-default-detail',
  templateUrl: './default-detail.component.html',
  styleUrl: './default-detail.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class DefaultDetailComponent {

  @Input() buttonDescription: string = "Default Description";
  isQuickEditEnabled: boolean = false;
  @Output() quickEdit = new EventEmitter<number>();  // Definizione dell'evento personalizzato per indicare il cambio di switch 

  @ViewChild('content') modalContent!: ElementRef;

  constructor(private modalService: NgbModal, private el: ElementRef) { }

  toggleQuickEdit(event: any) {
    this.isQuickEditEnabled = event.target.checked;
  }

  openModal(content: any) {
    const modalRef = this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', windowClass: 'dms-modal', size: 'xl', backdrop: 'static'  }); //backdrop serve a non far chiudere la modale se clicco fuori da essa
    const componentPosition = this.el.nativeElement.getBoundingClientRect().top;

    // Imposta la posizione della modale
    setTimeout(() => {
      const modalElement = document.querySelector('.modal-dialog') as HTMLElement;
      if (modalElement) {
        modalElement.classList.add('custom-modal-dialog'); // Aggiungi la classe personalizzata
        modalElement.style.top = `${componentPosition}px`; // Imposta la posizione verticale
      }
    });
  }

}
