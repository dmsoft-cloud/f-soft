import { Component, Input, Output, EventEmitter, OnInit, forwardRef } from '@angular/core';

import { Observable } from 'rxjs';
import { SelectOption } from '../select-custom/select-option.model';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';


@Component({
  selector: 'dms-select-filtered2-custom',
  templateUrl: 'select-filtered2-custom.component.html',
  styleUrl: 'select-filtered2-custom.component.css',
  providers: [
      {
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => SelectFiltered2CustomComponent), 
        multi: true
      }
    ]
})
export class SelectFiltered2CustomComponent implements OnInit, ControlValueAccessor {

  @Input() label: string = 'Select an option';
  @Input() id: string = 'custom-filtered2-select';
  @Input() options: { code: string, description: string }[] = []; // Opzioni della select da enum o da dati statici
  @Input() value: string = '';
  @Input() isDisabled: boolean = false;
  @Input() displayMode: 'code-description' | 'code' | 'description' = 'code-description';
  @Input() defaultValue?: string; // input per il valore predefinito

  @Input() showEmptyOption: boolean = false; // Abilita o disabilita la riga vuota
  @Input() emptyOptionValue: string = ''; // Valore della riga vuota
  @Input() emptyOptionLabel: string = '--- Select ---'; // Testo della riga vuota

  @Output() valueChange = new EventEmitter<string>();

  @Input() searchTerm: string = '';  
  filteredOptions: { code: string, description: string }[] = [];
  showDropdown = false;

  ngOnInit() {
    this.filteredOptions = this.options;
  }

  filterOptions() {
    const searchTermLower = this.searchTerm.toLowerCase();
    this.filteredOptions = this.options.filter(option =>
      option.description.toLowerCase().includes(searchTermLower) ||
      option.code.toLowerCase().includes(searchTermLower)
    );
  }

  selectOption(code: string, description: string) {
    //this.searchTerm = description; // Mostra la selezione
    this.searchTerm = this.getOptionLabel({code, description});
    this.value = code;
    this.valueChange.emit(this.value);
    this.onChange(this.value);
    this.showDropdown = false;
  }

  hideDropdownWithDelay() {
    setTimeout(() => {
      this.showDropdown = false;
    }, 200); // Ritardo per consentire il click
  }

  onChange: (value: string) => void = () => {};
  onTouched: () => void = () => {};

  writeValue(value: string): void {
    if (value) {
      this.value = value;
      const option = this.findOptionByValue(value);
      if (option) {
        this.searchTerm = this.getOptionLabel(option);
      }
    } else if (this.defaultValue) {
      this.value = this.defaultValue;
      const option = this.findOptionByValue(this.defaultValue);
      if (option) {
        this.searchTerm = this.getOptionLabel(option);
      }
    } else if (this.showEmptyOption) {
      this.value = this.emptyOptionValue;
      this.searchTerm = this.emptyOptionLabel;
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

  activeDropdown(){
    this.showDropdown = true;
    this.filterOptions();
  }

  private findOptionByValue(value: string): { code: string, description: string } | undefined {
    return this.options.find(option => option.code === value);
  }

}

