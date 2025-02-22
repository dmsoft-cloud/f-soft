import { Component, ElementRef, OnInit } from '@angular/core';
import { DefaultTableComponent } from '../../utils/default-table/default-table.component';
import { LogService } from '../log.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'dms-logs-list',
  templateUrl: './logs-list.component.html',
  styleUrl: './logs-list.component.css'
})
export class LogsListComponent extends DefaultTableComponent  implements OnInit {
  constructor(private logService: LogService, private modalServiceF: NgbModal, private elF: ElementRef) {
    super(modalServiceF, elF);
  }

  ngOnInit(): void {
    this.loadTableData();

  }

  loadTableData(){
    this.columns = [
      { header: 'ID', field: 'id', type: '' },
      { header: 'Host', field: 'host', type: '' },
      { header: 'ID Flusso', field: 'id_flusso', type: '' },
      { header: 'Esito', field: 'esito', type: '' },
      { header: 'Timestamp Inizio', field: 'timestamp_inizio', type: '' },
      { header: 'Timestamp Fine', field: 'timestamp_fine', type: '' }
    ];

    this.items = this.logService.getLogs();
  }

  refreshTable() {
    // Ricarica i dati della tabella senza perdere i filtri attivi
    this.loadTableData(); // Ricarica i dati e applica i filtri
  }

}
