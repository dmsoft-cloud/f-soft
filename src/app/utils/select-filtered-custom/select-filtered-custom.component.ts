import { Component, Input, Output, EventEmitter, OnInit, forwardRef } from '@angular/core';

import { Observable } from 'rxjs';
import { SelectOption } from '../select-custom/select-option.model';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';


@Component({
    selector: 'dms-select-filtered-custom',
    templateUrl: 'select-filtered-custom.component.html',
    styleUrl: 'select-filtered-custom.component.css',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => SelectFilteredCustomComponent),
            multi: true
        }
    ],
    standalone: false
})
export class SelectFilteredCustomComponent implements OnInit, ControlValueAccessor {

  @Input() label: string = 'Select an option';
  @Input() options: SelectOption[] = []; // Opzioni della select da enum o da dati statici
  @Input() value: string = '';
  @Input() isDisabled: boolean = false;
  @Input() displayMode: 'code-description' | 'code' | 'description' = 'code-description';
  @Input() defaultValue?: string; // input per il valore predefinito
  @Input() id: string = 'custom-select';

  @Input() showEmptyOption: boolean = false; // Abilita o disabilita la riga vuota
  @Input() emptyOptionValue: string = ''; // Valore della riga vuota
  @Input() emptyOptionLabel: string = '--- Seleziona ---'; // Testo della riga vuota

  @Input() optionsObservable?: Observable<SelectOption[]>; // Input per i dati API

  filterText: string = '';
  filteredOptions: SelectOption[] = [];
  isFilterVisible: boolean = false; // Controlla la visibilità del filtro

  ngOnInit() {
    if (this.optionsObservable) {
      this.optionsObservable.subscribe((data) => {
        this.options = [...this.options, ...data]; // Unisce dati enum e API
        this.filteredOptions = [...this.options]; // Inizializza le opzioni filtrate
      });
    }

    if (!this.options) {
      this.options = [];
    }

    if (!this.value && this.defaultValue) {
      this.value = this.defaultValue || this.emptyOptionValue;
      this.onChange(this.value);
    }

    this.filteredOptions = [...this.options]; // Inizializza le opzioni filtrate
  }

  onChange: (value: string) => void = () => {};
  onTouched: () => void = () => {};

  writeValue(value: string): void {
    if (value) {
      this.value = value;
    } else if (this.defaultValue) {
      this.value = this.defaultValue;
    } else if (this.showEmptyOption) {
      this.value = this.emptyOptionValue;
    }
    this.onChange(this.value);
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  onValueChange(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.value = value;
    this.onChange(value);
    this.onTouched();
  }

  getOptionLabel(option: SelectOption): string {
    switch (this.displayMode) {
      case 'code':
        return option.code;
      case 'description':
        return option.description;
      default:
        return `${option.code} - ${option.description}`;
    }
  }

  toggleFilter() {
    this.isFilterVisible = !this.isFilterVisible; // Mostra/nasconde il filtro
    if (!this.isFilterVisible) {
      this.filterText = ''; // Resetta il filtro quando viene nascosto
      this.filterOptions();
    }
  }

  filterOptions() {
    if (!this.filterText) {
      this.filteredOptions = [...this.options];
    } else {
      const filterTextLower = this.filterText.toLowerCase();
      this.filteredOptions = this.options.filter((option) =>
        this.getOptionLabel(option).toLowerCase().includes(filterTextLower)
      );
    }
  }

}
