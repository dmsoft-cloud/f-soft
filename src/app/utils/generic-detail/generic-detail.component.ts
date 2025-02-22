import { Component, ElementRef, EventEmitter, Input, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'dms-generic-detail',
  templateUrl: './generic-detail.component.html',
  styleUrl: './generic-detail.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class GenericDetailComponent {

  @Input() buttonDescription: string = "Default Descriptions";
  @Input() isQuickEditEnabled: boolean = false;

  @Output() quickEdit = new EventEmitter<boolean>(); 
  @Output() itemInsert = new EventEmitter<{item: any, mode: string}>();
  
  @ViewChild('content') modalContent!: ElementRef;
  @ViewChild('insertForm') insertForm!: NgForm;

  private modalRef: NgbModalRef | null = null; //componente per gestione modale

  constructor(protected  modalService: NgbModal, protected el: ElementRef) { }

  toggleQuickEdit(event: any) {
    this.isQuickEditEnabled = event.target.checked;
    this.quickEdit.emit(this.isQuickEditEnabled);
  }

  insertItem(){
    var item = {};
    var mode = 'I';
    this.itemInsert.emit({ item , mode}); // Emetti l'evento personalizzato in modalità inserimento
    this.openModal(this.modalContent, mode, item);
  }


  openModal(content: any, mode: string, item: any) {
    this.modalRef = this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', windowClass: 'dms-modal', size: 'xl', backdrop: 'static'  }); //backdrop serve a non far chiudere la modale se clicco fuori da essa
    const componentPosition = this.el.nativeElement.getBoundingClientRect().top;

    // Imposta la posizione della modale
    setTimeout(() => {
      const modalElement = document.querySelector('.modal-dialog') as HTMLElement;
      if (modalElement) {
        modalElement.classList.add('custom-modal-dialog'); // Aggiungi la classe personalizzata
        modalElement.style.top = `${componentPosition}px`; // Imposta la posizione verticale
      }
    });

        // Utilizza i dati passati
        console.log('Data received:', content);
  } 

  closeModal() {
    if (this.modalRef) {
      this.modalRef.close();
      this.modalRef = null;
    }
  }


  onCreatePost(formData: any) {
    console.log('Insert Form Data:', formData);
    this.isQuickEditEnabled = false;
    this.quickEdit.emit(false);
    console.log('test invio evento');
    
  }

  submitForm(form: NgForm) {
    if (form) {
      form.ngSubmit.emit();
    }
  }

}
