import { Directive, HostListener, ElementRef, Renderer2  } from '@angular/core';

@Directive({
    selector: '[appDropdown]',
    standalone: false
})
export class DropdownDirective {

  constructor(private elRef: ElementRef, private renderer: Renderer2) {}

  @HostListener('document:click', ['$event']) toggleOpen(event: Event) {
    const dropdownMenu = this.elRef.nativeElement.nextElementSibling;
    if (this.elRef.nativeElement.contains(event.target)){
      if (dropdownMenu.classList.contains('show')) {
        this.renderer.removeClass(dropdownMenu, 'show');
      } else {
        this.renderer.addClass(dropdownMenu, 'show');
      }
    } else this.renderer.removeClass(dropdownMenu, 'show');
  }

}
