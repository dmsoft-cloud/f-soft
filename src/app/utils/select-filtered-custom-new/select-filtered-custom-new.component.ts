import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnDestroy,
  forwardRef,
  ElementRef,
  HostListener
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { SelectOption } from '../select-custom/select-option.model';


@Component({
  selector: 'dms-select-filtered-custom-new',
  standalone: false,
  templateUrl: './select-filtered-custom-new.component.html',
  styleUrl: './select-filtered-custom-new.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectFilteredCustomNewComponent),
      multi: true
    }
  ]
})
export class SelectFilteredCustomNewComponent implements OnInit, OnDestroy, ControlValueAccessor {

 @Input() id = 'custom-select';
  @Input() label = '';
  @Input() options: SelectOption[] = [];
  @Input() optionsObservable?: Observable<SelectOption[]>;

  @Input() showEmptyOption = false;
  @Input() emptyOptionValue = '';
  @Input() emptyOptionLabel = '---';

  @Input() isDisabled = false;

  /** displayMode: 'code', 'description' o 'code-description' */
  @Input() displayMode: 'code' | 'description' | 'code-description' = 'code-description';

  /** valore */
  @Input() value: string = '';
  @Output() valueChange = new EventEmitter<string>();

  /** stato dropdown + filtro */
  isOpen = false;
  filterText = '';
  filteredOptions: SelectOption[] = [];

  private obsSub?: Subscription;
  private onChange: (v: string) => void = () => {};
  private onTouched: () => void = () => {};

  constructor(private elRef: ElementRef) {}

  ngOnInit(): void {
    // carica da observable se definito
    if (this.optionsObservable) {
      this.obsSub = this.optionsObservable.subscribe(apiOpts => {
        this.options = [...this.options, ...apiOpts];
        this.applyFilter();
      });
    }
    // init array
    this.filteredOptions = [...this.options];
  }

  ngOnDestroy(): void {
    this.obsSub?.unsubscribe();
  }

  // ControlValueAccessor
  writeValue(val: string): void {
    this.value = val ?? '';
  }
  registerOnChange(fn: (v: string) => void): void { this.onChange = fn; }
  registerOnTouched(fn: () => void): void { this.onTouched = fn; }
  setDisabledState(dis: boolean): void { this.isDisabled = dis; }

  /** apre/chiude dropdown */
  toggleDropdown(event: MouseEvent): void {
    if (this.isDisabled) { return; }
    event.stopPropagation();
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      // reset filtro ad apertura
      this.filterText = '';
      this.applyFilter();
    }
  }

  /** click fuori: chiude */
  @HostListener('document:click', ['$event.target'])
  onClickOutside(target: HTMLElement) {
    if (this.isOpen && !this.elRef.nativeElement.contains(target)) {
      this.closeDropdown();
    }
  }

  private closeDropdown(): void {
    this.isOpen = false;
    this.filterText = '';
    this.applyFilter();
  }

  /** gestisce il filtro */
  onFilterChange(txt: string): void {
    this.filterText = txt;
    this.applyFilter();
  }

  private applyFilter(): void {
    const term = this.filterText.trim().toLowerCase();
    this.filteredOptions = term
      ? this.options.filter(o =>
          this.getOptionLabel(o).toLowerCase().includes(term)
        )
      : [...this.options];
  }

  /** testo visualizzato per ogni option */
  getOptionLabel(opt: SelectOption): string {
    switch (this.displayMode) {
      case 'code':        return opt.code;
      case 'description': return opt.description;
      default:            return `${opt.code} – ${opt.description}`;
    }
  }

  /** seleziona un’opzione */
  selectOption(opt: SelectOption | null): void {
    const newVal = opt ? opt.code : this.emptyOptionValue;
    this.value = newVal;
    this.onChange(newVal);
    this.onTouched();
    this.valueChange.emit(newVal);
    this.closeDropdown();
  }

}
