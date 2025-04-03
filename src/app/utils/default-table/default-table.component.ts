import { Component, Input, OnInit, EventEmitter, Output, ModuleWithComponentFactories, ViewChild, ElementRef, TemplateRef} from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { EntityUtils, YesNo} from '../../common/baseEntity'


/**********************************************************************************************
 *  - per abilitare i pulsanti settare l'elemento buttonConfig
 *      dichiararlo nel compoennte esterno ed impostare a false i valori da disabilitare
 *      ad esempio [buttonConfig]="{ show: true, edit: false, delete: false, copy: false }"
 *  - per disabilitare i pulsanti di ricerca e download impostare isFilterSectionVisible
 *      nel componente che lo importa [isFilterSectionVisible]="isFilterSectionVisible"
 **********************************************************************************************/




interface TableColumn {
  header: string;
  field: string;
  type?: string;
  width?: number;
  minWidth?: number; 
}

@Component({
    selector: 'dms-default-table',
    templateUrl: './default-table.component.html',
    styleUrl: './default-table.component.scss',
    standalone: false
})
export class DefaultTableComponent implements OnInit {

  /************************************************************************/
  /*                   variabili generali per impaginare                  */
  /************************************************************************/
  @Input() columns: TableColumn[] = [];
  @Input() items: any[] = [];
  @Input() filteredItems: any[] = [];

  @Input() itemsPerPage: number = 13; // Numero predefinito di elementi per pagina
  
  public EntityUtils = EntityUtils;  //espongo le proprietà di entityUtils
  @Input() totalPages: number = 1;   // numero totale delle pagine
  @Input() currentPage: number = 1;  //pagina corrente della tabella
  
  @Input() isFilterSectionVisible: boolean = true;
  @Input() isAddEmpyRows: boolean= false;

  @Input() buttonConfig? = { show: true, edit: true, delete: true, copy: true }; // Configurazione pulsanti
  @Input() customButtonsTemplate?: TemplateRef<any>; // Template per pulsanti personalizzati


  /************************************************************************/
  /*                   eventi gestiti                                     */
  /************************************************************************/
  @Output() reloadTableEvent = new EventEmitter<void>(); //Definizione evento per ricaricare la tabella dati
  //@Output() rowSelected = new EventEmitter<{index: number, mode: string}>(); // Definizione dell'evento personalizzato per indicare l'elemento selezionato al padre che lo importa
  @Output() rowSelected = new EventEmitter<{item: any, mode: string}>();
  @Output() rowManaged = new EventEmitter<{item: any, mode: string}>();

  sortColumn: string = '';
  sortOrder: string = 'asc';

  tableHoverFlag: boolean = false;


  /************************************************************************/
  /*                   Modale di gestione                                 */
  /************************************************************************/
  @ViewChild('content') modalContent!: ElementRef;
  private modalRef: NgbModalRef | null = null; //componente per gestione modale
  //modo con cui apriamo la modale
  @Input() modalMode: string = '';


  filterText: string = '';

  @Input() componentDescription: string = "Default Description";


  //serve ad aprire il filtro
  isFilterOpen: boolean = false;

  //indica di evidenziare la riga
  highlightedRows: boolean[] = [];


  /**********************************************************************/
  /*                   metodi di inizializzazione                       */
  /**********************************************************************/
  constructor(private modalService: NgbModal, private el: ElementRef) { }

  ngOnInit(): void {
    // Potresti eventualmente implementare qui la logica di caricamento dei dati da un servizio
    this.loadItems();
  }

  loadItems() {
    // Carica i tuoi elementi qui, ad esempio con una chiamata HTTP
    this.filteredItems = this.items;
    this.applyFilter();
  }

  /**********************************************************************/
  /*                   metodi per la paginazione                        */
  /**********************************************************************/
  updatePagination() {
    this.totalPages = Math.ceil(this.filteredItems.length / this.itemsPerPage);
    this.currentPage = Math.min(this.currentPage, this.totalPages) || 1;
    //console.log("valore di addEmpyPage: " + (this.currentPage===this.totalPages) + ", pagina corrente: " + this.currentPage + ", pagine totali: " + this.totalPages );
    this.isAddEmpyRows=(this.currentPage===this.totalPages);
  }

  get paginatedItems() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.filteredItems.slice(start, end);
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  



  /**********************************************************************/
  /*                   metodi per l'ordinamento                         */
  /**********************************************************************/  
  sort(field: string) {
    if (this.sortColumn === field) {
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = field;
      this.sortOrder = 'asc';
    }

    // Implementa qui la logica di ordinamento basata sul campo e sull'ordine di ordinamento
    this.items.sort((a, b) => {
      if (a[field] < b[field]) {
        return this.sortOrder === 'asc' ? -1 : 1;
      } else if (a[field] > b[field]) {
        return this.sortOrder === 'asc' ? 1 : -1;
      } else {
        return 0;
      }
    });
  }

  getEmptyRows() {
    // Restituisce un array di righe vuote per scopi di stile
    if ((this.filteredItems.length % this.itemsPerPage) > 0) {
      const emptyRowsCount = this.itemsPerPage - (this.filteredItems.length % this.itemsPerPage);
      if (emptyRowsCount > 0) return Array(emptyRowsCount).fill(0);
    }
    else return null 
    //return [];
  }

  onResizeStart(event: MouseEvent, field: string) {
    // Eventuale logica per il ridimensionamento delle colonne
    console.log('Ridimensionamento colonna:', field);
  }

  applyFilter() {
    if (!this.filterText) {
      this.filteredItems = this.items;
      this.updatePagination(); 
      return;
    }

    /*this.filteredItems = this.items.filter((item: any) =>
      Object.values(item).some((value: any) => 
        value.toString().toLowerCase().includes(this.filterText.toLowerCase())
      )
    );
    */

    const filterTextLower = this.filterText.toLowerCase();

    this.filteredItems = this.items.filter(item => {
      return this.columns.some(column => {
        const value = item[column.field];
        // Ignora i valori undefined
        if (value === undefined) {
          return false;
        }
        return value.toString().toLowerCase().includes(filterTextLower);
      });
    });

    this.updatePagination(); 
  }

  downloadCSV() {
    const csvContent = this.convertArrayToCSV(this.filteredItems);
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const downloadLink = document.createElement('a');
    downloadLink.href = window.URL.createObjectURL(blob);
    downloadLink.setAttribute('download', `${this.constructor.name}_data.csv`);
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  }

  private convertArrayToCSV(data: any[]): string {
    const csvRows: string[] = [];
    const columns = this.columns.map(column => column.header);

    csvRows.push(columns.join(','));

    data.forEach(item => {
      const values = this.columns.map(column => item[column.field]);
      csvRows.push(values.join(','));
    });

    return csvRows.join('\n');
  }


  refreshTable() {
    this.reloadTableEvent.emit(); // Emittiamo l'evento di reload
  }


  //gestione apertura modale filtri
  public openFilterModal() {
     // Mostra la modale
     this.isFilterOpen = true;
  }

  public closeFilterModal() {
    this.isFilterOpen = false;
    
  }

  addFilter() {
    // Logica per l'aggiunta del filtro...
    // Chiudi la modale dopo aver aggiunto il filtro
    this.closeFilterModal();
  }

  highlightRow(index: number) {
    // Imposta la variabile per evidenziare la riga e mostrare i bottoni
    this.highlightedRows[index] = true;
    this.tableHoverFlag=true;
  }
  
  unhighlightRow(index: number) {
    // Resetta la variabile per nascondere i bottoni e rimuovere l'evidenziazione della riga
    this.highlightedRows[index] = false;
    this.tableHoverFlag=false;
  }


  //azione selezione ed editazione base
  // possibili valori di mode:
  // '' : solo visulaizzazione laterale
  // 'D' : delete del record
  // 'E' : modifica del reccord 
  // 'C' : copy
  selectItem(item: any, mode: string){
    //console.log(`Selezionato da padre l'elemento con indice ${item}`);
    //var index = index + ((this.currentPage -1) * this.itemsPerPage);
    //console.log(`Trasmesso elemento ${index}`);

    //console.log("evento emesso: " + JSON.stringify(item));
    this.rowSelected.emit({ item , mode}); // Emetti l'evento personalizzato con l'item della riga selezionata
  }

  manageItem(item: any, mode: string){
    //console.log("evento emesso: " + JSON.stringify(item));
    this.rowManaged.emit({ item , mode}); // Emetti l'evento personalizzato con l'item della riga da gestire
    this.openModal(this.modalContent, mode, item);
  }

  openModal(content: any, mode: string, item: any) {
    this.modalMode=mode;
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

  //usato per determinare il numero di bottoni attivi e dimansionarne lo spazio
  getActiveButtonsCount(): number {
    let count = 0;
    if (this.buttonConfig.show) count++;
    if (this.buttonConfig.edit) count++;
    if (this.buttonConfig.delete) count++;
    if (this.buttonConfig.copy) count++;
    if (this.customButtonsTemplate) {
      count += 1; // Supponiamo che ci sia almeno un pulsante extra
    }
    return count;
  }

  


}

